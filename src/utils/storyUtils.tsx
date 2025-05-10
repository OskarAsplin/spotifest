import type { StoryFn } from '@storybook/react';
import {
  RootRoute,
  Route,
  Router,
  RouterProvider,
} from '@tanstack/react-router';

export const withRouter = (Story: StoryFn) => {
  const rootRoute = new RootRoute();
  const catchAllRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '*',
    // @ts-ignore
    component: () => <Story />,
  });
  const router = new Router({
    routeTree: rootRoute.addChildren([catchAllRoute]),
  });

  return <RouterProvider router={router as any} />;
};
