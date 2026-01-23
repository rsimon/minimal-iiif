import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIState } from './use-ui-state';
import type { APIListImagesResponse } from '@/types';

const API_BASE = '/api';

const list = async (currentPage: number, pageSize: number): Promise<APIListImagesResponse> =>
  fetch(`${API_BASE}/images?offset=${pageSize * (currentPage - 1)}&limit=${pageSize}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch images');
      return res.json() as Promise<APIListImagesResponse>;
    });

export const useImages = () => {
  const currentPage = useUIState((state) => state.currentPage);
  const pageSize = useUIState((state) => state.pageSize);

  return useQuery({
    queryKey: ['images', currentPage, pageSize],
    queryFn: () => list(currentPage, pageSize)
  });
}

/*
export function useUploadImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: imagesApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    }
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: imagesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    }
  });
}
*/