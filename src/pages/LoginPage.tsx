import { useEffect } from 'react';
import { Box, Typography, typographyClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { useDispatch } from 'react-redux';
import { getAuthorizeHref } from '../oauthConfig';
import {
  setLoggedIn,
  setLoggedOff,
} from '../redux/reducers/authorizationSlice';
import StandardLink from '../components/StandardLink';
import LoginButton from '../components/LoginButton/LoginButton';

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

  const onClickLoginButton = () => {
    dispatch(setLoggedIn());
    window.open(getAuthorizeHref(), '_self');
  };

  return (
    <StyledBackgroundDiv>
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
        <LoginButton onClick={onClickLoginButton} />
      </Box>
      <StyledFooterDiv>
        <StyledFooterTypography variant={bigScreen ? 'body1' : 'body2'}>
          Find music festivals with your playlists
        </StyledFooterTypography>
        <StyledFooterTypography variant={bigScreen ? 'body1' : 'body2'}>
          {'A festival finder created by '}
          <StandardLink href={'https://github.com/OskarAsplin'}>
            Oskar Asplin
          </StandardLink>
        </StyledFooterTypography>
        <StyledFooterTypography variant={bigScreen ? 'body1' : 'body2'}>
          <StandardLink href="https://www.flickr.com/photos/149801000@N05/34735177654/in/photostream/">
            Photo
          </StandardLink>
          {' by '}
          <StandardLink href="https://www.flickr.com/photos/149801000@N05/">
            veldmusicfestival
          </StandardLink>
          {' / '}
          <StandardLink href="https://creativecommons.org/licenses/by-sa/2.0/">
            CC BY-SA 2.0
          </StandardLink>
        </StyledFooterTypography>
      </StyledFooterDiv>
    </StyledBackgroundDiv>
  );
};

const StyledFooterTypography = styled(Typography)(() => ({
  [`&.${typographyClasses.root}`]: {
    '@media (min-width: 610px)': {
      '@media (min-height: 610px)': {
        fontSize: '1.25rem',
      },
    },
  },
}));

const StyledTitleTypography = styled(Typography)(() => ({
  [`&.${typographyClasses.root}`]: {
    textAlign: 'center',
    borderRadius: '15%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    textShadow: '1px 1px 2px black',
    boxShadow: '0 -1px 10px 10px rgba(0, 0, 0, 0.4)',
    '@media (min-width: 610px)': {
      '@media (min-height: 610px)': {
        boxShadow: '0 -2px 20px 20px rgba(0, 0, 0, 0.4)',
      },
    },
  },
}));

const StyledBackgroundDiv = styled('div')(() => ({
  height: '100vh',
  backgroundImage:
    'url(/background_image.jpg), url(/background_image_low_res.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
}));

const StyledFooterDiv = styled('div')(({ theme: { spacing } }) => ({
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
}));

export default LoginPage;
