import { Typography, Popover } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectLoggedIn,
  setLoggedOff,
} from '../redux/reducers/authorizationSlice';
import { selectUserInfo } from '../redux/reducers/spotifyAccountSlice';
import { UserInfo } from '../redux/types';
import StandardLink from './StandardLink';
import { styled } from '@mui/material/styles';

interface Props {
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

const AppBarProfilePopover = ({ anchorEl, setAnchorEl }: Props) => {
  const loggedIn: boolean = useSelector(selectLoggedIn);
  const userInfo: UserInfo | undefined = useSelector(selectUserInfo);
  const dispatch = useDispatch();

  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <StyledPopoverDiv>
        {userInfo?.displayName && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            {userInfo.displayName}
          </Typography>
        )}
        {userInfo && userInfo.spotifyUrl && (
          <StandardLink href={userInfo.spotifyUrl} sx={{ mb: 1 }}>
            View profile in Spotify
          </StandardLink>
        )}
        {loggedIn && (
          <StandardLink
            href={`https://accounts.spotify.com/en/logout`}
            onClick={() => dispatch(setLoggedOff())}
          >
            Log out
          </StandardLink>
        )}
      </StyledPopoverDiv>
    </Popover>
  );
};

const StyledPopoverDiv = styled('div')(({ theme: { spacing } }) => {
  return {
    padding: spacing(1.5),
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center',
  };
});

export default AppBarProfilePopover;
