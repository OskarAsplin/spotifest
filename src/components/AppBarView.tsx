import { useState } from 'react';
import {
  IconButton,
  Typography,
  Toolbar,
  AppBar,
  Avatar,
  Popover,
  Button,
} from '@mui/material';
import { Paper, Drawer, Slide } from '@mui/material';
import {
  useScrollTrigger,
  PaletteMode,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { Brightness2, Brightness4 } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectLoggedIn,
  setLoggedOff,
} from '../redux/reducers/authorizationSlice';
import {
  selectThememode,
  switchToDarkMode,
  switchToLightMode,
} from '../redux/reducers/displaySlice';
import { selectUserInfo } from '../redux/reducers/spotifyAccountSlice';
import { UserInfo } from '../redux/types';
import StandardLink from './StandardLink';
import { getBaseUrl } from '../utils/utils';
import SearchField from './SearchField';
import { styled } from '@mui/material/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: 'flex',
      alignContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    grow: {
      flexGrow: 1,
    },
    customizeToolbar: {
      minHeight: 36,
      '@media (max-width: 439px)': {
        padding: theme.spacing(0, 1, 0, 1),
      },
    },
    popover: {
      padding: theme.spacing(1.5),
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
      alignItems: 'center',
    },
    button: {
      textTransform: 'none',
    },
    fullWidthAndReverse: {
      right: 0,
      zIndex: 10,
      width: '100%',
      display: 'flex',
      flexDirection: 'row-reverse',
      position: 'fixed',
    },
    drawerList: {
      width: 250,
    },
  })
);

const AppBarView = () => {
  const bigScreen = useMediaQuery('(min-width:610px)');
  const smallMobileScreen = useMediaQuery('(max-width:355px)');

  const thememode: PaletteMode = useSelector(selectThememode);
  const loggedIn: boolean = useSelector(selectLoggedIn);
  const userInfo: UserInfo | undefined = useSelector(selectUserInfo);
  const dispatch = useDispatch();

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [showSearchFieldSmallScreen, setShowSearchFieldSmallScreen] =
    useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const trigger = useScrollTrigger({ threshold: 30 });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
    <div className={classes.root}>
      <Slide appear={false} direction="down" in={!trigger}>
        <div>
          <AppBar
            id="oskarito-appbar"
            sx={{
              backgroundColor: ({ palette: { mode } }) =>
                mode === 'dark' ? blueGrey[900] : blueGrey[600],
              color: '#fff',
            }}
          >
            <Toolbar className={classes.customizeToolbar}>
              <Button
                className={classes.button}
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
              <div className={classes.grow}></div>
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
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className={classes.popover}>
                  {userInfo?.displayName && (
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {userInfo.displayName}
                    </Typography>
                  )}
                  {userInfo && userInfo.spotifyUrl && (
                    <StandardLink href={userInfo.spotifyUrl} sx={{ mb: 1 }}>
                      View profile in Spotify
                    </StandardLink>
                  )}
                  {loggedIn && (
                    <StandardLink
                      href={`https://accounts.spotify.com/en/logout`}
                      onClick={() => dispatch(setLoggedOff())}
                    >
                      Log out
                    </StandardLink>
                  )}
                </div>
              </Popover>
              <IconButton
                sx={{ p: 1.5 }}
                color="inherit"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          {showSearchFieldSmallScreen && (
            <div className={classes.fullWidthAndReverse}>
              <StyledSearchFieldSmallScreenPaper>
                <SearchField
                  setShowSearchFieldSmallScreen={setShowSearchFieldSmallScreen}
                />
              </StyledSearchFieldSmallScreenPaper>
            </div>
          )}
        </div>
      </Slide>
      <Drawer anchor={'right'} open={drawerOpen} onClose={toggleDrawer(false)}>
        <div
          className={classes.drawerList}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem
              button
              key="About"
              onClick={() => {
                if (!window.location.href.endsWith('/about'))
                  navigate('/about');
              }}
            >
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItem>
            <ListItem
              button
              key="Brightness"
              onClick={() => {
                thememode === 'light'
                  ? dispatch(switchToDarkMode())
                  : dispatch(switchToLightMode());
              }}
            >
              <ListItemIcon>
                {thememode === 'light' ? <Brightness2 /> : <Brightness4 />}
              </ListItemIcon>
              <ListItemText primary="Brightness" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
};

const StyledSearchFieldSmallScreenPaper = styled(Paper)(
  ({ theme: { palette, spacing } }) => {
    return {
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

export default AppBarView;
