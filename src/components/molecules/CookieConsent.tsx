import { createStyles, makeStyles } from '@mui/styles';
import { CookieConsent } from 'react-cookie-consent';

const useStyles = makeStyles(() =>
  createStyles({
    cookiesContainer: {
      boxShadow: '0px -5px 5px rgba(0, 0, 0, 0.25)',
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
      padding: '12px 24px 12px 24px !important',
      margin: '8px 12px !important',
    },
  }),
);

interface CookieConsentProps {
  children: React.ReactNode;
}

export const StyledCookieConsent = ({ children }: CookieConsentProps) => {
  const classes = useStyles();

  return (
    // @ts-ignore
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
