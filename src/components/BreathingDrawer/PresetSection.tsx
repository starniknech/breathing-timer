import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import type { Preset, ColorEnum } from '../../types/breathing';
import { ColorSelect } from '../../common/ColorSelect';
import { colorMap } from '../../constants/breathing';

type PresetDialogMode = 'create' | 'edit';

type PresetSectionProps = {
  presets: Preset[];
  selectedPresetId: string | null;
  onSelectPreset: (id: string | null) => void;
  onCreatePreset: (name: string, color: ColorEnum) => void;
  onUpdatePreset: (id: string, name: string, color: ColorEnum) => void;
  onDuplicatePreset: (id: string) => void;
  onDeletePreset: (id: string) => void;
};

export const PresetSection: React.FC<PresetSectionProps> = ({
  presets,
  selectedPresetId,
  onSelectPreset,
  onCreatePreset,
  onUpdatePreset,
  onDuplicatePreset,
  onDeletePreset,
}) => {
  const [presetDialogOpen, setPresetDialogOpen] = useState(false);
  const [presetDialogMode, setPresetDialogMode] = useState<PresetDialogMode>('create');
  const [presetName, setPresetName] = useState('');
  const [presetColor, setPresetColor] = useState<ColorEnum>(presets[0]?.color ?? ('' as ColorEnum));
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);

  const handlePresetSelectChange = (value: string) => {
    if (!value) {
      onSelectPreset(null);
    } else {
      onSelectPreset(value);
    }
  };

  const openCreatePresetDialog = () => {
    setPresetDialogMode('create');
    setPresetName('');
    setPresetColor(presets[0]?.color ?? presetColor ?? ('' as ColorEnum));
    setEditingPresetId(null);
    setPresetDialogOpen(true);
  };

  const openEditPresetDialog = () => {
    if (!selectedPresetId) return;
    const preset = presets.find((p) => p.id === selectedPresetId);
    if (!preset) return;

    setPresetDialogMode('edit');
    setPresetName(preset.name);
    setPresetColor(preset.color);
    setEditingPresetId(preset.id);
    setPresetDialogOpen(true);
  };

  const handlePresetDialogClose = () => {
    setPresetDialogOpen(false);
  };

  const handlePresetDialogSave = () => {
    if (presetDialogMode === 'create') {
      onCreatePreset(presetName, presetColor);
    } else if (presetDialogMode === 'edit' && editingPresetId) {
      onUpdatePreset(editingPresetId, presetName, presetColor);
    }
    setPresetDialogOpen(false);
  };

  const handleDuplicatePresetClick = () => {
    if (!selectedPresetId) return;
    onDuplicatePreset(selectedPresetId);
  };

  const handleDeletePresetClick = () => {
    if (!selectedPresetId) return;
    onDeletePreset(selectedPresetId);
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant='subtitle1' gutterBottom>
          Пресеты
        </Typography>

        <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between'>
          <Box sx={{ flex: 1, maxWidth: 300 }}>
            <Select
              size='small'
              value={selectedPresetId ?? ''}
              onChange={(e) => handlePresetSelectChange(e.target.value as string)}
              fullWidth
              displayEmpty
              renderValue={(selected) => {
                if (!selected) return 'Выберите пресет';
                const preset = presets.find((p) => p.id === (selected as string));
                return preset ? preset.name : 'Выберите пресет';
              }}
            >
              <MenuItem value=''>
                <em>Выберите пресет</em>
              </MenuItem>
              {presets.map((preset) => (
                <MenuItem key={preset.id} value={preset.id}>
                  {preset.name}
                  <Box
                    component='span'
                    sx={{
                      ml: 1,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      display: 'inline-block',
                      bgcolor: colorMap[preset.color],
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Stack direction='row' spacing={1} alignItems='center' sx={{ flexShrink: 0 }}>
            <IconButton size='medium' onClick={openEditPresetDialog} disabled={!selectedPresetId}>
              <EditIcon fontSize='medium' />
            </IconButton>
            <IconButton size='medium' onClick={handleDuplicatePresetClick} disabled={!selectedPresetId}>
              <ContentCopyIcon fontSize='medium' />
            </IconButton>
            <IconButton color='error' size='medium' onClick={handleDeletePresetClick} disabled={!selectedPresetId}>
              <DeleteIcon fontSize='medium' />
            </IconButton>
            <Button variant='outlined' size='medium' startIcon={<AddIcon />} onClick={openCreatePresetDialog}>
              CREATE PRESET
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Dialog open={presetDialogOpen} onClose={handlePresetDialogClose} fullWidth maxWidth='xs'>
        <DialogTitle>{presetDialogMode === 'create' ? 'Создать пресет' : 'Редактировать пресет'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label='Название пресета'
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              fullWidth
              size='small'
            />
            <Box>
              <Typography variant='subtitle2' sx={{ mb: 0.5 }}>
                Цвет пресета
              </Typography>
              <ColorSelect value={presetColor} onChange={setPresetColor} size='small' fullWidth />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePresetDialogClose}>Отмена</Button>
          <Button onClick={handlePresetDialogSave} variant='contained'>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
