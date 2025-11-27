import React, { useState, useEffect } from 'react';
import { Box, Divider, Drawer, TextField, Typography } from '@mui/material';

import type { Stage, Preset, ColorEnum } from '../../types/breathing';
import { PresetSection } from './PresetSection';
import { StageList } from './StageList';

type BreathingDrawerProps = {
  open: boolean;
  onClose: () => void;
  stages: Stage[];
  rounds: number;
  isRunning: boolean;
  onRoundsChange: (rounds: number) => void;
  onStageChange: (id: string, field: 'name' | 'duration' | 'color' | 'sound', value: string | number) => void;
  onAddStage: () => void;
  onDeleteStage: (id: string) => void;
  onReorderStages: (sourceId: string, targetId: string) => void;
  onDuplicateStage: (id: string) => void;

  presets: Preset[];
  selectedPresetId: string | null;
  onSelectPreset: (id: string | null) => void;
  onCreatePreset: (name: string, color: ColorEnum) => void;
  onUpdatePreset: (id: string, name: string, color: ColorEnum) => void;
  onDuplicatePreset: (id: string) => void;
  onDeletePreset: (id: string) => void;
};

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
  onDuplicateStage,
  presets,
  selectedPresetId,
  onSelectPreset,
  onCreatePreset,
  onUpdatePreset,
  onDuplicatePreset,
  onDeletePreset,
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // ширина дравера
  const [drawerWidth, setDrawerWidth] = useState<number>(520);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setDrawerWidth(window.innerWidth * 0.52); // стартовые ~52% экрана
  }, []);

  // ------------ resize слева у ПРАВОГО дравера ------------
  const handleResizeMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    const handleMouseMove = (e: MouseEvent) => {
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;

      const minWidth = viewportWidth * 0.3;
      const maxWidth = viewportWidth * 0.9;

      // дравер прижат к правому краю → ширина = расстояние от правого края до курсора
      const candidate = viewportWidth - e.clientX;
      const nextWidth = Math.min(maxWidth, Math.max(minWidth, candidate));

      setDrawerWidth(nextWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // ------------ drag & drop этапов ------------
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

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          right: 0, // жёстко прижимаем к правому краю
          left: 'auto', // и убираем привязку к левому
          position: 'fixed',
        },
      }}
    >
      <Box sx={{ position: 'relative', height: '100%' }}>
        {/* полоса-резайзер именно со стороны контента (левая грань дравера) */}
        <Box
          onMouseDown={handleResizeMouseDown}
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            cursor: 'col-resize',
            zIndex: 1,
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.08)',
            },
          }}
        />

        <Box sx={{ p: 3, height: '100%', boxSizing: 'border-box' }}>
          <Typography variant='h6' gutterBottom>
            Настройки дыхания
          </Typography>

          <PresetSection
            presets={presets}
            selectedPresetId={selectedPresetId}
            onSelectPreset={onSelectPreset}
            onCreatePreset={onCreatePreset}
            onUpdatePreset={onUpdatePreset}
            onDuplicatePreset={onDuplicatePreset}
            onDeletePreset={onDeletePreset}
          />

          <Divider sx={{ my: 2 }} />

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

          <StageList
            stages={stages}
            isRunning={isRunning}
            onStageChange={onStageChange}
            onAddStage={onAddStage}
            onDeleteStage={onDeleteStage}
            onDuplicateStage={onDuplicateStage}
            draggingId={draggingId}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        </Box>
      </Box>
    </Drawer>
  );
};
