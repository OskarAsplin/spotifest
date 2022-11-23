import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ProfilePopover from './ProfilePopover';
import { useState } from 'react';

type Meta = ComponentMeta<typeof ProfilePopover>;
type Story = ComponentStory<typeof ProfilePopover>;

const meta: Meta = {
  title: 'Organisms/ProfilePopover',
  component: ProfilePopover,
  parameters: {
    docs: {
      description: {
        component: 'ProfilePopover displays a drawer with a list of items',
      },
    },
  },
  args: {
    userName: 'Mr Boombastic',
    spotifyUrl: 'https://spotify.com',
    onClickLogout: action('onClickLogout'),
  },
  argTypes: {
    onClickLogout: { control: false },
  },
};

export default meta;

const Template: Story = (args) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? 'simple-popover' : undefined;

  return (
    <>
      <button onClick={handleClick}>Open Popover</button>
      <ProfilePopover
        {...args}
        id={popoverId}
        anchorEl={anchorEl}
        open={popoverOpen}
        onClose={() => setAnchorEl(null)}
      />
    </>
  );
};

export { Template as ProfilePopover };
