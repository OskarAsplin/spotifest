import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import FestivalMatchesDisplay from '../containers/FestivalMatchesDisplay';
import FestivalMatchSettingsBar from '../containers/FestivalMatchSettingsBar';
import { getAuthorizeHref } from '../oauthConfig';
import { initializeSite } from '../redux/asyncActions';
import {
  selectLoggedIn,
  selectAccessToken,
  selectTokenExpiryDate,
  setAccessToken,
  setTokenExpiryDate,
  setLoggedOff,
} from '../redux/reducers/authorizationSlice';
import {
  selectIsDbOnline,
  selectSiteInitialized,
} from '../redux/reducers/displaySlice';
import '../styles/base.scss';
import { getHashParams, removeHashParamsFromUrl } from '../utils/hashUtils';
import { StyledRootDiv } from '../layouts/StyledLayoutComponents';
import { spotifyApi } from '../utils/api/spotifyApi';

const hashParams = getHashParams();
const token = hashParams.access_token;
const expires_in = hashParams.expires_in;
removeHashParamsFromUrl();

const MainPage = () => {
  const isDbOnline: boolean = useSelector(selectIsDbOnline);
  const siteInitialized: boolean = useSelector(selectSiteInitialized);
  const loggedIn: boolean = useSelector(selectLoggedIn);
  const accessToken: string = useSelector(selectAccessToken);
  const tokenExpiryDate: string = useSelector(selectTokenExpiryDate);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(setAccessToken(token));
      spotifyApi.setAccessToken(token);

      if (!siteInitialized) dispatch(initializeSite(token));
      if (expires_in) dispatch(setTokenExpiryDate(+expires_in));
    } else if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      if (!siteInitialized) dispatch(initializeSite(token));

      if (tokenExpiryDate !== '') {
        const unixTimeNow = new Date().getTime();
        const tenMinMilliseconds = 600000;
        const oneDayMilliseconds = 86400000;
        const unixTimeExpiry = Date.parse(tokenExpiryDate);
        if (unixTimeNow > unixTimeExpiry + oneDayMilliseconds) {
          dispatch(setLoggedOff());
        } else if (unixTimeNow > unixTimeExpiry - tenMinMilliseconds) {
          dispatch(setAccessToken(''));
          window.open(getAuthorizeHref(), '_self');
        }
      }
    } else {
      dispatch(setLoggedOff());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loggedIn || (!token && !accessToken && !tokenExpiryDate)) {
    return <Navigate to="/login" />;
  }
  return (
    <StyledRootDiv>
      <Box
        sx={{
          width: '100%',
          '@media (min-width: 800px)': { py: 2 },
          '@media (max-width: 799px)': { py: 1 },
        }}
      />
      {isDbOnline ? (
        <>
          <FestivalMatchSettingsBar />
          <FestivalMatchesDisplay />
        </>
      ) : (
        <Typography variant="subtitle1">
          There seems to be some issue with connecting to our database. Try
          refreshing the page.
        </Typography>
      )}
    </StyledRootDiv>
  );
};

export default MainPage;
