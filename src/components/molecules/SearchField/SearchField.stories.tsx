import type { Meta, StoryObj } from '@storybook/react';
import { SearchField } from './SearchField';

type Story = StoryObj<typeof SearchField>;

const meta: Meta<typeof SearchField> = {
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

export const Primary: Story = {};
