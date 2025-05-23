import { useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Props {
  matchingPercent: number;
}

export const MatchingCircle = ({ matchingPercent }: Props) => {
  const themeMode = useTheme().palette.mode;
  const smallScreen = useMediaQuery('(max-width:439px)');

  const textSize = smallScreen ? '28px' : '25px';
  const pathColor = themeMode === 'light' ? '#3FBF3F' : '#3de53d';
  const textColor = themeMode === 'light' ? '#3FBF3F' : '#3de53d';
  const trailColor = themeMode === 'light' ? '#d6d6d6' : 'rgba(104, 104, 104)';

  return (
    <StyledMatchCircleDiv>
      {/*@ts-ignore*/}
      <CircularProgressbar
        value={matchingPercent}
        text={`${matchingPercent}%`}
        styles={buildStyles({
          textSize: textSize,
          pathTransitionDuration: 0.5,
          pathColor: pathColor,
          textColor: textColor,
          trailColor: trailColor,
        })}
      />
    </StyledMatchCircleDiv>
  );
};

export const MatchingCircleSizeCss = {
  '@media (min-width: 690px)': { width: '80px', height: '80px' },
  '@media (max-width: 689px)': {
    '@media (min-width: 440px)': { width: '60px', height: '60px' },
  },
  '@media (max-width: 439px)': { width: '50px', height: '50px' },
};

const StyledMatchCircleDiv = styled('div')(({ theme: { spacing } }) => ({
  marginLeft: spacing(2),
  userSelect: 'none',
  ...MatchingCircleSizeCss,
}));
