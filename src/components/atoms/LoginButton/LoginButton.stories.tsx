import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import LoginButton from './LoginButton';

type Meta = ComponentMeta<typeof LoginButton>;
type Story = ComponentStory<typeof LoginButton>;

const meta: Meta = {
  title: 'Buttons/LoginButton',
  component: LoginButton,
  parameters: {
    docs: {
      description: {
        component:
          'LoginButton used on LoginPage. Adjust screen size to see the mobile/desktop version of the button',
      },
    },
    backgrounds: {
      default: 'light',
    },
  },
  args: {
    onClick: action('onClick'),
  },
};

export default meta;

const Template: Story = (args) => <LoginButton {...args} />;

export { Template as LoginButton };
