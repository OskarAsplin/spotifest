import type { Meta, StoryObj } from '@storybook/react';
import MatchCriteriaSelect from './MatchCriteriaSelect';
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
    hasTopArtists: true,
    hasSavedTracks: true,
  },
};

export default meta;

export const Primary: Story = {};
export const MatchCriteriaSelectNoTopArtists: Story = {
  args: { hasTopArtists: false },
};
export const MatchCriteriaSelectNoSavedTracks: Story = {
  args: { hasSavedTracks: false },
};
export const MatchCriteriaSelectNoPlaylists: Story = {
  args: { playlists: [] },
};
