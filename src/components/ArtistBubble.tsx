import {
  Avatar,
  avatarClasses,
  IconButton,
  iconButtonClasses,
  Typography,
} from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { Shadows } from '@mui/material/styles';
import MusicNote from '@mui/icons-material/MusicNote';
import { useNavigate } from 'react-router-dom';
import { Artist } from '../redux/types';
import { styled } from '@mui/material/styles';

interface Props {
  artist: Artist;
  useSpotifyId?: boolean;
  bubbleId: string;
}

const ArtistBubble = (props: Props) => {
  const { artist, useSpotifyId, bubbleId } = props;
  const navigate = useNavigate();

  const navigateToArtist = (artistId: string) =>
    navigate(`/artist/${useSpotifyId ? 'spotifyId=' : ''}${artistId}`);

  return (
    <StyledAvatarContainerdiv>
      <StyledIconButton
        key={'div_' + bubbleId}
        color="inherit"
        disabled={!artist.hasSpotifyId}
        onClick={() => {
          if (artist.hasSpotifyId)
            navigateToArtist(
              encodeURIComponent(useSpotifyId ? artist.spotifyId! : artist.name)
            );
        }}
      >
        {artist.iconPicture ? (
          <StyledAvatar
            src={artist.iconPicture}
            alt={artist.name}
            isClickable={artist.hasSpotifyId}
            key={bubbleId}
          />
        ) : (
          <StyledAvatarDiv isClickable={artist.hasSpotifyId}>
            <MusicNote fontSize={'large'} />
          </StyledAvatarDiv>
        )}
      </StyledIconButton>
      <Typography variant="caption">{artist.name}</Typography>
    </StyledAvatarContainerdiv>
  );
};

const StyledAvatarContainerdiv = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    '@media (min-width: 690px)': {
      width: '100px',
    },
    '@media (max-width: 689px)': {
      width: '75px',
      marginBottom: '6px',
    },
  };
});

const StyledIconButton = styled(IconButton)(() => {
  return {
    [`&.${iconButtonClasses.root}`]: {
      textAlign: 'center',
      '@media (min-width: 690px)': {
        width: '104px',
        padding: '12px',
      },
      '@media (max-width: 689px)': {
        width: '75px',
        marginBottom: '6px',
        padding: '6px',
      },
    },
  };
});

const avatarSharedStyle = (isClickable: boolean, shadows: Shadows) => ({
  '@media (min-width: 690px)': {
    height: 80,
    width: 80,
  },
  '@media (max-width: 689px)': {
    height: 60,
    width: 60,
  },
  boxShadow: isClickable ? shadows[3] : undefined,
});

const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'isClickable',
})<{ isClickable: boolean }>(({ theme: { shadows }, isClickable }) => ({
  [`&.${avatarClasses.root}`]: {
    ...avatarSharedStyle(isClickable, shadows),
  },
}));

const StyledAvatarDiv = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isClickable',
})<{ isClickable: boolean }>(({ theme: { shadows, palette }, isClickable }) => {
  return {
    ...avatarSharedStyle(isClickable, shadows),
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: blueGrey[palette.mode === 'light' ? 300 : 700],
  };
});

export default ArtistBubble;
