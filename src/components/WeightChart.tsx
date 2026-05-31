import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, isSameMonth, isSameYear } from 'date-fns';
import { Box, Typography, Paper, Select, MenuItem, useTheme } from '@mui/material';
import { WeightRecord } from '../services/api';

interface WeightChartProps {
  data: WeightRecord[];
}

export const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  const [filter, setFilter] = useState<'month' | 'year' | 'all'>('all');
  const theme = useTheme();

  const filteredData = useMemo(() => {
    const now = new Date();
    let filtered = data;
    
    if (filter === 'month') {
      filtered = data.filter(d => isSameMonth(parseISO(d.date), now));
    } else if (filter === 'year') {
      filtered = data.filter(d => isSameYear(parseISO(d.date), now));
    }

    return filtered.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(d => ({
      ...d,
      displayDate: format(parseISO(d.date), filter === 'month' ? 'MMM d' : 'MMM yyyy')
    }));
  }, [data, filter]);

  return (
    <Paper sx={{ mt: 3, p: 2, pb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Weight Trend</Typography>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          size="small"
          sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
        >
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="year">This Year</MenuItem>
          <MenuItem value="all">All Time</MenuItem>
        </Select>
      </Box>

      <Box sx={{ width: '100%', height: 250 }}>
        {filteredData.length === 0 ? (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
            No data for this period
          </Box>
        ) : (
          <ResponsiveContainer>
            <LineChart data={filteredData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} dy={10} />
              <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)' }}
                formatter={(value: number) => [`${value} kg`, 'Weight']}
              />
              <Line type="monotone" dataKey="weight" stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 4, fill: theme.palette.primary.main, strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};
