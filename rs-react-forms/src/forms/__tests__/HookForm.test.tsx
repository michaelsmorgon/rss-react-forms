import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { HookForm } from '../hook-form/HookForm';
import userEvent from '@testing-library/user-event';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <div id="modal-root"></div>
    <Provider store={store}>{children}</Provider>
  </>
);

describe('HookForm', () => {
  it('renders all required fields', () => {
    render(
      <Provider store={store}>
        <HookForm onSuccess={vi.fn()} />
      </Provider>
    );

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

  it('disables submit while invalid', async () => {
    render(<HookForm onSuccess={() => {}} />, { wrapper });
    const submit = screen.getByRole('button', { name: /submit/i });
    expect(submit).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/Name/i), 'Test');
    await userEvent.type(screen.getByLabelText(/Age/i), '25');
    await userEvent.type(screen.getByLabelText(/Email/i), 'a@b.com');
    await userEvent.type(screen.getByLabelText(/^Password/i), 'Aa1!');
    await userEvent.type(screen.getByLabelText(/Confirm password/i), 'Aa1!');
    await userEvent.click(screen.getByRole('radio', { name: 'Female' }));
    await userEvent.type(screen.getByLabelText(/Country/i), 'Belarus');

    const file = new File(['dummy'], 'avatar.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/Picture/i) as HTMLInputElement;
    await userEvent.upload(fileInput, file);

    await userEvent.click(screen.getByLabelText(/I accept Terms/i));

    expect(submit).not.toBeDisabled();
  });
});
