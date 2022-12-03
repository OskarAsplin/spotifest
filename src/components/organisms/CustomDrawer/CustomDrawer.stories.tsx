import { Brightness2 } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import CustomDrawer from './CustomDrawer';

type Meta = ComponentMeta<typeof CustomDrawer>;
type Story = ComponentStory<typeof CustomDrawer>;

const meta: Meta = {
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

const Template: Story = (args) => <CustomDrawer {...args} />;

export { Template as CustomDrawer };
