import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('initializes with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('updates state correctly on login', () => {
    const mockUser = {
      id: 'usr-123',
      name: 'Tester Hero',
      email: 'tester@quiz.com',
      role: 'STUDENT' as const,
      xp: 450,
      level: 4,
      streak: 5,
    };

    useAuthStore.getState().login(mockUser, 'mock_token_123');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('mock_token_123');
  });

  it('updates user state via setUser', () => {
    const mockUser = {
      id: 'usr-123',
      name: 'Tester Hero',
      email: 'tester@quiz.com',
      role: 'STUDENT' as const,
      xp: 450,
      level: 4,
      streak: 5,
    };

    useAuthStore.getState().login(mockUser, 'token');
    useAuthStore.getState().setUser({ ...mockUser, xp: 550, level: 5 });

    const state = useAuthStore.getState();
    expect(state.user?.xp).toBe(550);
    expect(state.user?.level).toBe(5);
  });

  it('clears state on logout', () => {
    useAuthStore.getState().login(
      {
        id: 'usr-123',
        name: 'Tester Hero',
        email: 'tester@quiz.com',
        role: 'STUDENT' as const,
        xp: 450,
        level: 4,
        streak: 5,
      },
      'token'
    );

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
