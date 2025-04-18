// Mock storage for development environment
const mockStorage = {
  data: new Map<string, any>(),
  get: (key: string) => mockStorage.data.get(key),
  set: (key: string, value: any) => mockStorage.data.set(key, value),
  remove: (key: string) => mockStorage.data.delete(key),
  clear: () => mockStorage.data.clear(),
};

// Check if running in Chrome extension environment
const isExtension = typeof chrome !== "undefined" && chrome.storage;

export const storage = {
  get: (key: string) =>
    new Promise((resolve) => {
      if (isExtension) {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key]);
        });
      } else {
        // Use mock storage in development
        resolve(mockStorage.get(key));
      }
    }),
  set: (key: string, value: unknown) =>
    new Promise((resolve) => {
      if (isExtension) {
        chrome.storage.local.set({ [key]: value }, () => resolve(undefined));
      } else {
        // Use mock storage in development
        mockStorage.set(key, value);
        resolve(undefined);
      }
    }),
  // Add remove method
  remove: (key: string) =>
    new Promise((resolve) => {
      if (isExtension) {
        chrome.storage.local.remove(key, () => resolve(undefined));
      } else {
        // Use mock storage in development
        mockStorage.remove(key);
        resolve(undefined);
      }
    }),
  // Add clear method to remove all data
  clear: () =>
    new Promise((resolve) => {
      if (isExtension) {
        chrome.storage.local.clear(() => resolve(undefined));
      } else {
        // Use mock storage in development
        mockStorage.clear();
        resolve(undefined);
      }
    }),
};
