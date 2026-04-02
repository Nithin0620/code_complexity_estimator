import { v4 as uuidv4 } from 'uuid';

/**
 * Ensures a unique user ID (UID) is present in the browser's localStorage.
 * Generates and saves a new one if it doesn't already exist.
 */
export const getOrCreateUid = (): string => {
  if (typeof window === 'undefined') return '';
  let uid = localStorage.getItem('ce_uid');
  if (!uid) {
    uid = uuidv4();
    localStorage.setItem('ce_uid', uid);
  }
  return uid;
};

export const getUid = (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('ce_uid') || '';
};
