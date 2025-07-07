import { useRef, useEffect } from 'react';
import { debounce } from 'lodash-es';
import { ChangeEvent, startTransition, useState } from 'react';
import { useApiSuspenseQuery, withFallback } from '@src/api/api';
import { getDjangoSearchResults } from '@src/api/djangoApi';
import { SearchResults } from '@src/components/organisms/SearchResults/SearchResults';
import { ErrorFallback } from '@src/layouts/ErrorFallback';
import { Input } from '@src/components/ui/input';

export interface SearchFieldContainerProps {
  hideSearchFieldSmallScreen?: () => void;
  autoFocus?: boolean;
}

const DEBOUNCE_WAIT = 500;

export const SearchFieldContainer = ({
  hideSearchFieldSmallScreen,
  autoFocus,
}: SearchFieldContainerProps) => {
  const [inputText, setInputText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedOnChange = debounce(
    (e: ChangeEvent<HTMLInputElement>) =>
      startTransition(() => setInputText(e.target.value)),
    DEBOUNCE_WAIT,
  );

  const resetSearchFieldState = () => {
    setInputText('');
    hideSearchFieldSmallScreen?.();
  };

  useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        resetSearchFieldState();
      }
    };

    document.addEventListener('mousedown', handleClickAway);
    return () => document.removeEventListener('mousedown', handleClickAway);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col">
      <Input
        onChange={debouncedOnChange}
        placeholder="Search"
        autoFocus={autoFocus}
      />
      {inputText && (
        <SearchResultsContainer
          inputText={inputText}
          resetSearchFieldState={resetSearchFieldState}
        />
      )}
    </div>
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
      <div className="absolute w-full">
        <SearchResults
          searchResults={searchResults}
          inputText={inputText}
          resetSearchFieldState={resetSearchFieldState}
        />
      </div>
    </div>
  );
});
