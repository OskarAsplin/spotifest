import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBackOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const BackCircleButton = () => {
  const navigate = useNavigate();

  const onClick = () => {
    window.history.back();
    setTimeout(() => navigate('/'), 10);
  };

  return (
    <StyledTopLeftDiv>
      <IconButton onClick={onClick}>
        <ArrowBackOutlined fontSize="large" />
      </IconButton>
    </StyledTopLeftDiv>
  );
};

const StyledTopLeftDiv = styled('div')(({ theme: { spacing } }) => ({
  position: 'absolute',
  top: spacing(8),
  left: spacing(2),
}));

export default BackCircleButton;
