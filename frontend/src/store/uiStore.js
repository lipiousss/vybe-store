import { create } from 'zustand';

const enterStorageKey = 'vybe_enter_screen_passed';

export const useUiStore = create((set) => ({
  isEnterScreenPassed: sessionStorage.getItem(enterStorageKey) === 'true',
  isCartDrawerOpen: false,

  setEnterScreenPassed() {
    sessionStorage.setItem(enterStorageKey, 'true');
    set({ isEnterScreenPassed: true });
  },

  openCartDrawer() {
    set({ isCartDrawerOpen: true });
  },

  closeCartDrawer() {
    set({ isCartDrawerOpen: false });
  },
}));
