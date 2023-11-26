import { useNavigate } from '@tanstack/react-router';
import { withFallback } from '../api/api';
import { useAuthStore } from '../zustand/authStore';
import { loginRoute } from '../Routes';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = withFallback<Props>()(({ children }) => {
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const navigate = useNavigate();

  if (!loggedIn) return navigate({ to: loginRoute.to });

  return <>{children}</>;
});

export default ProtectedRoute;
