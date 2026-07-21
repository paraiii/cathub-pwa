import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { parseISO } from 'date-fns';
import { api, WeightRecord, VomitRecord } from '../services/api';

interface RecordEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  record: WeightRecord | VomitRecord | null;
  type: 'weight' | 'vomit';
}

export const RecordEditDialog: React.FC<RecordEditDialogProps> = ({ isOpen, onClose, onSuccess, record, type }) => {
  const [date, setDate] = useState<Date | null>(null);
  const [weightStr, setWeightStr] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (record) {
      setDate(parseISO(record.date));
      if (type === 'weight') {
        setWeightStr((record as WeightRecord).weight.toString());
      } else {
        setDescription((record as VomitRecord).description || '');
      }
    }
  }, [record, type]);

  const handleSave = async () => {
    if (!record || !date) return;
    
    if (type === 'weight') {
      const w = parseFloat(weightStr);
      if (isNaN(w) || w <= 0) return;
      await api.updateWeight(record.id, w, date.toISOString());
    } else {
      await api.updateVomit(record.id, description, date.toISOString());
    }
    
    onSuccess();
    onClose();
  };

  const handleDelete = async () => {
    if (!record) return;
    
    if (confirm('Are you sure you want to delete this record?')) {
      if (type === 'weight') {
        await api.deleteWeight(record.id);
      } else {
        await api.deleteVomit(record.id);
      }
      onSuccess();
      onClose();
    }
  };

  if (!record) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        Edit {type === 'weight' ? 'Weight' : 'Vomit'} Record
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <DateTimePicker
            label="Date & Time"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            ampm={false}
            slotProps={{ textField: { fullWidth: true } }}
          />

          {type === 'weight' ? (
            <TextField
              label="Weight (kg)"
              type="number"
              slotProps={{ htmlInput: { step: "0.01", min: "0.01" } }}
              fullWidth
              value={weightStr}
              onChange={(e) => setWeightStr(e.target.value)}
            />
          ) : (
            <TextField
              label="Note (Optional)"
              multiline
              rows={3}
              fullWidth
              placeholder="e.g., hairball, yellow liquid..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
        <Box>
          <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
