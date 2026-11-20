import { Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@src/components/ui/button';
import { HtmlTooltip } from '@src/components/atoms/HtmlTooltip/HtmlTooltip';
import { cn } from '@src/lib/utils';
import { useThemeMode } from '@src/zustand/themeStore';

const COPIED_TOOLTIP_DURATION_MS = 1500;

interface CopyToClipboardButtonProps {
  textToCopy: string;
  tooltipText: string;
  isDisabled?: boolean;
}

export const CopyToClipboardButton = ({
  textToCopy,
  tooltipText,
  isDisabled,
}: CopyToClipboardButtonProps) => {
  const themeMode = useThemeMode();
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const copy = () => {
    void navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(
      () => setCopied(false),
      COPIED_TOOLTIP_DURATION_MS,
    );
  };

  return (
    <HtmlTooltip title={copied ? 'Copied!' : tooltipText} forceOpen={copied}>
      <Button
        variant={themeMode === 'dark' ? 'ghost' : 'outline'}
        size="icon"
        onClick={copy}
        disabled={isDisabled}
        className={cn(
          'h-8 w-8 rounded-full bg-clip-border p-0 shadow-none',
          'bg-white/50 hover:bg-white/60',
          isDisabled && 'bg-white/30 hover:bg-white/30',
        )}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </HtmlTooltip>
  );
};
