import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@src/components/ui/tooltip';

interface CopyToClipboardProps {
  children: (props: { copy: (content: string) => void }) => React.ReactElement;
}

export const CopyToClipboard = ({ children }: CopyToClipboardProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const onCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1500);
  };

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>{children({ copy: onCopy })}</TooltipTrigger>
        <TooltipContent side="right">Copied!</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
