import { useSelector } from 'react-redux';
import {
  selectAccessToken,
  selectLoggedIn,
} from '../redux/reducers/authorizationSlice';
import { spotifyApi } from '../utils/api/spotifyApi';
import { Outlet } from 'react-router-dom';

const WithSpotifyTokenRoute = () => {
  const loggedIn = useSelector(selectLoggedIn);
  const accessToken = useSelector(selectAccessToken);

  if (loggedIn && accessToken) spotifyApi.setAccessToken(accessToken);
  return <Outlet />;
};
export default WithSpotifyTokenRoute;
