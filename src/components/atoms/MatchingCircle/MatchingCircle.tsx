import { useThemeMode } from '@src/zustand/themeStore';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Props {
  matchingPercent: number;
}

export const MatchingCircle = ({ matchingPercent }: Props) => {
  const themeMode = useThemeMode();

  const color = themeMode === 'light' ? '#3FBF3F' : '#3de53d';
  const trailColor = themeMode === 'light' ? '#d6d6d6' : 'rgba(104, 104, 104)';

  return (
    <div className="h-12.5 w-12.5 select-none sm:h-20 sm:w-20">
      {/*@ts-ignore*/}
      <CircularProgressbar
        value={matchingPercent}
        text={`${matchingPercent}%`}
        styles={buildStyles({
          pathTransitionDuration: 2,
          pathColor: color,
          textColor: color,
          trailColor: trailColor,
        })}
      />
    </div>
  );
};
