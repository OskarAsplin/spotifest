import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AppBarProfilePopover from './AppBarProfilePopover';
import { useState } from 'react';

type Meta = ComponentMeta<typeof AppBarProfilePopover>;
type Story = ComponentStory<typeof AppBarProfilePopover>;

const meta: Meta = {
  title: 'Other/AppBarProfilePopover',
  component: AppBarProfilePopover,
  parameters: {
    docs: {
      description: {
        component:
          'AppBarProfilePopover displays a drawer with a list of items',
      },
    },
  },
  args: {
    userName: 'Mr Boombastic',
    spotifyUrl: 'https://spotify.com',
    loggedIn: true,
    onClickLogout: action('onClickLogout'),
  },
  argTypes: {
    id: { control: false },
    anchorEl: { control: false },
    setAnchorEl: { control: false },
    onClickLogout: { control: false },
  },
};

export default meta;

const Template: Story = (args) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? 'simple-popover' : undefined;

  return (
    <>
      <button onClick={handleClick}>Click me</button>
      <AppBarProfilePopover
        {...args}
        id={popoverId}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </>
  );
};

export { Template as AppBarProfilePopover };
