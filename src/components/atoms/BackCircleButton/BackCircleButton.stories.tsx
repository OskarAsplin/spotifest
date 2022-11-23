import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import BackCircleButton from './BackCircleButton';

type Meta = ComponentMeta<typeof BackCircleButton>;
type Story = ComponentStory<typeof BackCircleButton>;

const meta: Meta = {
  title: 'Atoms/Buttons/BackCircleButton',
  component: BackCircleButton,
  parameters: {
    docs: {
      description: {
        component: 'BackCircleButton used for returning to previous page',
      },
    },
  },
  args: {
    onClick: action('onClick'),
  },
};

export default meta;

const Template: Story = (args) => <BackCircleButton {...args} />;

export { Template as BackCircleButton };
