import {
  TelegramLegacyIcon,
  TelegramShareButton,
  WhatsappLegacyIcon,
  WhatsappShareButton,
  XLegacyIcon,
  XShareButton,
} from 'react-share';
import { HtmlTooltip } from '@src/components/atoms/HtmlTooltip/HtmlTooltip';
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
    disabled: isDisabled,
    disabledStyle,
  };
  return (
    <div className="flex flex-row gap-4">
      <ButtonWrapper tooltipText={tooltipText}>
        <XShareButton
          {...sharedButtonProps}
          text={message}
          hashtags={['spotifest']}
        >
          <XLegacyIcon size={BUTTON_SIZE} round />
        </XShareButton>
      </ButtonWrapper>
      <ButtonWrapper tooltipText={tooltipText}>
        <TelegramShareButton {...sharedButtonProps} text={message}>
          <TelegramLegacyIcon size={BUTTON_SIZE} round />
        </TelegramShareButton>
      </ButtonWrapper>
      <ButtonWrapper tooltipText={tooltipText}>
        <WhatsappShareButton {...sharedButtonProps} message={message}>
          <WhatsappLegacyIcon size={BUTTON_SIZE} round />
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

interface ButtonWrapperProps extends Pick<
  SocialMediaButtonsProps,
  'tooltipText'
> {
  children: React.ReactNode;
}

const ButtonWrapper = ({ tooltipText, children }: ButtonWrapperProps) => (
  <HtmlTooltip title={tooltipText}>{children}</HtmlTooltip>
);
