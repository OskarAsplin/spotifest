import { Box } from '@mui/material';
import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import FestivalMatchSettingsBar from './FestivalMatchSettingsBar';
import { artistMock } from '../../molecules/ArtistBubble/ArtistBubble.fixtures';
import { setStoryDescription } from '../../../utils/storyUtils';
import {
  playlistMock,
  playlistMock2,
} from '../../molecules/MatchCriteriaSelect/MatchCriteriaSelect.fixtures';
import {
  continentsMock,
  countriesMock,
} from '../../molecules/AreaSelect/AreaSelect.fixtures';
import { getPlaylistKey } from '../../molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import { WORLDWIDE_AREA } from '../../molecules/AreaSelect/AreaSelect';
import { StyledRootDiv } from '../../../layouts/StyledLayoutComponents';

type Meta = ComponentMeta<typeof FestivalMatchSettingsBar>;
type Story = ComponentStory<typeof FestivalMatchSettingsBar>;

const promiseAction =
  (msg: string) =>
  (...args: any[]) => {
    action(msg)(...args);
    return Promise.resolve();
  };

const meta: Meta = {
  title: 'Organisms/FestivalMatchSettingsBar',
  component: FestivalMatchSettingsBar,
  parameters: {
    docs: {
      description: {
        component:
          'FestivalMatchSettingsBar displays the selectors for the match settings',
      },
    },
    layout: 'fullscreen',
  },
  args: {
    playlists: [playlistMock, playlistMock2],
    topArtists: Array(14).fill(artistMock),
    countries: countriesMock,
    continents: continentsMock,
    matchSettings: {
      matchBasis: getPlaylistKey(playlistMock),
      area: WORLDWIDE_AREA,
      fromDate: new Date(2023, 0, 1).toISOString(),
      toDate: new Date(2023, 11, 31).toISOString(),
      numTracks: 1337,
    },
    onChangeHandlers: {
      onMatchBasisChange: promiseAction('onMatchBasisChange'),
      onAreaChange: promiseAction('onAreaChange'),
      onFromDateChange: action('onFromDateChange'),
      onToDateChange: action('onToDateChange'),
      onDateRangePreSelect: action('onDateRangePreSelect'),
    },
  },
  argTypes: {
    onChangeHandlers: { control: false },
  },
};

export default meta;

const Template: Story = (args) => (
  <StyledRootDiv>
    <Box
      sx={{ my: 2, width: '100%', display: 'flex', justifyContent: 'center' }}
    >
      <FestivalMatchSettingsBar {...args} />
    </Box>
  </StyledRootDiv>
);

export { Template as FestivalMatchSettingsBar };
export const FestivalMatchSettingsBarDisabledMatchBasis = Template.bind({});

FestivalMatchSettingsBarDisabledMatchBasis.args = {
  isMatchBasisFieldDisabled: true,
};
setStoryDescription(
  FestivalMatchSettingsBarDisabledMatchBasis,
  'With `isMatchBasisFieldDisabled: true`. This is used on the share results page'
);
