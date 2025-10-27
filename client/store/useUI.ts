import { create } from "zustand";

interface UIState {
  showCartDrawer: boolean;
  showMobileMenu: boolean;
  showSearchAutocomplete: boolean;
  isScrolled: boolean;
  toggleCartDrawer: () => void;
  setShowCartDrawer: (show: boolean) => void;
  toggleMobileMenu: () => void;
  setShowMobileMenu: (show: boolean) => void;
  setShowSearchAutocomplete: (show: boolean) => void;
  setIsScrolled: (scrolled: boolean) => void;
}

export const useUI = create<UIState>((set) => ({
  showCartDrawer: false,
  showMobileMenu: false,
  showSearchAutocomplete: false,
  isScrolled: false,
  toggleCartDrawer: () =>
    set((state) => ({ showCartDrawer: !state.showCartDrawer })),
  setShowCartDrawer: (show) => set({ showCartDrawer: show }),
  toggleMobileMenu: () =>
    set((state) => ({ showMobileMenu: !state.showMobileMenu })),
  setShowMobileMenu: (show) => set({ showMobileMenu: show }),
  setShowSearchAutocomplete: (show) => set({ showSearchAutocomplete: show }),
  setIsScrolled: (scrolled) => set({ isScrolled: scrolled }),
}));
