import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import { useRef } from 'react';

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({ title, isOpen, onClose, children }: ModalProps) => {
  const modalRoot = document.getElementById('modal-root');
  const contentRef = useRef<HTMLDivElement>(null);

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
