import { ComponentMeta, ComponentStory } from '@storybook/react';
import CopyToClipboardButton from './CopyToClipboardButton';

type Meta = ComponentMeta<typeof CopyToClipboardButton>;
type Story = ComponentStory<typeof CopyToClipboardButton>;

const meta: Meta = {
  title: 'Molecules/CopyToClipboardButton',
  component: CopyToClipboardButton,
  parameters: {
    docs: {
      description: {
        component:
          'CopyToClipboardButton takes a textToCopy which will be copied to clipboard when the user clicks the button. \
          A tooltip will be displayed which confirms that the text was copied. It uses the CopyToClipboard component under the hood',
      },
    },
  },
  args: {
    textToCopy: 'This text will be copied',
    isDisabled: false,
  },
};

export default meta;

const Template: Story = (args) => <CopyToClipboardButton {...args} />;

export { Template as CopyToClipboardButton };
