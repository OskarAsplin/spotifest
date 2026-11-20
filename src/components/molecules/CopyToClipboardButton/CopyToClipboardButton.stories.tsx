import type { Meta, StoryObj } from '@storybook/react-vite';
import { CopyToClipboardButton } from './CopyToClipboardButton';

type Story = StoryObj<typeof CopyToClipboardButton>;

const meta: Meta<typeof CopyToClipboardButton> = {
  title: 'Molecules/CopyToClipboardButton',
  component: CopyToClipboardButton,
  parameters: {
    docs: {
      description: {
        component:
          'CopyToClipboardButton takes a textToCopy which will be copied to clipboard when the user clicks the button. \
          The tooltip shows tooltipText on hover and confirms that the text was copied after a click.',
      },
    },
  },
  args: {
    textToCopy: 'This text will be copied',
    tooltipText: 'Copy link and message',
    isDisabled: false,
  },
};

export default meta;

export const Primary: Story = {};
