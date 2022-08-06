import {
  buttonClasses,
  CssBaseline,
  Box,
  Typography,
  typographyClasses,
  Button,
  styled,
  Link,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAuthorizeHref } from '../oauthConfig';
import {
  setLoggedIn,
  setLoggedOff,
} from '../redux/reducers/authorizationSlice';

const LoginPage = () => {
  const bigWidth = useMediaQuery('(min-width:610px)');
  const bigHeight = useMediaQuery('(min-height:610px)');
  const bigScreen = bigWidth && bigHeight;
  const verySmallScreen = useMediaQuery('(max-width:330px)');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoggedOff());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledBackground>
      <CssBaseline />
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <StyledTitleTypography
          variant={bigScreen ? 'h2' : verySmallScreen ? 'h5' : 'h4'}
        >
          Oskarito SpotiFest
        </StyledTitleTypography>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          px: 1,
        }}
      >
        <StyledLoginButton
          bigScreen={bigScreen}
          key={'Log in with spotify button'}
          variant="contained"
          onClick={() => {
            dispatch(setLoggedIn());
            window.open(getAuthorizeHref(), '_self');
          }}
        >
          <Box
            component="img"
            src={process.env.PUBLIC_URL + '/techIcons/Spotify-Mark-white.png'}
            alt="Spotify-icon"
            sx={{
              height: bigScreen ? '50px' : '35px',
              mr: bigScreen ? 2 : 1.5,
            }}
          />
          <Typography
            variant={bigScreen ? 'h4' : 'h6'}
            color={({ palette }) => palette.text.primary}
          >
            Log in with Spotify
          </Typography>
        </StyledLoginButton>
      </Box>
      <StyledFooterContainer>
        <StyledFooterTypography variant={bigScreen ? 'body1' : 'body2'}>
          Find music festivals with your playlists
        </StyledFooterTypography>
        <StyledFooterTypography variant={bigScreen ? 'body1' : 'body2'}>
          A festival finder created by{' '}
          <Link
            color={'primary'}
            href={'https://github.com/OskarAsplin'}
            target={'_blank'}
            rel="noopener noreferrer"
          >
            Oskar Asplin
          </Link>
        </StyledFooterTypography>
        <StyledFooterTypography variant={bigScreen ? 'body1' : 'body2'}>
          <Link
            color={'primary'}
            href="https://www.flickr.com/photos/149801000@N05/34735177654/in/photostream/"
            target={'_blank'}
            rel="noopener noreferrer"
          >
            Photo
          </Link>{' '}
          by{' '}
          <Link
            color={'primary'}
            href="https://www.flickr.com/photos/149801000@N05/"
            target={'_blank'}
            rel="noopener noreferrer"
          >
            veldmusicfestival
          </Link>{' '}
          /{' '}
          <Link
            color={'primary'}
            href="https://creativecommons.org/licenses/by-sa/2.0/"
            target={'_blank'}
            rel="noopener noreferrer"
          >
            CC BY-SA 2.0
          </Link>
        </StyledFooterTypography>
      </StyledFooterContainer>
    </StyledBackground>
  );
};

const StyledLoginButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'bigScreen',
})<{ bigScreen: boolean }>(({ theme: { spacing, shadows }, bigScreen }) => {
  return {
    [`&.${buttonClasses.root}`]: {
      display: 'flex',
      flexDirection: 'row',
      textTransform: 'none',
      alignItems: 'center',
      backgroundColor: '#1DB954',
      boxShadow: shadows[3],
      '&:hover': {
        backgroundColor: 'rgb(19, 175, 74)',
      },
      padding: bigScreen ? spacing(2, 5, 2, 5) : spacing(1, 2.5, 1, 1.5),
      borderRadius: bigScreen ? 15 : 25,
    },
  };
});

const StyledFooterTypography = styled(Typography)(() => {
  return {
    [`&.${typographyClasses.root}`]: {
      '@media (min-width: 610px)': {
        '@media (min-height: 610px)': {
          fontSize: '1.25rem',
        },
      },
    },
  };
});

const StyledTitleTypography = styled(Typography)(() => {
  return {
    [`&.${typographyClasses.root}`]: {
      textAlign: 'center',
      borderRadius: '15%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      '@media (min-width: 610px)': {
        '@media (min-height: 610px)': {
          boxShadow: '0 -2px 20px 20px rgba(0, 0, 0, 0.4)',
        },
      },
      boxShadow: '0 -1px 10px 10px rgba(0, 0, 0, 0.4)',
      textShadow: '1px 1px 2px black',
    },
  };
});

const StyledBackground = styled('div')(() => {
  return {
    height: '100vh',
    backgroundImage:
      'url(/background_image.jpg), url(/background_image_low_res.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  };
});

const StyledFooterContainer = styled('div')(({ theme: { spacing } }) => {
  return {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    marginBottom: spacing(1),
    padding: spacing(1, 2, 1, 2),
    boxShadow: '0 -1px 50px 50px rgba(0, 0, 0, 0.6)',
  };
});

export default LoginPage;
