import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import { useEffect, useRef } from 'react';

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({ title, isOpen, onClose, children }: ModalProps) => {
  const modalRoot = document.getElementById('modal-root');
  const contentRef = useRef<HTMLDivElement>(null);
  const lastActive = useRef<HTMLElement | null>(null);

  const focusableSelector = [
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    '[contenteditable=true]',
  ].join(',');

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    lastActive.current = document.activeElement as HTMLElement;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab' && contentRef.current) {
        const nodes = Array.from(
          contentRef.current.querySelectorAll<HTMLElement>(focusableSelector)
        );
        if (nodes.length === 0) {
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const current = document.activeElement as HTMLElement;
        if (e.shiftKey) {
          if (current === first || !contentRef.current.contains(current)) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (current === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const t = setTimeout(() => {
      const node =
        contentRef.current?.querySelector<HTMLElement>(focusableSelector);
      node?.focus();
    }, 0);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      clearTimeout(t);
      lastActive.current?.focus();
    };
  }, [isOpen, onClose, focusableSelector]);

  if (!isOpen || !modalRoot) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.modalBackdrop} onMouseDown={handleBackdropClick}>
      <div
        className={styles.modalDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={contentRef}
      >
        <div className={styles.modalHeader}>
          <h2 id="modal-title">{title}</h2>
          <button
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>,
    modalRoot
  );
};
