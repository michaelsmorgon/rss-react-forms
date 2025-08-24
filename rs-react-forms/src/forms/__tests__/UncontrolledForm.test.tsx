import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UncontrolledForm } from '../uncontrolled-form/UncontrolledForm';
import { Provider } from 'react-redux';
import type { RootState } from '../../store';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { clearUsers } from '../../store/userSlice';
import countriesReducer from '../../store/countrySlice';

vi.mock('../../utils/fileToBase64', () => ({
  fileToBase64: vi.fn(() => Promise.resolve('data:image/png;base64,xxx')),
}));

describe('UncontrolledForm', () => {
  let store: ReturnType<typeof configureStore<RootState>>;
  let onSuccess: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        users: userReducer,
        countries: countriesReducer,
      },
      preloadedState: {
        users: { list: [] },
        countries: ['Belarus', 'Poland'],
      },
    });
    store.dispatch(clearUsers());
    onSuccess = vi.fn();
  });

  const setup = () =>
    render(
      <Provider store={store}>
        <UncontrolledForm onSuccess={onSuccess} />
      </Provider>
    );

  it('renders all required fields', () => {
    setup();

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm password/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Picture/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/I accept Terms/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    setup();
    fireEvent.click(screen.getByText(/Submit/i));
    await waitFor(() =>
      expect(screen.getByText(/Validation error/i)).toBeInTheDocument()
    );
  });

  it('validates password strength display', () => {
    setup();
    const passwordInput = screen.getByLabelText(/^Password$/i);
    fireEvent.change(passwordInput, { target: { value: '123' } });
    expect(screen.getByText(/Weak/i)).toBeInTheDocument();
  });
});
