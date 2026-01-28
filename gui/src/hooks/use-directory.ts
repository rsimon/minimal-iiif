import type { APIListDirectoryResponse } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUIState } from './use-ui-state';
import { useMemo } from 'react';

export const API_BASE = '/api';

const list = async (currentPage: number, pageSize: number): Promise<APIListDirectoryResponse> =>
  fetch(`${API_BASE}/all?offset=${pageSize * (currentPage - 1)}&limit=${pageSize}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch images');
      return res.json() as Promise<APIListDirectoryResponse>;
    });

export const useDirectory = () => {
  const queryClient = useQueryClient();

  const currentPage = useUIState((state) => state.currentPage);
  const pageSize = useUIState((state) => state.pageSize);

  const { data: { items = [], images = [], manifests = [] } = {}, error } = useQuery({
    queryKey: ['directory', currentPage, pageSize],
    queryFn: () => list(currentPage, pageSize),
    select: data => ({
      items: data.items,
      total: data.total,
      images: data.items.filter(i => i.type === 'image'),
      manifests: data.items.filter(i => i.type === 'manifest'),
    })
  });

  const refreshDirectory = () =>
    queryClient.invalidateQueries({ queryKey: ['directory'] });

  return {
    items, images, manifests, refreshDirectory
  }

}