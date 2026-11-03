import { readEnv } from './env';

describe('readEnv', () => {
  afterEach(() => {
    delete process.env.TEST_VALUE;
  });

  it('strips the trailing newline left by piping into vercel env add', () => {
    process.env.TEST_VALUE = 'a54ea63d5f0c0e34a0ef\n';
    expect(readEnv('TEST_VALUE')).toBe('a54ea63d5f0c0e34a0ef');
  });

  it('treats missing and blank values as unset', () => {
    expect(readEnv('TEST_VALUE')).toBeUndefined();
    process.env.TEST_VALUE = ' \n';
    expect(readEnv('TEST_VALUE')).toBeUndefined();
  });
});
