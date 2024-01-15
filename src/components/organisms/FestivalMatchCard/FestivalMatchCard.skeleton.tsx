import { Box, Divider, Paper, Skeleton, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { ArtistBox } from '../../../layouts/StyledLayoutComponents';
import { getMaxArtistsInWidth } from '../../../utils/displayUtils';
import { MatchingCircleSizeCss } from '../../atoms/MatchingCircle/MatchingCircle';
import {
  ArtistBubbleSkeleton,
  StyledAvatarContainerdiv,
} from '../../molecules/ArtistBubble/ArtistBubble';
import { artistMock } from '../../molecules/ArtistBubble/ArtistBubble.fixtures';
import { StyledPaddedDiv, StyledTitleButton } from './FestivalMatchCard.styled';

const FestivalMatchCardSkeleton = () => {
  const bigScreen = useMediaQuery('(min-width:690px)');
  const smallScreen = useMediaQuery('(max-width:439px)');

  const mockPopularArtists = Array(7).fill(artistMock);
  const mockMatchingArtists = Array(3).fill(artistMock);

  const maxArtistsInWidth = getMaxArtistsInWidth(bigScreen, smallScreen, 7);
  const fillMatchingArtistWidth =
    maxArtistsInWidth - (mockMatchingArtists.length % maxArtistsInWidth);

  return (
    <Paper elevation={3} sx={{ py: 2, mb: 3 }}>
      <StyledPaddedDiv>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Skeleton>
              <StyledTitleButton color="inherit" variant="outlined">
                <Typography variant={bigScreen ? 'h3' : 'h5'}>
                  Some festival 2023
                </Typography>
              </StyledTitleButton>
            </Skeleton>
            <Typography variant="subtitle2">
              <Skeleton width={120} />
            </Typography>
            <Typography variant="subtitle2">
              <Skeleton width={150} />
            </Typography>
            <Typography variant="subtitle2">
              <Skeleton width={240} />
            </Typography>
          </Box>
          <Skeleton variant="circular" sx={MatchingCircleSizeCss} />
        </Box>
        <Typography variant="body1" sx={{ my: 1.5 }}>
          <Skeleton width={120} />
        </Typography>
      </StyledPaddedDiv>
      <ArtistBox>
        {mockMatchingArtists.map((artist, i) => (
          <ArtistBubbleSkeleton
            key={`avatar_match_artist_skeleton_${artist.name}_${i}`}
          />
        ))}
        {mockMatchingArtists.length > 0 &&
          Array.from({ length: fillMatchingArtistWidth }, (_, i) => (
            <StyledAvatarContainerdiv key={i} />
          ))}
      </ArtistBox>
      <Divider sx={{ width: '100%' }}>
        <Typography variant="body1" sx={{ my: 1.5 }}>
          <Skeleton width={200} />
        </Typography>
      </Divider>
      <ArtistBox>
        {mockPopularArtists.slice(0, maxArtistsInWidth).map((artist, i) => (
          <ArtistBubbleSkeleton
            key={`avatar_pop_artist_skeleton_${artist.name}_${i}`}
          />
        ))}
      </ArtistBox>
    </Paper>
  );
};

export default FestivalMatchCardSkeleton;
