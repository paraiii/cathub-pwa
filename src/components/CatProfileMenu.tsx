import React, { useState, useEffect } from 'react';
import { Avatar, Menu, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { api, Cat } from '../services/api';
import { Plus, Pencil } from 'lucide-react';

interface CatProfileMenuProps {
  onCatChange: () => void;
}

export const CatProfileMenu: React.FC<CatProfileMenuProps> = ({ onCatChange }) => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [currentCat, setCurrentCat] = useState<Cat | undefined>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');

  const loadCats = async () => {
    const loadedCats = await api.getCats();
    const current = await api.getCurrentCat();
    setCats(loadedCats);
    setCurrentCat(current);
  };

  useEffect(() => {
    loadCats();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchCat = async (id: string) => {
    await api.setCurrentCatId(id);
    await loadCats();
    onCatChange();
    handleMenuClose();
  };

  const handleAddCat = async () => {
    if (newCatName.trim()) {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F9D56E', '#FF8C42', '#B565A7', '#4285F4'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      await api.addCat(newCatName.trim(), randomColor);
      await loadCats();
      onCatChange();
      setNewCatName('');
      setIsAddOpen(false);
      handleMenuClose();
    }
  };

  const openEditCat = (e: React.MouseEvent, cat: Cat) => {
    e.stopPropagation();
    setEditCatId(cat.id);
    setEditCatName(cat.name);
    setIsEditOpen(true);
    handleMenuClose();
  };

  const handleEditCat = async () => {
    if (editCatId && editCatName.trim()) {
      await api.updateCat(editCatId, editCatName.trim());
      await loadCats();
      onCatChange();
      setIsEditOpen(false);
    }
  };

  if (!currentCat) return null;

  return (
    <>
      <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0 }}>
        <Avatar sx={{ bgcolor: currentCat.avatarColor, width: 40, height: 40 }}>
          {currentCat.name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{ mt: 1 }}
      >
        {cats.map(cat => (
          <MenuItem 
            key={cat.id} 
            selected={cat.id === currentCat.id}
            onClick={() => handleSwitchCat(cat.id)}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 200 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: cat.avatarColor, width: 24, height: 24, mr: 2, fontSize: '0.875rem' }}>
                {cat.name.charAt(0).toUpperCase()}
              </Avatar>
              {cat.name}
            </Box>
            <IconButton size="small" onClick={(e) => openEditCat(e, cat)} sx={{ ml: 2 }}>
              <Pencil size={16} />
            </IconButton>
          </MenuItem>
        ))}
        <MenuItem onClick={() => { setIsAddOpen(true); handleMenuClose(); }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', minHeight: 32 }}>
            <Plus size={20} style={{ marginRight: 16 }} />
            Add New Cat
          </Box>
        </MenuItem>
      </Menu>

      {/* Add Cat Dialog */}
      <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Cat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Cat's Name"
            fullWidth
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setIsAddOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleAddCat} variant="contained" disabled={!newCatName.trim()}>Add Cat</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Cat Dialog */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Rename Cat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Cat's Name"
            fullWidth
            value={editCatName}
            onChange={(e) => setEditCatName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setIsEditOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleEditCat} variant="contained" disabled={!editCatName.trim()}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
