import { Box, Button, buttonClasses, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { useTranslation } from 'react-i18next';

interface LoginButtonProps {
  onClick: () => void;
}

const LoginButton = ({ onClick }: LoginButtonProps) => {
  const bigWidth = useMediaQuery('(min-width:610px)');
  const bigHeight = useMediaQuery('(min-height:610px)');
  const bigScreen = bigWidth && bigHeight;
  const { t } = useTranslation();

  return (
    <StyledLoginButton
      variant="contained"
      bigScreen={bigScreen}
      onClick={onClick}
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
      <Typography variant={bigScreen ? 'h4' : 'h6'} color="textPrimary">
        {t('login_page.button')}
      </Typography>
    </StyledLoginButton>
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
      boxShadow: shadows[3],
      padding: bigScreen ? spacing(2, 5, 2, 5) : spacing(1, 2.5, 1, 1.5),
      borderRadius: bigScreen ? 15 : 25,
      backgroundColor: '#1DB954',
      '&:hover': {
        backgroundColor: 'rgb(19, 175, 74)',
      },
    },
  };
});

export default LoginButton;
