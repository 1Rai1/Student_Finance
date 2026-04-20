import React from 'react'
import ConfettiCannon from 'react-native-confetti-cannon';

export const showConfetti = (ref) => {
  if (ref && ref.current) {
    ref.current.start();
  }
};

export const Confetti = React.forwardRef((props, ref) => (
  <ConfettiCannon
    ref={ref}
    count={200}
    origin={{ x: -10, y: 0 }}
    explosionSpeed={350}
    fallSpeed={2500}
    colors={['#13294B', '#4CD964', '#F59E0B', '#EF4444', '#3B82F6']}
    autoStart={false}
    fadeOut={true}
    {...props}
  />
));

//colors
export const COLORS = {
  navy: '#13294B',
  green: '#4CD964',
  black: '#222222',
  gray: '#4A5568',
  white: '#FFFFFF',
  lightGray: '#F8F9FA',
  borderGray: '#E9ECEF',
  darkGray: '#333333',
  mediumGray: '#666666',
  red: '#EF4444',
  amber: '#F59E0B',
  blue: '#3B82F6',
};

//spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 18,
  xl: 32,
  xxl: 48,
  bullet: 8,
  logoWidth: 250,
  logoHeight: 200,
};

//typography
export const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: 'bold', color: '#333333' },
  h2: { fontSize: 24, fontWeight: 'bold', color: '#333333' },
  subtitle: { fontSize: 15, color: '#666666' },
  body: { fontSize: 16, color: '#333333' },
  bodySmall: { fontSize: 14, fontWeight: '600', color: '#333333' },
  caption: { fontSize: 15, color: '#666666' },
  button: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' },
  buttonArrow: { fontSize: 20, fontWeight: 'bold', color: '#4CD964' },
  link: { color: '#4CD964' },
};

//layout
export const LAYOUT = {
  container: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
  },
  header: { alignItems: 'center', marginBottom: 32 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 'auto',
    paddingTop: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
    marginBottom: 8,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bullet: { width: 8, height: 8, borderRadius: 4 },
  buttonRow: { flexDirection: 'row', gap: 8 },
  landingFooter: { paddingHorizontal: 32, paddingBottom: 32, paddingTop: 18 },
  landingContent: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  goalsHeader: { padding: 18, paddingTop: 60 },
  goalsList: { padding: 18 },
  //discounts screen
  discountsHeader: {
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  discountsFeed: {
    padding: 14,
    paddingBottom: 100,
  },
};

//input
export const INPUT = {
  group: { gap: 8 },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    position: 'relative'
  },
  field: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333333',
  },
  eyeButton: { paddingHorizontal: 14 },
};

//button
export const BUTTON = {
  primary: {
    backgroundColor: '#13294B',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'center',
    width: '100%',
  },
  rounded: { borderRadius: 30 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.6 },
  text: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  landingButton: {
    backgroundColor: '#13294B',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  newGoal: { backgroundColor: '#13294B', padding: 16, borderRadius: 10, marginBottom: 16 },
  newGoalText: { color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' },
  modalCreate: { backgroundColor: '#13294B', padding: 16, borderRadius: 10, marginTop: 20 },
  modalCreateText: { color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' },
  modalCancel: { marginTop: 12 },
  modalCancelText: { textAlign: 'center', color: '#4A5568' },
  //discounts
  discountPost: {
    backgroundColor: '#13294B',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountPostText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
};

//images
export const IMAGES = {
  logo: { width: 250, height: 200 },
};

//utils
export const UTILS = {
  flex1: { flex: 1 },
  itemsCenter: { alignItems: 'center' },
  justifyCenter: { justifyContent: 'center' },
  textCenter: { textAlign: 'center' },
  gapLg: { gap: 18 },
  row: { flexDirection: 'row', alignItems: 'center' },
  spaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  dragHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.borderGray, alignSelf: 'center', marginBottom: SPACING.md },
  alignEnd: { alignItems: 'flex-end', marginTop: SPACING.xs },
  center: { alignItems: 'center' },
  actionBtn: { flex: 1, justifyContent: 'center', gap: SPACING.xs },
};

//categories
export const CATEGORIES = {
  FOOD: '#F59E0B',
  TRANSPORT: '#3B82F6',
  BOOKS: '#8B5CF6',
  ENTERTAINMENT: '#EC4899',
  UTILITIES: '#10B981',
  OTHER: '#6B7280',
};

//budget
export const BUDGET = {
  spentColor: '#EF4444',
  progressBg: '#E9ECEF',
  cardBg: '#F8F9FA',
  editBtnBg: '#E9ECEF',
};

//chip
export const CHIP = {
  base: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  active: { backgroundColor: '#13294B', borderColor: '#13294B' },
  text: { fontSize: 13, fontWeight: '500', color: '#666666' },
  textActive: { color: '#FFFFFF' },
};

//progress
export const PROGRESS = {
  bar: { height: 8, borderRadius: 4, backgroundColor: '#E9ECEF', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
};

//modal
export const MODAL = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingBottom: 40,
    paddingTop: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E9ECEF',
    alignSelf: 'center',
    marginBottom: 18,
  },
  goalsModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingBottom: 40,
    paddingTop: 18,
  },
  //shared by CreatePostModal and CommentSheet
  discountModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingBottom: 36,
    paddingTop: 18,
    maxHeight: '92%',
  },
};

