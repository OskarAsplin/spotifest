import { IconButton, Typography } from '@mui/material';
import {
  InputAdornment,
  TextField,
  Paper,
  Box,
  CircularProgress,
  ClickAwayListener,
} from '@mui/material';
import { lightBlue } from '@mui/material/colors';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import SearchIcon from '@mui/icons-material/Search';
import StandardLink from './StandardLink';
import { getBaseUrl } from '../utils/utils';
import { useSearchDb } from './SearchField.utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
    },
    fixed: {
      position: 'absolute',
      '@media (min-width: 610px)': {
        width: '250px',
      },
      '@media (max-width: 609px)': {
        width: '200px',
      },
      padding: theme.spacing(1, 1, 1, 1),
    },
    fixedAndAligned: {
      position: 'fixed',
      '@media (min-width: 610px)': {
        width: '250px',
      },
      '@media (max-width: 609px)': {
        width: '200px',
      },
      display: 'flex',
      padding: theme.spacing(1, 1, 1, 1),
      alignItems: 'center',
      justifyContent: 'center',
    },
    fixedWidthAbsolute: {
      '@media (min-width: 610px)': {
        width: '250px',
      },
      '@media (max-width: 609px)': {
        position: 'absolute',
        minHeight: '40px',
        width: '200px',
      },
      '@media (min-width: 590px)': {
        '@media (max-width: 609px)': {
          marginRight: '44px',
        },
      },
      '@media (min-width: 440px)': {
        '@media (max-width: 589px)': {
          marginRight: '36px',
        },
      },
      '@media (max-width: 439px)': {
        marginRight: '28px',
      },
    },
    minHeight: {
      minHeight: '40px',
    },
  })
);

interface Props {
  setShowSearchFieldSmallScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchField = ({ setShowSearchFieldSmallScreen }: Props) => {
  const bigScreen = useMediaQuery('(min-width:610px)');

  const classes = useStyles();
  const { inputText, setInputText, searchResults } = useSearchDb();

  const getFestivalUrl = (festivalName: string) => {
    return getBaseUrl() + '/festival/' + encodeURIComponent(festivalName);
  };

  const getArtistUrl = (artistName: string) => {
    return getBaseUrl() + '/artist/' + encodeURIComponent(artistName);
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        setInputText('');
        setShowSearchFieldSmallScreen(false);
      }}
    >
      <div className={classes.flexColumn}>
        {!bigScreen && <div className={classes.minHeight} />}
        <TextField
          size="small"
          autoFocus={bigScreen ? false : true}
          className={classes.fixedWidthAbsolute}
          placeholder="Search"
          value={inputText}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setInputText(event.target.value)
          }
          InputLabelProps={{
            shrink: true,
          }}
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
        <div>
          {searchResults.loading && (
            <Paper elevation={10} className={classes.fixedAndAligned}>
              <CircularProgress />
            </Paper>
          )}
          {searchResults.error && (
            <div>Error: {searchResults.error.message}</div>
          )}
          {searchResults.result && inputText && (
            <Paper elevation={10} className={classes.fixed}>
              <div className={classes.flexColumn}>
                {searchResults.result.festivals.length === 0 &&
                  searchResults.result.artists.length === 0 && (
                    <Typography color="primary" component="div">
                      No results
                    </Typography>
                  )}
                {searchResults.result.festivals.length > 0 && (
                  <Typography
                    component="div"
                    sx={{ mb: 1, color: lightBlue[500] }}
                  >
                    <Box fontWeight="fontWeightBold">Festivals:</Box>
                  </Typography>
                )}
                {searchResults.result.festivals
                  .slice(0, 5)
                  .map((festival: any) => (
                    <StandardLink
                      color={'textSecondary'}
                      key={'searchResult festival: ' + festival.name}
                      href={getFestivalUrl(festival.name)}
                      onClick={() => setInputText('')}
                      sx={{ mb: 1 }}
                      variant="body2"
                    >
                      {festival.name + ': ' + festival.location}
                    </StandardLink>
                  ))}
                {searchResults.result.festivals.length > 5 && (
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    sx={{ mt: -1 }}
                  >
                    ...
                  </Typography>
                )}
                {searchResults.result.festivals.length > 0 &&
                  searchResults.result.artists.length > 0 && (
                    <Box sx={{ mt: 2 }} />
                  )}
                {searchResults.result.artists.length > 0 && (
                  <Typography sx={{ mb: 1 }} color="primary" component="div">
                    <Box fontWeight="fontWeightBold">Artists:</Box>
                  </Typography>
                )}
                {searchResults.result.artists.slice(0, 5).map((artist: any) => (
                  <StandardLink
                    color={'textSecondary'}
                    key={'searchResult artist: ' + artist.name}
                    href={getArtistUrl(artist.name)}
                    onClick={() => setInputText('')}
                    sx={{ mb: 1 }}
                    variant="body2"
                  >
                    {artist.name}
                  </StandardLink>
                ))}
                {searchResults.result.artists.length > 5 && (
                  <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    sx={{ mt: -1 }}
                  >
                    ...
                  </Typography>
                )}
              </div>
            </Paper>
          )}
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default SearchField;
