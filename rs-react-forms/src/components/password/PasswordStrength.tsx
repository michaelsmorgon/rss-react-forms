import React from 'react';
import { passwordScore } from '../../utils/constants';

export const PasswordStrength: React.FC<{ value: string }> = ({ value }) => {
  const score = passwordScore(value || '');
  const labels = ['Weak', 'Okay', 'Good', 'Strong'];
  return (
    <div className="pwd-strength" aria-live="polite">
      <div className={`bar s${score}`} />
      <div className="pwd-hints">
        <small>Need: number, uppercase, lowercase, special</small>
      </div>
      <div className="pwd-label">
        <small>{value ? labels[Math.max(0, score - 1)] : ''}</small>
      </div>
    </div>
  );
};
