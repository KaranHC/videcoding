const STORAGE_KEY = 'vibe-board-data';

export function loadState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return undefined;
    }
    return JSON.parse(serialized);
  } catch (err) {
    console.warn('Failed to load state from localStorage:', err);
    return undefined;
  }
}

export function saveState(state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('Failed to save state to localStorage:', err);
  }
}
