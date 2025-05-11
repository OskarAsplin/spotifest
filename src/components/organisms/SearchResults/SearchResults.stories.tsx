import type { Meta, StoryObj } from '@storybook/react';
import SearchResults from './SearchResults';
import { searchResultsMock } from './SearchResults.fixtures';
import { withRouter } from '@src/utils/storyUtils';

type Story = StoryObj<typeof SearchResults>;

const meta: Meta<typeof SearchResults> = {
  title: 'Organisms/SearchResults',
  component: SearchResults,
  parameters: {
    docs: {
      description: {
        component:
          'SearchResults displays a user name and shows links to view porfile in Spotify and to log out',
      },
    },
  },
  args: {
    searchResults: searchResultsMock,
    inputText: 'Oskar',
  },
  decorators: [withRouter],
};

export default meta;

export const Primary: Story = {};
export const ManyResults: Story = {
  args: {
    searchResults: {
      festivals: Array(6).fill(searchResultsMock.festivals[0]),
      artists: Array(6).fill(searchResultsMock.artists[0]),
    },
  },
};
export const NoFestivals: Story = {
  args: {
    searchResults: { festivals: [], artists: searchResultsMock.artists },
  },
};
export const NoAritsts: Story = {
  args: {
    searchResults: { festivals: searchResultsMock.festivals, artists: [] },
  },
};
export const NoResults: Story = {
  args: { searchResults: { festivals: [], artists: [] } },
};
