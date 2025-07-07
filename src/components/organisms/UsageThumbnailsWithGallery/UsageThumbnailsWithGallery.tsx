import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@src/components/ui/dialog';
import { Button } from '@src/components/ui/button';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const images: ReactImageGalleryItem[] = [
  {
    original: '/screenshots/matches.png',
    thumbnail: '/black_thumbnail.png',
    thumbnailLabel: 'Festival matches',
  },
  {
    original: '/screenshots/festival_page.png',
    thumbnail: '/black_thumbnail.png',
    thumbnailLabel: 'Festival page',
  },
  {
    original: '/screenshots/artist_page.png',
    thumbnail: '/black_thumbnail.png',
    thumbnailLabel: 'Artist page',
  },
];

type UsageThumbnailsWithGalleryProps = {
  isGalleryOpen?: boolean;
  setIsGalleryOpen: (isOpen: boolean) => void;
};

export const UsageThumbnailsWithGallery = ({
  isGalleryOpen,
  setIsGalleryOpen,
}: UsageThumbnailsWithGalleryProps) => {
  const [startIndex, setStartIndex] = useState(0);

  const onThumbnailClick = (index: number) => {
    setIsGalleryOpen(true);
    setStartIndex(index);
  };

  const escFunction = (event: KeyboardEvent) => {
    if (event.key === 'Escape') setIsGalleryOpen(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', escFunction, true);

    return () => {
      document.removeEventListener('keydown', escFunction, true);
    };
  }, []);

  return (
    <>
      <div className={isGalleryOpen ? 'hidden' : 'z-100'}>
        <Button
          variant="ghost"
          onClick={() => onThumbnailClick(0)}
          className="h-[154px] p-2"
        >
          <img src="/screenshots/matches_blurred.png" className="h-full" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onThumbnailClick(1)}
          className="h-[154px] p-2"
        >
          <img
            src="/screenshots/festival_page_blurred.png"
            className="h-full"
          />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onThumbnailClick(2)}
          className="h-[154px] p-2"
        >
          <img src="/screenshots/artist_page_blurred.png" className="h-full" />
        </Button>
      </div>
      <Dialog open={isGalleryOpen}>
        <DialogContent
          showCloseButton={false}
          className="m-0 max-w-none border-none bg-transparent p-0 sm:max-w-none"
        >
          {/* @ts-ignore */}
          <ImageGallery
            items={images}
            startIndex={startIndex}
            showPlayButton={false}
            showFullscreenButton={false}
            renderCustomControls={() => (
              <button
                type="button"
                className="image-gallery-icon image-gallery-fullscreen-button"
                style={{ bottom: 'unset', top: 0, right: 0 }}
                aria-label="Close Gallery"
                onClick={() => setIsGalleryOpen(false)}
              >
                <svg
                  className="image-gallery-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                >
                  <path d="M18.3 5.71a.9959.9959 0 0 0-1.41 0L12 10.59 7.11 5.7a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"></path>
                </svg>
              </button>
            )}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
