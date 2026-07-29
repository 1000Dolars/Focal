import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { seedTasks } from '../data/seed';
import { generateSchedule } from '../utils/schedule';
import { totalMinutes, todayKey } from '../utils/time';
import { createId } from '../utils/id';
import { loadState, saveState, clearState } from '../utils/storage';

// Single source of truth: the user, their tasks, the derived schedule, points
// and completion history. All state is persisted locally and restored on launch.

const AppContext = createContext(null);

const POINTS_PER_TASK = 40; // completing a task rewards points

const DEFAULTS = {
  userName: '',
  personality: 'organizado',
  tasks: seedTasks,
  history: {}, // { 'YYYY-MM-DD': completedCount }
};

export function AppProvider({ children }) {
  const [userName, setUserName] = useState(DEFAULTS.userName);
  const [personality, setPersonality] = useState(DEFAULTS.personality);
  const [tasks, setTasks] = useState(DEFAULTS.tasks);
  const [history, setHistory] = useState(DEFAULTS.history);
  const [hydrated, setHydrated] = useState(false);

  // --- Hydration ----------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await loadState(); // never throws
      if (!cancelled && saved) {
        if (typeof saved.userName === 'string') setUserName(saved.userName);
        if (typeof saved.personality === 'string') setPersonality(saved.personality);
        if (Array.isArray(saved.tasks)) setTasks(saved.tasks);
        if (saved.history && typeof saved.history === 'object') setHistory(saved.history);
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // --- Persistence --------------------------------------------------------
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!hydrated) return; // never overwrite saved data with defaults
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveState({ userName, personality, tasks, history });
    }, 400);
    return () => clearTimeout(saveTimer.current);
  }, [hydrated, userName, personality, tasks, history]);

  // --- Task actions -------------------------------------------------------
  const addTask = useCallback((task) => {
    const { title, description = '', duration = 60, urgency = 'media', dueDate = null } =
      task || {};
    const trimmed = (title || '').trim();
    if (!trimmed) return;
    setTasks((prev) => [
      ...prev,
      {
        id: createId('t'),
        title: trimmed.slice(0, 80),
        description: (description || '').trim().slice(0, 500),
        duration: duration || 60,
        done: false,
        urgency,
        dueDate,
      },
    ]);
  }, []);

  // Pure state update — points are derived, so no side effect belongs here.
  const toggleTask = useCallback((id) => {
    let becameDone = false;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        becameDone = !t.done;
        return { ...t, done: becameDone };
      })
    );
    setHistory((prev) => {
      const key = todayKey();
      const current = prev[key] || 0;
      return { ...prev, [key]: Math.max(0, current + (becameDone ? 1 : -1)) };
    });
  }, []);

  const removeTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- Data management ----------------------------------------------------
  const resetAllData = useCallback(async () => {
    await clearState();
    setUserName(DEFAULTS.userName);
    setPersonality(DEFAULTS.personality);
    setTasks(DEFAULTS.tasks);
    setHistory(DEFAULTS.history);
  }, []);

  // --- Derived values -----------------------------------------------------
  // Derived from completed tasks, so points can't be farmed by completing and
  // then deleting a task, and can never be double-counted.
  const points = useMemo(
    () => tasks.filter((t) => t.done).length * POINTS_PER_TASK,
    [tasks]
  );

  const schedule = useMemo(
    () => generateSchedule(tasks, { personality }),
    [tasks, personality]
  );

  const summary = useMemo(
    () => ({
      taskCount: tasks.length,
      pending: tasks.filter((t) => !t.done).length,
      studyMinutes: totalMinutes(tasks.filter((t) => !t.done)),
      completed: tasks.filter((t) => t.done).length,
      points,
    }),
    [tasks, points]
  );

  const value = useMemo(
    () => ({
      hydrated,
      userName,
      setUserName,
      personality,
      setPersonality,
      tasks,
      addTask,
      toggleTask,
      removeTask,
      schedule,
      summary,
      points,
      history,
      resetAllData,
    }),
    [
      hydrated,
      userName,
      personality,
      tasks,
      addTask,
      toggleTask,
      removeTask,
      schedule,
      summary,
      points,
      history,
      resetAllData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}

export default AppContext;
