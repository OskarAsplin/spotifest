import {
  IconButton,
  TextFieldProps,
  InputAdornment,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import SearchIcon from '@mui/icons-material/Search';

const SearchField = (props: TextFieldProps) => {
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

export const SHARED_SEARCH_FIELD_WIDTH = {
  '@media (min-width: 610px)': { width: '250px' },
  '@media (max-width: 609px)': { width: '200px' },
};

const StyledTextField = styled(TextField)(() => ({
  ...SHARED_SEARCH_FIELD_WIDTH,
  '@media (max-width: 609px)': { position: 'absolute', minHeight: '40px' },
  '@media (min-width: 590px)': {
    '@media (max-width: 609px)': { marginRight: '44px' },
  },
  '@media (min-width: 440px)': {
    '@media (max-width: 589px)': { marginRight: '36px' },
  },
  '@media (max-width: 439px)': { marginRight: '28px' },
}));

export default SearchField;
