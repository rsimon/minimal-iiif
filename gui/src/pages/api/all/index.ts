import fs from 'fs/promises';
import type { APIRoute } from 'astro';
import { listManifests } from '../manifests/_utils';
import { listImages } from '../images/_utils';
import { META_DIR } from '../images';
import { MANIFESTS_DIR } from '../manifests';

const countImages = async () => {
  const metafiles = (await fs.readdir(META_DIR)).filter(f => f.endsWith('.json'));     
  return metafiles.length;
}

const countManifests = async () => {
  const manifestFiles = (await fs.readdir(MANIFESTS_DIR)).filter(f => f.endsWith('.json'));
  return manifestFiles.length;
}

export const GET: APIRoute = async ({ url }) => {
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const limit = parseInt(url.searchParams.get('limit') || '100');

  const totalManifests = await countManifests();
  const totalImages = await countImages();
  const totalItems = totalManifests + totalImages;

  const items = [];

  if (offset < totalManifests) {
    const manifestsToFetch = Math.min(limit, totalManifests - offset);
    const { manifests } = await listManifests(offset, manifestsToFetch);
    items.push(...manifests.map(m => ({ type: 'manifest', ...m })));

    const remaining = limit - manifestsToFetch;
    if (remaining > 0) {
      const { images } = await listImages(0, remaining);
      items.push(...images.map(i => ({ type: 'image', ...i })));
    }
  } else {
    const imageOffset = offset - totalManifests;
    const { images } = await listImages(imageOffset, limit);
    items.push(...images.map(i => ({ type: 'image', ...i })));
  }

  return new Response(JSON.stringify({
    total: totalItems,
    offset,
    limit,
    items
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}