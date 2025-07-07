import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@src/components/ui/tooltip';
import { ReactNode } from 'react';

interface HtmlTooltipProps {
  title: ReactNode;
  children: ReactNode;
}

export const HtmlTooltip = ({ title, children }: HtmlTooltipProps) =>
  title ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{children}</span>
        </TooltipTrigger>
        <TooltipContent className="max-w-80 whitespace-pre-line" side="top">
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    children
  );

// Alias for backward compatibility
export const StyledTooltip = HtmlTooltip;
