import type { ViewMode } from '@/types';
import { create } from 'zustand';

export interface UIState {

  currentPage: number;
  setCurrentPage: (page: number) => void;

  pageSize: number;
  setPageSize: (size: number) => void;

  selectedImageIds: Set<string>;
  setSelectedImage: (id: string, selected: boolean) => void;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

}

export const useUIState = create<UIState>((set) => ({
  currentPage: 1,
  setCurrentPage: page => set({ currentPage: page }),

  pageSize: 100,
  setPageSize: size => set({ pageSize: size }),

  selectedImageIds: new Set<string>([]),
  setSelectedImage: (id, selected) => set(state => {
    const newSelectedIds = new Set([...state.selectedImageIds]);

    if (selected)
      newSelectedIds.add(id);
    else
      newSelectedIds.delete(id);
    
    return { selectedImageIds: newSelectedIds };
  }),

  viewMode: 'grid',
  setViewMode: mode => set({ viewMode: mode })
}));