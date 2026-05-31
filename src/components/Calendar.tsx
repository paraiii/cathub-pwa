import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, parseISO } from 'date-fns';
import { Box, Typography, Paper } from '@mui/material';
import { VomitRecord } from '../services/api';

interface CalendarProps {
  currentDate: Date;
  vomitRecords: VomitRecord[];
}

export const Calendar: React.FC<CalendarProps> = ({ currentDate, vomitRecords }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const vomitCountsByDay: Record<string, number> = {};
  vomitRecords.forEach(record => {
    const dateStr = format(parseISO(record.date), 'yyyy-MM-dd');
    vomitCountsByDay[dateStr] = (vomitCountsByDay[dateStr] || 0) + 1;
  });

  const getDayStyles = (date: Date) => {
    if (isToday(date)) {
      return {
        bgcolor: 'error.main',
        color: 'white',
        fontWeight: 600,
      };
    }
    return {
      bgcolor: 'transparent',
      color: 'text.primary',
    };
  };

  const getDotStyles = (count: number) => {
    if (count === 1) return { bgcolor: 'success.main' };
    if (count === 2) return { bgcolor: 'warning.main' };
    if (count >= 3) return { bgcolor: 'error.main' };
    return { bgcolor: 'transparent' };
  };

  return (
    <Paper sx={{ mt: 3, p: 2, pb: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        {format(currentDate, 'MMMM yyyy')}
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <Typography key={idx} variant="caption" align="center" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
            {day}
          </Typography>
        ))}
        
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <Box key={`empty-${i}`} />
        ))}

        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const count = vomitCountsByDay[dateStr] || 0;

          return (
            <Box key={day.toString()} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 48 }}>
              <Box sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...getDayStyles(day)
              }}>
                <Typography variant="body1">{format(day, 'd')}</Typography>
              </Box>
              <Box sx={{ height: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '2px' }}>
                {count > 0 && (
                  <Box sx={{ width: 5, height: 5, borderRadius: '50%', ...getDotStyles(count) }} />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3 }}>
        {[
          { label: '1 Time', color: 'success.main' },
          { label: '2 Times', color: 'warning.main' },
          { label: '3+ Times', color: 'error.main' }
        ].map((legend, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: legend.color }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{legend.label}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
