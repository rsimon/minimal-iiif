import type { APIListManifestsResponse } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const API_BASE = '/api';

const list = async (currentPage: number, pageSize: number): Promise<APIListManifestsResponse> =>
  fetch(`${API_BASE}/manifests?offset=${pageSize * (currentPage - 1)}&limit=${pageSize}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch manifest metadata');
      return res.json() as Promise<APIListManifestsResponse>;
    });

export const useManifests = () => {
  const queryClient = useQueryClient();

  const { data: { manifests = [] } = {}, error } = useQuery({
    queryKey: ['manifests'],
    queryFn: () => list(1, 1000)
  });

  const refreshManifests = () =>
    queryClient.invalidateQueries({ queryKey: ['manifests'] });

  return { 
    manifests, 
    error, 
    refreshManifests
  };
}