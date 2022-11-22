import { useState } from 'react';
import { Box, Slide } from '@mui/material';
import { useScrollTrigger, PaletteMode } from '@mui/material';
import { useDispatch } from 'react-redux';
import { isMainPage } from '../utils/utils';
import SearchFieldContainer from './SearchFieldContainer';
import AppBarProfilePopover from '../components/organisms/AppBarProfilePopover/AppBarProfilePopover';
import AppBarMenuDrawerContainer from '../containers/AppBarMenuDrawerContainer';
import { setLoggedOff } from '../redux/reducers/authorizationSlice';
import { useGet } from '../utils/api/api';
import { getSpotifyUserInfo } from '../utils/api/spotifyApi';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/organisms/AppBar/AppBar';

interface Props {
  setThemeMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
}

const AppBarContainer = ({ setThemeMode }: Props) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const { data: userInfo } = useGet(getSpotifyUserInfo);

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
          <AppBar
            SearchFieldComponent={SearchFieldContainer}
            onClickLogo={onClickLogo}
            onClickProfilePicture={onClickProfilePicture}
            onClickMenu={toggleDrawer(true)}
            profilePictureUrl={userInfo?.profilePictureUrl}
          />
        </div>
      </Slide>
      <AppBarProfilePopover
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
