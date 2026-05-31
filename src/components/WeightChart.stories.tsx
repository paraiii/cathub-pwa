import type { Meta, StoryObj } from '@storybook/react';
import { WeightChart } from './WeightChart';
import { format, subDays, subMonths } from 'date-fns';

const meta = {
  title: 'Components/WeightChart',
  component: WeightChart,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof WeightChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date();

const generateMockData = () => {
  return [
    { id: '1', weight: 4.5, date: format(subMonths(today, 2), "yyyy-MM-dd'T'HH:mm") },
    { id: '2', weight: 4.4, date: format(subMonths(today, 1), "yyyy-MM-dd'T'HH:mm") },
    { id: '3', weight: 4.3, date: format(subDays(today, 10), "yyyy-MM-dd'T'HH:mm") },
    { id: '4', weight: 4.25, date: format(subDays(today, 5), "yyyy-MM-dd'T'HH:mm") },
    { id: '5', weight: 4.2, date: format(today, "yyyy-MM-dd'T'HH:mm") },
  ];
};

export const Default: Story = {
  args: {
    data: generateMockData(),
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};
