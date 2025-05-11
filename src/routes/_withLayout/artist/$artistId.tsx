import { ArtistPage } from '@src/pages/ArtistPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_withLayout/artist/$artistId')({
  component: ArtistPage,
});
