import { Button, buttonClasses } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTitleButton = styled(Button)(
  ({ theme: { spacing, palette } }) => ({
    [`&.${buttonClasses.root}`]: {
      whiteSpace: 'normal',
      textTransform: 'none',
      textAlign: 'left',
      marginBottom: spacing(1.5),
      padding: spacing(0, 1),
      borderColor: palette.primary?.[palette.mode],
      '@media (min-width: 690px)': { borderStyle: 'dashed' },
      '@media (max-width: 689px)': { borderStyle: 'dotted' },
    },
  }),
);

export const StyledPaddedDiv = styled('div')(({ theme: { spacing } }) => ({
  '@media (min-width: 690px)': { padding: spacing(0, 4) },
  '@media (max-width: 689px)': {
    '@media (min-width: 440px)': { padding: spacing(0, 2) },
  },
  '@media (max-width: 439px)': { padding: spacing(0, 2) },
}));
