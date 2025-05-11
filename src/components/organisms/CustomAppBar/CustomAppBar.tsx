import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Toolbar,
  toolbarClasses,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { SearchFieldContainerProps } from '@src/containers/SearchFieldContainer';
import { useTranslation } from 'react-i18next';

interface CustomAppBarProps {
  SearchFieldComponent: (
    props: SearchFieldContainerProps,
  ) => React.ReactElement;
  onClickLogo: () => void;
  onClickProfilePicture: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickMenu: (event: React.KeyboardEvent | React.MouseEvent) => void;
  profilePictureUrl?: string;
}

export const CustomAppBar = ({
  SearchFieldComponent,
  onClickLogo,
  onClickProfilePicture,
  onClickMenu,
  profilePictureUrl,
}: CustomAppBarProps) => {
  const bigScreen = useMediaQuery('(min-width:610px)');
  const [showSearchFieldSmallScreen, setShowSearchFieldSmallScreen] =
    useState(false);
  const { t } = useTranslation();

  const onClickSearchIcon = () =>
    setShowSearchFieldSmallScreen(!showSearchFieldSmallScreen);

  const hideSearchFieldSmallScreen = () => setShowSearchFieldSmallScreen(false);

  return (
    <AppBar
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
          <Typography variant="h6">{t('common.app_title')}</Typography>
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        {bigScreen && <SearchFieldComponent />}
        {!bigScreen && (
          <>
            <IconButton sx={{ p: 1.5 }} onClick={onClickSearchIcon}>
              <SearchIcon sx={{ color: '#fff' }} />
            </IconButton>
            {showSearchFieldSmallScreen && (
              <PositionSearchFieldSmallScreen>
                <SearchFieldComponent
                  hideSearchFieldSmallScreen={hideSearchFieldSmallScreen}
                />
              </PositionSearchFieldSmallScreen>
            )}
          </>
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
    </AppBar>
  );
};

const PositionSearchFieldSmallScreen = styled('div')(
  ({ theme: { spacing } }) => ({
    position: 'fixed',
    right: 0,
    top: spacing(6),
    zIndex: 10,
    width: '200px',
    '@media (min-width: 590px)': { marginRight: '44px' },
    '@media (min-width: 440px)': {
      '@media (max-width: 589px)': { marginRight: '36px' },
    },
    '@media (max-width: 439px)': { marginRight: '28px' },
  }),
);

const StyledToolbar = styled(Toolbar)(({ theme: { spacing } }) => ({
  [`&.${toolbarClasses.root}`]: {
    minHeight: spacing(4.5),
    '@media (max-width: 439px)': { padding: spacing(0, 1) },
  },
}));
