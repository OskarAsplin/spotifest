import { useState } from 'react';
import { Box, Slide } from '@mui/material';
import { useScrollTrigger, PaletteMode } from '@mui/material';
import { useDispatch } from 'react-redux';
import { isMainPage } from '../utils/utils';
import SearchFieldContainer from './SearchFieldContainer';
import ProfilePopover from '../components/organisms/ProfilePopover/ProfilePopover';
import AppBarMenuDrawerContainer from '../containers/AppBarMenuDrawerContainer';
import { setLoggedOff } from '../redux/reducers/authorizationSlice';
import { useGet } from '../utils/api/api';
import { getSpotifyLoggedInUserInfo } from '../utils/api/spotifyApi';
import { useNavigate } from 'react-router-dom';
import CustomAppBar from '../components/organisms/CustomAppBar/CustomAppBar';

interface AppBarContainerProps {
  setThemeMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
}

const AppBarContainer = ({ setThemeMode }: AppBarContainerProps) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const { data: userInfo } = useGet(getSpotifyLoggedInUserInfo);

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
    else navigate('/');
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
        setThemeMode={setThemeMode}
      />
    </Box>
  );
};

export default AppBarContainer;
