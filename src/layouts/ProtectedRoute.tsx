import { useNavigate } from '@tanstack/react-router';
import { withFallback } from '../api/api';
import { useAuthStore } from '../zustand/authStore';
import { loginRoute } from '../Routes';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = withFallback<Props>()(({ children }) => {
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) navigate({ to: loginRoute.to });
  }, []);

  if (!loggedIn) return <div />;

  return <>{children}</>;
});

export default ProtectedRoute;
