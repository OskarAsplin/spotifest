import { Box, Paper, ThemeProvider, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { escapeRegExp } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { SearchResponse } from '@src/api/types';
import { getMainTheme } from '@src/theme/theme.styles';
import { getArtistPath, getFestivalPath } from '@src/utils/routeUtils';
import { MatchHighlighter } from '@src/components/atoms/MatchHighlighter/MatchHighlighter';
import { SEARCH_FIELD_WIDTH_BIG_SCREEN } from '@src/components/molecules/SearchField/SearchField';
import { StandardRouterLink } from '@src/components/atoms/StandardLink/StandardLink';

interface SearchResultsProps {
  searchResults: SearchResponse;
  inputText: string;
  resetSearchFieldState: () => void;
}

export const SearchResults = ({
  searchResults,
  inputText,
  resetSearchFieldState,
}: SearchResultsProps) => {
  const { t } = useTranslation();
  const lightTheme = createTheme(getMainTheme('light'));

  const standardLinkProps = {
    color: 'textSecondary',
    onClick: resetSearchFieldState,
    sx: { mb: 1 },
    variant: 'body2',
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Paper elevation={10} sx={{ ...SEARCH_FIELD_WIDTH_BIG_SCREEN, p: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {searchResults.festivals.length === 0 &&
            searchResults.artists.length === 0 && (
              <Typography color="textDisabled">
                {t('common.no_results')}
              </Typography>
            )}
          {searchResults.festivals.length > 0 && (
            <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
              {t('common.festivals')}:
            </Typography>
          )}
          {searchResults.festivals.slice(0, 5).map((festival) => (
            <StandardRouterLink
              key={'searchResult festival: ' + festival.name}
              to={getFestivalPath(festival.name)}
              {...standardLinkProps}
            >
              <MatchHighlighter
                text={`${festival.name}: ${festival.location}`}
                regex={new RegExp(`(${escapeRegExp(inputText)})`, 'ig')}
              />
            </StandardRouterLink>
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
              {t('common.artists')}:
            </Typography>
          )}
          {searchResults.artists.slice(0, 5).map((artist) => (
            <StandardRouterLink
              key={'searchResult artist: ' + artist.name}
              to={getArtistPath(artist.name, artist.spotifyId)}
              {...standardLinkProps}
            >
              <MatchHighlighter
                text={artist.name}
                regex={new RegExp(`(${escapeRegExp(inputText)})`, 'ig')}
              />
            </StandardRouterLink>
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
      </Paper>
    </ThemeProvider>
  );
};
