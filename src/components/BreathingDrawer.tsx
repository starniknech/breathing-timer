import React, { useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Stage, ColorEnum } from '../types/breathing';
import { colorMap } from '../constants/breathing';

type BreathingDrawerProps = {
  open: boolean;
  onClose: () => void;
  stages: Stage[];
  rounds: number;
  isRunning: boolean;
  onRoundsChange: (rounds: number) => void;
  onStageChange: (
    id: string,
    field: 'name' | 'duration' | 'color',
    value: string | number
  ) => void;
  onAddStage: () => void;
  onDeleteStage: (id: string) => void;
  onReorderStages: (sourceId: string, targetId: string) => void;
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
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);

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
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '45vw',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Настройки дыхания
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Количество кругов
          </Typography>
          <TextField
            type="number"
            size="small"
            value={rounds}
            onChange={e => onRoundsChange(Number(e.target.value) || 1)}
            inputProps={{ min: 1 }}
            fullWidth
          />
        </Box>

        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="subtitle1">Этапы дыхания</Typography>
            <Button
              variant="outlined"
              onClick={onAddStage}
              disabled={isRunning}
            >
              Добавить этап
            </Button>
          </Stack>

          <Stack spacing={2}>
            {stages.map(stage => (
              <Box
                key={stage.id}
                draggable={!isRunning}
                onDragStart={() => handleDragStart(stage.id)}
                onDragOver={handleDragOver}
                onDrop={event => handleDrop(event, stage.id)}
                onDragEnd={handleDragEnd}
                sx={{
                  cursor: isRunning ? 'default' : 'grab',
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderColor: 'primary.main',
                    opacity: isRunning ? 0.8 : 1,
                    backgroundColor:
                      draggingId === stage.id && !isRunning
                        ? 'rgba(0,0,0,0.04)'
                        : 'inherit',
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <DragIndicatorIcon
                      sx={{
                        color: 'text.secondary',
                        cursor: isRunning ? 'default' : 'grab',
                      }}
                    />
                    <TextField
                      label="Название"
                      size="small"
                      value={stage.name}
                      onChange={e =>
                        onStageChange(stage.id, 'name', e.target.value)
                      }
                      disabled={isRunning}
                      sx={{ flex: 2 }}
                    />
                    <TextField
                      label="Длительность, сек"
                      type="number"
                      size="small"
                      value={stage.duration}
                      onChange={e =>
                        onStageChange(stage.id, 'duration', e.target.value)
                      }
                      disabled={isRunning}
                      inputProps={{ min: 1 }}
                      sx={{ flex: 1 }}
                    />
                    <Select
                      size="small"
                      value={stage.color}
                      onChange={e =>
                        onStageChange(stage.id, 'color', e.target.value)
                      }
                      disabled={isRunning}
                      sx={{ flex: 1 }}
                    >
                      <MenuItem value={ColorEnum.PURPLE}>
                        Фиолетовый
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            display: 'inline-block',
                            bgcolor: colorMap[ColorEnum.PURPLE],
                          }}
                        />
                      </MenuItem>
                      <MenuItem value={ColorEnum.BLUE}>
                        Синий
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            display: 'inline-block',
                            bgcolor: colorMap[ColorEnum.BLUE],
                          }}
                        />
                      </MenuItem>
                      <MenuItem value={ColorEnum.GREEN}>
                        Зелёный
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            display: 'inline-block',
                            bgcolor: colorMap[ColorEnum.GREEN],
                          }}
                        />
                      </MenuItem>
                      <MenuItem value={ColorEnum.ORANGE}>
                        Оранжевый
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            display: 'inline-block',
                            bgcolor: colorMap[ColorEnum.ORANGE],
                          }}
                        />
                      </MenuItem>
                      <MenuItem value={ColorEnum.RED}>
                        Красный
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            display: 'inline-block',
                            bgcolor: colorMap[ColorEnum.RED],
                          }}
                        />
                      </MenuItem>
                      <MenuItem value={ColorEnum.TEAL}>
                        Бирюзовый
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            display: 'inline-block',
                            bgcolor: colorMap[ColorEnum.TEAL],
                          }}
                        />
                      </MenuItem>
                      <MenuItem value={ColorEnum.PINK}>
                        Розовый
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            display: 'inline-block',
                            bgcolor: colorMap[ColorEnum.PINK],
                          }}
                        />
                      </MenuItem>
                      <MenuItem value={ColorEnum.AMBER}>
                        Янтарный
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            display: 'inline-block',
                            bgcolor: colorMap[ColorEnum.AMBER],
                          }}
                        />
                      </MenuItem>
                    </Select>
                    <Button
                      variant="outlined"
                      color="error"
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
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Пока нет этапов. Добавь хотя бы один.
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};
