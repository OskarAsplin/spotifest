import { Button, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledCenteredRowDiv } from '@src/layouts/StyledLayoutComponents';

interface CustomSwitchProps {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  leftOptionText: string;
  rightOptionText: string;
}

const CustomSwitch = ({
  checked,
  setChecked,
  leftOptionText,
  rightOptionText,
}: CustomSwitchProps) => {
  return (
    <StyledCenteredRowDiv>
      {/* The invisible button is a quick fix for click event propagation from the grid item */}
      <Button hidden sx={{ display: 'none' }}>
        .
      </Button>
      <StyledButton
        disableRipple
        disableElevation
        color={!checked ? 'primary' : 'inherit'}
        onClick={() => setChecked(false)}
      >
        {leftOptionText}
      </StyledButton>
      <Switch
        checked={checked}
        color="default"
        onChange={(_, newValue) => setChecked(newValue)}
        name="CustomSwitch"
      />
      <StyledButton
        disableRipple
        disableElevation
        color={checked ? 'primary' : 'inherit'}
        onClick={() => setChecked(true)}
      >
        {rightOptionText}
      </StyledButton>
    </StyledCenteredRowDiv>
  );
};

const StyledButton = styled(Button)(() => ({
  textTransform: 'none',
  padding: 0,
  fontSize: '18px',
  '&:hover': { backgroundColor: 'transparent' },
}));

export default CustomSwitch;
