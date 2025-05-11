import { StandardLayout } from '@src/layouts/StandardLayout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_withProtectedLayout')({
  component: () => <StandardLayout hideIfNotLoggedIn />,
});
