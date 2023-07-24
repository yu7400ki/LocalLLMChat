export const storage = {
  get: (key: string): string | null => {
    return localStorage.getItem(key);
  },
  set: (key: string, value: string): void => {
    localStorage.setItem(key, value);
  },
  getJSON: <T>(key: string): T | null => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  setJSON: <T>(key: string, value: T): void => {
    const json = JSON.stringify(value);
    localStorage.setItem(key, json);
  },
};
