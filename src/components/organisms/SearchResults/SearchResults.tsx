import { escapeRegExp } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { SearchResponse } from '@src/api/types';
import { getArtistPath, getFestivalPath } from '@src/utils/routeUtils';
import { MatchHighlighter } from '@src/components/atoms/MatchHighlighter/MatchHighlighter';
import { StandardRouterLink } from '@src/components/atoms/StandardLink/StandardLink';
import { Card, CardContent } from '@src/components/ui/card';
import { cn } from '@src/lib/utils';

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

  const standardLinkProps = {
    onClick: resetSearchFieldState,
    className: 'mb-2 text-sm text-muted-foreground',
  };

  return (
    <Card className={cn('p-2 shadow-lg min-[610px]:w-[200px]')}>
      <CardContent className="p-0">
        <div className="flex flex-col space-y-1">
          {searchResults.festivals.length === 0 &&
            searchResults.artists.length === 0 && (
              <p className="text-muted-foreground text-sm">
                {t('common.no_results')}
              </p>
            )}
          {searchResults.festivals.length > 0 && (
            <h3 className="mb-1 text-sm font-semibold">
              {t('common.festivals')}:
            </h3>
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
            <p className="text-muted-foreground -mt-1 text-sm">...</p>
          )}
          {searchResults.festivals.length > 0 &&
            searchResults.artists.length > 0 && <div className="mt-2" />}
          {searchResults.artists.length > 0 && (
            <h3 className="mb-1 text-sm font-semibold">
              {t('common.artists')}:
            </h3>
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
            <p className="text-muted-foreground -mt-1 text-sm">...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
