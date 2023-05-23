import { Box, ClickAwayListener, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { debounce } from 'lodash-es';
import { ChangeEvent, useState } from 'react';
import { useApiQuery } from '../api/api';
import { getDjangoSearchResults } from '../api/djangoApi';
import SearchField from '../components/molecules/SearchField/SearchField';
import SearchResults from '../components/organisms/SearchResults/SearchResults';
import { getMainTheme } from '../theme/theme.styles';

export interface SearchFieldContainerProps {
  hideSearchFieldSmallScreen?: () => void;
}

const DEBOUNCE_WAIT = 500;

const SearchFieldContainer = ({
  hideSearchFieldSmallScreen,
}: SearchFieldContainerProps) => {
  const darkTheme = createTheme(getMainTheme('dark'));

  const [inputText, setInputText] = useState('');

  const { data: searchResults } = useApiQuery(getDjangoSearchResults, {
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
          <SearchField onChange={debouncedOnChange} />
          {searchResults && inputText && (
            <div>
              <Box sx={{ position: 'absolute' }}>
                <SearchResults
                  searchResults={searchResults}
                  inputText={inputText}
                  resetSearchFieldState={resetSearchFieldState}
                />
              </Box>
            </div>
          )}
        </Box>
      </ClickAwayListener>
    </ThemeProvider>
  );
};

export default SearchFieldContainer;
