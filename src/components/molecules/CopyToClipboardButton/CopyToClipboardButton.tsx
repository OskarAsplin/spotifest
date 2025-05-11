import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { Box, IconButton } from '@mui/material';
import { CopyToClipboard } from '@src/components/atoms/CopyToClipboard/CopyToClipboard';

interface CopyToClipboardButtonProps {
  textToCopy: string;
  isDisabled?: boolean;
}

export const CopyToClipboardButton = ({
  textToCopy,
  isDisabled,
}: CopyToClipboardButtonProps) => (
  <CopyToClipboard>
    {({ copy }) => (
      <IconButton
        onClick={() => copy(textToCopy)}
        sx={{ p: 0 }}
        disabled={isDisabled}
      >
        <Box
          sx={{
            backgroundColor: `rgba(255, 255, 255, ${
              isDisabled ? '0.3' : '0.5'
            })`,
            borderRadius: '50%',
            width: ({ spacing }) => spacing(4),
            height: ({ spacing }) => spacing(4),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ContentCopyOutlinedIcon fontSize="small" />
        </Box>
      </IconButton>
    )}
  </CopyToClipboard>
);
