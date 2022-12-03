import { ComponentMeta, ComponentStory } from '@storybook/react';
import { escapeRegExp } from 'lodash-es';
import MatchHighlighter from './MatchHighlighter';

type Meta = ComponentMeta<typeof MatchHighlighter>;
type Story = ComponentStory<typeof MatchHighlighter>;

const regex = new RegExp(`(${escapeRegExp('me')})`, 'ig');

const meta: Meta = {
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

const Template: Story = (args) => <MatchHighlighter {...args} />;

export { Template as MatchHighlighter };
