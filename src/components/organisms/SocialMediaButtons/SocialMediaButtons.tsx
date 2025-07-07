import {
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  XIcon,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import { StyledTooltip } from '@src/components/atoms/HtmlTooltip/HtmlTooltip';
import { CopyToClipboardButton } from '@src/components/molecules/CopyToClipboardButton/CopyToClipboardButton';

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

export const SocialMediaButtons = ({
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
    <div className="flex flex-row gap-4">
      <ButtonWrapper tooltipText={tooltipText}>
        <TwitterShareButton {...sharedButtonProps} hashtags={['spotifest']}>
          <XIcon size={BUTTON_SIZE} round />
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
    </div>
  );
};

interface ButtonWrapperProps
  extends Pick<SocialMediaButtonsProps, 'tooltipText'> {
  children: React.ReactNode;
}

const ButtonWrapper = ({ tooltipText, children }: ButtonWrapperProps) => (
  <StyledTooltip title={tooltipText}>{children}</StyledTooltip>
);
