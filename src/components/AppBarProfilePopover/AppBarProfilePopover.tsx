import { Typography, Popover } from '@mui/material';
import StandardLink from '../StandardLink';
import { styled } from '@mui/material/styles';

interface Props {
  id?: string;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  userName?: string;
  spotifyUrl?: string;
  onClickLogout: () => void;
}

const AppBarProfilePopover = ({
  id,
  anchorEl,
  setAnchorEl,
  userName,
  spotifyUrl,
  onClickLogout,
}: Props) => {
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);

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
        {userName && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            {userName}
          </Typography>
        )}
        {spotifyUrl && (
          <>
            <StandardLink href={spotifyUrl} sx={{ mb: 1 }}>
              View profile in Spotify
            </StandardLink>
            <StandardLink
              href="https://accounts.spotify.com/en/logout"
              onClick={onClickLogout}
            >
              Log out
            </StandardLink>
          </>
        )}
      </StyledPopoverDiv>
    </Popover>
  );
};

const StyledPopoverDiv = styled('div')(({ theme: { spacing } }) => ({
  padding: spacing(1.5),
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  alignItems: 'center',
}));

export default AppBarProfilePopover;
