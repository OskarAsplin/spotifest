import { fetchToJson, getApiBaseUrl } from '../utils/restUtils';
import { SearchResponse } from '../redux/types';
import { useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useAsync } from 'react-async-hook';
import useConstant from 'use-constant';

export const emptySearchResponse: SearchResponse = {
  festivals: [],
  artists: [],
};

// Generic reusable hook
const useDebouncedSearch = (searchFunction: any) => {
  // Handle the input text state
  const [inputText, setInputText] = useState('');

  // Debounce the original search async function
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 700)
  );

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  const searchResults = useAsync(async () => {
    if (inputText.length === 0) {
      return emptySearchResponse;
    } else {
      return debouncedSearchFunction(inputText);
    }
  }, [debouncedSearchFunction, inputText]);

  // Return everything needed for the hook consumer
  return {
    inputText,
    setInputText,
    searchResults,
  };
};

export const useSearchDb = () =>
  useDebouncedSearch((text: any) => searchDatabase(text));

export const searchDatabase = (searchString: string) => {
  return fetchToJson(getApiBaseUrl() + '/onTour/search/?q=' + searchString)
    .then((response: any) => {
      const searchResponse = response as SearchResponse;
      return searchResponse;
    })
    .catch((error) => {
      console.log(error);
      return emptySearchResponse;
    });
};
