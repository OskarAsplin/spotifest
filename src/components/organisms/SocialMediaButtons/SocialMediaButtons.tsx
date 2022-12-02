import {
  // EmailShareButton,
  TwitterShareButton,
  TwitterIcon,
  // HatenaShareButton,
  // InstapaperShareButton,
  // LineShareButton,
  // LinkedinShareButton,
  // LivejournalShareButton,
  // MailruShareButton,
  // OKShareButton,
  // PinterestShareButton,
  // PocketShareButton,
  // RedditShareButton,
  // TelegramShareButton,
  // TumblrShareButton,
  // TwitterShareButton,
  // ViberShareButton,
  // VKShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  // WorkplaceShareButton
} from 'react-share';
import copy from 'copy-to-clipboard';
import { Box, IconButton } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { Fragment } from 'react';
import HtmlTooltip from '../../atoms/HtmlTooltip/HtmlTooltip';

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
          disabled={isDisabled}
          title={message}
          hashtags={['spotifest']}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </ButtonWrapper>
      <ButtonWrapper tooltipText={tooltipText}>
        <WhatsappShareButton
          url={shareUrl}
          disabled={isDisabled}
          title={message}
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </ButtonWrapper>
      <ButtonWrapper tooltipText="Copy share link to clipboard">
        <IconButton
          onClick={() => copy(shareUrl)}
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
      </ButtonWrapper>
    </Box>
  );
};

interface ButtonWrapperProps
  extends Pick<SocialMediaButtonsProps, 'tooltipText'> {
  children: React.ReactNode;
}

const ButtonWrapper = ({ tooltipText, children }: ButtonWrapperProps) => (
  <HtmlTooltip
    disableFocusListener
    enterTouchDelay={0}
    title={<Fragment>{tooltipText}</Fragment>}
  >
    <Box sx={{ mr: 2 }}>{children}</Box>
  </HtmlTooltip>
);

export default SocialMediaButtons;
