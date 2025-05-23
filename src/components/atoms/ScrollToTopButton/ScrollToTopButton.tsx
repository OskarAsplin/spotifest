import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab } from '@mui/material';
import { ScrollToTop } from '@src/components/atoms/ScrollToTop/ScrollToTop';

export const ScrollToTopButton = () => (
  <ScrollToTop>
    <Fab size="small" aria-label="scroll back to top">
      <KeyboardArrowUpIcon />
    </Fab>
  </ScrollToTop>
);
