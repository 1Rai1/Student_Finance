# Frontend Jest Testing Guide

## Overview
This frontend project includes comprehensive automated Jest tests covering components, hooks, and utilities.

## Test Files Structure

### `jest.config.js`
Main Jest configuration file that:
- Uses `jest-expo` preset for React Native
- Sets up module paths and transformations
- Configures coverage thresholds (50% minimum)
- Includes ignore patterns for node_modules and builds

### `jest.setup.js`
Test environment setup that:
- Imports testing library extensions
- Mocks AsyncStorage for storage operations
- Mocks fetch API for HTTP requests
- Mocks React Navigation utilities
- Resets mocks after each test

## Test Suites

### 1. `__tests__/config.test.js`
Tests the API configuration module:
- ✓ Verifies API base URL is defined
- ✓ Validates API endpoint protocol (http/https)
- ✓ Checks for `/api` endpoint suffix
- ✓ Ensures no trailing slashes
- ✓ Validates valid IP addresses

### 2. `__tests__/useAuth.test.js`
Tests the authentication hook:
- ✓ Login functionality validation
- ✓ Registration with field validation
- ✓ Session restoration from AsyncStorage
- ✓ Loading state management
- ✓ User context availability

### 3. `__tests__/Login.test.js`
Tests the Login screen component:
- ✓ Screen rendering
- ✓ Welcome message display
- ✓ Email and password input fields
- ✓ Input state updates
- ✓ Password visibility toggle
- ✓ Navigation buttons
- ✓ Loading state handling

### 4. `__tests__/Register.test.js`
Tests the Register screen component:
- ✓ Screen rendering
- ✓ Account creation messaging
- ✓ All required input fields (username, email, password, confirm password)
- ✓ Form state management
- ✓ Password visibility toggle
- ✓ Navigation links
- ✓ Loading state handling

### 5. `__tests__/hooks.test.js`
Generic tests for custom hooks:
- ✓ useAuth hook property verification
- ✓ Function type validation
- ✓ Auth context availability

### 6. `__tests__/globals.test.js`
Tests global style definitions:
- ✓ COLORS object and properties
- ✓ SPACING object and numeric values
- ✓ TYPOGRAPHY styles
- ✓ LAYOUT definitions
- ✓ INPUT field styles
- ✓ BUTTON styles

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests for a specific file
```bash
npm test config.test.js
```

### Run tests with coverage report
```bash
npm test -- --coverage
```

### Run tests with verbose output
```bash
npm test -- --verbose
```

## Test Coverage

The project maintains minimum coverage thresholds of:
- **Branches**: 50%
- **Functions**: 50%
- **Lines**: 50%
- **Statements**: 50%

View coverage report:
```bash
npm test -- --coverage
```

## Mocked Dependencies

### AsyncStorage
All AsyncStorage calls are mocked to prevent file system access during tests.

### Fetch API
Global fetch is mocked to handle API calls without network requests.

### React Navigation
Navigation hooks and components are mocked to test navigation logic without full navigation stack.

### Global Styles
Style modules are mocked in component tests to focus on logic rather than styling.

## Adding New Tests

When adding new test files:

1. **Location**: Create files in `src/__tests__/` directory
2. **Naming**: Use `*.test.js` or `*.spec.js` suffix
3. **Structure**: Follow existing test patterns with describe/it blocks
4. **Mocking**: Import and mock external dependencies
5. **Coverage**: Aim to maintain >50% coverage threshold

## Example Test Template

```javascript
import { render, fireEvent } from '@testing-library/react-native';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    const { container } = render(<MyComponent />);
    expect(container).toBeTruthy();
  });

  it('should handle user interaction', () => {
    const { getByText } = render(<MyComponent />);
    const button = getByText('Click me');
    fireEvent.press(button);
    // Add assertions
  });
});
```

## Debugging Tests

### Run single test file
```bash
npm test -- Login.test.js
```

### Run tests matching pattern
```bash
npm test -- --testNamePattern="login"
```

### Debug with Node Inspector
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Clarity**: Use descriptive test names
3. **Setup/Teardown**: Use beforeEach/afterEach for cleanup
4. **Assertions**: Include meaningful assertions
5. **Mocking**: Mock external dependencies appropriately
6. **Coverage**: Aim to test happy paths and error cases

## Troubleshooting

### Tests failing due to mocks
- Verify mocks are properly set up in jest.setup.js
- Clear mocks between tests with jest.clearAllMocks()

### Import errors
- Check jest.config.js transformIgnorePatterns
- Ensure moduleNameMapper is correctly configured

### Navigation errors
- Verify useNavigation is properly mocked
- Check navigation mock return values include expected methods

### AsyncStorage errors
- Confirm AsyncStorage is mocked in jest.setup.js
- Verify mock implementations match expected behavior

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [Jest Expo Documentation](https://docs.expo.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about/)
