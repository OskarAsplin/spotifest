import { Box, ClickAwayListener, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { debounce } from 'lodash-es';
import { ChangeEvent, startTransition, useState } from 'react';
import { useApiSuspenseQuery, withFallback } from '@src/api/api';
import { getDjangoSearchResults } from '@src/api/djangoApi';
import { SearchField } from '@src/components/molecules/SearchField/SearchField';
import { SearchResults } from '@src/components/organisms/SearchResults/SearchResults';
import { getMainTheme } from '@src/theme/theme.styles';
import { ErrorFallback } from '@src/layouts/ErrorFallback';

export interface SearchFieldContainerProps {
  hideSearchFieldSmallScreen?: () => void;
}

const DEBOUNCE_WAIT = 500;

export const SearchFieldContainer = ({
  hideSearchFieldSmallScreen,
}: SearchFieldContainerProps) => {
  const darkTheme = createTheme(getMainTheme('dark'));

  const [inputText, setInputText] = useState('');

  const debouncedOnChange = debounce(
    (e: ChangeEvent<HTMLInputElement>) =>
      startTransition(() => setInputText(e.target.value)),
    DEBOUNCE_WAIT,
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
          {inputText && (
            <SearchResultsContainer
              inputText={inputText}
              resetSearchFieldState={resetSearchFieldState}
            />
          )}
        </Box>
      </ClickAwayListener>
    </ThemeProvider>
  );
};

interface SearchResultsContainerProps {
  inputText: string;
  resetSearchFieldState: () => void;
}

const SearchResultsContainer = withFallback<SearchResultsContainerProps>(
  () => null,
  ErrorFallback,
)(({ inputText, resetSearchFieldState }) => {
  const { data: searchResults } = useApiSuspenseQuery(getDjangoSearchResults, {
    params: { search: inputText },
  });

  return (
    <div>
      <Box sx={{ position: 'absolute', width: '100%' }}>
        <SearchResults
          searchResults={searchResults}
          inputText={inputText}
          resetSearchFieldState={resetSearchFieldState}
        />
      </Box>
    </div>
  );
});
