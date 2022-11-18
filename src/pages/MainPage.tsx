import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import FestivalMatchesDisplay from '../containers/FestivalMatchesDisplay';
import { selectLoggedIn } from '../redux/reducers/authorizationSlice';
import { selectIsDbOnline } from '../redux/reducers/displaySlice';
import '../styles/base.scss';
import { StyledRootDiv } from '../layouts/StyledLayoutComponents';
import FestivalMatchSettingsContainerReactQuery from '../containers/FestivalMatchSettingsContainerReactQuery';

const MainPage = () => {
  const isDbOnline = useSelector(selectIsDbOnline);
  const loggedIn = useSelector(selectLoggedIn);

  if (!loggedIn) return <Navigate to="/login" />;

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
          <FestivalMatchSettingsContainerReactQuery />
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
