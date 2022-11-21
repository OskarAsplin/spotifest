import { IconButton } from '@mui/material';
import { ArrowBackOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface BackCircleButtonProps {
  onClick: () => void;
}

const BackCircleButton = ({ onClick }: BackCircleButtonProps) => (
  <StyledTopLeftDiv>
    <IconButton onClick={onClick}>
      <ArrowBackOutlined fontSize="large" />
    </IconButton>
  </StyledTopLeftDiv>
);

const StyledTopLeftDiv = styled('div')(({ theme: { spacing } }) => ({
  position: 'absolute',
  top: spacing(8),
  left: spacing(2),
}));

export default BackCircleButton;
