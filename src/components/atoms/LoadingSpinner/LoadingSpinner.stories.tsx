import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';

type Meta = ComponentMeta<typeof LoadingSpinner>;
type Story = ComponentStory<typeof LoadingSpinner>;

const meta: Meta = {
  title: 'Other/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    docs: {
      description: {
        component: 'LoadingSpinner to indicate loading state',
      },
    },
  },
};

export default meta;

const Template: Story = (args) => <LoadingSpinner {...args} />;

export { Template as LoadingSpinner };
