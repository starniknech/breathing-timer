import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';

import type { Stage } from '../../types/breathing';
import { StageItem } from './StageItem';

type StageListProps = {
  stages: Stage[];
  isRunning: boolean;
  onStageChange: (id: string, field: 'name' | 'duration' | 'color' | 'sound', value: string | number) => void;
  onAddStage: () => void;
  onDeleteStage: (id: string) => void;
  onDuplicateStage: (id: string) => void;

  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, targetId: string) => void;
  onDragEnd: () => void;
};

export const StageList: React.FC<StageListProps> = ({
  stages,
  isRunning,
  onStageChange,
  onAddStage,
  onDeleteStage,
  onDuplicateStage,
  draggingId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        justifyContent='space-between'
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        sx={{ mb: 2 }}
      >
        <Typography variant='subtitle1'>Этапы круга</Typography>
        <Button
          variant='outlined'
          onClick={onAddStage}
          disabled={isRunning}
          sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
        >
          Добавить этап
        </Button>
      </Stack>
      <Stack spacing={2}>
        {stages.map((stage) => (
          <StageItem
            key={stage.id}
            stage={stage}
            isRunning={isRunning}
            isDragging={draggingId === stage.id}
            onStageChange={onStageChange}
            onDeleteStage={onDeleteStage}
            onDuplicateStage={onDuplicateStage}
            onDragStart={() => onDragStart(stage.id)}
            onDragOver={onDragOver}
            onDrop={(event) => onDrop(event, stage.id)}
            onDragEnd={onDragEnd}
          />
        ))}

        {!stages.length && (
          <Typography variant='body2' color='text.secondary'>
            Пока нет этапов. Добавь хотя бы один.
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
