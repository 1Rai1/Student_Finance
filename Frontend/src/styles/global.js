// ============================================
// COLORS - Used across ALL components
// ============================================
export const COLORS = {
  navy: '#13294B',        // Buttons, headers, primary actions
  green: '#4CD964',       // Success states, arrows, links
  black: '#222222',       // Text (minimal use)
  gray: '#4A5568',        // Secondary text, icons
  white: '#FFFFFF',       // Backgrounds, text on dark
  lightGray: '#F8F9FA',   // Card backgrounds, input backgrounds
  borderGray: '#E9ECEF',  // Borders, dividers, progress background
  darkGray: '#333333',    // Primary text color
  mediumGray: '#666666',  // Secondary text, captions
};

// ============================================
// SPACING - Used across ALL components
// ============================================
export const SPACING = {
  xs: 4,   // Tiny gaps, bullet points
  sm: 8,   // Small gaps, padding between elements
  md: 14,  // Medium gaps, card padding
  lg: 18,  // Large gaps, section padding
  xl: 32,  // Extra large, screen edges
  xxl: 48, // Double extra large, large sections
  bullet: 8,      // Landing page bullet points
  logoWidth: 250, // Logo dimensions
  logoHeight: 200,
};

// ============================================
// TYPOGRAPHY - Used across ALL components
// ============================================
export const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: 'bold', color: COLORS.darkGray },        // Screen titles (Expenses, Goals)
  h2: { fontSize: 24, fontWeight: 'bold', color: COLORS.darkGray },        // Section headers, modal titles
  subtitle: { fontSize: 15, color: COLORS.mediumGray },                    // Subtitles, descriptions
  body: { fontSize: 16, color: COLORS.darkGray },                          // Regular text
  bodySmall: { fontSize: 14, fontWeight: '600', color: COLORS.darkGray },  // Labels, small headers
  caption: { fontSize: 15, color: COLORS.mediumGray },                     // Helper text, timestamps
  button: { fontSize: 17, fontWeight: 'bold', color: COLORS.white },       // Button text
  buttonArrow: { fontSize: 20, fontWeight: 'bold', color: COLORS.green },  // Landing page arrows
  link: { color: COLORS.green },                                           // Links
};

