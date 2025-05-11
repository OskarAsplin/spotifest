import type { Meta, StoryObj } from '@storybook/react';
import { CopyToClipboard } from './CopyToClipboard';

type Story = StoryObj<typeof CopyToClipboard>;

const meta: Meta<typeof CopyToClipboard> = {
  title: 'Atoms/CopyToClipboard',
  component: CopyToClipboard,
  parameters: {
    docs: {
      description: {
        component:
          'CopyToClipboard sends a `copy`-function to the child element that will copy text and display a `Copied!` tooltip when the function is called',
      },
    },
  },
  argTypes: {
    children: { control: false },
  },
};

export default meta;

const textToCopy = 'This text will be copied';

const Template: Story['render'] = () => (
  <CopyToClipboard>
    {({ copy }) => (
      <button onClick={() => copy(textToCopy)}>{textToCopy}</button>
    )}
  </CopyToClipboard>
);

export const Primary: Story = { render: Template };
