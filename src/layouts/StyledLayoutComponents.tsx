import { styled } from '@mui/material/styles';

export const StyledRootDiv = styled('div')(({ theme: { spacing } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  '@media (min-width: 440px)': { padding: spacing(0, 2) },
  '@media (max-width: 439px)': { padding: spacing(0, 1) },
}));

export const StyledCenteredColumnDiv = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const StyledCenteredRowDiv = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const ArtistBox = styled('div')(({ theme: { spacing } }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  '@media (min-width: 440px)': { padding: spacing(0, 2) },
  '@media (max-width: 439px)': { padding: spacing(0, 1) },
}));
