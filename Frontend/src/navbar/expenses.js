import React, { useState } from 'react';
import { Text, View, Pressable, FlatList, TextInput, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useExpenses } from '../hooks/useExpenses';
import { COLORS, SPACING, TYPOGRAPHY, BUTTON, INPUT, UTILS, CATEGORIES, BUDGET, CHIP, PROGRESS, MODAL, CARD } from '../styles/global';

//category list
const CAT_LIST = ['Food', 'Transport', 'Books', 'Entertainment', 'Utilities', 'Other'];

export default function ExpensesScreen() {
  const nav = useNavigation();
  const { user, logout } = useAuth();
  const { expenses, monthlyBudget, setMonthlyBudget, totalExpenses, remaining, budgetPercent, barColor, addExpense, deleteExpense } = useExpenses();
  
  //state
  const [showAdd, setShowAdd] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState('Food');
  const [budgetIn, setBudgetIn] = useState('');

  //add expense
  const handleAdd = async () => {
    if (!title || !amount) return Alert.alert('Error', 'Fill fields');
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return Alert.alert('Error', 'Invalid amount');
    if (await addExpense({ title, description: title, amount: num, category: cat })) {
      setTitle(''); setAmount(''); setCat('Food'); setShowAdd(false);
    }
  };

  //set budget
  const handleBudget = () => {
    const num = parseFloat(budgetIn);
    if (isNaN(num) || num <= 0) return Alert.alert('Error', 'Invalid budget');
    setMonthlyBudget(num); setBudgetIn(''); setShowBudget(false);
  };

  //render expense item
  const renderItem = ({ item }) => (
    <View style={CARD.expense}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: CATEGORIES[item.category?.toUpperCase()] || CATEGORIES.OTHER }} />
        <View>
          <Text style={TYPOGRAPHY.bodySmall}>{item.title}</Text>
          <Text style={TYPOGRAPHY.caption}>{item.category}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}>
        <Text style={[TYPOGRAPHY.bodySmall, { color: BUDGET.spentColor }]}>-₱{item.amount?.toFixed(2)}</Text>
        <Pressable onPress={() => Alert.alert('Delete', 'Sure?', [
          { text: 'No' }, { text: 'Yes', onPress: () => deleteExpense(item.id) }
        ])}>
          <Text style={TYPOGRAPHY.body}>✕</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[UTILS.flex1, { backgroundColor: COLORS.white }]}>
      {/*header*/}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.lg, paddingTop: 60 }}>
        <View>
          <Text style={TYPOGRAPHY.caption}>Hi, {user?.name}</Text>
          <Text style={TYPOGRAPHY.h1}>Expenses</Text>
        </View>
        <Pressable onPress={async () => { await logout(); nav.replace('Login'); }}>
          <Text style={TYPOGRAPHY.body}>Logout</Text>
        </Pressable>
      </View>

      {/*budget card*/}
      <View style={CARD.budget}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={TYPOGRAPHY.caption}>Monthly Budget</Text>
            <Text style={TYPOGRAPHY.h1}>₱{monthlyBudget.toFixed(2)}</Text>
          </View>
          <Pressable style={{ backgroundColor: BUDGET.editBtnBg, width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { setBudgetIn(monthlyBudget.toString()); setShowBudget(true); }}>
            <Text>Edit</Text>
          </Pressable>
        </View>
        {/*progress bar*/}
        <View style={[PROGRESS.bar, { marginTop: SPACING.md }]}>
          <View style={[PROGRESS.fill, { width: `${budgetPercent}%`, backgroundColor: barColor }]} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.md }}>
          <View><Text style={TYPOGRAPHY.caption}>Spent</Text><Text style={[TYPOGRAPHY.bodySmall, { color: BUDGET.spentColor }]}>₱{totalExpenses.toFixed(2)}</Text></View>
          <View><Text style={TYPOGRAPHY.caption}>Left</Text><Text style={[TYPOGRAPHY.bodySmall, { color: remaining >= 0 ? COLORS.green : BUDGET.spentColor }]}>₱{remaining.toFixed(2)}</Text></View>
        </View>
      </View>

      {/*list header*/}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.md }}>
        <Text style={TYPOGRAPHY.h2}>Recent</Text>
        <Pressable style={{ backgroundColor: COLORS.navy, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 12 }} onPress={() => setShowAdd(true)}>
          <Text style={BUTTON.text}>+ New</Text>
        </Pressable>
      </View>

      <FlatList
        data={expenses}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
        ListEmptyComponent={<Text style={[TYPOGRAPHY.body, UTILS.textCenter, { paddingTop: 64 }]}>No expenses</Text>}
      />

      {/*add modal*/}
      <Modal visible={showAdd} transparent>
        <View style={MODAL.overlay}>
          <View style={MODAL.content}>
            <View style={MODAL.handle} />
            <Text style={[TYPOGRAPHY.h2, { marginBottom: SPACING.lg }]}>New Expense</Text>
            
            <View style={INPUT.group}>
              <Text style={TYPOGRAPHY.bodySmall}>Title</Text>
              <View style={INPUT.wrap}><TextInput style={INPUT.field} value={title} onChangeText={setTitle} /></View>
            </View>
            
            <View style={INPUT.group}>
              <Text style={TYPOGRAPHY.bodySmall}>Amount</Text>
              <View style={INPUT.wrap}><TextInput style={INPUT.field} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" /></View>
            </View>

            <Text style={TYPOGRAPHY.bodySmall}>Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginVertical: SPACING.sm }}>
              {CAT_LIST.map(c => (
                <Pressable key={c} style={[CHIP.base, cat === c && CHIP.active]} onPress={() => setCat(c)}>
                  <Text style={[CHIP.text, cat === c && CHIP.textActive]}>{c}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={BUTTON.primary} onPress={handleAdd}><Text style={BUTTON.text}>Add</Text></Pressable>
            <Pressable onPress={() => setShowAdd(false)} style={{ marginTop: SPACING.md }}>
              <Text style={[TYPOGRAPHY.body, UTILS.textCenter]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/*budget modal*/}
      <Modal visible={showBudget} transparent>
        <View style={MODAL.overlay}>
          <View style={MODAL.content}>
            <View style={MODAL.handle} />
            <Text style={[TYPOGRAPHY.h2, { marginBottom: SPACING.lg }]}>Set Budget</Text>
            
            <View style={INPUT.group}>
              <Text style={TYPOGRAPHY.bodySmall}>Amount</Text>
              <View style={INPUT.wrap}><TextInput style={INPUT.field} value={budgetIn} onChangeText={setBudgetIn} keyboardType="decimal-pad" /></View>
            </View>

            <Pressable style={BUTTON.primary} onPress={handleBudget}><Text style={BUTTON.text}>Save</Text></Pressable>
            <Pressable onPress={() => setShowBudget(false)} style={{ marginTop: SPACING.md }}>
              <Text style={[TYPOGRAPHY.body, UTILS.textCenter]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}