import SearchIcon from '@mui/icons-material/Search';
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
  useMediaQuery,
} from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

export const SearchField = (props: TextFieldProps) => {
  const bigScreen = useMediaQuery('(min-width:610px)');

  return (
    <StyledTextField
      {...props}
      size="small"
      autoFocus={bigScreen ? false : true}
      placeholder="Search"
      InputLabelProps={{ shrink: true }}
      InputProps={bigScreen ? { endAdornment: <EndAdornment /> } : {}}
    />
  );
};

const EndAdornment = () => (
  <InputAdornment position="end" disablePointerEvents>
    <IconButton>
      <SearchIcon />
    </IconButton>
  </InputAdornment>
);

export const SEARCH_FIELD_WIDTH_BIG_SCREEN = {
  '@media (min-width: 610px)': { width: '250px' },
};

const StyledTextField = styled(TextField)(({ theme: { palette } }) => ({
  ...SEARCH_FIELD_WIDTH_BIG_SCREEN,
  '@media (max-width: 609px)': {
    backgroundColor: palette.mode === 'dark' ? blueGrey[900] : blueGrey[500],
  },
}));