// ============================================
// LAYOUT - Component-specific layouts
// ============================================
export const LAYOUT = {
  // General screens
  container: {               // All screen containers
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  header: { alignItems: 'center', marginBottom: SPACING.xl },  // Screen headers
  footer: {                // Screen footers with buttons
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: 'auto',
    paddingTop: SPACING.xl,
  },
  backButton: {            // Back navigation buttons
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -SPACING.sm,
    marginBottom: SPACING.sm,
  },
  
  // Landing page specific
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },  // Feature bullets
  bullet: { width: SPACING.bullet, height: SPACING.bullet, borderRadius: SPACING.xs },  // Bullet points
  buttonRow: { flexDirection: 'row', gap: SPACING.sm },  // Button groups
  landingFooter: {         // Landing page bottom section
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  landingContent: {        // Landing page main content
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  
  // Goals screen specific
  goalsHeader: { padding: SPACING.lg, paddingTop: 60 },  // Goals screen header
  goalsList: { padding: SPACING.lg },                    // Goals list container
};

// ============================================
// INPUT - Login, Register, forms
// ============================================
export const INPUT = {
  group: { gap: SPACING.sm },                    // Input field groups
  wrap: {                                         // Input wrapper with icon
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  field: {                                         // Actual input field
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    color: COLORS.darkGray,
  },
  eyeButton: { paddingHorizontal: SPACING.md },   // Password visibility toggle
};

// ============================================
// BUTTON - All button styles
// ============================================
export const BUTTON = {
  primary: {                                       // Primary buttons (Login, Register)
    backgroundColor: COLORS.navy,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: SPACING.sm,
    justifyContent: 'center',
    width: '100%',
  },
  rounded: { borderRadius: 30 },                   // Rounded buttons (Landing)
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },  // Press state
  disabled: { opacity: 0.6 },                      // Disabled state
  text: { fontSize: 17, fontWeight: 'bold', color: COLORS.white, textAlign: 'center' },  // Button text
  
  // Landing page buttons
  landingButton: {
    backgroundColor: COLORS.navy,
    borderRadius: 30,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    width: '100%',
  },
  
  // Goals screen buttons
  newGoal: { backgroundColor: COLORS.navy, padding: 16, borderRadius: 10, marginBottom: 16 },
  newGoalText: { color: COLORS.white, textAlign: 'center', fontWeight: 'bold' },
  modalCreate: { backgroundColor: COLORS.navy, padding: 16, borderRadius: 10, marginTop: 20 },
  modalCreateText: { color: COLORS.white, textAlign: 'center', fontWeight: 'bold' },
  modalCancel: { marginTop: 12 },
  modalCancelText: { textAlign: 'center', color: COLORS.gray },
};

// ============================================
// IMAGES - Logo and images
// ============================================
export const IMAGES = {
  logo: { width: SPACING.logoWidth, height: SPACING.logoHeight },  // App logo
};

// ============================================
// UTILS - Reusable utility styles
// ============================================
export const UTILS = {
  flex1: { flex: 1 },
  itemsCenter: { alignItems: 'center' },
  justifyCenter: { justifyContent: 'center' },
  textCenter: { textAlign: 'center' },
  gapLg: { gap: SPACING.lg },
};

// ============================================
// CATEGORIES - Expense categories
// ============================================
export const CATEGORIES = {
  FOOD: '#F59E0B',        // Food category color
  TRANSPORT: '#3B82F6',   // Transport category color
  BOOKS: '#8B5CF6',       // Books category color
  ENTERTAINMENT: '#EC4899', // Entertainment color
  UTILITIES: '#10B981',   // Utilities color
  OTHER: '#6B7280',       // Other category color
};

// ============================================
// BUDGET - Budget screen styles
// ============================================
export const BUDGET = {
  spentColor: '#EF4444',   // Spent amount color (red)
  progressBg: COLORS.borderGray,  // Progress bar background
  cardBg: COLORS.lightGray,       // Budget card background
  editBtnBg: COLORS.borderGray,   // Edit button background
};

// ============================================
// CHIP - Category chips (Expenses)
// ============================================
export const CHIP = {
  base: {                  // Category chip base style
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  active: { backgroundColor: COLORS.navy, borderColor: COLORS.navy },  // Active chip
  text: { fontSize: 13, fontWeight: '500', color: COLORS.mediumGray },  // Chip text
  textActive: { color: COLORS.white },  // Active chip text
};

// ============================================
// PROGRESS - Progress bars (Budget, Goals)
// ============================================
export const PROGRESS = {
  bar: { 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: COLORS.borderGray, 
    overflow: 'hidden' 
  },
  fill: { 
    height: '100%', 
    borderRadius: 4 
  },
};

// ============================================
// MODAL - Modal styles (Expenses, Goals)
// ============================================
export const MODAL = {
  overlay: {               // Modal backdrop
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  content: {               // Expense modal content
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
    paddingTop: SPACING.sm,
  },
  handle: {                // Modal drag handle
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.borderGray,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  goalsModal: {            // Goals modal content
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
    paddingTop: SPACING.lg,
  },
};

// ============================================
// CARD - Card styles (Expenses, Goals)
// ============================================
export const CARD = {
  expense: {               // Expense item card
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  budget: {                // Budget summary card
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  goal: {                  // Goal item card
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },  // Goal header row
  goalStats: { flexDirection: 'row', justifyContent: 'space-between' },  // Goal stats row
};
//Component-specific text styles
export const TEXT = {
  // Goals screen
  goalName: { fontSize: 14, fontWeight: '600', color: COLORS.darkGray },
  goalProgress: { fontSize: 14, color: COLORS.mediumGray },
  goalDelete: { fontSize: 16, color: COLORS.gray },
  emptyState: { textAlign: 'center', paddingTop: 40, color: COLORS.mediumGray }, //Empty list message
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 20 }, //Modal title
  modalLabel: { fontSize: 14, fontWeight: '600', color: COLORS.darkGray }, //Modal field labels
};
//omponent-specific inputs
export const INPUT_STYLES = {
  goalInput: { //Goals screen input fields
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
  },
};