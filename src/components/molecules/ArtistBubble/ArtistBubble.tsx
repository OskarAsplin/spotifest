import MusicNote from '@mui/icons-material/MusicNote';
import {
  Avatar,
  avatarClasses,
  IconButton,
  iconButtonClasses,
  Skeleton,
  Typography,
} from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { Shadows, styled } from '@mui/material/styles';
import { Artist } from '@src/api/types';
import { Link } from '@tanstack/react-router';
import { getArtistParam } from '@src/utils/routeUtils';

interface ArtistBubbleProps {
  artist: Artist;
}

const ArtistBubble = ({ artist }: ArtistBubbleProps) => (
  <StyledAvatarContainerDiv>
    <Link
      to="/artist/$artistId"
      params={{ artistId: getArtistParam(artist.name, artist.spotifyId) }}
      style={{ borderRadius: '50%', color: 'inherit' }}
      disabled={!artist.spotifyId}
    >
      <StyledIconButton color="inherit" disabled={!artist.spotifyId}>
        {artist.iconPicture ? (
          <StyledAvatar
            src={artist.iconPicture}
            alt={artist.name}
            isClickable={!!artist.spotifyId}
          />
        ) : (
          <StyledAvatarDiv isClickable={!!artist.spotifyId}>
            <MusicNote fontSize="large" />
          </StyledAvatarDiv>
        )}
      </StyledIconButton>
    </Link>
    <Typography variant="caption">{artist.name}</Typography>
  </StyledAvatarContainerDiv>
);

export const ArtistBubbleSkeleton = () => (
  <StyledAvatarContainerDiv>
    <StyledIconButton disabled>
      <Skeleton variant="circular">
        <StyledAvatar />
      </Skeleton>
    </StyledIconButton>
    <Typography variant="caption">
      <Skeleton width={60} />
    </Typography>
  </StyledAvatarContainerDiv>
);

export const StyledAvatarContainerDiv = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  '@media (min-width: 690px)': { width: '100px' },
  '@media (max-width: 689px)': { width: '75px', marginBottom: '6px' },
}));

const StyledIconButton = styled(IconButton)(() => ({
  [`&.${iconButtonClasses.root}`]: {
    textAlign: 'center',
    '@media (min-width: 690px)': {
      width: '104px',
      height: '104px',
      padding: '12px',
    },
    '@media (max-width: 689px)': {
      width: '75px',
      height: '75px',
      padding: '6px',
    },
  },
}));

const sharedAvatarStyle = (isClickable: boolean, shadows: Shadows) => ({
  '@media (min-width: 690px)': { height: 80, width: 80 },
  '@media (max-width: 689px)': { height: 60, width: 60 },
  boxShadow: isClickable ? shadows[3] : undefined,
});

const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'isClickable',
})<{ isClickable?: boolean }>(
  ({ theme: { shadows }, isClickable = false }) => ({
    [`&.${avatarClasses.root}`]: sharedAvatarStyle(isClickable, shadows),
  }),
);

const StyledAvatarDiv = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isClickable',
})<{ isClickable: boolean }>(
  ({ theme: { shadows, palette }, isClickable }) => ({
    ...sharedAvatarStyle(isClickable, shadows),
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: blueGrey[palette.mode === 'light' ? 300 : 700],
  }),
);

export default ArtistBubble;
