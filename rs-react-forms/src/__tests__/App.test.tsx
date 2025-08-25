import { describe, it, beforeAll, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { store } from '../store';

beforeAll(() => {
  const modalRoot = document.createElement('div');
  modalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(modalRoot);
});

describe('App component', () => {
  const setup = () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  };

  it('renders header and buttons', () => {
    setup();
    expect(
      screen.getByText(/Forms Playground \(Portals \+ Redux\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Open Uncontrolled Form/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Open React Hook Form/i })
    ).toBeInTheDocument();
  });

  it('opens uncontrolled form modal', () => {
    setup();
    fireEvent.click(
      screen.getByRole('button', { name: /Open Uncontrolled Form/i })
    );
    expect(screen.getByText(/^Uncontrolled Form$/i)).toBeInTheDocument();
  });

  it('opens hook form modal', () => {
    setup();
    fireEvent.click(
      screen.getByRole('button', { name: /Open React Hook Form/i })
    );
    expect(screen.getByText(/^React Hook Form$/i)).toBeInTheDocument();
  });

  it('closes modal when close button clicked', () => {
    setup();
    fireEvent.click(
      screen.getByRole('button', { name: /Open Uncontrolled Form/i })
    );

    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/^Uncontrolled Form$/i)).not.toBeInTheDocument();
  });
});
