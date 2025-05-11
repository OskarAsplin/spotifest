import { createFileRoute } from '@tanstack/react-router';
import { StandardLayout } from '@src/layouts/StandardLayout';

export const Route = createFileRoute('/_withLayout')({
  component: StandardLayout,
});
