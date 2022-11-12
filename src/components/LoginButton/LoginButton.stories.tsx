import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import LoginButton from './LoginButton';

type Meta = ComponentMeta<typeof LoginButton>;
type Story = ComponentStory<typeof LoginButton>;

const meta: Meta = {
  title: 'Buttons/LoginButton',
  component: LoginButton,
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
  args: {
    onClick: () => action('onClick'),
  },
};

export default meta;

const Template: Story = (args) => (
  <div>
    <LoginButton {...args} />
  </div>
);

export { Template as LoginButton };
