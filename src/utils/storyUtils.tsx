import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { StoryContext, StoryFn } from '@storybook/react-vite';

export const withRouter = (Story: StoryFn, { parameters }: StoryContext) => {
  const {
    initialEntries = ['/'],
    initialIndex,
    routes = ['/'],
  } = parameters?.router || {};

  const rootRoute = createRootRoute();

  const children = routes.map((path: string) =>
    createRoute({
      path,
      getParentRoute: () => rootRoute,
      // @ts-ignore
      component: Story,
    }),
  );

  rootRoute.addChildren(children);

  const router = createRouter({
    history: createMemoryHistory({ initialEntries, initialIndex }),
    routeTree: rootRoute,
  });

  return <RouterProvider router={router} />;
};

declare module '@storybook/react-vite' {
  interface Parameters {
    router?: {
      initialEntries?: string[];
      initialIndex?: number;
      routes?: string[];
    };
  }
}
