//check if you are on the client (browser) or server
const isBrowser = () => typeof window !== "undefined";

// Get item from localstorage
export const getItemFromLocal = (key: string) => {
  if (isBrowser()) {
    const item = window.localStorage.getItem(key);
    if (!!item) {
      return JSON.parse(item);
    } else {
      return undefined;
    }
  }
};

// Set item from localstorage
export const setItemInLocal = (key: string, data: any) => {
  window.localStorage.setItem(key, JSON.stringify(data));
};

// Remove item from localstorage
export const removeItemFromLocal = (key: string) => {
  window.localStorage.removeItem(key);
};

// Delete all from local
export const deleteAllFromLocal = () => {
  /**
   * save temp theme from local storage
   * and delete all from local storage
   * then restore theme from temp
   */
  const tempTheme = getItemFromLocal("theme");
  window.localStorage.clear();

  /**
   * If temp theme is undefined
   * set default theme
   */
  if (tempTheme === undefined) {
    setItemInLocal("theme", "light");
  } else {
    setItemInLocal("theme", tempTheme);
  }

};
