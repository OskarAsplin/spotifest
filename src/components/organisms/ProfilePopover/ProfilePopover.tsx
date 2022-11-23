import { PopoverProps, Typography, Popover } from '@mui/material';
import StandardLink from '../../atoms/StandardLink/StandardLink';
import { styled } from '@mui/material/styles';

interface ProfilePopoverProps extends PopoverProps {
  userName?: string;
  spotifyUrl?: string;
  onClickLogout: () => void;
}

const ProfilePopover = ({
  userName,
  spotifyUrl,
  onClickLogout,
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
  transformOrigin = { vertical: 'top', horizontal: 'center' },
  ...restProps
}: ProfilePopoverProps) => (
  <Popover
    {...restProps}
    anchorOrigin={anchorOrigin}
    transformOrigin={transformOrigin}
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

const StyledPopoverDiv = styled('div')(({ theme: { spacing } }) => ({
  padding: spacing(1.5),
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  alignItems: 'center',
}));

export default ProfilePopover;
