import { create } from "zustand";
import { Card } from "../types/Card";

interface appState {
  currentPage: string;
  setCurrentPage: (currentPage: string) => void;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
  isNavHoverOpen: boolean;
  setIsNavHoverOpen: (isHoverOpen: boolean) => void;
  isSelectedOptionsShowing: boolean;
  setIsSelectedOptionsShowing: (isSelectedOptionsShowing: boolean) => void;
  selectedOptionIds: Set<string>;
  setSelectedOptionIds: (selectedOptionIds: Set<string>) => void;
  isTilesView: boolean;
  setIsTilesView: (isTilesView: boolean) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
  filterTags: string[];
  setFilterTags: (filterTags: string[]) => void;
  isTransitionsPaused: boolean;
  setIsTransitionsPaused: (isTransitionsPaused: boolean) => void;
  tasksData: Card[];
  setTasksData: (tasks: Card[]) => void;
  editModalId: string | null;
  setEditModalId: (editModalId: string | null) => void;
  modalData: Card | null;
  setModalData: (modalData: Card | null) => void;
}

const useStore = create<appState>((set) => ({
  currentPage: "",
  setCurrentPage: (currentPage) => set({ currentPage }),
  errorMessage: "",
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  isNavOpen: false,
  setIsNavOpen: (isNavOpen) => set({ isNavOpen }),
  isNavHoverOpen: false,
  setIsNavHoverOpen: (isNavHoverOpen) => set({ isNavHoverOpen }),
  isSelectedOptionsShowing: false,
  setIsSelectedOptionsShowing: (isSelectedOptionsShowing) => set({ isSelectedOptionsShowing }),
  selectedOptionIds: new Set(),
  setSelectedOptionIds: (selectedOptionIds) => set({ selectedOptionIds }),
  isTilesView: true,
  setIsTilesView: (isTilesView) => set({ isTilesView }),
  searchText: "",
  setSearchText: (searchText) => set({ searchText }),
  filterTags: [],
  setFilterTags: (filterTags) => set({ filterTags }),
  isTransitionsPaused: true,
  setIsTransitionsPaused: (isTransitionsPaused) => set({ isTransitionsPaused }),
  tasksData: [],
  setTasksData: (tasksData) => set({ tasksData }),
  editModalId: null,
  setEditModalId: (editModalId: string | null) => set({ editModalId }),
  modalData: null,
  setModalData: (modalData: Card | null) => set({ modalData }),
}));

export default useStore;
