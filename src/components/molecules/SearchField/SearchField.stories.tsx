import { ComponentMeta, ComponentStory } from '@storybook/react';
import SearchField from './SearchField';

type Meta = ComponentMeta<typeof SearchField>;
type Story = ComponentStory<typeof SearchField>;

const meta: Meta = {
  title: 'Molecules/SearchField',
  component: SearchField,
  parameters: {
    docs: {
      description: {
        component:
          'SearchField displays a Textfield with a search icon for big screens and without for small screens.\
          The screen size limit is currently `min-width:610px`',
      },
    },
  },
};

export default meta;

const Template: Story = (args) => <SearchField {...args} />;

export { Template as SearchField };
