import type { Meta, StoryObj } from '@storybook/react';
import { SocialMediaButtons } from './SocialMediaButtons';

type Story = StoryObj<typeof SocialMediaButtons>;

const meta: Meta<typeof SocialMediaButtons> = {
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

export const Primary: Story = {};

export const SocialMediaButtonsDisabled: Story = {
  args: { isDisabled: true },
  parameters: {
    docs: {
      description: {
        story: 'With `isDisabled: true`. This does not affect the tooltipText',
      },
    },
  },
};
