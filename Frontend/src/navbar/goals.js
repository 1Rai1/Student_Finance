import React, { useState, useRef } from 'react';
import { Text, View, Pressable, FlatList, TextInput, Modal, Alert, ActivityIndicator, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT, BUTTON, MODAL, CARD, TEXT, INPUT_STYLES, UTILS, PROGRESS, CHIP, Confetti, showConfetti } from '../styles/global';
import { useGoals } from '../hooks/useGoals';

const CATEGORIES = ['General', 'Education', 'Travel', 'Shopping', 'Emergency', 'Other'];

export default function GoalsScreen() {
  const { goals, loading, createGoal, deleteGoal, addProgress } = useGoals();
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [category, setCategory] = useState('General');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  // ref for confetti
  const confettiRef = useRef(null);

  const handleCreate = async () => {
    if (!title || !target) {
      Alert.alert('Error', 'Title and target amount are required');
      return;
    }
    const num = parseFloat(target);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Error', 'Invalid amount');
      return;
    }
    if (deadline) {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        Alert.alert('Error', 'Deadline cannot be in the past');
        return;
      }
    }
    const success = await createGoal({
      title: title.trim(),
      targetAmount: num,
      category,
      deadline: deadline.trim() || null,
      description: description.trim()
    });
    if (success) {
      setTitle('');
      setTarget('');
      setCategory('General');
      setDeadline('');
      setDescription('');
      setShowModal(false);
    }
  };

  const handleAddSavings = async () => {
    if (!selectedGoal) {
      Alert.alert('Error', 'No goal selected');
      return;
    }
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    const success = await addProgress(selectedGoal.id, amount);
    if (success) {
      // Trigger confetti celebration
      showConfetti(confettiRef);
      setAddAmount('');
      setSelectedGoal(null);
      setShowAddModal(false);
    }
  };

  const openAddModal = (goal) => {
    setSelectedGoal(goal);
    setAddAmount('');
    setShowAddModal(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setDeadline(`${year}-${month}-${day}`);
    }
  };

  const renderGoal = ({ item }) => {
    const progress = item.targetAmount > 0 
      ? ((item.currentAmount || 0) / item.targetAmount * 100).toFixed(0) 
      : 0;
    const isCompleted = item.status === 'completed' || item.currentAmount >= item.targetAmount;
    return (
      <View style={[CARD.goal, isCompleted && { borderColor: COLORS.green, borderWidth: 2 }]}>
        <View style={CARD.goalHeader}>
          <View style={{ flex: 1 }}>
            <Text style={TEXT.goalName}>{item.title}</Text>
            <Text style={TEXT.goalProgress}>
              ₱{item.currentAmount || 0} of ₱{item.targetAmount}
            </Text>
            {item.category && <Text style={[TEXT.goalProgress, { fontSize: 12, color: COLORS.gray }]}>Category: {item.category}</Text>}
            {item.deadline && <Text style={[TEXT.goalProgress, { fontSize: 12, color: COLORS.gray }]}>Deadline: {item.deadline}</Text>}
          </View>
          <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
            {!isCompleted && (
              <Pressable onPress={() => openAddModal(item)} style={{ backgroundColor: COLORS.green, padding: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Add Savings</Text>
              </Pressable>
            )}
            <Pressable onPress={() => {
              Alert.alert('Delete', 'Are you sure?', [
                { text: 'Cancel' },
                { text: 'Delete', onPress: () => deleteGoal(item.id) }
              ]);
            }}>
              <Text style={TEXT.goalDelete}>✕</Text>
            </Pressable>
          </View>
        </View>
        <View style={[PROGRESS.bar, { marginVertical: SPACING.sm }]}>
          <View style={[PROGRESS.fill, { width: `${Math.min(progress, 100)}%`, backgroundColor: isCompleted ? COLORS.green : COLORS.navy }]} />
        </View>
        <View style={CARD.goalStats}>
          <Text style={TEXT.goalProgress}>{progress}% complete</Text>
          {isCompleted && <Text style={[TEXT.goalProgress, { color: COLORS.green }]}>✓ Completed</Text>}
        </View>
      </View>
    );
  };

  if (loading && !goals.length) {
    return (
      <View style={[UTILS.flex1, UTILS.itemsCenter, UTILS.justifyCenter]}>
        <ActivityIndicator size="large" color={COLORS.navy} />
      </View>
    );
  }

  return (
    <View style={UTILS.flex1}>
      {/* confetti cannon */}
      <Confetti ref={confettiRef} />

      <View style={LAYOUT.goalsHeader}>
        <Text style={TYPOGRAPHY.h1}>My Goals</Text>
        <Text style={TYPOGRAPHY.caption}>
          {goals.filter(g => g.status === 'completed' || g.currentAmount >= g.targetAmount).length} of {goals.length} completed
        </Text>
      </View>

      <FlatList
        data={goals}
        renderItem={renderGoal}
        keyExtractor={item => item.id}
        contentContainerStyle={LAYOUT.goalsList}
        ListHeaderComponent={
          <Pressable style={BUTTON.newGoal} onPress={() => setShowModal(true)}>
            <Text style={BUTTON.newGoalText}>+ New Goal</Text>
          </Pressable>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <Text style={TEXT.emptyState}>No goals yet</Text>
            <Text style={[TEXT.emptyState, { fontSize: 14, marginTop: SPACING.sm }]}>
              Tap "New Goal" to start saving!
            </Text>
          </View>
        }
      />

      {/* create goal modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={MODAL.overlay}>
          <ScrollView contentContainerStyle={MODAL.goalsModal} showsVerticalScrollIndicator={false}>
            <Text style={TEXT.modalTitle}>New Goal</Text>
            <Text style={TEXT.modalLabel}>Goal Name *</Text>
            <TextInput style={INPUT_STYLES.goalInput} placeholder="e.g. New Laptop" value={title} onChangeText={setTitle} />
            <Text style={[TEXT.modalLabel, { marginTop: 16 }]}>Target Amount (₱) *</Text>
            <TextInput style={INPUT_STYLES.goalInput} placeholder="1000" value={target} onChangeText={setTarget} keyboardType="decimal-pad" />
            <Text style={[TEXT.modalLabel, { marginTop: 16 }]}>Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginVertical: SPACING.sm }}>
              {CATEGORIES.map(c => (
                <Pressable key={c} style={[CHIP.base, category === c && CHIP.active]} onPress={() => setCategory(c)}>
                  <Text style={[CHIP.text, category === c && CHIP.textActive]}>{c}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={[TEXT.modalLabel, { marginTop: 8 }]}>Deadline (optional)</Text>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <View pointerEvents="none">
                <TextInput style={INPUT_STYLES.goalInput} placeholder="Select date" value={deadline} editable={false} />
              </View>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
            <Text style={[TEXT.modalLabel, { marginTop: 8 }]}>Description (optional)</Text>
            <TextInput style={[INPUT_STYLES.goalInput, { minHeight: 80, textAlignVertical: 'top' }]} placeholder="Describe your goal..." value={description} onChangeText={setDescription} multiline />
            <Pressable style={BUTTON.modalCreate} onPress={handleCreate}>
              <Text style={BUTTON.modalCreateText}>Create Goal</Text>
            </Pressable>
            <Pressable style={BUTTON.modalCancel} onPress={() => { setShowModal(false); setTitle(''); setTarget(''); setCategory('General'); setDeadline(''); setDescription(''); }}>
              <Text style={BUTTON.modalCancelText}>Cancel</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>

      {/* add savings modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={MODAL.overlay}>
          <View style={MODAL.goalsModal}>
            <Text style={TEXT.modalTitle}>Add Savings</Text>
            {selectedGoal && (
              <>
                <Text style={TEXT.goalName}>{selectedGoal.title}</Text>
                <Text style={TEXT.goalProgress}>Current: ₱{selectedGoal.currentAmount || 0} of ₱{selectedGoal.targetAmount}</Text>
                <Text style={[TEXT.modalLabel, { marginTop: 20 }]}>Amount to Add (₱)</Text>
                <TextInput style={INPUT_STYLES.goalInput} placeholder="Enter amount" value={addAmount} onChangeText={setAddAmount} keyboardType="decimal-pad" autoFocus />
                <Pressable style={BUTTON.modalCreate} onPress={handleAddSavings}>
                  <Text style={BUTTON.modalCreateText}>Add Savings</Text>
                </Pressable>
              </>
            )}
            <Pressable style={BUTTON.modalCancel} onPress={() => { setShowAddModal(false); setSelectedGoal(null); setAddAmount(''); }}>
              <Text style={BUTTON.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}