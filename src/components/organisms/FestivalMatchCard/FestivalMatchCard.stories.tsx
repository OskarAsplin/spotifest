import type { Meta, StoryObj } from '@storybook/react-vite';
import { artistMock } from '@src/components/molecules/ArtistBubble/ArtistBubble.fixtures';
import { FestivalMatchCard } from './FestivalMatchCard';
import { withRouter } from '@src/utils/storyUtils';

type Story = StoryObj<typeof FestivalMatchCard>;

const meta: Meta<typeof FestivalMatchCard> = {
  title: 'Organisms/FestivalMatchCard',
  component: FestivalMatchCard,
  parameters: {
    docs: {
      description: {
        component:
          'FestivalMatchCard to display festival information and possibly matching artists',
      },
    },
    layout: 'fullscreen',
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
      top_genres: 'Funky fever, Groovy hipbangers, Swifty footsies',
    },
    popularArtists: Array(14).fill(artistMock),
    matchingArtists: Array(2).fill(artistMock),
    showMatching: true,
  },
  decorators: [withRouter],
};

export default meta;

const Template: Story['render'] = (args) => (
  <div className="flex w-full flex-col items-center justify-center max-[439px]:px-2 min-[440px]:px-4">
    <div className="mt-2 w-full max-w-3xl">
      <FestivalMatchCard {...args} />
    </div>
  </div>
);

export const Primary: Story = { render: Template };
export const Matching: Story = {
  render: Template,
  args: { showMatching: true },
};
export const NoMatching: Story = {
  render: Template,
  args: { showMatching: false },
};
export const NoArtists: Story = {
  render: Template,
  args: { popularArtists: [] },
};
export const NoMatchingArtists: Story = {
  render: Template,
  args: { matchingArtists: [] },
};
