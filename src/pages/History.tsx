import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, Activity } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { api, WeightRecord, VomitRecord } from '../services/api';
import { Box, Typography, Container, IconButton, Tabs, Tab, Paper } from '@mui/material';
import { CatProfileMenu } from '../components/CatProfileMenu';
import { RecordEditDialog } from '../components/RecordEditDialog';

export default function History() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'weight' | 'vomit'>('weight');
  const [weights, setWeights] = useState<WeightRecord[]>([]);
  const [vomits, setVomits] = useState<VomitRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<(WeightRecord | VomitRecord) & { type: 'weight' | 'vomit' } | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const loadData = async () => {
    setWeights(await api.getWeights());
    setVomits(await api.getVomits());
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', pb: 4, px: { xs: 2, sm: 3 } }}>
      <Box component="header" sx={{ py: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)} edge="start" sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <ArrowLeft size={24} />
          </IconButton>
          <Typography variant="h1" sx={{ fontSize: '1.5rem', lineHeight: 1.2 }}>History</Typography>
        </Box>
        <CatProfileMenu onCatChange={loadData} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          variant="fullWidth"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: 3,
            p: 0.5,
            minHeight: 48,
            '& .MuiTabs-indicator': { display: 'none' }
          }}
        >
          <Tab
            value="weight"
            label="Weight"
            sx={{
              borderRadius: 2.5,
              minHeight: 40,
              fontWeight: 600,
              bgcolor: tab === 'weight' ? 'white' : 'transparent',
              boxShadow: tab === 'weight' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              color: tab === 'weight' ? 'primary.main' : 'text.secondary',
              '&.Mui-selected': { color: 'primary.main' }
            }}
          />
          <Tab
            value="vomit"
            label="Vomit"
            sx={{
              borderRadius: 2.5,
              minHeight: 40,
              fontWeight: 600,
              bgcolor: tab === 'vomit' ? 'white' : 'transparent',
              boxShadow: tab === 'vomit' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              color: tab === 'vomit' ? 'error.main' : 'text.secondary',
              '&.Mui-selected': { color: 'error.main' }
            }}
          />
        </Tabs>
      </Box>

      <Paper sx={{ p: 2, minHeight: '60vh' }}>
        {tab === 'weight' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {weights.length === 0 ? <Typography align="center" color="text.secondary" sx={{ py: 4 }}>No weight records found.</Typography> : null}
            {weights.map(w => (
              <Box 
                key={w.id} 
                onClick={() => { setSelectedRecord({ ...w, type: 'weight' }); setEditModalOpen(true); }}
                sx={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  p: 2, bgcolor: 'background.default', borderRadius: 3,
                  cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: 'primary.main', display: 'flex' }}><Scale size={24} /></Box>
                  <Box>
                    {/* <Typography variant="body1" sx={{ fontWeight: 600 }}>Recorded Weight</Typography> */}
                    <Typography variant="body1" color="text.secondary">{format(parseISO(w.date), 'MMM d, yyyy HH:mm')}</Typography>
                  </Box>
                </Box>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                  {w.weight.toFixed(2)} kg
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {vomits.length === 0 ? <Typography align="center" color="text.secondary" sx={{ py: 4 }}>No vomit records found.</Typography> : null}
            {vomits.map(v => (
              <Box 
                key={v.id} 
                onClick={() => { setSelectedRecord({ ...v, type: 'vomit' }); setEditModalOpen(true); }}
                sx={{ 
                  p: 2, bgcolor: 'background.default', borderRadius: 3,
                  cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: v.description ? 1 : 0 }}>
                  <Box sx={{ color: 'error.main', display: 'flex' }}><Activity size={24} /></Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>Vomited</Typography>
                    <Typography variant="caption" color="text.secondary">{format(parseISO(v.date), 'MMM d, yyyy HH:mm')}</Typography>
                  </Box>
                </Box>
                {v.description && (
                  <Box sx={{ mt: 1, p: 1.5, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
                    <Typography variant="body2">{v.description}</Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Record Edit Modal */}
      <RecordEditDialog
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={loadData}
        record={selectedRecord}
        type={selectedRecord?.type as 'weight' | 'vomit'}
      />
    </Container>
  );
}
