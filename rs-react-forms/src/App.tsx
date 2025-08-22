import styles from './App.module.css';
import { useState } from 'react';
import { HOOK, UNCONTROLLED, type ModalType } from './utils/constants';
import { Modal } from './components/modal/Modal';

const UNCONTROLLED_FORM_TITLE = 'Uncontrolled Form';
const HOOK_FORM_TITLE = 'React Hook Form';

const App = () => {
  const [open, setOpen] = useState<ModalType>(null);

  return (
    <div className={styles.container}>
      <header>
        <h1>Forms Playground (Portals + Redux)</h1>
      </header>
      <div className={styles.btnRow}>
        <button onClick={() => setOpen(UNCONTROLLED)}>
          Open Uncontrolled Form
        </button>
        <button onClick={() => setOpen(HOOK)}>Open React Hook Form</button>
      </div>

      <Modal
        title={
          open === UNCONTROLLED ? UNCONTROLLED_FORM_TITLE : HOOK_FORM_TITLE
        }
        isOpen={open !== null}
        onClose={() => setOpen(null)}
      >
        <p>Modal Content</p>
      </Modal>
    </div>
  );
};

export default App;
