import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, Pressable, FlatList,
  Linking, Modal, ActivityIndicator, Animated, Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAdmin } from '../hooks/useAdmin';
import { Confetti, showConfetti } from '../styles/global';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

//category colors
const CATEGORY_COLORS = {
  Beginner: '#10B981', Stocks: '#3B82F6', Funds: '#8B5CF6',
  Crypto: '#F59E0B', Savings: '#EC4899', 'Real Estate': '#EF4444', Budgeting: '#06B6D4',
};

//quiz modal (slide-up animation + confetti on completion)
function QuizModal({ lesson, quizzes, visible, onClose }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const confettiRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setCurrent(0); setSelected(null); setScore(0); setDone(false);
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 300, useNativeDriver: true }).start();
    }
  }, [visible]);

  if (!quizzes.length) return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <View style={styles.quizOverlay}>
        <Animated.View style={[styles.quizBox, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.quizTitle}>No questions yet.</Text>
          <Pressable style={styles.quizBtn} onPress={onClose}><Text style={styles.quizBtnText}>Close</Text></Pressable>
        </Animated.View>
      </View>
    </Modal>
  );

  const q = quizzes[current];

  const submit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const correct = selected === q.correctIndex;
    const newScore = correct ? score + 1 : score;
    if (current + 1 < quizzes.length) {
      setCurrent(current + 1);
      setSelected(null);
      setScore(newScore);
    } else {
      setScore(newScore);
      setDone(true);
      if (newScore === quizzes.length) {
        showConfetti(confettiRef);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (newScore >= quizzes.length / 2) {
        showConfetti(confettiRef);
      }
    }
  };

  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <Confetti ref={confettiRef} />
      <View style={styles.quizOverlay}>
        <Animated.View style={[styles.quizBox, { transform: [{ translateY: slideAnim }] }]}>
          {done ? (
            <>
              <Text style={styles.quizTitle}>Quiz Complete</Text>
              <Text style={styles.quizScore}>{score} / {quizzes.length}</Text>
              <Text style={styles.quizSub}>
                {score === quizzes.length ? 'Perfect score! 🎉' : score >= quizzes.length / 2 ? 'Good job! 🌟' : 'Keep studying! 📚'}
              </Text>
              <Pressable style={styles.quizBtn} onPress={onClose}><Text style={styles.quizBtnText}>Done</Text></Pressable>
            </>
          ) : (
            <>
              <Text style={styles.quizProgress}>Question {current + 1} of {quizzes.length}</Text>
              <Text style={styles.quizTitle}>{q.question}</Text>
              {q.options?.map((opt, i) => (
                <Pressable
                  key={i}
                  style={[styles.quizOption, selected === i && styles.quizOptionSelected]}
                  onPress={() => { setSelected(i); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                >
                  <Text style={[styles.quizOptionText, selected === i && { color: '#FFFFFF' }]}>{opt}</Text>
                </Pressable>
              ))}
              <Pressable style={[styles.quizBtn, selected === null && { opacity: 0.5 }]} onPress={submit} disabled={selected === null}>
                <Text style={styles.quizBtnText}>{current + 1 < quizzes.length ? 'Next' : 'Finish'}</Text>
              </Pressable>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

export default function InvestmentsScreen() {
  const { lessons, quizzes, loading, fetchLessons, fetchQuizzes } = useAdmin();
  const [quizLesson, setQuizLesson] = useState(null);
  const [quizVisible, setQuizVisible] = useState(false);

  useEffect(() => { fetchLessons(); }, []);

  const openVideo = (url) => { Linking.openURL(url); };

  const openQuiz = async (lesson) => {
    await fetchQuizzes(lesson.id);
    setQuizLesson(lesson);
    setQuizVisible(true);
  };

  const renderLesson = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.videoCard, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
      onPress={() => openVideo(item.url)}
    >
      <View style={[styles.thumbnail, { backgroundColor: CATEGORY_COLORS[item.category] || '#0A2463' }]}>
        <Text style={styles.playIcon}>▶ Play</Text>
        <Text style={styles.duration}>{item.duration}</Text>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        {!!item.description && <Text style={styles.videoDesc} numberOfLines={2}>{item.description}</Text>}
        <View style={styles.videoMeta}>
          <View style={[styles.catBadge, { backgroundColor: (CATEGORY_COLORS[item.category] || '#0A2463') + '20' }]}>
            <Text style={[styles.catBadgeText, { color: CATEGORY_COLORS[item.category] || '#0A2463' }]}>{item.category}</Text>
          </View>
          <Pressable style={styles.quizChip} onPress={() => openQuiz(item)}>
            <Text style={styles.quizChipText}>Take Quiz</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Learn to Invest</Text>
      </View>

      <View style={styles.tipCard}>
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Tip of the Day</Text>
          <Text style={styles.tipText}>
            Start investing early. Even small amounts grow significantly with compound interest over time.
          </Text>
        </View>
      </View>

      {loading
        ? <ActivityIndicator color="#0A2463" style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={lessons}
            keyExtractor={item => item.id}
            renderItem={renderLesson}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#666', paddingTop: 40 }}>No lessons yet.</Text>}
          />
        )
      }

      <QuizModal
        lesson={quizLesson}
        quizzes={quizzes}
        visible={quizVisible}
        onClose={() => { setQuizVisible(false); setQuizLesson(null); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  topBar: { paddingHorizontal: 20, paddingVertical: 16, paddingTop: 60 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  tipCard: { marginHorizontal: 20, marginBottom: 16, backgroundColor: '#FFFBEB', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#FDE68A' },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 },
  tipText: { fontSize: 13, color: '#666', lineHeight: 18 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  videoCard: { backgroundColor: '#F8F9FA', borderRadius: 18, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: '#E9ECEF' },
  thumbnail: { height: 140, alignItems: 'center', justifyContent: 'center' },
  playIcon: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 1 },
  duration: { position: 'absolute', bottom: 8, right: 10, fontSize: 12, fontWeight: '600', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  videoInfo: { padding: 16 },
  videoTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  videoDesc: { fontSize: 13, color: '#666', marginBottom: 8, lineHeight: 18 },
  videoMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  catBadgeText: { fontSize: 11, fontWeight: '600' },
  quizChip: { backgroundColor: '#13294B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  quizChipText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  quizOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  quizBox: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400 },
  quizProgress: { fontSize: 12, color: '#666', marginBottom: 8 },
  quizTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 16, lineHeight: 24 },
  quizOption: { borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 12, padding: 14, marginBottom: 8 },
  quizOptionSelected: { backgroundColor: '#13294B', borderColor: '#13294B' },
  quizOptionText: { fontSize: 15, color: '#333' },
  quizBtn: { backgroundColor: '#13294B', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  quizBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  quizScore: { fontSize: 36, fontWeight: 'bold', color: '#13294B', textAlign: 'center', marginBottom: 8 },
  quizSub: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
});