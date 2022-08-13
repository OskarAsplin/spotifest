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
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../redux/reducers/spotifyAccountSlice';
import { UserInfo } from '../redux/types';
import { getBaseUrl } from '../utils/utils';
import SearchField from './SearchField';
import { styled } from '@mui/material/styles';
import AppBarMenuDrawer from './AppBarMenuDrawer';
import AppBarProfilePopover from './AppBarProfilePopover';

interface Props {
  setThemeMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
}

const AppBarView = ({ setThemeMode }: Props) => {
  const bigScreen = useMediaQuery('(min-width:610px)');
  const smallMobileScreen = useMediaQuery('(max-width:355px)');

  const userInfo: UserInfo | undefined = useSelector(selectUserInfo);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [showSearchFieldSmallScreen, setShowSearchFieldSmallScreen] =
    useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const trigger = useScrollTrigger({ threshold: 30 });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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

  return (
    <>
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
                onClick={() => {
                  const url = window.location.href;
                  if (
                    url.endsWith('spotifest.app') ||
                    url.endsWith('spotifest.app/') ||
                    url.endsWith('localhost:3000') ||
                    url.endsWith('localhost:3000/')
                  ) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    window.open(getBaseUrl(), '_self');
                  }
                }}
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
                  '@media (min-width: 610px)': {
                    ml: 2,
                  },
                  padding: userInfo?.profilePictureUrl ? '10px' : undefined,
                }}
                color="inherit"
                aria-describedby={id}
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
      <AppBarProfilePopover anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      <AppBarMenuDrawer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        setThemeMode={setThemeMode}
      />
    </>
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

const StyledToolbar = styled(Toolbar)(({ theme: { spacing } }) => {
  return {
    [`&.${toolbarClasses.root}`]: {
      minHeight: spacing(4.5),
      '@media (max-width: 439px)': {
        padding: spacing(0, 1, 0, 1),
      },
    },
  };
});

export default AppBarView;
