import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Props {
  matchingPercent: number;
}

const MatchingCircle = ({ matchingPercent }: Props) => {
  const themeMode = useTheme().palette.mode;
  const smallScreen = useMediaQuery('(max-width:439px)');

  const textSize = smallScreen ? '28px' : '25px';
  const pathColor = themeMode === 'light' ? '#3FBF3F' : '#3de53d';
  const textColor = themeMode === 'light' ? '#3FBF3F' : '#3de53d';
  const trailColor = themeMode === 'light' ? '#d6d6d6' : 'rgba(104, 104, 104)';

  return (
    <StyledMatchCircleDiv>
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

const StyledMatchCircleDiv = styled('div')(({ theme: { spacing } }) => ({
  marginLeft: spacing(2),
  userSelect: 'none',
  '@media (min-width: 690px)': { width: '80px' },
  '@media (max-width: 689px)': {
    '@media (min-width: 440px)': { width: '60px' },
  },
  '@media (max-width: 439px)': { width: '50px' },
}));

export default MatchingCircle;
