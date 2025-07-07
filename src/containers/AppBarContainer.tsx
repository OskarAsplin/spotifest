import { useState, useEffect } from 'react';
import { cn } from '@src/lib/utils';
import { useNavigate, useMatchRoute } from '@tanstack/react-router';
import { useApiQuery } from '@src/api/api';
import { getLoggedInUserInfo } from '@src/api/spotifyApi';
import { CustomAppBar } from '@src/components/organisms/CustomAppBar/CustomAppBar';
import { SearchFieldContainer } from './SearchFieldContainer';
import { useIsLoggedIn } from '@src/zustand/authStore';
import { setThemeMode, useThemeMode } from '@src/zustand/themeStore';

export const AppBarContainer = () => {
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const loggedIn = useIsLoggedIn();

  const { data: userInfo } = useApiQuery(getLoggedInUserInfo, {
    enabled: loggedIn,
  });

  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHidden(window.pageYOffset > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onClickLogo = () => {
    const isIndexRoute = !!matchRoute({ to: '/' });
    if (isIndexRoute) window.scrollTo({ top: 0, behavior: 'smooth' });
    else navigate({ to: '/' });
  };

  const themeMode = useThemeMode();

  const onClickAbout = () => {
    if (!window.location.href.endsWith('/about')) navigate({ to: '/about' });
  };
  const onClickBrightness = () =>
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');

  return (
    <div className="pb-4 sm:pb-6">
      <div
        className={cn(
          'transition-transform duration-300 ease-in-out',
          isHidden ? '-translate-y-full' : 'translate-y-0',
        )}
      >
        <CustomAppBar
          SearchFieldComponent={SearchFieldContainer}
          onClickLogo={onClickLogo}
          onClickAbout={onClickAbout}
          onClickBrightness={onClickBrightness}
          userInfo={userInfo}
        />
      </div>
    </div>
  );
};
