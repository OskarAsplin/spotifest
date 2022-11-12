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
