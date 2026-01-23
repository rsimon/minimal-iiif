import { useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import type { ImageMetadata } from '@/types';
import { cn } from '@/lib/utils';
import { getThumbnailURL } from '@/utils/get-thumbnail-url';

interface ImageCardProps {

  image: ImageMetadata;
  
  isSelected: boolean;

  onDelete(): void;

  onSelect(selected: boolean): void;

}

const THUMBNAIL_HEIGHT = 400;
const THUMBNAIL_WIDTH = Math.ceil(THUMBNAIL_HEIGHT * 4 / 3);

export const ImageCard = (props: ImageCardProps) => {

  const src = useMemo(() => (
    getThumbnailURL(props.image, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
  ), [props.image]);

  return (
    <div className="group rounded-lg overflow-hidden image-card-shadow border transition-all duration-200 animate-fade-in cursor-grab active:cursor-grabbing">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <img
          src={src}
          alt={props.image.filename}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none" />

        <div className={cn(
          'absolute top-3 left-3',
          props.isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}>
          <Checkbox
            checked={props.isSelected}
            onCheckedChange={checked => props.onSelect(checked as boolean)}
            className="size-6 border-sky-950/40 rounded-full bg-white/60 data-[state=checked]:bg-green-600 data-[state=checked]:text-green-100 data-[state=checked]:border-green-100" />
        </div>
      </div>

      <div className="px-3 py-4 flex items-center justify-between bg-white">
        <span className="text-sm font-medium text-card-foreground truncate flex-1">
          {props.image.filename}
        </span>
      </div>
    </div>
  )

}