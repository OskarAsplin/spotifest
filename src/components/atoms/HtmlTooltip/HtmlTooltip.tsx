import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@src/components/ui/tooltip';
import { ReactNode, useState, useRef, useCallback, useEffect } from 'react';

interface HtmlTooltipProps {
  title: ReactNode;
  children: ReactNode;
}

export const HtmlTooltip = ({ title, children }: HtmlTooltipProps) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const handleTouchStart = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, 1000);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleTouchCancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  return title ? (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>
          <span
            className="h-full"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            onTouchMove={handleTouchCancel}
          >
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-80 whitespace-pre-line" side="top">
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    children
  );
};

// Alias for backward compatibility
export const StyledTooltip = HtmlTooltip;
