import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { Stage, ColorEnum, Preset } from '../types/breathing';
import { ColorSelect } from '../common/ColorSelect';
import { colorMap } from '../constants/breathing';

type BreathingDrawerProps = {
  open: boolean;
  onClose: () => void;
  stages: Stage[];
  rounds: number;
  isRunning: boolean;
  onRoundsChange: (rounds: number) => void;
  onStageChange: (id: string, field: 'name' | 'duration' | 'color', value: string | number) => void;
  onAddStage: () => void;
  onDeleteStage: (id: string) => void;
  onReorderStages: (sourceId: string, targetId: string) => void;

  presets: Preset[];
  selectedPresetId: string | null;
  onSelectPreset: (id: string | null) => void;
  onCreatePreset: (name: string, color: ColorEnum) => void;
  onUpdatePreset: (id: string, name: string, color: ColorEnum) => void;
  onDuplicatePreset: (id: string) => void;
  onDeletePreset: (id: string) => void;
};

type PresetDialogMode = 'create' | 'edit';

export const BreathingDrawer: React.FC<BreathingDrawerProps> = ({
  open,
  onClose,
  stages,
  rounds,
  isRunning,
  onRoundsChange,
  onStageChange,
  onAddStage,
  onDeleteStage,
  onReorderStages,
  presets,
  selectedPresetId,
  onSelectPreset,
  onCreatePreset,
  onUpdatePreset,
  onDuplicatePreset,
  onDeletePreset,
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const [presetDialogOpen, setPresetDialogOpen] = useState(false);
  const [presetDialogMode, setPresetDialogMode] = useState<PresetDialogMode>('create');
  const [presetName, setPresetName] = useState('');
  const [presetColor, setPresetColor] = useState<ColorEnum>(ColorEnum.PURPLE);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    if (isRunning) return;
    setDraggingId(id);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (isRunning) return;
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetId: string) => {
    if (isRunning) return;
    event.preventDefault();
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      return;
    }
    onReorderStages(draggingId, targetId);
    setDraggingId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const openCreatePresetDialog = () => {
    setPresetDialogMode('create');
    setPresetName('');
    setPresetColor(ColorEnum.PURPLE);
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

  const handlePresetSelectChange = (value: string) => {
    if (!value) {
      onSelectPreset(null);
    } else {
      onSelectPreset(value);
    }
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
      <Drawer
        anchor='right'
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: '48vw', // 48% экрана
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            Настройки дыхания
          </Typography>

          {/* Пресеты */}
          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle1' gutterBottom>
              Пресеты
            </Typography>

            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between'>
              <Box sx={{ flex: 1 }}>
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
                <IconButton size='small' onClick={openEditPresetDialog} disabled={!selectedPresetId}>
                  <EditIcon fontSize='small' />
                </IconButton>
                <IconButton size='small' onClick={handleDuplicatePresetClick} disabled={!selectedPresetId}>
                  <ContentCopyIcon fontSize='small' />
                </IconButton>
                <IconButton size='small' onClick={handleDeletePresetClick} disabled={!selectedPresetId}>
                  <DeleteIcon fontSize='small' />
                </IconButton>
                <Button variant='outlined' size='small' startIcon={<AddIcon />} onClick={openCreatePresetDialog}>
                  CREATE PRESET
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Количество кругов */}
          <Box sx={{ mb: 3 }}>
            <Typography variant='subtitle1' gutterBottom>
              Количество кругов
            </Typography>
            <TextField
              type='number'
              size='small'
              value={rounds}
              onChange={(e) => onRoundsChange(Number(e.target.value) || 1)}
              inputProps={{ min: 1 }}
              fullWidth
            />
          </Box>

          {/* Этапы */}
          <Box>
            <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 2 }}>
              <Typography variant='subtitle1'>Этапы дыхания</Typography>
              <Button variant='outlined' onClick={onAddStage} disabled={isRunning}>
                Добавить этап
              </Button>
            </Stack>

            <Stack spacing={2}>
              {stages.map((stage) => (
                <Box
                  key={stage.id}
                  draggable={!isRunning}
                  onDragStart={() => handleDragStart(stage.id)}
                  onDragOver={handleDragOver}
                  onDrop={(event) => handleDrop(event, stage.id)}
                  onDragEnd={handleDragEnd}
                  sx={{
                    cursor: isRunning ? 'default' : 'grab',
                  }}
                >
                  <Paper
                    variant='outlined'
                    sx={{
                      p: 2,
                      borderColor: 'primary.main',
                      opacity: isRunning ? 0.8 : 1,
                      backgroundColor: draggingId === stage.id && !isRunning ? 'rgba(0,0,0,0.04)' : 'inherit',
                    }}
                  >
                    <Stack direction='row' spacing={2} alignItems='center'>
                      <DragIndicatorIcon
                        sx={{
                          color: 'text.secondary',
                          cursor: isRunning ? 'default' : 'grab',
                        }}
                      />
                      <TextField
                        label='Название'
                        size='small'
                        value={stage.name}
                        onChange={(e) => onStageChange(stage.id, 'name', e.target.value)}
                        disabled={isRunning}
                        sx={{ flex: 2 }}
                      />
                      <TextField
                        label='Длительность, сек'
                        type='number'
                        size='small'
                        value={stage.duration}
                        onChange={(e) => onStageChange(stage.id, 'duration', e.target.value)}
                        disabled={isRunning}
                        inputProps={{ min: 1 }}
                        sx={{ flex: 1 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <ColorSelect
                          value={stage.color}
                          onChange={(value: string) => onStageChange(stage.id, 'color', value)}
                          disabled={isRunning}
                          size='small'
                          fullWidth
                        />
                      </Box>
                      <Button
                        variant='outlined'
                        color='error'
                        onClick={() => onDeleteStage(stage.id)}
                        disabled={isRunning && stages.length <= 1}
                      >
                        Удалить
                      </Button>
                    </Stack>
                  </Paper>
                </Box>
              ))}

              {!stages.length && (
                <Typography variant='body2' color='text.secondary'>
                  Пока нет этапов. Добавь хотя бы один.
                </Typography>
              )}
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/* Модалка пресета */}
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
