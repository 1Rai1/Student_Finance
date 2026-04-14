import API_BASE from '../config';

describe('Config Module', () => {
  it('should export a valid API base URL', () => {
    expect(API_BASE).toBeDefined();
    expect(typeof API_BASE).toBe('string');
  });

  it('should contain http protocol', () => {
    expect(API_BASE).toMatch(/^https?:\/\//);
  });

  it('should contain /api endpoint', () => {
    expect(API_BASE).toMatch(/\/api$/);
  });

  it('should not contain trailing slashes', () => {
    expect(API_BASE).not.toMatch(/\/$/);
  });

  it('should be a localhost or valid IP address', () => {
    const ipRegex = /^https?:\/\/(localhost|(\d{1,3}\.){3}\d{1,3})/;
    expect(API_BASE).toMatch(ipRegex);
  });
});
