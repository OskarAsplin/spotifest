import {
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import { Box, IconButton } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { Fragment } from 'react';
import { StyledTooltip } from '../../atoms/HtmlTooltip/HtmlTooltip';
import CopyToClipboard from '../../atoms/CopyToClipboard/CopyToClipboard';

const BUTTON_SIZE = 32;

interface SocialMediaButtonsProps {
  message: string;
  shareUrl: string;
  tooltipText: string;
  isDisabled: boolean;
}

const SocialMediaButtons = ({
  message,
  shareUrl,
  tooltipText,
  isDisabled,
}: SocialMediaButtonsProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', ml: 2 }}>
      <ButtonWrapper tooltipText={tooltipText}>
        <TwitterShareButton
          url={shareUrl}
          title={message}
          hashtags={['spotifest']}
          disabled={isDisabled}
        >
          <TwitterIcon size={BUTTON_SIZE} round />
        </TwitterShareButton>
      </ButtonWrapper>
      <ButtonWrapper tooltipText={tooltipText}>
        <TelegramShareButton
          url={shareUrl}
          title={message}
          disabled={isDisabled}
        >
          <TelegramIcon size={BUTTON_SIZE} round />
        </TelegramShareButton>
      </ButtonWrapper>
      <ButtonWrapper tooltipText={tooltipText}>
        <WhatsappShareButton
          url={shareUrl}
          title={message}
          disabled={isDisabled}
        >
          <WhatsappIcon size={BUTTON_SIZE} round />
        </WhatsappShareButton>
      </ButtonWrapper>
      <ButtonWrapper
        tooltipText={isDisabled ? tooltipText : 'Copy link and message'}
      >
        <CopyToClipboard>
          {({ copy }) => (
            <IconButton
              onClick={() => copy(`${message} ${shareUrl}`)}
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
                <LinkIcon />
              </Box>
            </IconButton>
          )}
        </CopyToClipboard>
      </ButtonWrapper>
    </Box>
  );
};

interface ButtonWrapperProps
  extends Pick<SocialMediaButtonsProps, 'tooltipText'> {
  children: React.ReactNode;
}

const ButtonWrapper = ({ tooltipText, children }: ButtonWrapperProps) => (
  <StyledTooltip
    disableFocusListener
    enterTouchDelay={0}
    leaveTouchDelay={3000}
    title={<Fragment>{tooltipText}</Fragment>}
  >
    <Box sx={{ mr: 2 }}>{children}</Box>
  </StyledTooltip>
);

export default SocialMediaButtons;
