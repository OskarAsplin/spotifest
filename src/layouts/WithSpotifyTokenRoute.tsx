import { useSelector } from 'react-redux';
import {
  selectAccessToken,
  selectLoggedIn,
} from '../redux/reducers/authorizationSlice';
import { setSpotifyToken } from '../utils/api/spotifyApi';
import { Outlet } from 'react-router-dom';

const WithSpotifyTokenRoute = () => {
  const loggedIn = useSelector(selectLoggedIn);
  const accessToken = useSelector(selectAccessToken);

  if (loggedIn && accessToken) setSpotifyToken(accessToken);
  return <Outlet />;
};
export default WithSpotifyTokenRoute;
