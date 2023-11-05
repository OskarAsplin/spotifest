import type { Meta, StoryObj } from '@storybook/react';
import { artistMock } from '../../molecules/ArtistBubble/ArtistBubble.fixtures';
import FestivalMatchCard from './FestivalMatchCard';
import { StyledRootDiv } from '../../../layouts/StyledLayoutComponents';
import { StyledMatchesRootBox } from '../../templates/FestivalMatches/FestivalMatches';

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
  argTypes: {
    onClickTitle: { control: false },
    onClickArtistBubble: { control: false },
  },
};

export default meta;

const Template: Story['render'] = (args) => (
  <StyledRootDiv>
    <StyledMatchesRootBox>
      <FestivalMatchCard {...args} />
    </StyledMatchesRootBox>
  </StyledRootDiv>
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
