import { Box, Fade, useScrollTrigger } from '@mui/material';

type ScrollToTopProps = {
  children: React.ReactNode;
};

export const ScrollToTop = ({ children }: ScrollToTopProps) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 1500,
  });

  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
};
