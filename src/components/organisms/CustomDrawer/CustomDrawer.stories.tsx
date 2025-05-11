import { Brightness2 } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
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
      { Icon: <InfoIcon />, label: 'About', onClick: action('onClickAbout') },
      {
        Icon: <Brightness2 />,
        label: 'Brightness',
        onClick: action('onClickBrightness'),
      },
    ],
  },
};

export default meta;

export const Primary: Story = {};
