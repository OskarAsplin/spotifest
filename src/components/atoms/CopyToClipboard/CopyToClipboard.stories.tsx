import { ComponentMeta, ComponentStory } from '@storybook/react';
import CopyToClipboard from './CopyToClipboard';

type Meta = ComponentMeta<typeof CopyToClipboard>;
type Story = ComponentStory<typeof CopyToClipboard>;

const meta: Meta = {
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

const copiedText = 'This text will be copied';

const Template: Story = () => (
  <CopyToClipboard>
    {({ copy }) => (
      <button onClick={() => copy(copiedText)}>{copiedText}</button>
    )}
  </CopyToClipboard>
);

export { Template as CopyToClipboard };
