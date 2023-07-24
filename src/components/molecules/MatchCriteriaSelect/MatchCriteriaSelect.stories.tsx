import type { Meta, StoryObj } from '@storybook/react';
import MatchCriteriaSelect from './MatchCriteriaSelect';
import { artistMock } from '../../molecules/ArtistBubble/ArtistBubble.fixtures';
import {
  playlistMock,
  playlistMock2,
} from '../../molecules/MatchCriteriaSelect/MatchCriteriaSelect.fixtures';

type Story = StoryObj<typeof MatchCriteriaSelect>;

const meta: Meta<typeof MatchCriteriaSelect> = {
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

export const Primary: Story = {};
export const MatchCriteriaSelectNoTopArtists: Story = {
  args: { topArtists: [] },
};
export const MatchCriteriaSelectNoPlaylists: Story = {
  args: { playlists: [] },
};
