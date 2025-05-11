import { Box, Slide, useScrollTrigger } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useMatchRoute } from '@tanstack/react-router';
import { useApiQuery } from '@src/api/api';
import { getLoggedInUserInfo } from '@src/api/spotifyApi';
import { CustomAppBar } from '@src/components/organisms/CustomAppBar/CustomAppBar';
import { ProfilePopover } from '@src/components/organisms/ProfilePopover/ProfilePopover';
import { AppBarMenuDrawerContainer } from '@src/containers/AppBarMenuDrawerContainer';
import { SearchFieldContainer } from './SearchFieldContainer';
import { resetAuthStore, useIsLoggedIn } from '@src/zustand/authStore';

export const AppBarContainer = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const loggedIn = useIsLoggedIn();

  const { data: userInfo } = useApiQuery(getLoggedInUserInfo, {
    enabled: loggedIn,
  });

  const trigger = useScrollTrigger({ threshold: 30 });

  const onClickProfilePicture = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? 'simple-popover' : undefined;

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setDrawerOpen(open);
    };

  const onClickLogo = () => {
    const isIndexRoute = !!matchRoute({ to: '/' });
    if (isIndexRoute) window.scrollTo({ top: 0, behavior: 'smooth' });
    else navigate({ to: '/' });
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Slide appear={false} direction="down" in={!trigger}>
        <div>
          <CustomAppBar
            SearchFieldComponent={SearchFieldContainer}
            onClickLogo={onClickLogo}
            onClickProfilePicture={onClickProfilePicture}
            onClickMenu={toggleDrawer(true)}
            profilePictureUrl={userInfo?.profilePictureUrl}
          />
        </div>
      </Slide>
      <ProfilePopover
        id={popoverId}
        anchorEl={anchorEl}
        open={popoverOpen}
        userName={userInfo?.displayName}
        spotifyUrl={userInfo?.spotifyUrl}
        onClose={() => setAnchorEl(null)}
        onClickLogout={resetAuthStore}
      />
      <AppBarMenuDrawerContainer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      />
    </Box>
  );
};
