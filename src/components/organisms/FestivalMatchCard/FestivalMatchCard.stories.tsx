import { ComponentStory, ComponentMeta } from '@storybook/react';
import FestivalMatchCard from './FestivalMatchCard';
import { action } from '@storybook/addon-actions';
import { artistMock } from '../../molecules/ArtistBubble/ArtistBubble.fixtures';
import { setStoryDescription } from '../../../utils/storyUtils';
import { Box } from '@mui/material';

type Meta = ComponentMeta<typeof FestivalMatchCard>;
type Story = ComponentStory<typeof FestivalMatchCard>;

const meta: Meta = {
  title: 'Other/FestivalMatchCard',
  component: FestivalMatchCard,
  parameters: {
    docs: {
      description: {
        component:
          'FestivalMatchCard to display festival information and possibly matching artists',
      },
    },
    viewMode: 'docs',
  },
  args: {
    festival: {
      lineup_id: '1337',
      name: 'Oskarito Festival',
      locationText: 'Oskariño ciudad',
      country: 'MX',
      date: '15.07',
      year: 2022,
      cancelled: false,
      matching_percent_artists: 70,
      matching_artists: [],
      matching_percent_genres: 80,
      matching_percent_combined: 90,
      top_genres: ['Funky fever', 'Groovy hipbangers', 'Swifty footsies'],
      lineupImg: '',
      festivalImg: '',
    },
    popularArtists: Array(14).fill(artistMock),
    matchingArtists: Array(2).fill(artistMock),
    showMatching: true,
    onClickTitle: action('onClickTitle'),
    onClickArtistBubble: action('onClickArtistBubble'),
  },
  argTypes: {
    onClickTitle: { control: false },
    onClickArtistBubble: { control: false },
  },
};

export default meta;

const Template: Story = (args) => (
  <Box sx={{ px: 10 }}>
    <FestivalMatchCard {...args} />
  </Box>
);

export { Template as FestivalMatchCard };
export const FestivalMatchCardMatching = Template.bind({});
export const FestivalMatchCardNoMatching = Template.bind({});

FestivalMatchCardMatching.args = { showMatching: true };
setStoryDescription(
  FestivalMatchCardMatching,
  'With matching. `showMatching: true`'
);

FestivalMatchCardNoMatching.args = { showMatching: false };
setStoryDescription(
  FestivalMatchCardNoMatching,
  'Without matching. `showMatching: false`'
);
