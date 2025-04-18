// Define valid manifest permissions based on Chrome Extension API
type ManifestPermissions =
  | "geolocation"
  | "storage"
  | "notifications"
  | "tabs"
  | "bookmarks"
  | "history"
  | "activeTab"
  | "webRequest"
  | "webRequestBlocking";

// Check if running in Chrome extension environment
const isExtension = typeof chrome !== "undefined" && chrome.permissions;

export const permissions = {
  request: (permissionName: ManifestPermissions): Promise<boolean> =>
    new Promise((resolve) => {
      if (isExtension) {
        chrome.permissions.request(
          {
            permissions: [permissionName],
          },
          (granted) => {
            resolve(granted);
          }
        );
      } else {
        // In development, simulate permission grant
        console.log(
          "Development environment: Simulating permission grant for:",
          permissionName
        );
        resolve(true);
      }
    }),
};
