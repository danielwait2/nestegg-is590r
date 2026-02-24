import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the db module before importing auth so no better-sqlite3 binding is needed
vi.mock('./db', () => {
  const mockRun = vi.fn();
  const mockGet = vi.fn();
  const mockPrepare = vi.fn(() => ({ run: mockRun, get: mockGet }));
  return {
    default: { prepare: mockPrepare },
    __mockRun: mockRun,
    __mockGet: mockGet,
    __mockPrepare: mockPrepare,
  };
});

import { createSession, getSession, deleteSession } from './auth';
import db from './db';

// Cast to access mock internals
const mockDb = db as unknown as {
  prepare: ReturnType<typeof vi.fn>;
};

describe('createSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: SELECT returns a user row
    mockDb.prepare.mockReturnValue({
      run: vi.fn(),
      get: vi.fn(() => ({ id: 42 })),
    });
  });

  it('returns a 64-character hex token', () => {
    const token = createSession('test@example.com');
    expect(typeof token).toBe('string');
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });

  it('generates a different token on each call', () => {
    // Each prepare call chain returns a fresh mock so we need stable mocks
    const runMock = vi.fn();
    const getMock = vi.fn(() => ({ id: 1 }));
    mockDb.prepare.mockReturnValue({ run: runMock, get: getMock });

    const token1 = createSession('a@example.com');
    const token2 = createSession('a@example.com');
    expect(token1).not.toBe(token2);
  });

  it('calls prepare with INSERT OR IGNORE to upsert the user', () => {
    const runMock = vi.fn();
    const getMock = vi.fn(() => ({ id: 1 }));
    mockDb.prepare.mockReturnValue({ run: runMock, get: getMock });

    createSession('newuser@example.com');

    const firstCall: string = mockDb.prepare.mock.calls[0][0];
    expect(firstCall).toContain('INSERT OR IGNORE INTO users');
  });

  it('calls prepare with INSERT INTO sessions including the token and expiry', () => {
    const runMock = vi.fn();
    const getMock = vi.fn(() => ({ id: 99 }));
    mockDb.prepare.mockReturnValue({ run: runMock, get: getMock });

    createSession('session@example.com');

    const sessionInsertCall = mockDb.prepare.mock.calls.find(
      (c: string[]) => c[0].includes('INSERT INTO sessions')
    );
    expect(sessionInsertCall).toBeDefined();
  });
});

describe('getSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns user data when session row exists', () => {
    const mockRow = { userId: 7, email: 'user@example.com' };
    mockDb.prepare.mockReturnValue({ get: vi.fn(() => mockRow) });

    const result = getSession('valid-token');
    expect(result).toEqual(mockRow);
  });

  it('returns null when no matching session row exists', () => {
    mockDb.prepare.mockReturnValue({ get: vi.fn(() => undefined) });

    const result = getSession('nonexistent-token');
    expect(result).toBeNull();
  });

  it('queries sessions joined with users using the provided token', () => {
    mockDb.prepare.mockReturnValue({ get: vi.fn(() => null) });

    getSession('some-token');

    const sql: string = mockDb.prepare.mock.calls[0][0];
    expect(sql).toContain('FROM sessions');
    expect(sql).toContain('JOIN users');
  });
});

describe('deleteSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls DELETE on sessions with the given token', () => {
    const runMock = vi.fn();
    mockDb.prepare.mockReturnValue({ run: runMock });

    deleteSession('token-to-delete');

    const sql: string = mockDb.prepare.mock.calls[0][0];
    expect(sql).toContain('DELETE FROM sessions');
    expect(runMock).toHaveBeenCalledWith('token-to-delete');
  });

  it('returns undefined (void)', () => {
    mockDb.prepare.mockReturnValue({ run: vi.fn() });
    const result = deleteSession('any-token');
    expect(result).toBeUndefined();
  });
});
