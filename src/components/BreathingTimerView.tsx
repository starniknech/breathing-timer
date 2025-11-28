import React from 'react';
import { Box, Button, CircularProgress, Container, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { Stage } from '../types/breathing';
import { colorMap } from '../constants/constants';

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

const formatTime = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) return `${hours}h, ${minutes}min, ${seconds}s`;
  if (minutes > 0) return `${minutes}min, ${seconds}s`;
  return `${seconds}s`;
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const circleColor = currentStage ? colorMap[currentStage.color] : '#1976d2';
  const trackColor = mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.25)';
  const stageKey = currentStage ? `${currentStage.id}-${currentRound}` : 'no-stage';

  const formattedTime = formatTime(displayTime);

  const hasHours = displayTime >= 3600;
  const hasMinutes = !hasHours && displayTime >= 60;

  const baseFontSize = hasHours ? 1.9 : hasMinutes ? 2.4 : 3.6;
  const fontSize = `${baseFontSize * (isMobile ? 0.8 : 1)}rem`;

  const circleSize = isMobile ? 260 : 320;
  const circleThickness = isMobile ? 5 : 6;

  return (
    <Container maxWidth='sm'>
      <Box sx={{ textAlign: 'center', py: isMobile ? 3 : 4 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>
          {currentStage ? currentStage.name : 'Добавьте этапы'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: isMobile ? 2 : 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant='determinate'
              value={100}
              size={circleSize}
              thickness={circleThickness}
              sx={{ color: trackColor }}
            />
            <CircularProgress
              key={stageKey}
              variant='determinate'
              value={progressValue}
              size={circleSize}
              thickness={circleThickness}
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
              <Typography component='div' sx={{ fontWeight: 700, fontSize }}>
                {formattedTime}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant='h6' sx={{ mb: isMobile ? 2 : 3 }}>
          Круг {currentRound} из {rounds}
        </Typography>

        <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent='center'>
          <Button variant='contained' onClick={onStart} disabled={isRunning || !currentStage} fullWidth={isMobile}>
            Старт
          </Button>
          <Button variant='outlined' onClick={onPause} disabled={!isRunning} fullWidth={isMobile}>
            Пауза
          </Button>
          <Button variant='outlined' onClick={onReset} fullWidth={isMobile}>
            Сброс
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};
