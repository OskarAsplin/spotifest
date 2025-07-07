import { LoginButton } from '@src/components/atoms/LoginButton/LoginButton';
import { StandardLink } from '@src/components/atoms/StandardLink/StandardLink';
import { UsageThumbnailsWithGallery } from '@src/components/organisms/UsageThumbnailsWithGallery/UsageThumbnailsWithGallery';
import { cn } from '@src/lib/utils';
import { redirectToSpotifyLogin } from '@src/utils/spotifyAuthUtils';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export const LoginPage = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="h-screen bg-[url(/background_image.jpg)] bg-cover bg-center bg-no-repeat">
      <div className="absolute top-[15%] flex w-full flex-col items-center">
        <h1 className="rounded-[15%] bg-black/60 text-center text-6xl text-white shadow-[0_10px_20px_35px_rgba(0,0,0,0.6)] shadow-black/60 text-shadow-[1px_1px_2px_black] sm:text-8xl">
          {t('common.app_title')}
        </h1>
        <p className="text-center text-base text-white sm:text-xl">
          {t('login_page.subtitle')}
        </p>
      </div>
      <div className="absolute top-[40%] flex w-full justify-center px-2">
        <LoginButton onClick={redirectToSpotifyLogin} />
      </div>
      <div className="absolute bottom-0 mb-4 flex w-full flex-col items-center">
        <UsageThumbnailsWithGallery
          isGalleryOpen={isGalleryOpen}
          setIsGalleryOpen={setIsGalleryOpen}
        />
        <div
          className={cn(
            'flex w-full flex-col items-center bg-black/60 text-center shadow-[0_0_50px_50px_rgba(0,0,0,0.6)]',
            isGalleryOpen ? 'hidden' : '',
          )}
        >
          <p className="text-sm text-white sm:text-xl">
            {t('login_page.footer.line_1')}
          </p>
          <p className="text-sm text-white sm:text-xl">
            <Trans
              i18nKey="login_page.footer.line_2"
              components={{ Link: <StandardLink /> }}
            />
          </p>
          <p className="text-sm text-white sm:text-xl">
            <Trans
              i18nKey="login_page.footer.line_3"
              components={{ Link: <StandardLink /> }}
            />
          </p>
        </div>
      </div>
    </div>
  );
};
