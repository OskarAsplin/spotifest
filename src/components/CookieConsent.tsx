import CookieConsent from 'react-cookie-consent';
import { Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cookiesContainer: {
      boxShadow: theme.shadows[3],
      color: 'rgb(64, 64, 64) !important',
      backgroundColor: 'rgb(200, 200, 200) !important',
      fontSize: '16px !important',
      '@media (max-width: 460px)': {
        justifyContent: 'center !important',
        textAlign: 'center !important',
      },
    },
    cookiesButton: {
      color: '#fefefe !important',
      backgroundColor: 'rgb(118, 175, 73) !important', // rgb(180, 237, 134)
      borderRadius: '5px !important',
      topMargin: '0px !important',
      fontWeight: 700,
      padding: theme.spacing(1.5, 3, 1.5, 3) + '!important',
    },
  })
);

interface CookieConsentProps {
  children: React.ReactNode;
}

const StyledCookieConsent = ({ children }: CookieConsentProps) => {
  const classes = useStyles();

  return (
    <CookieConsent
      location="bottom"
      buttonText="Got it!"
      containerClasses={classes.cookiesContainer}
      buttonClasses={classes.cookiesButton}
    >
      {children}
    </CookieConsent>
  );
};

export default StyledCookieConsent;
