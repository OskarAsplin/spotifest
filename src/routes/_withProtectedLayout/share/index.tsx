import { createFileRoute, redirect } from '@tanstack/react-router';
import { t } from 'i18next';
import ErrorFallback from '@src/layouts/ErrorFallback';
import { getSharedMatchBasis } from '@src/zustand/sharedResultsStore';
import { getCodeVerifier } from '@src/zustand/authStore';
import { getSpotifyAccessTokenWithCode } from '@src/utils/spotifyAuthUtils';

export const Route = createFileRoute('/_withProtectedLayout/share/')({
  component: () => (
    <ErrorFallback fallbackText={t('error.invalid_share_url')} />
  ),
  validateSearch: (search: Record<string, unknown>): { code?: string } => ({
    code: search.code as string | undefined,
  }),
  beforeLoad: async ({ search: { code } }) => {
    console.log(321);
    const sharedMatchBasis = getSharedMatchBasis();
    const codeVerifier = getCodeVerifier();

    if (!code || !codeVerifier || !sharedMatchBasis) {
      throw Error('Invalid URL');
    }

    await getSpotifyAccessTokenWithCode(code, codeVerifier);
    throw redirect({
      to: '/share/$matchBasis',
      params: { matchBasis: sharedMatchBasis },
    });
  },
});
