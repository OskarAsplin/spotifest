import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import BackButton from './BackButton';

type Meta = ComponentMeta<typeof BackButton>;
type Story = ComponentStory<typeof BackButton>;

const meta: Meta = {
  title: 'Atoms/Buttons/BackButton',
  component: BackButton,
  parameters: {
    docs: {
      description: {
        component: 'BackButton used for returning to previous page',
      },
    },
  },
  args: {
    onClick: action('onClick'),
  },
};

export default meta;

const Template: Story = (args) => <BackButton {...args} />;

export { Template as BackButton };
