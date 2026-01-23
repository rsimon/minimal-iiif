import { useUIState } from '@/hooks/use-ui-state';
import type { ImageMetadata } from '@/types';
import { ImageCard } from './image-card';

interface ImageGridProps {

  images: ImageMetadata[];

}

export const ImageGrid = (props: ImageGridProps) => {

  const { selectedImageIds, setSelectedImage } = useUIState();

  const onDelete = (imageId: string) => {

  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {props.images.map(image => (
        <ImageCard
          key={image.id}
          image={image}
          isSelected={selectedImageIds.has(image.id)}
          onSelect={selected => setSelectedImage(image.id, selected)}
          onDelete={() => onDelete(image.id)} />
      ))}
    </div>
  )

}