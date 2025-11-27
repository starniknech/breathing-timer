import React from 'react';
import { Box, Button, CircularProgress, Container, Stack, Typography } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { Stage } from '../types/breathing';
import { colorMap } from '../constants/breathing';

type BreathingTimerViewProps = {
  mode: PaletteMode;
  currentStage: Stage | null;
  currentRound: number;
  rounds: number;
  displayTime: number;
  progressValue: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

export const BreathingTimerView: React.FC<BreathingTimerViewProps> = ({
  mode,
  currentStage,
  currentRound,
  rounds,
  displayTime,
  progressValue,
  isRunning,
  onStart,
  onPause,
  onReset,
}) => {
  const circleColor = currentStage ? colorMap[currentStage.color] : '#1976d2';
  const trackColor = mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.25)';

  const stageKey = currentStage ? `${currentStage.id}-${currentRound}` : 'no-stage';

  return (
    <Container maxWidth='sm'>
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
        }}
      >
        <Typography variant='h4' gutterBottom>
          {currentStage ? currentStage.name : 'Добавьте этапы дыхания'}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'inline-flex',
            }}
          >
            <CircularProgress
              variant='determinate'
              value={100}
              size={220}
              thickness={4}
              sx={{
                color: trackColor,
              }}
            />
            <CircularProgress
              key={stageKey}
              variant='determinate'
              value={progressValue}
              size={220}
              thickness={4}
              sx={{
                color: circleColor,
                position: 'absolute',
                left: 0,
                top: 0,
                '& .MuiCircularProgress-circle': {
                  transition: 'none',
                },
              }}
            />

            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography variant='h3' component='div' sx={{ fontWeight: 700 }}>
                {displayTime}s
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant='h6' sx={{ mb: 3 }}>
          Круг {currentRound} из {rounds}
        </Typography>

        <Stack direction='row' spacing={2} justifyContent='center'>
          <Button variant='contained' onClick={onStart} disabled={isRunning || !currentStage}>
            Старт
          </Button>
          <Button variant='outlined' onClick={onPause} disabled={!isRunning}>
            Пауза
          </Button>
          <Button variant='outlined' onClick={onReset}>
            Сброс
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};
