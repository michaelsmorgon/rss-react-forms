import React from 'react';
import styles from './Countries.module.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  name: string;
  error?: string;
}

const Countries: React.FC<Props> = ({ id, label, name, error, ...rest }) => {
  const countries = useSelector((state: RootState) => state.countries);
  return (
    <div className={styles.formField}>
      <label htmlFor={id}>{label}</label>
      <input id={id} list="countries-list" name={name} {...rest} />
      <datalist id="countries-list">
        {countries.map((country) => (
          <option key={country} value={country} />
        ))}
      </datalist>
      <div className={styles.fieldError} aria-live="polite" role="status">
        {error || '\u00A0'}
      </div>
    </div>
  );
};

export default Countries;
