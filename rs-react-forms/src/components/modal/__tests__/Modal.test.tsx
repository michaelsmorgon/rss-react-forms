import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { Modal } from '../Modal';

const onClose = vi.fn();

beforeAll(() => {
  const modalRoot = document.createElement('div');
  modalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(modalRoot);
});

describe('Modal', () => {
  const setup = () => {
    render(
      <Modal title="Test Modal" isOpen={true} onClose={onClose}>
        Test modal content
      </Modal>
    );
  };

  it('renders via portal', () => {
    setup();
    expect(screen.getByText(/Test modal content/i)).toBeInTheDocument();
  });

  it('closes on ESC key', () => {
    setup();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on outside click', () => {
    setup();
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalled();
  });
});
