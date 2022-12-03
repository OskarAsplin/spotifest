import { useState } from 'react';
import copy from 'copy-to-clipboard';
import { Tooltip } from '@mui/material';

interface CopyToClipboardProps {
  children: (props: { copy: (content: string) => void }) => JSX.Element;
}

const CopyToClipboard = ({ children }: CopyToClipboardProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const onCopy = (content: string) => {
    copy(content);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1500);
  };

  return (
    <Tooltip open={showTooltip} title="Copied!" placement="right">
      {children({ copy: onCopy })}
    </Tooltip>
  );
};

export default CopyToClipboard;
