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
import { getArtistPath } from '../utils/utils';

interface Props {
  artist: Artist;
  bubbleId: string;
}

const ArtistBubble = ({ artist, bubbleId }: Props) => {
  const navigate = useNavigate();

  return (
    <StyledAvatarContainerdiv>
      <StyledIconButton
        key={'div_' + bubbleId}
        color="inherit"
        disabled={!artist.spotifyId}
        onClick={() => navigate(getArtistPath(artist.name, artist.spotifyId))}
      >
        {artist.iconPicture ? (
          <StyledAvatar
            src={artist.iconPicture}
            alt={artist.name}
            isClickable={!!artist.spotifyId}
            key={bubbleId}
          />
        ) : (
          <StyledAvatarDiv isClickable={!!artist.spotifyId}>
            <MusicNote fontSize={'large'} />
          </StyledAvatarDiv>
        )}
      </StyledIconButton>
      <Typography variant="caption">{artist.name}</Typography>
    </StyledAvatarContainerdiv>
  );
};

export const StyledAvatarContainerdiv = styled('div')(() => {
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
        padding: '6px',
      },
    },
  };
});

const sharedAvatarStyle = (isClickable: boolean, shadows: Shadows) => ({
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
  [`&.${avatarClasses.root}`]: sharedAvatarStyle(isClickable, shadows),
}));

const StyledAvatarDiv = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isClickable',
})<{ isClickable: boolean }>(({ theme: { shadows, palette }, isClickable }) => {
  return {
    ...sharedAvatarStyle(isClickable, shadows),
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: blueGrey[palette.mode === 'light' ? 300 : 700],
  };
});

export default ArtistBubble;
