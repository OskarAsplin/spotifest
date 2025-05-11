import { Box } from '@mui/material';
import { Fragment } from 'react';
import {
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import { StyledTooltip } from '@src/components/atoms/HtmlTooltip/HtmlTooltip';
import CopyToClipboardButton from '@src/components/molecules/CopyToClipboardButton/CopyToClipboardButton';

const BUTTON_SIZE = 32;

const disabledStyle: React.CSSProperties = {
  cursor: 'default',
  opacity: 0.6,
  pointerEvents: 'none',
};

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
  const sharedButtonProps = {
    url: shareUrl,
    title: message,
    disabled: isDisabled,
    disabledStyle,
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', ml: 2 }}>
      <ButtonWrapper tooltipText={tooltipText}>
        <TwitterShareButton {...sharedButtonProps} hashtags={['spotifest']}>
          <TwitterIcon size={BUTTON_SIZE} round />
        </TwitterShareButton>
      </ButtonWrapper>
      <ButtonWrapper tooltipText={tooltipText}>
        <TelegramShareButton {...sharedButtonProps}>
          <TelegramIcon size={BUTTON_SIZE} round />
        </TelegramShareButton>
      </ButtonWrapper>
      <ButtonWrapper tooltipText={tooltipText}>
        <WhatsappShareButton {...sharedButtonProps}>
          <WhatsappIcon size={BUTTON_SIZE} round />
        </WhatsappShareButton>
      </ButtonWrapper>
      <ButtonWrapper
        tooltipText={isDisabled ? tooltipText : 'Copy link and message'}
      >
        <CopyToClipboardButton
          textToCopy={`${message} ${shareUrl}`}
          isDisabled={isDisabled}
        />
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
