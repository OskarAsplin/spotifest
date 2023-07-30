import { Navigate } from '@tanstack/router';
import { withFallback } from '../api/api';
import { useAuthStore } from '../zustand/authStore';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = withFallback<Props>()(({ children }) => {
  const loggedIn = useAuthStore((state) => state.loggedIn);

  if (!loggedIn) return <Navigate to="/login" />;

  return <>{children}</>;
});

export default ProtectedRoute;
