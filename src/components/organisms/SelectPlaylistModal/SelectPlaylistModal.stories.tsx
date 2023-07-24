import type { Meta, StoryObj } from '@storybook/react';
import SelectPlaylistModal from './SelectPlaylistModal';
import {
  playlistMock,
  playlistMock2,
} from '../../molecules/MatchCriteriaSelect/MatchCriteriaSelect.fixtures';
import { artistMock } from '../../molecules/ArtistBubble/ArtistBubble.fixtures';
import { useState } from 'react';

type Story = StoryObj<typeof SelectPlaylistModal>;

const meta: Meta<typeof SelectPlaylistModal> = {
  title: 'Organisms/SelectPlaylistModal',
  component: SelectPlaylistModal,
  parameters: {
    docs: {
      description: {
        component:
          'SelectPlaylistModal is a modal that shows up only on login. It displays the options for setting the match basis',
      },
    },
  },
  args: {
    playlists: [playlistMock, playlistMock2],
    topArtists: Array(14).fill(artistMock),
    userSpotifyUrl: 'abc123',
  },
  argTypes: {
    open: { control: false },
    onMatchBasisChange: { control: false },
    onClickGoButton: { control: false },
  },
};

export default meta;

const Template: Story['render'] = (args) => {
  const [open, setOpen] = useState(false);

  const onClick = () => setOpen(!open);
  const onMatchBasisChange = async () => setOpen(!open);

  return (
    <>
      <button onClick={onClick}>Open modal</button>
      <SelectPlaylistModal
        {...args}
        open={open}
        onMatchBasisChange={onMatchBasisChange}
        onClickGoButton={onClick}
      />
    </>
  );
};

export const Primary: Story = {
  render: Template,
};

export const NoPlaylists: Story = {
  render: Template,
  args: { playlists: [] },
};

export const NoTopArtists: Story = {
  render: Template,
  args: { topArtists: [] },
};

export const NoTopArtistsAndNoPlaylists: Story = {
  render: Template,
  args: { topArtists: [], playlists: [] },
  parameters: {
    docs: {
      description: {
        story:
          'No way to get the modal away in this story other than refreshing the page',
      },
    },
  },
};
