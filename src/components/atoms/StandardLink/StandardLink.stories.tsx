import { ComponentStory, ComponentMeta } from '@storybook/react';
import StandardLink from './StandardLink';
import { setStoryDescription } from '../../../utils/storyUtils';

type Meta = ComponentMeta<typeof StandardLink>;
type Story = ComponentStory<typeof StandardLink>;

const meta: Meta = {
  title: 'Atoms/StandardLink',
  component: StandardLink,
  parameters: {
    docs: {
      description: {
        component:
          'StandardLink which renders as a RouteLink when `to` is given and as a normal link otherwise',
      },
    },
  },
  args: {
    children: 'Link text',
  },
};

export default meta;

const Template: Story = (args) => <StandardLink {...args} />;

export { Template as StandardLink };
