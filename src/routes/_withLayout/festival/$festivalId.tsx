import FestivalPage from '@src/pages/FestivalPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_withLayout/festival/$festivalId')({
  component: FestivalPage,
});
