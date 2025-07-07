import { Moon, Info } from 'lucide-react';
import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CustomDrawer } from './CustomDrawer';

type Story = StoryObj<typeof CustomDrawer>;

const meta: Meta<typeof CustomDrawer> = {
  title: 'Organisms/CustomDrawer',
  component: CustomDrawer,
  parameters: {
    docs: {
      description: {
        component: 'CustomDrawer displays a drawer with a list of items',
      },
    },
    viewMode: 'canvas',
  },
  args: {
    open: true,
    items: [
      { Icon: <Info className="h-5 w-5" />, label: 'About', onClick: action('onClickAbout') },
      {
        Icon: <Moon className="h-5 w-5" />,
        label: 'Brightness',
        onClick: action('onClickBrightness'),
      },
    ],
  },
};

export default meta;

export const Primary: Story = {};
