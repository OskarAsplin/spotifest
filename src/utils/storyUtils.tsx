import type { StoryFn } from '@storybook/react';
import { RootRoute, Router, RouterProvider } from '@tanstack/react-router';

export const withRouter = (Story: StoryFn) => {
  const rootRoute = new RootRoute({ component: () => <Story /> });
  const router = new Router({ routeTree: rootRoute });

  return <RouterProvider router={router} />;
};
