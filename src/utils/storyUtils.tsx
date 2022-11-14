import { Story } from '@storybook/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setStoryDescription = (story: Story<any>, description: string) => {
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
