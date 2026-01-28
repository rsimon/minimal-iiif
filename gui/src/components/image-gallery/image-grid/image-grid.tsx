import { useEffect, useMemo, useState } from 'react';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useUIState } from '@/hooks/use-ui-state';
import type { ImageMetadata } from '@/types';
import { ImageCard } from './image-card';
import { FolderCard } from './folder-card';
import { DragPreview } from './drag-preview';
import { 
  closestCenter,
  DndContext, 
  DragOverlay,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors, 
  useDndContext
} from '@dnd-kit/core';

interface ImageGridProps {

  images: ImageMetadata[];

}

const SortableImageList = (props: ImageGridProps) => {

  const { selectedImageIds, setSelectedImage } = useUIState();

  const selectedImages = useMemo(() => (
    [...selectedImageIds].map(id => props.images.find(i => i.id === id)).filter(Boolean)
  ), [selectedImageIds, props.images]);

  const { active } = useDndContext();

  const activeImage = props.images.find(i => i.id === active?.id);

  const filteredImages = (activeImage && selectedImages.length > 1)
    ? props.images.filter(i => !selectedImageIds.has(i.id)) 
    : props.images;

  const onDelete = (_imageId: string) => {

  }

  return (
    <SortableContext 
      items={filteredImages} 
      strategy={rectSortingStrategy}>
      {filteredImages.map(image => (
        <ImageCard
          key={image.id}
          image={image}
          isSelected={selectedImageIds.has(image.id)}
          onSelect={selected => setSelectedImage(image.id, selected)}
          onDelete={() => onDelete(image.id)} />
      ))}

      {activeImage && (
        <DragOverlay>
          <DragPreview 
            active={activeImage}
            selected={selectedImages} />
        </DragOverlay>
      )}
    </SortableContext>
  )

}

const measuringConfig = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  }
};

export const ImageGrid = (props: ImageGridProps) => {

  const [sortedImages, setSortedImags] = useState(props.images);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  useEffect(() => {
    setSortedImags(props.images);
  }, [props.images.map(i => i.id).join()]);

  const onDragEnd = (event: any) => {
    const { active, over } = event;

    if (over.data.current.type === 'folder') return;

    if (active.id !== over.id) {
      setSortedImags(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      measuring={measuringConfig}
      sensors={sensors}
      onDragEnd={onDragEnd}>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <SortableImageList images={sortedImages} />
      </div>
    </DndContext>
  )

}