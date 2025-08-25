import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Tiles } from '../Tiles';
import type { UserFormData } from '../../../utils/types';
import usersReducer from '../../../store/userSlice';

const renderWithStore = (preloadedUsers: UserFormData[] = []) => {
  const store = configureStore({
    reducer: { users: usersReducer },
    preloadedState: {
      users: {
        list: preloadedUsers,
      },
    },
  });

  return render(
    <Provider store={store}>
      <Tiles />
    </Provider>
  );
};

describe('Tiles component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders "No data..." when no users', () => {
    renderWithStore([]);

    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });

  it('renders user data correctly', () => {
    const users: UserFormData[] = [
      {
        id: 'u1',
        name: 'Test',
        age: 25,
        email: 'a@b.com',
        password: 'Aa1!',
        gender: 'female',
        acceptedTC: true,
        country: 'USA',
        imageBase64: 'data:image/png;base64,xyz',
        createdAt: Date.now(),
      },
    ];

    renderWithStore(users);

    expect(screen.getByText(/^Test$/i)).toBeInTheDocument();
    expect(screen.getByText(/25/)).toBeInTheDocument();
    expect(screen.getByText(/a@b.com/)).toBeInTheDocument();
    expect(screen.getByText(/female/)).toBeInTheDocument();
    expect(screen.getByAltText("Test's avatar")).toHaveAttribute(
      'src',
      users[0].imageBase64
    );
  });

  it('highlights the newest user briefly', () => {
    const now = Date.now();
    const users: UserFormData[] = [
      {
        id: 'u1',
        name: 'Test',
        age: 25,
        email: 'a@b.com',
        password: 'Aa1!',
        gender: 'female',
        acceptedTC: true,
        country: 'USA',
        imageBase64: 'data:image/png;base64,xyz',
        createdAt: now - 1000,
      },
      {
        id: 'u2',
        name: 'Test2',
        age: 30,
        email: 'a2@b.com',
        password: 'Aa1!',
        gender: 'male',
        acceptedTC: true,
        country: 'UK',
        imageBase64: 'data:image/png;base64,xyz',
        createdAt: now,
      },
    ];

    renderWithStore(users);

    const test2Tile = screen
      .getByText(/Test2/)
      .closest('div[aria-live="polite"]');
    expect(test2Tile?.className).toContain('tileNew');

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(test2Tile?.className).not.toContain('tileNew');
  });
});
