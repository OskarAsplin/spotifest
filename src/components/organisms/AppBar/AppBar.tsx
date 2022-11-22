import { useState } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Typography,
  Toolbar,
  AppBar as MuiAppBar,
  Avatar,
  Button,
  toolbarClasses,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { blueGrey } from '@mui/material/colors';
import { SearchFieldContainerProps } from '../../../containers/SearchFieldContainer';

interface AppBarProps {
  SearchFieldComponent: (props: SearchFieldContainerProps) => JSX.Element;
  onClickLogo: () => void;
  onClickProfilePicture: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickMenu: (event: React.KeyboardEvent | React.MouseEvent) => void;
  profilePictureUrl?: string;
}

const AppBar = ({
  SearchFieldComponent,
  onClickLogo,
  onClickProfilePicture,
  onClickMenu,
  profilePictureUrl,
}: AppBarProps) => {
  const bigScreen = useMediaQuery('(min-width:610px)');
  const smallMobileScreen = useMediaQuery('(max-width:355px)');
  const [showSearchFieldSmallScreen, setShowSearchFieldSmallScreen] =
    useState(false);

  const onClickSearchIcon = () =>
    setShowSearchFieldSmallScreen(!showSearchFieldSmallScreen);

  const hideSearchFieldSmallScreen = () => setShowSearchFieldSmallScreen(false);

  return (
    <>
      <MuiAppBar
        id="oskarito-appbar"
        sx={{
          color: '#fff',
          backgroundColor: ({ palette: { mode } }) =>
            mode === 'dark' ? '#03293c' : '#065980',
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
          {bigScreen && <SearchFieldComponent />}
          {!bigScreen && (
            <IconButton sx={{ p: 1.5 }} onClick={onClickSearchIcon}>
              <SearchIcon sx={{ color: '#fff' }} />
            </IconButton>
          )}
          <IconButton
            sx={{
              p: 1.5,
              '@media (min-width: 610px)': { ml: 2 },
              padding: profilePictureUrl ? '10px' : undefined,
            }}
            color="inherit"
            onClick={onClickProfilePicture}
          >
            {profilePictureUrl ? (
              <Avatar
                src={profilePictureUrl}
                alt=""
                sx={{ height: 28, width: 28 }}
              />
            ) : (
              <AccountCircleIcon />
            )}
          </IconButton>
          <IconButton sx={{ p: 1.5 }} color="inherit" onClick={onClickMenu}>
            <MenuIcon />
          </IconButton>
        </StyledToolbar>
      </MuiAppBar>
      {showSearchFieldSmallScreen && (
        <StyledSearchFieldSmallScreenPaper>
          <SearchFieldComponent
            hideSearchFieldSmallScreen={hideSearchFieldSmallScreen}
          />
        </StyledSearchFieldSmallScreenPaper>
      )}
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
      '@media (min-width: 610px)': { width: '250px' },
      '@media (max-width: 609px)': {
        position: 'absolute',
        minHeight: '40px',
        width: '200px',
      },
      '@media (min-width: 590px)': {
        '@media (max-width: 609px)': { marginRight: '44px' },
      },
      '@media (min-width: 440px)': {
        '@media (max-width: 589px)': { marginRight: '36px' },
      },
      '@media (max-width: 439px)': { marginRight: '28px' },
    };
  }
);

const StyledToolbar = styled(Toolbar)(({ theme: { spacing } }) => ({
  [`&.${toolbarClasses.root}`]: {
    minHeight: spacing(4.5),
    '@media (max-width: 439px)': { padding: spacing(0, 1) },
  },
}));

export default AppBar;
