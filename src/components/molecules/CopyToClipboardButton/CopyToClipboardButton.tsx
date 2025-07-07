import { Copy } from 'lucide-react';
import { Button } from '@src/components/ui/button';
import { CopyToClipboard } from '@src/components/atoms/CopyToClipboard/CopyToClipboard';
import { cn } from '@src/lib/utils';
import { useThemeMode } from '@src/zustand/themeStore';

interface CopyToClipboardButtonProps {
  textToCopy: string;
  isDisabled?: boolean;
}

export const CopyToClipboardButton = ({
  textToCopy,
  isDisabled,
}: CopyToClipboardButtonProps) => {
  const themeMode = useThemeMode();
  return (
    <CopyToClipboard>
      {({ copy }) => (
        <Button
          variant={themeMode === 'dark' ? 'ghost' : 'outline'}
          size="icon"
          onClick={() => copy(textToCopy)}
          disabled={isDisabled}
          className={cn(
            'h-8 w-8 rounded-full p-0 shadow-none',
            'bg-white/50 hover:bg-white/60',
            isDisabled && 'bg-white/30 hover:bg-white/30',
          )}
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
    </CopyToClipboard>
  );
};
