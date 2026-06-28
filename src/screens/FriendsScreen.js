import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import LeaderboardRow from '../components/LeaderboardRow';
import { useApp } from '../context/AppContext';
import { colors, spacing, fontSize, radius } from '../theme';

// "Amigos" — a leaderboard where you compete with friends by total points.
// Add friends and watch where you rank; complete tasks to climb.
export default function FriendsScreen() {
  const { leaderboard, addFriend, removeFriend } = useApp();
  const [name, setName] = useState('');

  const me = useMemo(() => leaderboard.find((e) => e.isMe), [leaderboard]);
  const leader = leaderboard[0];

  const handleAdd = useCallback(() => {
    if (!name.trim()) return;
    addFriend(name);
    setName('');
    Keyboard.dismiss();
  }, [name, addFriend]);

  // Motivational line based on the user's position.
  const statusLine = useMemo(() => {
    if (!me) return '';
    if (me.rank === 1) return '¡Vas en primer lugar! 🏆 Mantén el ritmo.';
    const ahead = leaderboard.find((e) => e.rank === me.rank - 1);
    const diff = ahead ? ahead.points - me.points : 0;
    return `Vas en el puesto #${me.rank}. Te faltan ${diff} pts para alcanzar a ${ahead.name}.`;
  }, [me, leaderboard]);

  return (
    <ScreenContainer edges={['top']} contentStyle={styles.container}>
      <ScreenHeader title="Amigos" />

      {/* Your standing */}
      {me ? (
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerRank}>#{me.rank}</Text>
            <Text style={styles.bannerRankLabel}>tu puesto</Text>
          </View>
          <View style={styles.bannerDivider} />
          <View style={styles.bannerBody}>
            <Text style={styles.bannerPoints}>{me.points} pts</Text>
            <Text style={styles.bannerStatus}>{statusLine}</Text>
          </View>
        </View>
      ) : null}

      {/* Add friend */}
      <View style={styles.inputRow}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Agregar amigo..."
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Ionicons name="person-add" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Clasificación 🏆</Text>

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <LeaderboardRow entry={item} onRemove={() => removeFriend(item.id)} />
        )}
        ListFooterComponent={
          <Text style={styles.hint}>Mantén presionado un amigo para eliminarlo</Text>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.xl },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardPurple,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  bannerLeft: { alignItems: 'center', width: 64 },
  bannerRank: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.white },
  bannerRankLabel: { fontSize: fontSize.xs, color: '#EFEAFF' },
  bannerDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: spacing.lg,
  },
  bannerBody: { flex: 1 },
  bannerPoints: { fontSize: fontSize.lg, fontWeight: '800', color: colors.white },
  bannerStatus: { fontSize: fontSize.sm, color: '#EFEAFF', marginTop: 2, lineHeight: 18 },

  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textDark,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },

  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.textDark,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  listContent: { paddingBottom: spacing.xxxl },
  hint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
