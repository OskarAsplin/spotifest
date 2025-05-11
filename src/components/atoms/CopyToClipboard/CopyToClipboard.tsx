import { Tooltip } from '@mui/material';
import { useState } from 'react';

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
    <Tooltip open={showTooltip} title="Copied!" placement="right">
      {children({ copy: onCopy })}
    </Tooltip>
  );
};
