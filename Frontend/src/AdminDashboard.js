import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, Pressable, Modal, TextInput,
  Alert, ActivityIndicator, FlatList
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAdmin } from './hooks/useAdmin';
import { useDiscounts } from './hooks/useDiscounts';
import { useAuth } from './hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY, BUTTON, INPUT, MODAL, CARD, TEXT, UTILS, CHIP, Confetti, showConfetti } from './styles/global';

const TABS = ['Discounts', 'Lessons', 'Quizzes'];
const LESSON_CATS = ['Beginner', 'Stocks', 'Funds', 'Crypto', 'Savings', 'Real Estate', 'Budgeting'];

const CATEGORY_COLORS = {
  Beginner: '#10B981', Stocks: '#3B82F6', Funds: '#8B5CF6',
  Crypto: '#F59E0B', Savings: '#EC4899', 'Real Estate': '#EF4444', Budgeting: '#06B6D4',
};

export default function AdminDashboard() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { isAdmin, lessons, quizzes, loading, fetchLessons, createLesson, updateLesson, deleteLesson, fetchQuizzes, createQuiz, deleteQuiz } = useAdmin();
  const { posts, fetchPosts, deletePost } = useDiscounts();

  const confettiRef = useRef(null);
  const [tab, setTab] = useState('Discounts');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonModal, setLessonModal] = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', url: '', duration: '', category: 'Beginner' });
  const [quizModal, setQuizModal] = useState(false);
  const [quizForm, setQuizForm] = useState({ question: '', options: ['', '', '', ''], answer: 0 });

  useEffect(() => { fetchPosts(); fetchLessons(); }, []);
  useEffect(() => {
    if (selectedLesson) fetchQuizzes(selectedLesson.id);
  }, [selectedLesson]);

  const openLessonModal = (lesson = null) => {
    if (lesson) {
      setEditLesson(lesson);
      setLessonForm({ title: lesson.title, description: lesson.description || '', url: lesson.url, duration: lesson.duration, category: lesson.category });
    } else {
      setEditLesson(null);
      setLessonForm({ title: '', description: '', url: '', duration: '', category: 'Beginner' });
    }
    setLessonModal(true);
  };

  const saveLesson = async () => {
    const { title, url, duration, category } = lessonForm;
    if (!title || !url || !duration) return Alert.alert('Error', 'Fill all required fields');
    const res = editLesson ? await updateLesson(editLesson.id, lessonForm) : await createLesson(lessonForm);
    if (res?.success) {
      setLessonModal(false);
      if (!editLesson) showConfetti(confettiRef);
    } else {
      Alert.alert('Error', res?.message || 'Failed');
    }
  };

  const confirmDeleteLesson = (id) => {
    Alert.alert('Delete Lesson', 'This will also remove its quizzes.', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          const res = await deleteLesson(id);
          if (res?.success) showConfetti(confettiRef);
        }
      },
    ]);
  };

  const confirmDeletePost = (postId) => {
    Alert.alert('Delete Post', 'Remove this post as admin?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          const res = await deletePost(postId);
          if (res?.success) showConfetti(confettiRef);
        }
      },
    ]);
  };

  const saveQuiz = async () => {
    if (!selectedLesson) return;
    const { question, options, answer } = quizForm;
    if (!question || options.some(o => !o)) return Alert.alert('Error', 'Fill all fields');
    const res = await createQuiz(selectedLesson.id, { question, options, correctIndex: answer });
    if (res?.success) {
      setQuizForm({ question: '', options: ['', '', '', ''], answer: 0 });
      Alert.alert('Success', 'Question added! You can add another.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Alert.alert('Error', res?.message || 'Failed');
    }
  };

  const closeQuizModal = () => {
    setQuizModal(false);
    setQuizForm({ question: '', options: ['', '', '', ''], answer: 0 });
  };

  if (!isAdmin) return null;

  return (
    <View style={[UTILS.flex1, { backgroundColor: COLORS.white }]}>
      <Confetti ref={confettiRef} />
      <View style={{ paddingHorizontal: SPACING.lg, paddingTop: 60, paddingBottom: SPACING.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={TYPOGRAPHY.caption}>Admin Panel</Text>
          <Text style={TYPOGRAPHY.h1}>Dashboard</Text>
        </View>
        <Pressable onPress={async () => { await logout(); }}>
          <Text style={[TYPOGRAPHY.body, { color: COLORS.red }]}>Logout</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.md }}>
        {TABS.map(t => (
          <Pressable key={t} style={[CHIP.base, tab === t && CHIP.active, { flex: 1, alignItems: 'center' }]} onPress={() => setTab(t)}>
            <Text style={[CHIP.text, tab === t && CHIP.textActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {loading && <ActivityIndicator color={COLORS.navy} style={{ marginTop: SPACING.lg }} />}

      {tab === 'Discounts' && (
        <FlatList
          data={posts}
          keyExtractor={p => p.id}
          contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 100 }}
          ListEmptyComponent={<Text style={TEXT.emptyState}>No posts yet.</Text>}
          renderItem={({ item }) => (
            <View style={[CARD.expense, { flexDirection: 'column', alignItems: 'flex-start', gap: SPACING.sm }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Text style={[TYPOGRAPHY.bodySmall, { flex: 1 }]}>{item.title}</Text>
                <Pressable onPress={() => confirmDeletePost(item.id)}>
                  <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.red }]}>Delete</Text>
                </Pressable>
              </View>
              <Text style={TYPOGRAPHY.caption}>{item.author?.name || 'Unknown'} · {item.location}</Text>
            </View>
          )}
        />
      )}

      {tab === 'Lessons' && (
        <View style={UTILS.flex1}>
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.md }}>
            <Pressable style={BUTTON.primary} onPress={() => openLessonModal()}>
              <Text style={BUTTON.text}>+ Add Lesson</Text>
            </Pressable>
          </View>
          <FlatList
            data={lessons}
            keyExtractor={l => l.id}
            contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 100 }}
            ListEmptyComponent={<Text style={TEXT.emptyState}>No lessons yet.</Text>}
            renderItem={({ item }) => (
              <View style={[CARD.expense, { flexDirection: 'column', alignItems: 'flex-start', gap: SPACING.xs }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                  <Text style={[TYPOGRAPHY.bodySmall, { flex: 1 }]}>{item.title}</Text>
                  <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                    <Pressable onPress={() => openLessonModal(item)}>
                      <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.navy }]}>Edit</Text>
                    </Pressable>
                    <Pressable onPress={() => confirmDeleteLesson(item.id)}>
                      <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.red }]}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: SPACING.sm, alignItems: 'center' }}>
                  <View style={{ backgroundColor: (CATEGORY_COLORS[item.category] || COLORS.navy) + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: CATEGORY_COLORS[item.category] || COLORS.navy }}>{item.category}</Text>
                  </View>
                  <Text style={TYPOGRAPHY.caption}>{item.duration}</Text>
                </View>
                <Pressable onPress={() => { setSelectedLesson(item); setTab('Quizzes'); }}>
                  <Text style={[TYPOGRAPHY.caption, { color: COLORS.navy, fontWeight: '600' }]}>Manage Quizzes →</Text>
                </Pressable>
              </View>
            )}
          />
        </View>
      )}

      {tab === 'Quizzes' && (
        <View style={UTILS.flex1}>
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.md, gap: SPACING.sm }}>
            <Text style={TYPOGRAPHY.bodySmall}>Select Lesson:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.sm }}>
              {lessons.map(l => (
                <Pressable key={l.id} style={[CHIP.base, selectedLesson?.id === l.id && CHIP.active, { marginRight: SPACING.sm }]}
                  onPress={() => setSelectedLesson(l)}>
                  <Text style={[CHIP.text, selectedLesson?.id === l.id && CHIP.textActive]}>{l.title}</Text>
                </Pressable>
              ))}
            </ScrollView>
            {selectedLesson && (
              <Pressable style={BUTTON.primary} onPress={() => setQuizModal(true)}>
                <Text style={BUTTON.text}>+ Add Quiz Question</Text>
              </Pressable>
            )}
          </View>

          {!selectedLesson
            ? <Text style={TEXT.emptyState}>Select a lesson above.</Text>
            : (
              <FlatList
                data={quizzes}
                keyExtractor={q => q.id}
                contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 100 }}
                ListEmptyComponent={<Text style={TEXT.emptyState}>No quiz questions yet.</Text>}
                renderItem={({ item, index }) => (
                  <View style={[CARD.expense, { flexDirection: 'column', alignItems: 'flex-start', gap: SPACING.xs }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                      <Text style={[TYPOGRAPHY.bodySmall, { flex: 1 }]}>Q{index + 1}: {item.question}</Text>
                      <Pressable onPress={() => {
                        Alert.alert('Delete', 'Remove this question?', [
                          { text: 'Cancel' },
                          { text: 'Delete', style: 'destructive', onPress: () => deleteQuiz(selectedLesson.id, item.id) },
                        ]);
                      }}>
                        <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.red }]}>Delete</Text>
                      </Pressable>
                    </View>
                    {item.options?.map((opt, i) => (
                      <Text key={i} style={[TYPOGRAPHY.caption, i === item.correctIndex && { color: COLORS.green, fontWeight: '700' }]}>
                        {i === item.correctIndex ? '✓ ' : '• '}{opt}
                      </Text>
                    ))}
                  </View>
                )}
              />
            )
          }
        </View>
      )}

      {/* Lesson Modal */}
      <Modal visible={lessonModal} transparent animationType="slide">
        <View style={MODAL.overlay}>
          <ScrollView keyboardShouldPersistTaps="handled" style={MODAL.content}>
            <View style={MODAL.handle} />
            <Text style={[TYPOGRAPHY.h2, { marginBottom: SPACING.lg }]}>{editLesson ? 'Edit Lesson' : 'New Lesson'}</Text>
            {[['Title *', 'title'], ['YouTube URL *', 'url'], ['Duration (e.g. 12:30) *', 'duration'], ['Description', 'description']].map(([label, key]) => (
              <View key={key} style={[INPUT.group, { marginBottom: SPACING.sm }]}>
                <Text style={TYPOGRAPHY.bodySmall}>{label}</Text>
                <View style={INPUT.wrap}><TextInput style={INPUT.field} value={lessonForm[key]} onChangeText={v => setLessonForm(p => ({ ...p, [key]: v }))} /></View>
              </View>
            ))}
            <Text style={[TYPOGRAPHY.bodySmall, { marginBottom: SPACING.sm }]}>Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.lg }}>
              {LESSON_CATS.map(c => (
                <Pressable key={c} style={[CHIP.base, lessonForm.category === c && CHIP.active]} onPress={() => setLessonForm(p => ({ ...p, category: c }))}>
                  <Text style={[CHIP.text, lessonForm.category === c && CHIP.textActive]}>{c}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={BUTTON.primary} onPress={saveLesson}><Text style={BUTTON.text}>{editLesson ? 'Save Changes' : 'Create Lesson'}</Text></Pressable>
            <Pressable style={{ marginTop: SPACING.md }} onPress={() => setLessonModal(false)}><Text style={[TYPOGRAPHY.body, UTILS.textCenter]}>Cancel</Text></Pressable>
          </ScrollView>
        </View>
      </Modal>

      {/* Quiz Modal (stay open) */}
      <Modal visible={quizModal} transparent animationType="slide">
        <View style={MODAL.overlay}>
          <ScrollView keyboardShouldPersistTaps="handled" style={MODAL.content}>
            <View style={MODAL.handle} />
            <Text style={[TYPOGRAPHY.h2, { marginBottom: SPACING.lg }]}>New Quiz Question</Text>
            <View style={[INPUT.group, { marginBottom: SPACING.md }]}>
              <Text style={TYPOGRAPHY.bodySmall}>Question</Text>
              <View style={INPUT.wrap}><TextInput style={INPUT.field} value={quizForm.question} onChangeText={v => setQuizForm(p => ({ ...p, question: v }))} multiline /></View>
            </View>
            <Text style={[TYPOGRAPHY.bodySmall, { marginBottom: SPACING.sm }]}>Options (tap to mark correct)</Text>
            {quizForm.options.map((opt, i) => (
              <View key={i} style={[INPUT.group, { marginBottom: SPACING.sm }]}>
                <Pressable onPress={() => setQuizForm(p => ({ ...p, answer: i }))}>
                  <Text style={[TYPOGRAPHY.caption, { marginBottom: 4, color: quizForm.answer === i ? COLORS.green : COLORS.gray, fontWeight: quizForm.answer === i ? '700' : '400' }]}>
                    {quizForm.answer === i ? '✓ Correct' : `Option ${i + 1}`}
                  </Text>
                </Pressable>
                <View style={[INPUT.wrap, quizForm.answer === i && { borderColor: COLORS.green }]}>
                  <TextInput style={INPUT.field} value={opt} onChangeText={v => setQuizForm(p => { const opts = [...p.options]; opts[i] = v; return { ...p, options: opts }; })} />
                </View>
              </View>
            ))}
            <Pressable style={[BUTTON.primary, { marginTop: SPACING.md }]} onPress={saveQuiz}><Text style={BUTTON.text}>Add Question</Text></Pressable>
            <Pressable style={{ marginTop: SPACING.md }} onPress={closeQuizModal}><Text style={[TYPOGRAPHY.body, UTILS.textCenter]}>Close</Text></Pressable>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}