//card
export const CARD = {
  expense: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 14,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  budget: {
    marginHorizontal: 18,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  goal: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  goalStats: { flexDirection: 'row', justifyContent: 'space-between' },
  imagePicker: { marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.borderGray, borderRadius: 12, borderStyle: 'dashed', padding: SPACING.md, alignItems: 'center' },
  imagePickerPreview: { width: '100%', height: 160, borderRadius: 10 },
  discountPostImage: { width: '100%', height: 200 },
  //discount post card
  discountPost: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    overflow: 'hidden',
  },
  discountPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  discountPostBody: {
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  discountPostActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
};

//text
export const TEXT = {
  //goals
  goalName: { fontSize: 14, fontWeight: '600', color: '#333333' },
  goalProgress: { fontSize: 14, color: '#666666' },
  goalDelete: { fontSize: 16, color: '#4A5568' },
  emptyState: { textAlign: 'center', paddingTop: 40, color: '#666666' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#333333', marginBottom: 20 },
  modalLabel: { fontSize: 14, fontWeight: '600', color: '#333333' },
  //discounts
  postAuthor: { fontSize: 14, fontWeight: '700', color: '#333333' },
  postTime: { fontSize: 12, color: '#666666', marginTop: 1 },
  postTitle: { fontSize: 16, fontWeight: '700', color: '#333333', marginBottom: 4 },
  postBody: { fontSize: 14, color: '#4A5568', lineHeight: 20 },
  postLocation: { fontSize: 12, color: '#666666', marginTop: 6 },
  commentAuthor: { fontSize: 13, fontWeight: '700', color: '#333333' },
  commentText: { fontSize: 13, color: '#333333', lineHeight: 18 },
  commentTime: { fontSize: 11, color: '#666666', marginTop: 2 },
  actionIcon: { fontSize: 13, fontWeight: '600', color: COLORS.gray },
};

//input styles
export const INPUT_STYLES = {
  goalInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
  },
  discountInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    fontSize: 15,
    color: '#333333',
  },
  discountTextArea: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    fontSize: 15,
    color: '#333333',
    minHeight: 90,
    textAlignVertical: 'top',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 14,
    color: '#333333',
    maxHeight: 80,
  },
};

//badge
export const BADGE = {
  verified: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedText: { fontSize: 11, fontWeight: '700', color: '#059669' },
  fake: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  fakeText: { fontSize: 11, fontWeight: '700', color: '#DC2626' },
  unverified: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  unverifiedText: { fontSize: 11, fontWeight: '700', color: '#D97706' },
};

//avatar
export const AVATAR = {
  sm: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#13294B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  smText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  lg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#13294B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  lgText: { color: '#FFFFFF', fontWeight: '700', fontSize: 18 },
};