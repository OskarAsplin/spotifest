import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, IconButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ExpandButtonProps extends IconButtonProps {
  expanded?: boolean;
}

const ExpandButton = (props: ExpandButtonProps) => (
  <StyledIconButton {...props}>
    <ExpandMoreIcon />
  </StyledIconButton>
);

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded?: boolean }>(({ theme: { transitions }, expanded }) => ({
  transition: transitions.create('transform', {
    duration: transitions.duration.shortest,
  }),
  transform: expanded ? 'rotate(180deg)' : undefined,
}));

export default ExpandButton;
