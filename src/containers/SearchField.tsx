import {
  IconButton,
  Typography,
  InputAdornment,
  TextField,
  Paper,
  Box,
  ClickAwayListener,
  ThemeProvider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import SearchIcon from '@mui/icons-material/Search';
import StandardLink from '../components/StandardLink';
import { getArtistPath, getFestivalPath } from '../utils/utils';
import { createTheme } from '@mui/material/styles';
import { getMainTheme } from '../theme/theme.styles';
import MatchHighlighter, { escapeRegExp } from '../components/MatchHighlighter';
import { debounce } from 'lodash-es';
import { ChangeEvent, useState } from 'react';
import { getDjangoSearchResults } from '../utils/api/djangoApi';
import { useGet } from '../utils/api/api';

interface Props {
  setShowSearchFieldSmallScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DEBOUNCE_WAIT = 500;

const SearchField = ({ setShowSearchFieldSmallScreen }: Props) => {
  const bigScreen = useMediaQuery('(min-width:610px)');
  const darkTheme = createTheme(getMainTheme('dark'));
  const lightTheme = createTheme(getMainTheme('light'));

  const [inputText, setInputText] = useState('');

  const { data: searchResults } = useGet(getDjangoSearchResults, {
    query: { search: inputText },
    enabled: !!inputText.length,
  });

  const debouncedOnChange = debounce(
    (e: ChangeEvent<HTMLInputElement>) => setInputText(e.target.value),
    DEBOUNCE_WAIT
  );

  const onResultClick = () => {
    setInputText('');
    setShowSearchFieldSmallScreen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <ClickAwayListener
        onClickAway={() => {
          setInputText('');
          setShowSearchFieldSmallScreen(false);
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {!bigScreen && (
            <Box sx={{ minHeight: ({ spacing }) => spacing(5) }} />
          )}
          <StyledTextField
            size="small"
            autoFocus={bigScreen ? false : true}
            placeholder="Search"
            onChange={debouncedOnChange}
            InputLabelProps={{ shrink: true }}
            InputProps={
              bigScreen
                ? {
                    endAdornment: (
                      <InputAdornment position="end" disablePointerEvents>
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                : {}
            }
          />
          <ThemeProvider theme={lightTheme}>
            <div>
              {searchResults && inputText && (
                <StyledAbsolutePaper elevation={10}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {searchResults.festivals.length === 0 &&
                      searchResults.artists.length === 0 && (
                        <Typography color="primary" component="div">
                          No results
                        </Typography>
                      )}
                    {searchResults.festivals.length > 0 && (
                      <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
                        Festivals:
                      </Typography>
                    )}
                    {searchResults.festivals
                      .slice(0, 5)
                      .map((festival: any) => (
                        <StandardLink
                          color={'textSecondary'}
                          key={'searchResult festival: ' + festival.name}
                          to={getFestivalPath(festival.name)}
                          onClick={onResultClick}
                          sx={{ mb: 1 }}
                          variant="body2"
                        >
                          <MatchHighlighter
                            text={festival.name}
                            regex={
                              new RegExp(`(${escapeRegExp(inputText)})`, 'ig')
                            }
                          />
                          {': ' + festival.location}
                        </StandardLink>
                      ))}
                    {searchResults.festivals.length > 5 && (
                      <Typography
                        color="textSecondary"
                        variant="subtitle1"
                        sx={{ mt: -1 }}
                      >
                        ...
                      </Typography>
                    )}
                    {searchResults.festivals.length > 0 &&
                      searchResults.artists.length > 0 && (
                        <Box sx={{ mt: 2 }} />
                      )}
                    {searchResults.artists.length > 0 && (
                      <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
                        Artists:
                      </Typography>
                    )}
                    {searchResults.artists.slice(0, 5).map((artist: any) => (
                      <StandardLink
                        color={'textSecondary'}
                        key={'searchResult artist: ' + artist.name}
                        to={getArtistPath(artist.name, artist.spotifyId)}
                        onClick={onResultClick}
                        sx={{ mb: 1 }}
                        variant="body2"
                      >
                        <MatchHighlighter
                          text={artist.name}
                          regex={
                            new RegExp(`(${escapeRegExp(inputText)})`, 'ig')
                          }
                        />
                      </StandardLink>
                    ))}
                    {searchResults.artists.length > 5 && (
                      <Typography
                        color="textSecondary"
                        variant="subtitle1"
                        sx={{ mt: -1 }}
                      >
                        ...
                      </Typography>
                    )}
                  </Box>
                </StyledAbsolutePaper>
              )}
            </div>
          </ThemeProvider>
        </Box>
      </ClickAwayListener>
    </ThemeProvider>
  );
};

const StyledAbsolutePaper = styled(Paper)(({ theme: { spacing } }) => ({
  position: 'absolute',
  padding: spacing(1),
  '@media (min-width: 610px)': { width: '250px' },
  '@media (max-width: 609px)': { width: '200px' },
}));

const StyledTextField = styled(TextField)(() => ({
  '@media (min-width: 610px)': { width: '250px' },
  '@media (max-width: 609px)': {
    position: 'absolute',
    minHeight: '40px',
    width: '200px',
  },
  '@media (min-width: 590px)': {
    '@media (max-width: 609px)': { marginRight: '44px' },
  },
  '@media (min-width: 440px)': {
    '@media (max-width: 589px)': { marginRight: '36px' },
  },
  '@media (max-width: 439px)': { marginRight: '28px' },
}));

export default SearchField;
