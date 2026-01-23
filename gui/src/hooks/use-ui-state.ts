import { create } from 'zustand';

export interface UIState {

  currentPage: number;
  setCurrentPage: (page: number) => void;

  pageSize: number;
  setPageSize: (size: number) => void;

  selectedImageIds: Set<string>;

  viewMode: 'grid' | 'list';

}

export const useUIState = create<UIState>((set) => ({
  currentPage: 1,
  setCurrentPage: page => set({ currentPage: page }),

  pageSize: 100,
  setPageSize: size => set({ pageSize: size }),

  selectedImageIds: new Set<string>([]),

  viewMode: 'grid'
}));