import { create } from "zustand";

interface appState {
  currentPage: string;
  setCurrentPage: (currentPage: string) => void;
  navIsOpen: boolean;
  setNavIsOpen: (isOpen: boolean) => void;
  navIsHoverOpen: boolean;
  setNavIsHoverOpen: (isHoverOpen: boolean) => void;
}

const useStore = create<appState>((set) => ({
  currentPage: "",
  setCurrentPage: (currentPage) => set({ currentPage }),
  navIsOpen: false,
  setNavIsOpen: (navIsOpen) => set({ navIsOpen }),
  navIsHoverOpen: false,
  setNavIsHoverOpen: (navIsHoverOpen) => set({ navIsHoverOpen }),
}));

export default useStore;
