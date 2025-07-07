import { ChevronDown } from 'lucide-react';
import { Button } from '@src/components/ui/button';
import { cn } from '@src/lib/utils';

interface ExpandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  expanded?: boolean;
}

export const ExpandButton = ({
  expanded,
  className,
  ...props
}: ExpandButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn(
      'transition-transform duration-200',
      expanded && 'rotate-180',
      className,
    )}
    {...props}
  >
    <ChevronDown className="h-5 w-5" />
  </Button>
);
