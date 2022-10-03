import { styled } from '@mui/material/styles';

const ArtistBox = styled('div')(({ theme: { spacing } }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  '@media (min-width: 440px)': {
    padding: spacing(0, 2, 0, 2),
  },
  '@media (max-width: 439px)': {
    padding: spacing(0, 1, 0, 1),
  },
}));

export default ArtistBox;
