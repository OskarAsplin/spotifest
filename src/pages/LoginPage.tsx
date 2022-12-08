import { Box, Typography, typographyClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import LoginButton from '../components/atoms/LoginButton/LoginButton';
import StandardLink from '../components/atoms/StandardLink/StandardLink';
import { getAuthorizeHref } from '../oauthConfig';
import {
  setLoggedIn,
  setLoggedOff,
} from '../redux/reducers/authorizationSlice';
import { Trans, useTranslation } from 'react-i18next';

const LoginPage = () => {
  const bigWidth = useMediaQuery('(min-width:610px)');
  const bigHeight = useMediaQuery('(min-height:610px)');
  const bigScreen = bigWidth && bigHeight;
  const verySmallScreen = useMediaQuery('(max-width:330px)');

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(setLoggedOff());
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
          {t('common.app_title')}
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
          {t('login_page.footer.line_1')}
        </StyledFooterTypography>
        <StyledFooterTypography variant={bigScreen ? 'body1' : 'body2'}>
          <Trans
            i18nKey="login_page.footer.line_2"
            components={{ Link: <StandardLink /> }}
          />
        </StyledFooterTypography>
        <StyledFooterTypography variant={bigScreen ? 'body1' : 'body2'}>
          <Trans
            i18nKey="login_page.footer.line_3"
            components={{ Link: <StandardLink /> }}
          />
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
