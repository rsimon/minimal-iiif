import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { listManifests } from './_utils';

export const prerender = false;

export const MANIFESTS_DIR = path.join(process.cwd(), '..', 'data', 'manifests');

export const GET: APIRoute = async ({ url }) => {
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const limit = parseInt(url.searchParams.get('limit') || '100');
    
  const { manifests, total } = await listManifests(offset, limit);

  return new Response(JSON.stringify({
    total,
    offset,
    limit,
    manifests
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {    
    const body = await request.json();
    const { id, manifest } = body;
    
    if (!id || !manifest) {
      return new Response(JSON.stringify({ 
        error: 'Both id and manifest are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    let manifestObj;
    try {
      manifestObj = typeof manifest === 'string' 
        ? JSON.parse(manifest) 
        : manifest;
    } catch {
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in manifest' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const filename = `${id}.json`;
    const filePath = path.join(MANIFESTS_DIR, filename);
    
    let existed = false;
    try {
      await fs.access(filePath);
      existed = true;
    } catch {
      // File doesn't exist, will be created
    }
    
    await fs.writeFile(
      filePath, 
      JSON.stringify(manifestObj, null, 2), 
      'utf-8'
    );
    
    return new Response(JSON.stringify({
      success: true,
      action: existed ? 'updated' : 'created',
      manifest: {
        id,
        filename,
      },
    }), {
      status: existed ? 200 : 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to save manifest',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}