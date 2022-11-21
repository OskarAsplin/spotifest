import { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Toolbar,
  AppBar,
  Avatar,
  Button,
  toolbarClasses,
  Paper,
  Slide,
} from '@mui/material';
import { useScrollTrigger, PaletteMode } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch } from 'react-redux';
import { isMainPage } from '../utils/utils';
import SearchField from './SearchField';
import { styled } from '@mui/material/styles';
import AppBarProfilePopover from '../components/AppBarProfilePopover/AppBarProfilePopover';
import AppBarMenuDrawerContainer from '../containers/AppBarMenuDrawerContainer';
import { setLoggedOff } from '../redux/reducers/authorizationSlice';
import { useGet } from '../utils/api/api';
import { getSpotifyUserInfo } from '../utils/api/spotifyApi';
import { useNavigate } from 'react-router-dom';

interface Props {
  setThemeMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
}

const AppBarView = ({ setThemeMode }: Props) => {
  const bigScreen = useMediaQuery('(min-width:610px)');
  const smallMobileScreen = useMediaQuery('(max-width:355px)');
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [showSearchFieldSmallScreen, setShowSearchFieldSmallScreen] =
    useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const { data: userInfo } = useGet(getSpotifyUserInfo);

  const trigger = useScrollTrigger({ threshold: 30 });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

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
            id="oskarito-appbar"
            sx={{
              backgroundColor: ({ palette: { mode } }) =>
                mode === 'dark' ? '#03293c' : '#065980',
              color: '#fff',
            }}
          >
            <StyledToolbar>
              <Button
                sx={{ textTransform: 'none' }}
                color="inherit"
                onClick={onClickLogo}
              >
                <Typography variant="h6">
                  {smallMobileScreen ? 'SpotiFest' : 'Oskarito SpotiFest'}
                </Typography>
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              {bigScreen && (
                <SearchField
                  setShowSearchFieldSmallScreen={setShowSearchFieldSmallScreen}
                />
              )}
              {!bigScreen && (
                <IconButton
                  sx={{ p: 1.5 }}
                  onClick={() =>
                    setShowSearchFieldSmallScreen(!showSearchFieldSmallScreen)
                  }
                >
                  <SearchIcon sx={{ color: '#fff' }} />
                </IconButton>
              )}
              <IconButton
                sx={{
                  p: 1.5,
                  '@media (min-width: 610px)': { ml: 2 },
                  padding: userInfo?.profilePictureUrl ? '10px' : undefined,
                }}
                color="inherit"
                aria-describedby={popoverId}
                onClick={handleClick}
              >
                {userInfo?.profilePictureUrl ? (
                  <Avatar
                    src={userInfo.profilePictureUrl}
                    alt=""
                    sx={{ height: 28, width: 28 }}
                  />
                ) : (
                  <AccountCircleIcon />
                )}
              </IconButton>
              <IconButton
                sx={{ p: 1.5 }}
                color="inherit"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            </StyledToolbar>
          </AppBar>
          {showSearchFieldSmallScreen && (
            <StyledSearchFieldSmallScreenPaper>
              <SearchField
                setShowSearchFieldSmallScreen={setShowSearchFieldSmallScreen}
              />
            </StyledSearchFieldSmallScreenPaper>
          )}
        </div>
      </Slide>
      <AppBarProfilePopover
        id={popoverId}
        anchorEl={anchorEl}
        open={popoverOpen}
        onClose={() => setAnchorEl(null)}
        userName={userInfo?.displayName}
        spotifyUrl={userInfo?.spotifyUrl}
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

const StyledSearchFieldSmallScreenPaper = styled(Paper)(
  ({ theme: { palette, spacing } }) => {
    return {
      right: 0,
      zIndex: 10,
      position: 'fixed',

      backgroundColor: palette.mode === 'dark' ? blueGrey[900] : blueGrey[500],
      marginTop: spacing(6),
      '@media (min-width: 610px)': {
        width: '250px',
      },
      '@media (max-width: 609px)': {
        position: 'absolute',
        minHeight: '40px',
        width: '200px',
      },
      '@media (min-width: 590px)': {
        '@media (max-width: 609px)': {
          marginRight: '44px',
        },
      },
      '@media (min-width: 440px)': {
        '@media (max-width: 589px)': {
          marginRight: '36px',
        },
      },
      '@media (max-width: 439px)': {
        marginRight: '28px',
      },
    };
  }
);

const StyledToolbar = styled(Toolbar)(({ theme: { spacing } }) => ({
  [`&.${toolbarClasses.root}`]: {
    minHeight: spacing(4.5),
    '@media (max-width: 439px)': {
      padding: spacing(0, 1, 0, 1),
    },
  },
}));

export default AppBarView;
