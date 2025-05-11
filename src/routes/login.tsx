import { LoginPage } from '@src/pages/LoginPage';
import { createFileRoute } from '@tanstack/react-router';
import { resetAuthStore } from '@src/zustand/authStore';
import { resetMathingStore } from '@src/zustand/matchingStore';

export const Route = createFileRoute('/login')({
  component: LoginPage,
  beforeLoad: () => {
    resetAuthStore();
    resetMathingStore();
  },
});
