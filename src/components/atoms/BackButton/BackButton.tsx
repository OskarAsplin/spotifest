import { ArrowBackOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

interface TopLeftBackButtonProps {
  onClick: () => void;
}

const BackButton = ({ onClick }: TopLeftBackButtonProps) => (
  <IconButton onClick={onClick}>
    <ArrowBackOutlined fontSize="large" />
  </IconButton>
);

export const TopLeftBackButton = ({ onClick }: TopLeftBackButtonProps) => (
  <StyledTopLeftDiv>
    <BackButton onClick={onClick} />
  </StyledTopLeftDiv>
);

const StyledTopLeftDiv = styled('div')(({ theme: { spacing } }) => ({
  position: 'absolute',
  top: spacing(8),
  left: spacing(2),
}));

export default BackButton;
