import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AppBarMenuDrawer from './AppBarMenuDrawer';
import { Brightness2 } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';

type Meta = ComponentMeta<typeof AppBarMenuDrawer>;
type Story = ComponentStory<typeof AppBarMenuDrawer>;

const meta: Meta = {
  title: 'Other/AppBarMenuDrawer',
  component: AppBarMenuDrawer,
  parameters: {
    docs: {
      description: {
        component: 'AppBarMenuDrawer displays a drawer with a list of items',
      },
    },
    viewMode: 'canvas',
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
  },
  args: {
    open: true,
    onClose: action('onClose'),
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

const Template: Story = (args) => <AppBarMenuDrawer {...args} />;

export { Template as AppBarMenuDrawer };
