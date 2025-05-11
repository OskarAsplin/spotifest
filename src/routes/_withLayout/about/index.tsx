import AboutPage from '@src/pages/AboutPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_withLayout/about/')({
  component: AboutPage,
});
