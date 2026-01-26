import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { EllipsisVertical } from 'lucide-react';

interface FolderCardProps {

  id: string;

}

export const FolderCard = (props: FolderCardProps) => {

  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: { type: 'folder' }
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        'rounded-lg border border-border bg-white',
        isOver ? 'ring-6 ring-slate-500/30' : 'image-card-shadow'
      )}>
      <div className="relative aspect-4/3 p-1">
        <div className="size-full relative rounded-sm bg-muted flex items-center justify-center">
          <div 
            className={cn(
              'relative w-4/12 h-5/12 perspective-[200px]',
              isOver ? 'scale-110' : undefined
            )}>
            <div className="absolute top-0.5 left-0 w-8/12 h-2.5 bg-[#b2b2b2] rounded-t" />
            <div className="absolute top-2.5 w-full h-9/12 rounded shadow-sm bg-[#b2b2b2]" />

            <div className={cn(
              'absolute bottom-0 w-full h-10/12 origin-bottom rounded shadow-sm bg-[linear-gradient(#c1c1c1,#b2b2b2)]',
              isOver ? '-rotate-x-40' : '-rotate-x-10'
            )} />
          </div>
        </div>
      </div>

      <div className="p-1 pt-0 pl-3 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-950 truncate flex-1">
          My IIIF Manifest
        </span>

        <Button
          variant="ghost"
          size="icon">
          <EllipsisVertical />
        </Button>
      </div>
    </div>
  )

}