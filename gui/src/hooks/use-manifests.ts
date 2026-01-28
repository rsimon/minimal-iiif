import type { APIListManifestsResponse, ManifestMetadata } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const API_BASE = '/api';

const list = async (currentPage: number, pageSize: number): Promise<APIListManifestsResponse> =>
  fetch(`${API_BASE}/manifests?offset=${pageSize * (currentPage - 1)}&limit=${pageSize}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch manifest metadata');
      return res.json() as Promise<APIListManifestsResponse>;
    });

const create = async (name: string): Promise<ManifestMetadata> => 
  fetch(`${API_BASE}/manifests`, {
    method: 'POST',
    body: JSON.stringify({ name })
  }).then(res => {
    if (!res.ok) throw new Error('Failed to create manifest');
    return res.json() as Promise<ManifestMetadata>;
  });

export const useManifests = () => {
  const queryClient = useQueryClient();

  const { data: { manifests = [] } = {}, error } = useQuery({
    queryKey: ['manifests'],
    queryFn: () => list(1, 1000)
  });

  const refreshManifests = () =>
    queryClient.invalidateQueries({ queryKey: ['manifests'] });

  const createManifest = (name: string) =>
    create(name).then(refreshManifests);

  return { 
    manifests, 
    error, 
    createManifest,
    refreshManifests
  };
}