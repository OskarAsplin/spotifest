import { Box, Slide, useScrollTrigger } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from '@tanstack/router';
import { useApiQuery } from '../api/api';
import { getLoggedInUserInfo } from '../api/spotifyApi';
import CustomAppBar from '../components/organisms/CustomAppBar/CustomAppBar';
import ProfilePopover from '../components/organisms/ProfilePopover/ProfilePopover';
import AppBarMenuDrawerContainer from '../containers/AppBarMenuDrawerContainer';
import {
  selectLoggedIn,
  setLoggedOff,
} from '../redux/reducers/authorizationSlice';
import { isMainPage } from '../utils/routeUtils';
import SearchFieldContainer from './SearchFieldContainer';
import { indexRoute } from '../Routes';

const AppBarContainer = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const loggedIn = useSelector(selectLoggedIn);

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
    const url = window.location.href;
    if (isMainPage(url)) window.scrollTo({ top: 0, behavior: 'smooth' });
    else navigate({ to: indexRoute.to });
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
        onClickLogout={() => dispatch(setLoggedOff())}
      />
      <AppBarMenuDrawerContainer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      />
    </Box>
  );
};

export default AppBarContainer;
