import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';
import { format, subDays } from 'date-fns';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date();
const todayStr = format(today, "yyyy-MM-dd'T'HH:mm");
const yesterdayStr = format(subDays(today, 1), "yyyy-MM-dd'T'HH:mm");
const twoDaysAgoStr = format(subDays(today, 2), "yyyy-MM-dd'T'HH:mm");

export const Default: Story = {
  args: {
    currentDate: today,
    vomitRecords: [],
  },
};

export const WithVomitData: Story = {
  args: {
    currentDate: today,
    vomitRecords: [
      { id: '1', description: 'Hairball', date: todayStr },
      { id: '2', description: 'Food', date: yesterdayStr },
      { id: '3', description: 'Liquid', date: yesterdayStr },
      { id: '4', description: 'Unknown', date: twoDaysAgoStr },
      { id: '5', description: '', date: twoDaysAgoStr },
      { id: '6', description: '', date: twoDaysAgoStr },
    ],
  },
};
