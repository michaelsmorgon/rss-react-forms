import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import styles from './Tiles.module.css';

export const Tiles: React.FC = () => {
  const users = useSelector((s: RootState) => s.users.list);
  const [highlightedUserId, setHighlightedUserId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (users.length > 0) {
      let userId = users[0].id;
      let maxCreatedAt = users[0].createdAt;
      users.forEach((user) => {
        if (user.createdAt > maxCreatedAt) {
          maxCreatedAt = user.createdAt;
          userId = user.id;
        }
      });

      setHighlightedUserId(userId);

      const timer = setTimeout(() => {
        setHighlightedUserId(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [users]);
  return (
    <div className={styles.tiles}>
      {users.map((user) => {
        return (
          <div
            key={user.id}
            className={`${styles.tile} ${highlightedUserId === user.id ? styles.tileNew : ''}`}
            aria-live="polite"
          >
            {user.imageBase64 && (
              <img
                className={styles.avatar}
                src={user.imageBase64}
                alt={`${user.name}'s avatar`}
              />
            )}
            <div className={styles.tileBody}>
              <div className={styles.tileRow}>
                <strong>{user.name}</strong> · {user.age}
              </div>
              <div className={styles.tileRow}>{user.email}</div>
              <div className={styles.tileRow}>
                {user.gender} · {user.country}
              </div>
            </div>
          </div>
        );
      })}
      {users.length === 0 && <p>No data...</p>}
    </div>
  );
};
