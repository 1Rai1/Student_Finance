import React, { useState } from 'react';
import { Text, View, Pressable, FlatList, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT, BUTTON, MODAL, CARD, TEXT, INPUT_STYLES, UTILS, PROGRESS } from '../styles/global';
import { useGoals } from '../hooks/useGoals';

export default function GoalsScreen() {
  const { goals, loading, createGoal, deleteGoal, addProgress } = useGoals();
  //state
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [addAmount, setAddAmount] = useState('');

  //create goal
  const handleCreate = async () => {
    if (!title || !target) {
      Alert.alert('Error', 'Fill all fields');
      return;
    }
    const num = parseFloat(target);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Error', 'Invalid amount');
      return;
    }

    const success = await createGoal({
      title: title.trim(),
      targetAmount: num,
      category: 'general'
    });

    if (success) {
      setTitle('');
      setTarget('');
      setShowModal(false);
    }
  };

  //add savings
  const handleAddSavings = async () => {
    if (!selectedGoal) {
      Alert.alert('Error', 'No goal selected');
      return;
    }

    //validate amount
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const success = await addProgress(selectedGoal.id, amount);
    
    if (success) {
      setAddAmount('');
      setSelectedGoal(null);
      setShowAddModal(false);
    }
  };

  //open add modal
  const openAddModal = (goal) => {
    setSelectedGoal(goal);
    setAddAmount('');
    setShowAddModal(true);
  };

  //render goal item
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
          </View>
          <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
            {!isCompleted && (
              <Pressable 
                onPress={() => openAddModal(item)}
                style={{ backgroundColor: COLORS.green, padding: 8, borderRadius: 8 }}
              >
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

        {/*progress bar*/}
        <View style={[PROGRESS.bar, { marginVertical: SPACING.sm }]}>
          <View style={[
            PROGRESS.fill, 
            { 
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: isCompleted ? COLORS.green : COLORS.navy 
            }
          ]} />
        </View>

        {/*progress stats*/}
        <View style={CARD.goalStats}>
          <Text style={TEXT.goalProgress}>{progress}% complete</Text>
          {isCompleted && (
            <Text style={[TEXT.goalProgress, { color: COLORS.green }]}>✓ Completed</Text>
          )}
        </View>
      </View>
    );
  };

  //loading state
  if (loading && !goals.length) {
    return (
      <View style={[UTILS.flex1, UTILS.itemsCenter, UTILS.justifyCenter]}>
        <ActivityIndicator size="large" color={COLORS.navy} />
      </View>
    );
  }

  return (
    <View style={UTILS.flex1}>
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
          <Pressable 
            style={BUTTON.newGoal}
            onPress={() => setShowModal(true)}
          >
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

      {/*new goal modal*/}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={MODAL.overlay}>
          <View style={MODAL.goalsModal}>
            <Text style={TEXT.modalTitle}>New Goal</Text>
            
            <Text style={TEXT.modalLabel}>Goal Name</Text>
            <TextInput
              style={INPUT_STYLES.goalInput}
              placeholder="e.g. New Laptop"
              value={title}
              onChangeText={setTitle}
            />
            
            <Text style={[TEXT.modalLabel, { marginTop: 16 }]}>Target Amount (₱)</Text>
            <TextInput
              style={INPUT_STYLES.goalInput}
              placeholder="1000"
              value={target}
              onChangeText={setTarget}
              keyboardType="decimal-pad"
            />

            <Pressable 
              style={BUTTON.modalCreate}
              onPress={handleCreate}
            >
              <Text style={BUTTON.modalCreateText}>Create Goal</Text>
            </Pressable>

            <Pressable 
              style={BUTTON.modalCancel}
              onPress={() => {
                setShowModal(false);
                setTitle('');
                setTarget('');
              }}
            >
              <Text style={BUTTON.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/*add savings modal*/}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={MODAL.overlay}>
          <View style={MODAL.goalsModal}>
            <Text style={TEXT.modalTitle}>Add Savings</Text>
            
            {selectedGoal && (
              <>
                <Text style={TEXT.goalName}>{selectedGoal.title}</Text>
                <Text style={TEXT.goalProgress}>
                  Current: ₱{selectedGoal.currentAmount || 0} of ₱{selectedGoal.targetAmount}
                </Text>
                
                <Text style={[TEXT.modalLabel, { marginTop: 20 }]}>Amount to Add (₱)</Text>
                <TextInput
                  style={INPUT_STYLES.goalInput}
                  placeholder="Enter amount"
                  value={addAmount}
                  onChangeText={setAddAmount}
                  keyboardType="decimal-pad"
                  autoFocus
                />

                <Pressable 
                  style={BUTTON.modalCreate}
                  onPress={handleAddSavings}
                >
                  <Text style={BUTTON.modalCreateText}>Add Savings</Text>
                </Pressable>
              </>
            )}

            <Pressable 
              style={BUTTON.modalCancel}
              onPress={() => {
                setShowAddModal(false);
                setSelectedGoal(null);
                setAddAmount('');
              }}
            >
              <Text style={BUTTON.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}