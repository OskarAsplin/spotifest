import { User, Moon, Sun, Info, Search } from 'lucide-react';
import { useMediaQuery } from '@src/hooks/useMediaQuery';
import { Avatar, AvatarImage } from '@src/components/ui/avatar';
import { Button } from '@src/components/ui/button';
import { cn } from '@src/lib/utils';
import { useState } from 'react';
import { SearchFieldContainerProps } from '@src/containers/SearchFieldContainer';
import { useTranslation } from 'react-i18next';
import { ProfilePopover } from '../ProfilePopover/ProfilePopover';
import { UserInfo } from '@src/api/types';
import { resetAuthStore } from '@src/zustand/authStore';
import { useThemeMode } from '@src/zustand/themeStore';

interface CustomAppBarProps {
  SearchFieldComponent: (
    props: SearchFieldContainerProps,
  ) => React.ReactElement;
  onClickLogo: () => void;
  onClickAbout?: () => void;
  onClickBrightness?: () => void;
  userInfo?: UserInfo;
}

export const CustomAppBar = ({
  SearchFieldComponent,
  onClickLogo,
  onClickAbout,
  onClickBrightness,
  userInfo,
}: CustomAppBarProps) => {
  const bigScreen = useMediaQuery('(min-width:640px)');
  const [showSearchFieldSmallScreen, setShowSearchFieldSmallScreen] =
    useState(false);
  const { t } = useTranslation();
  const themeMode = useThemeMode();

  const onClickSearchIcon = () =>
    setShowSearchFieldSmallScreen(!showSearchFieldSmallScreen);

  const hideSearchFieldSmallScreen = () => setShowSearchFieldSmallScreen(false);

  return (
    <header className="sticky top-0 z-50 h-12 bg-[#065980] text-white shadow-md dark:bg-[#03293c]">
      <div className="flex h-full items-center gap-2 px-2 lg:px-4">
        <Button
          variant="ghost"
          className="ml-2 h-auto p-0 font-normal text-white hover:bg-white/10"
          onClick={onClickLogo}
        >
          <h1 className="text-lg font-semibold">{t('common.app_title')}</h1>
        </Button>
        <div className="flex-grow" />
        {bigScreen && <SearchFieldComponent />}
        {!bigScreen && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="p-1.5 text-white hover:bg-white/10"
              onClick={onClickSearchIcon}
            >
              <Search className="h-5 w-5" />
            </Button>
            {showSearchFieldSmallScreen && (
              <div className="bg-background fixed top-12 right-0 z-10 mr-15.5 w-[200px]">
                <SearchFieldComponent
                  hideSearchFieldSmallScreen={hideSearchFieldSmallScreen}
                  autoFocus
                />
              </div>
            )}
          </>
        )}
        <ProfilePopover
          userName={userInfo?.displayName}
          spotifyUrl={userInfo?.spotifyUrl}
          onClickLogout={resetAuthStore}
        >
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'p-1.5 text-white hover:bg-white/10',
              userInfo?.profilePictureUrl && 'p-2.5',
            )}
          >
            {userInfo?.profilePictureUrl ? (
              <Avatar className="h-5 w-5">
                <AvatarImage src={userInfo.profilePictureUrl} alt="" />
              </Avatar>
            ) : (
              <User className="h-5 w-5" />
            )}
          </Button>
        </ProfilePopover>
        <Button
          variant="ghost"
          size="icon"
          className="p-1.5 text-white hover:bg-white/10"
          onClick={onClickAbout}
        >
          <Info className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-1.5 text-white hover:bg-white/10"
          onClick={onClickBrightness}
        >
          {themeMode === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};
