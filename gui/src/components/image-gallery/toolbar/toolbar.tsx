import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Home, SquareCheckBig, Trash2, Upload } from 'lucide-react';
import { ViewToggle } from './view-toggle';
import { useUIState } from '@/hooks/use-ui-state';
import { Separator } from '@/components/ui/separator';

interface ToolbarProps {

  onClickUpload(): void;

  onClickDelete(): void;

}

export const Toolbar = (props: ToolbarProps) => {

  const viewMode = useUIState(state => state.viewMode);
  const setViewMode = useUIState(state => state.setViewMode);

  const selectedImageIds = useUIState(state => state.selectedImageIds);

  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-2.5">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="mb-px" />

        <nav className="text-slate-700 mr-4 text-sm font">
          All Images
        </nav>

        <Separator orientation="vertical" />

        <Button 
          variant="ghost"
          onClick={props.onClickUpload}>
          <Upload className="size-4" />
          Upload
        </Button>

        <Button 
          variant="ghost" 
          onClick={props.onClickUpload}>
          <SquareCheckBig className="size-4" />
          Select All
        </Button>

        {selectedImageIds.size > 0 && (
          <Button
            variant="destructive"
            onClick={props.onClickUpload}>
            <Trash2 className="size-4" />
            Delete {selectedImageIds.size} Image{selectedImageIds.size > 1 && 's'}
          </Button>
        )}
      </div>

      <ViewToggle 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} />
    </div>
  )

}