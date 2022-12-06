import { ComponentMeta, ComponentStory } from '@storybook/react';
import MatchCriteriaSelect from './MatchCriteriaSelect';
import { artistMock } from '../../molecules/ArtistBubble/ArtistBubble.fixtures';
import { setStoryDescription } from '../../../utils/storyUtils';
import {
  playlistMock,
  playlistMock2,
} from '../../molecules/MatchCriteriaSelect/MatchCriteriaSelect.fixtures';

type Meta = ComponentMeta<typeof MatchCriteriaSelect>;
type Story = ComponentStory<typeof MatchCriteriaSelect>;

const meta: Meta = {
  title: 'Molecules/MatchCriteriaSelect',
  component: MatchCriteriaSelect,
  parameters: {
    docs: {
      description: {
        component:
          'MatchCriteriaSelect displays the top artists and playlists as options',
      },
    },
  },
  args: {
    playlists: [playlistMock, playlistMock2],
    topArtists: Array(14).fill(artistMock),
  },
};

export default meta;

const Template: Story = (args) => <MatchCriteriaSelect {...args} />;

export { Template as MatchCriteriaSelect };
export const MatchCriteriaSelectNoTopArtists = Template.bind({});
export const MatchCriteriaSelectNoPlaylists = Template.bind({});

MatchCriteriaSelectNoTopArtists.args = { topArtists: [] };
setStoryDescription(MatchCriteriaSelectNoTopArtists, 'Without topArtists');

MatchCriteriaSelectNoPlaylists.args = { playlists: [] };
setStoryDescription(MatchCriteriaSelectNoPlaylists, 'Without playlists');
