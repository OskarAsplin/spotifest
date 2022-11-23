import { Typography, Paper, Box, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';
import StandardLink, {
  StandardLinkProps,
} from '../../atoms/StandardLink/StandardLink';
import { createTheme } from '@mui/material/styles';
import MatchHighlighter from '../../atoms/MatchHighlighter/MatchHighlighter';
import { escapeRegExp } from 'lodash-es';
import { SearchResponse } from '../../../redux/types';
import { getMainTheme } from '../../../theme/theme.styles';
import { getArtistPath, getFestivalPath } from '../../../utils/utils';
import { SHARED_SEARCH_FIELD_WIDTH_BIG_SCREEN } from '../../molecules/SearchField/SearchField';

export interface SearchResultsProps {
  searchResults: SearchResponse;
  inputText: string;
  resetSearchFieldState: () => void;
}

const SearchResults = ({
  searchResults,
  inputText,
  resetSearchFieldState,
}: SearchResultsProps) => {
  const lightTheme = createTheme(getMainTheme('light'));

  const standardLinkProps: StandardLinkProps = {
    color: 'textSecondary',
    onClick: resetSearchFieldState,
    sx: { mb: 1 },
    variant: 'body2',
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <div>
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
            {searchResults.festivals.slice(0, 5).map((festival) => (
              <StandardLink
                key={'searchResult festival: ' + festival.name}
                to={getFestivalPath(festival.name)}
                {...standardLinkProps}
              >
                <MatchHighlighter
                  text={festival.name}
                  regex={new RegExp(`(${escapeRegExp(inputText)})`, 'ig')}
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
              searchResults.artists.length > 0 && <Box sx={{ mt: 2 }} />}
            {searchResults.artists.length > 0 && (
              <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
                Artists:
              </Typography>
            )}
            {searchResults.artists.slice(0, 5).map((artist) => (
              <StandardLink
                key={'searchResult artist: ' + artist.name}
                to={getArtistPath(artist.name, artist.spotifyId)}
                {...standardLinkProps}
              >
                <MatchHighlighter
                  text={artist.name}
                  regex={new RegExp(`(${escapeRegExp(inputText)})`, 'ig')}
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
      </div>
    </ThemeProvider>
  );
};

const StyledAbsolutePaper = styled(Paper)(({ theme: { spacing } }) => ({
  ...SHARED_SEARCH_FIELD_WIDTH_BIG_SCREEN,
  position: 'absolute',
  padding: spacing(1),
}));

export default SearchResults;
