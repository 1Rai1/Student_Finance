/**
 * Global style definitions test
 */
describe('Global Styles Module', () => {
  let styles;

  beforeEach(() => {
    // Import the styles
    styles = require('../styles/global');
  });

  describe('COLORS', () => {
    it('should export COLORS object', () => {
      expect(styles.COLORS).toBeDefined();
      expect(typeof styles.COLORS).toBe('object');
    });

    it('should have required color properties', () => {
      expect(styles.COLORS.white).toBeDefined();
      expect(styles.COLORS.primary).toBeDefined();
      expect(styles.COLORS.darkGray).toBeDefined();
    });
  });

  describe('SPACING', () => {
    it('should export SPACING object', () => {
      expect(styles.SPACING).toBeDefined();
      expect(typeof styles.SPACING).toBe('object');
    });

    it('should have required spacing values', () => {
      expect(styles.SPACING.sm).toBeDefined();
      expect(styles.SPACING.md).toBeDefined();
      expect(styles.SPACING.lg).toBeDefined();
    });

    it('should have numeric spacing values', () => {
      expect(typeof styles.SPACING.sm).toBe('number');
      expect(typeof styles.SPACING.md).toBe('number');
      expect(typeof styles.SPACING.lg).toBe('number');
    });
  });

  describe('TYPOGRAPHY', () => {
    it('should export TYPOGRAPHY object', () => {
      expect(styles.TYPOGRAPHY).toBeDefined();
      expect(typeof styles.TYPOGRAPHY).toBe('object');
    });

    it('should have required typography styles', () => {
      expect(styles.TYPOGRAPHY.h1).toBeDefined();
      expect(styles.TYPOGRAPHY.h2).toBeDefined();
      expect(styles.TYPOGRAPHY.subtitle).toBeDefined();
    });
  });

  describe('LAYOUT', () => {
    it('should export LAYOUT object', () => {
      expect(styles.LAYOUT).toBeDefined();
      expect(typeof styles.LAYOUT).toBe('object');
    });

    it('should have container layout', () => {
      expect(styles.LAYOUT.container).toBeDefined();
    });
  });

  describe('INPUT', () => {
    it('should export INPUT object', () => {
      expect(styles.INPUT).toBeDefined();
      expect(typeof styles.INPUT).toBe('object');
    });

    it('should have input field styles', () => {
      expect(styles.INPUT.field).toBeDefined();
      expect(styles.INPUT.group).toBeDefined();
    });
  });

  describe('BUTTON', () => {
    it('should export BUTTON object', () => {
      expect(styles.BUTTON).toBeDefined();
      expect(typeof styles.BUTTON).toBe('object');
    });

    it('should have primary button style', () => {
      expect(styles.BUTTON.primary).toBeDefined();
    });
  });
});
