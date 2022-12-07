import { ComponentMeta, ComponentStory } from '@storybook/react';
import SelectPlaylistModal from './SelectPlaylistModal';
import { setStoryDescription } from '../../../utils/storyUtils';
import {
  playlistMock,
  playlistMock2,
} from '../../molecules/MatchCriteriaSelect/MatchCriteriaSelect.fixtures';
import { artistMock } from '../../molecules/ArtistBubble/ArtistBubble.fixtures';
import { useState } from 'react';

type Meta = ComponentMeta<typeof SelectPlaylistModal>;
type Story = ComponentStory<typeof SelectPlaylistModal>;

const meta: Meta = {
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

const Template: Story = (args) => {
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

export { Template as SelectPlaylistModal };
export const SelectPlaylistModalNoPlaylists = Template.bind({});
export const SelectPlaylistModalNoTopArtists = Template.bind({});
export const SelectPlaylistModalNoTopAritstsAndNoPlaylists = Template.bind({});

SelectPlaylistModalNoPlaylists.args = { playlists: [] };
setStoryDescription(SelectPlaylistModalNoPlaylists, 'Without playlists');

SelectPlaylistModalNoTopArtists.args = { topArtists: [] };
setStoryDescription(SelectPlaylistModalNoTopArtists, 'Without topArtists');

SelectPlaylistModalNoTopAritstsAndNoPlaylists.args = {
  playlists: [],
  topArtists: [],
};
setStoryDescription(
  SelectPlaylistModalNoTopAritstsAndNoPlaylists,
  'Without playlists and topArtists. No way to get the modal away in this story other than refreshing the page'
);
