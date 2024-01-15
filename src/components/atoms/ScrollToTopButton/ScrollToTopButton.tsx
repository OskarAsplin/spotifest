import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab } from '@mui/material';
import ScrollToTop from '../ScrollToTop/ScrollToTop';

const ScrollToTopButton = () => (
  <ScrollToTop>
    <Fab size="small" aria-label="scroll back to top">
      <KeyboardArrowUpIcon />
    </Fab>
  </ScrollToTop>
);

export default ScrollToTopButton;
