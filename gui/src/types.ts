export interface ImageMetadata {

  id: string;

  filename: string;

  format: ImageFormat;

  width: number;

  height: number;
        
  uploadedAt: string;
        
  fileSize: number;

}

// Cf.:
// - https://github.com/lovell/sharp/blob/7b4c4762432b14c62676e860c8034b5cd326f464/lib/index.d.ts#L1915-L1940
// - https://cantaloupe-project.github.io/manual/5.0/processors.html
export type ImageFormat = 'jpeg' | 'jpg' | 'jp2' | 'png' | 'tiff' | 'tif' | 'webp';

export interface ImageFile {
  
  id: string;
  
  name: string;
  
  url: string;
  
  width: number;
  
  height: number;
  
  size: number;
  
  uploadedAt: Date;
  
  folderId: string;

}

export interface Folder {

  id: string;

  name: string;

  parentId: string | null;

  order: number;

}

export type ViewMode = 'grid' | 'table';
