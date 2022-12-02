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
import { useSelector } from 'react-redux';
import { selectMatchBasis } from '../../../redux/reducers/matchingSlice';
import { TOP_ARTISTS_CHOICE } from '../../molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import { Box } from '@mui/material';
import { Fragment } from 'react';
import HtmlTooltip from '../../atoms/HtmlTooltip/HtmlTooltip';

const TITLE =
  'I matched my Spotify playlist with music festivals using Spotifest. Check out the results!';

const SocialMediaButtons = () => {
  const matchBasis = useSelector(selectMatchBasis);

  const isDisabled = !matchBasis || matchBasis === TOP_ARTISTS_CHOICE; // || isPrivate

  const shareUrl = `${process.env.REACT_APP_REDIRECT_URI}/share/${matchBasis}`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', ml: 2 }}>
      <HtmlTooltip
        disableFocusListener
        enterTouchDelay={0}
        title={
          <Fragment>Only results from public playlists can be shared</Fragment>
        }
      >
        <Box sx={{ mr: 2 }}>
          <TwitterShareButton
            url={shareUrl}
            disabled={isDisabled}
            title={TITLE}
            hashtags={['spotifest']}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </Box>
      </HtmlTooltip>
      <HtmlTooltip
        disableFocusListener
        enterTouchDelay={0}
        title={
          <Fragment>Only results from public playlists can be shared</Fragment>
        }
      >
        <Box sx={{ mr: 2 }}>
          <WhatsappShareButton
            url={shareUrl}
            disabled={isDisabled}
            title={TITLE}
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </Box>
      </HtmlTooltip>
    </Box>
  );
};

export default SocialMediaButtons;
