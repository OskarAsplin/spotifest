import { ChevronUp } from 'lucide-react';
import { Button } from '@src/components/ui/button';
import { ScrollToTop } from '@src/components/atoms/ScrollToTop/ScrollToTop';

export const ScrollToTopButton = () => (
  <ScrollToTop>
    <Button
      size="sm"
      variant="default"
      className="h-10 w-10 rounded-full p-0"
      aria-label="scroll back to top"
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  </ScrollToTop>
);
