import { ComponentMeta, ComponentStory } from '@storybook/react';
import SocialMediaButtons from './SocialMediaButtons';
import { setStoryDescription } from '../../../utils/storyUtils';

type Meta = ComponentMeta<typeof SocialMediaButtons>;
type Story = ComponentStory<typeof SocialMediaButtons>;

const meta: Meta = {
  title: 'Organisms/SocialMediaButtons',
  component: SocialMediaButtons,
  parameters: {
    docs: {
      description: {
        component:
          'SocialMediaButtons displays the available buttons for sharing match results on social media',
      },
    },
  },
  args: {
    message:
      'I matched the Spotify playlist "Your Top Songs 2022" with music festivals using Spotifest. Check out the results!',
    shareUrl:
      'https://www.spotifest.app/share/spotify__PID__37i9dQZF1F0sijgNaJdgit',
    tooltipText: 'Share the match results for this playlist!',
    isDisabled: false,
  },
};

export default meta;

const Template: Story = (args) => <SocialMediaButtons {...args} />;

export { Template as SocialMediaButtons };
export const SocialMediaButtonsDisabled = Template.bind({});

SocialMediaButtonsDisabled.args = { isDisabled: true };
setStoryDescription(
  SocialMediaButtonsDisabled,
  'With `isDisabled: true`. This does not affect the tooltipText'
);
