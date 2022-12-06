import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import SearchResults from './SearchResults';
import { setStoryDescription } from '../../../utils/storyUtils';
import { searchResultsMock } from './SearchResults.fixtures';

type Meta = ComponentMeta<typeof SearchResults>;
type Story = ComponentStory<typeof SearchResults>;

const meta: Meta = {
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
    resetSearchFieldState: action('resetSearchFieldState'),
  },
};

export default meta;

const Template: Story = (args) => <SearchResults {...args} />;

export { Template as SearchResults };
export const SearchResultsManyResults = Template.bind({});
export const SearchResultsNoFestivals = Template.bind({});
export const SearchResultsNoAritsts = Template.bind({});
export const SearchResultsNoResults = Template.bind({});

SearchResultsManyResults.args = {
  searchResults: {
    festivals: Array(6).fill(searchResultsMock.festivals[0]),
    artists: Array(6).fill(searchResultsMock.artists[0]),
  },
};
setStoryDescription(
  SearchResultsManyResults,
  'With more than 5 results for both artists and festivals'
);

SearchResultsNoFestivals.args = {
  searchResults: { festivals: [], artists: searchResultsMock.artists },
};
setStoryDescription(SearchResultsNoFestivals, 'Without festivals');

SearchResultsNoAritsts.args = {
  searchResults: { festivals: searchResultsMock.festivals, artists: [] },
};
setStoryDescription(SearchResultsNoAritsts, 'Without artists');

SearchResultsNoResults.args = { searchResults: { festivals: [], artists: [] } };
setStoryDescription(SearchResultsNoResults, 'Without results');
