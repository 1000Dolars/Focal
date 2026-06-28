import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { seedTasks, seedFriends, friendEmojis } from '../data/seed';
import { generateSchedule } from '../utils/schedule';
import { totalMinutes } from '../utils/time';
import { pastelOrder } from '../theme/colors';

// Single source of truth for app state: the user, their tasks, the derived
// schedule, gamification points, friends (leaderboard) and donation history.
// Kept in React Context so every screen stays in sync without prop drilling.

const AppContext = createContext(null);

const POINTS_PER_TASK = 40; // completing a task rewards points (gamification)

let idCounter = 100;
const nextId = (p = 't') => `${p}${idCounter++}`;

export function AppProvider({ children }) {
  const [userName, setUserName] = useState(''); // set at login
  const [personality, setPersonality] = useState('organizado');
  const [tasks, setTasks] = useState(seedTasks);
  const [points, setPoints] = useState(120);
  const [friends, setFriends] = useState(seedFriends);
  const [donations, setDonations] = useState([]);

  // --- Task actions -------------------------------------------------------
  const addTask = useCallback((task) => {
    // Accepts an object: { title, description, duration, urgency, dueDate }.
    const { title, description = '', duration = 60, urgency = 'media', dueDate = null } =
      task || {};
    const trimmed = (title || '').trim();
    if (!trimmed) return;
    setTasks((prev) => {
      const color = pastelOrder[prev.length % pastelOrder.length];
      return [
        ...prev,
        {
          id: nextId('t'),
          title: trimmed,
          description: (description || '').trim(),
          duration: duration || 60,
          icon: '📒',
          done: false,
          color,
          urgency,
          dueDate,
        },
      ];
    });
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const done = !t.done;
        // Award or remove points to keep the counter honest.
        setPoints((p) => Math.max(0, p + (done ? POINTS_PER_TASK : -POINTS_PER_TASK)));
        return { ...t, done };
      })
    );
  }, []);

  const removeTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- Friends (leaderboard) ---------------------------------------------
  const addFriend = useCallback((name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return;
    setFriends((prev) => {
      const emoji = friendEmojis[prev.length % friendEmojis.length];
      // New friends start with a small random score so the ranking stays lively.
      const startPoints = 40 + Math.floor(Math.random() * 180);
      return [...prev, { id: nextId('f'), name: trimmed, points: startPoints, emoji }];
    });
  }, []);

  const removeFriend = useCallback((id) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // --- Donations ----------------------------------------------------------
  const addDonation = useCallback((amount) => {
    if (!amount || amount <= 0) return;
    setDonations((prev) => [
      { id: `d${Date.now()}`, amount, date: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  // --- Derived values -----------------------------------------------------
  const schedule = useMemo(() => generateSchedule(tasks), [tasks]);

  const summary = useMemo(
    () => ({
      taskCount: tasks.length,
      studyMinutes: totalMinutes(tasks),
      completed: tasks.filter((t) => t.done).length,
      points,
    }),
    [tasks, points]
  );

  // Leaderboard: friends + the current user, ranked by points (desc).
  const leaderboard = useMemo(() => {
    const me = {
      id: 'me',
      name: userName || 'Tú',
      points,
      emoji: '🧑‍🎓',
      isMe: true,
    };
    return [...friends, me]
      .sort((a, b) => b.points - a.points)
      .map((entry, i) => ({ ...entry, rank: i + 1 }));
  }, [friends, points, userName]);

  const value = useMemo(
    () => ({
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
      friends,
      addFriend,
      removeFriend,
      leaderboard,
      donations,
      addDonation,
    }),
    [
      userName,
      personality,
      tasks,
      addTask,
      toggleTask,
      removeTask,
      schedule,
      summary,
      points,
      friends,
      addFriend,
      removeFriend,
      leaderboard,
      donations,
      addDonation,
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
