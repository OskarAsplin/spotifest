import { Box, Popover, PopoverProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import StandardLink from '../../atoms/StandardLink/StandardLink';
import { Trans, useTranslation } from 'react-i18next';

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
}: ProfilePopoverProps) => {
  const { t } = useTranslation();
  return (
    <Popover
      {...restProps}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
    >
      <StyledPopoverDiv>
        {userName && spotifyUrl && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            {userName}
          </Typography>
        )}
        {spotifyUrl && (
          <>
            <StandardLink href={spotifyUrl} sx={{ mb: 1 }}>
              {t('app_bar.profile_popover.view_profile')}
            </StandardLink>
            <StandardLink
              href="https://accounts.spotify.com/en/logout"
              onClick={onClickLogout}
            >
              {t('app_bar.profile_popover.log_out')}
            </StandardLink>
          </>
        )}
        {!spotifyUrl && (
          <Box sx={{ maxWidth: '200px' }}>
            <Trans
              i18nKey="app_bar.profile_popover.log_in"
              components={{ Link: <StandardLink to="/login" /> }}
            />
          </Box>
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

export default ProfilePopover;
