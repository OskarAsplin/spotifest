import { Meta, StoryObj } from '@storybook/react';
import { escapeRegExp } from 'lodash-es';
import { MatchHighlighter } from './MatchHighlighter';

type Story = StoryObj<typeof MatchHighlighter>;

const regex = new RegExp(`(${escapeRegExp('me')})`, 'ig');

const meta: Meta<typeof MatchHighlighter> = {
  title: 'Atoms/MatchHighlighter',
  component: MatchHighlighter,
  parameters: {
    docs: {
      description: {
        component: `The MatchHighlighter will higlight all regex matches in the input text. Controlling a regex arg does not work well in storybook, so we use a fixed example regex: ${regex.toString()}`,
      },
    },
  },
  args: {
    text: "Looks like meat's back on the menu boys",
    regex,
  },
  argTypes: {
    regex: { control: false },
  },
};

export default meta;

export const Primary: Story = {};
