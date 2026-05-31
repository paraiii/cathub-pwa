import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '../components/Calendar';
import { WeightChart } from '../components/WeightChart';
import { Activity, Scale, History } from 'lucide-react';
import { format, isSameMonth, parseISO } from 'date-fns';
import { api, WeightRecord, VomitRecord } from '../services/api';
import {
  Box, Typography, Button, Paper, Container, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';

export default function Home() {
  const navigate = useNavigate();
  const [weights, setWeights] = useState<WeightRecord[]>([]);
  const [vomits, setVomits] = useState<VomitRecord[]>([]);
  const [isWeightModalOpen, setWeightModalOpen] = useState(false);
  const [isVomitModalOpen, setVomitModalOpen] = useState(false);

  // Form states
  const [weightValue, setWeightValue] = useState('');
  const [weightDate, setWeightDate] = useState<Date | null>(new Date());
  const [vomitDesc, setVomitDesc] = useState('');
  const [vomitDate, setVomitDate] = useState<Date | null>(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setWeights(await api.getWeights());
    setVomits(await api.getVomits());
  };

  const handleRecordWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightValue || !weightDate) return;
    await api.addWeight(parseFloat(weightValue), weightDate.toISOString());
    setWeightModalOpen(false);
    setWeightValue('');
    setWeightDate(new Date());
    loadData();
  };

  const handleRecordVomit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vomitDate) return;
    await api.addVomit(vomitDesc, vomitDate.toISOString());
    setVomitModalOpen(false);
    setVomitDesc('');
    setVomitDate(new Date());
    loadData();
  };

  const recentRecords = [
    ...weights.map(w => ({ ...w, type: 'weight' as const })),
    ...vomits.map(v => ({ ...v, type: 'vomit' as const }))
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', pb: 4, px: { xs: 2, sm: 3 } }}>
      <Box component="header" sx={{ py: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: 4, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Activity size={24} />
          </Box>
          <Box>
            <Typography variant="h1" sx={{ fontSize: '1.5rem', lineHeight: 1.2 }}>CatHub</Typography>
            <Typography variant="body2" color="text.secondary">Health Tracker</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
        <Button variant="contained" color="primary" onClick={() => setWeightModalOpen(true)} startIcon={<Scale size={20} />} fullWidth>
          Weight
        </Button>
        <Button variant="contained" color="error" onClick={() => setVomitModalOpen(true)} startIcon={<Activity size={20} />} fullWidth>
          Vomit
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Recent Records</Typography>
          <Button size="small" variant="text" onClick={() => navigate('/history')} startIcon={<History size={14} />}>
            View All
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {recentRecords.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ py: 3 }}>No recent records.</Typography>
          ) : (
            recentRecords.map(record => (
              <Box key={record.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: 'background.default', borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: record.type === 'weight' ? 'primary.main' : 'error.main', display: 'flex' }}>
                    {record.type === 'weight' ? <Scale size={20} /> : <Activity size={20} />}
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {record.type === 'weight' ? 'Weight' : 'Vomited'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(parseISO(record.date), 'MMM d, yyyy HH:mm')}
                    </Typography>
                  </Box>
                </Box>
                {record.type === 'weight' ? (
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                    {`${(record as any).weight.toFixed(2)} kg`}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '150px', textAlign: 'right', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {(record as any).description}
                  </Typography>
                )}

              </Box>
            ))
          )}
        </Box>
      </Paper>

      <Calendar currentDate={new Date()} vomitRecords={vomits} />
      <WeightChart data={weights} />

      {/* Weight Modal */}
      <Dialog open={isWeightModalOpen} onClose={() => setWeightModalOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Record Weight</DialogTitle>
        <form onSubmit={handleRecordWeight}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <DateTimePicker
              label="Time"
              value={weightDate}
              onChange={(val) => setWeightDate(val)}
              ampm={false}
              format="yyyy-MM-dd HH:mm"
            />
            <TextField
              label="Weight (kg)"
              type="number"
              slotProps={{ htmlInput: { step: "0.01" } }}
              value={weightValue}
              onChange={e => setWeightValue(e.target.value)}
              placeholder="e.g. 4.50"
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setWeightModalOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Save Weight</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Vomit Modal */}
      <Dialog open={isVomitModalOpen} onClose={() => setVomitModalOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Record Vomit</DialogTitle>
        <form onSubmit={handleRecordVomit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <DateTimePicker
              label="Time"
              value={vomitDate}
              onChange={(val) => setVomitDate(val)}
              ampm={false}
              format="yyyy-MM-dd HH:mm"
            />
            <TextField
              label="Description (Optional)"
              multiline
              rows={3}
              value={vomitDesc}
              onChange={e => setVomitDesc(e.target.value)}
              placeholder="Hairball, food, clear liquid..."
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setVomitModalOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="error">Save Record</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
