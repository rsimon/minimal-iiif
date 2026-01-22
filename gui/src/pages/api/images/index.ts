import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { createImage } from './_utils/create-image';
import type { ImageMetadata } from '@/types';
import { IMAGES_DIR, META_DIR } from './_paths';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {    
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    
    const metafiles = (await fs.readdir(META_DIR)).filter(f => f.endsWith('.json'));
    
    const total = metafiles.length;

    const all: ImageMetadata[] = [];

    for (const m of metafiles) {
      try {
        const raw = await fs.readFile(path.join(META_DIR, m), 'utf8');
        const metadata = JSON.parse(raw);

        if (!metadata.id) {
          console.error('Invalid metadata');
          console.error(raw);
          continue;
        }
          
        all.push(metadata);
      } catch {
        console.error(`Error reading metadata: ${m}`);
        continue;
      }
    }

    all.sort((a, b) => a.filename.localeCompare(b.filename));  

    const images = all.slice(offset, offset + limit);
    
    return new Response(JSON.stringify({
      total,
      offset,
      limit,
      images
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to list images',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => { 
  const formData = await request.formData();
  const files = formData.getAll('files');
  
  if (files.length === 0) {
    return new Response(JSON.stringify({ 
      error: 'No image files in request' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const uploaded: ImageMetadata[] = [];
  const failed: { filename: string, reason: string }[] = [];

  for (const file of files) {
    if (file instanceof File) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const meta = await createImage(file.name, buffer);
        uploaded.push(meta);
      } catch (error) {
        failed.push({ filename: file.name, reason: error.message });
      }
    } else {
      failed.push({ filename: file, reason: 'Not a file' });
    }
  }
  
  return new Response(JSON.stringify({
    uploaded,
    failed
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { ids } = body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request: ids must be a non-empty array' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const deleted = [];
    const failed = [];
    
    for (const id of ids) {
      try {
        const files = await fs.readdir(IMAGES_DIR);
        const matchingFile = files.find(f => path.parse(f).name === id);
        
        if (matchingFile) {
          const filePath = path.join(IMAGES_DIR, matchingFile);
          await fs.unlink(filePath);
          deleted.push({ id, filename: matchingFile });
        } else {
          failed.push({ id, reason: 'File not found' });
        }
      } catch (error) {
        failed.push({ 
          id, 
          reason: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      deleted,
      failed,
      deletedCount: deleted.length,
      failedCount: failed.length,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to delete images',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}