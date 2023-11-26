import { useNavigate } from '@tanstack/react-router';
import { withFallback } from '../api/api';
import { useIsLoggedIn } from '../zustand/authStore';
import { loginRoute } from '../Routes';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = withFallback<Props>()(({ children }) => {
  const loggedIn = useIsLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) navigate({ to: loginRoute.to });
  }, [loggedIn]);

  if (!loggedIn) return <div />;

  return <>{children}</>;
});

export default ProtectedRoute;
