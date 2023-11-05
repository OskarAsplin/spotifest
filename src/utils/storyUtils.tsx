import type { StoryFn } from '@storybook/react';
import { RootRoute, Router, RouterProvider } from '@tanstack/react-router';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setStoryDescription = (story: any, description: string) => {
  story.parameters = {
    ...story.parameters,
    docs: {
      ...story.parameters?.docs,
      description: {
        ...story.parameters?.docs?.description,
        story: description,
      },
    },
  };
};

export const withRouter = (Story: StoryFn) => {
  const rootRoute = new RootRoute({ component: () => <Story /> });
  const router = new Router({ routeTree: rootRoute });

  return <RouterProvider router={router} />;
};
