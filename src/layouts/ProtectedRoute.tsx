import { Navigate } from '@tanstack/react-router';
import { loginRoute } from '../Routes';
import { withFallback } from '../api/api';
import { useIsLoggedIn } from '../zustand/authStore';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = withFallback<Props>()(({ children }) => {
  const loggedIn = useIsLoggedIn();

  if (!loggedIn) return <Navigate to={loginRoute.to} />;

  return <>{children}</>;
});

export default ProtectedRoute;
