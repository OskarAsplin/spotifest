import { Box, ClickAwayListener, ThemeProvider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { createTheme } from '@mui/material/styles';
import { getMainTheme } from '../theme/theme.styles';
import { debounce } from 'lodash-es';
import { ChangeEvent, useState } from 'react';
import { getDjangoSearchResults } from '../utils/api/djangoApi';
import { useGet } from '../utils/api/api';
import SearchResults from '../components/organisms/SearchResults/SearchResults';
import SearchField from '../components/molecules/SearchField/SearchField';

export interface SearchFieldContainerProps {
  hideSearchFieldSmallScreen?: () => void;
}

const DEBOUNCE_WAIT = 500;

const SearchFieldContainer = ({
  hideSearchFieldSmallScreen,
}: SearchFieldContainerProps) => {
  const bigScreen = useMediaQuery('(min-width:610px)');
  const darkTheme = createTheme(getMainTheme('dark'));

  const [inputText, setInputText] = useState('');

  const { data: searchResults } = useGet(getDjangoSearchResults, {
    query: { search: inputText },
    enabled: !!inputText.length,
    suspense: false,
    keepPreviousData: true,
  });

  const debouncedOnChange = debounce(
    (e: ChangeEvent<HTMLInputElement>) => setInputText(e.target.value),
    DEBOUNCE_WAIT
  );

  const resetSearchFieldState = () => {
    setInputText('');
    hideSearchFieldSmallScreen?.();
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <ClickAwayListener onClickAway={resetSearchFieldState}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {!bigScreen && (
            <Box sx={{ minHeight: ({ spacing }) => spacing(5) }} />
          )}
          <SearchField onChange={debouncedOnChange} />
          {searchResults && inputText && (
            <SearchResults
              searchResults={searchResults}
              inputText={inputText}
              resetSearchFieldState={resetSearchFieldState}
            />
          )}
        </Box>
      </ClickAwayListener>
    </ThemeProvider>
  );
};

export default SearchFieldContainer;
