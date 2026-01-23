import { useCallback } from 'react';
import { AppHeader } from '../layout/app-header';
import { AppSidebar } from '../layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { Toolbar } from './toolbar';
import { ImageGrid } from './image-grid';
import { useImages } from '@/hooks/use-images';

export const ImageGallery = () => {

  const { data: { images = [] } = {} } = useImages();

  const onClickUpload = useCallback(() => {

  }, []);

  const onClickDelete = useCallback(() => {

  }, []);

  return (
    <SidebarProvider className="w-auto">
      <div className="h-screen grow flex flex-col bg-background">
        <AppHeader />

        <div className="flex-1 flex min-h-0">
          <AppSidebar />

          <SidebarInset>
            <main className="grow flex flex-col min-h-0 bg-muted">  
              <Toolbar 
                images={images}
                onClickUpload={onClickUpload}
                onClickDelete={onClickDelete} />

              <div className="flex-1 overflow-auto p-6">
                <ImageGrid images={images} />
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )

}