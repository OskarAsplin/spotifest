import { LogOut } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@src/components/ui/popover';
import { StandardLink } from '@src/components/atoms/StandardLink/StandardLink';
import { Trans, useTranslation } from 'react-i18next';
import { redirectToSpotifyLogin } from '@src/utils/spotifyAuthUtils';

interface ProfilePopoverProps {
  userName?: string;
  spotifyUrl?: string;
  onClickLogout: () => void;
  children: React.ReactNode;
}

export const ProfilePopover = ({
  userName,
  spotifyUrl,
  onClickLogout,
  children,
}: ProfilePopoverProps) => {
  const { t } = useTranslation();
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-50 p-2">
        <div className="flex flex-col items-center text-center">
          {userName && spotifyUrl && <p className="mb-2 text-lg">{userName}</p>}
          {spotifyUrl && (
            <>
              <StandardLink href={spotifyUrl} className="mb-2 block">
                {t('app_bar.profile_popover.view_profile')}
              </StandardLink>
              <StandardLink
                href="https://accounts.spotify.com/en/logout"
                onClick={onClickLogout}
              >
                <div className="flex items-center gap-2">
                  {t('app_bar.profile_popover.log_out')}
                  <LogOut className="size-4" />
                </div>
              </StandardLink>
            </>
          )}
          {!spotifyUrl && (
            <div className="max-w-[200px]">
              <Trans
                i18nKey="app_bar.profile_popover.log_in"
                components={{
                  Link: (
                    <StandardLink onClick={() => redirectToSpotifyLogin()} />
                  ),
                }}
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
