import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Paper, Stack, TextField, useMediaQuery, useTheme } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { SoundEffect, type Stage } from '../../types/breathing';
import { ColorSelect } from '../../common/ColorSelect';
import { SoundSelect } from '../../common/SoundSelect';

type StageItemProps = {
  stage: Stage;
  isRunning: boolean;
  isDragging: boolean;
  onStageChange: (id: string, field: 'name' | 'duration' | 'color' | 'sound', value: string | number) => void;
  onDeleteStage: (id: string) => void;
  onDuplicateStage: (id: string) => void;

  onDragStart: () => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
};

type Segment = 'hours' | 'minutes' | 'seconds';

// сек -> ч/м/с
const secondsToHMS = (totalSeconds: number) => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return { hours, minutes, seconds };
};

const toSeconds = (hStr: string, mStr: string, sStr: string) => {
  const h = parseInt(hStr || '0', 10) || 0;
  let m = parseInt(mStr || '0', 10) || 0;
  let s = parseInt(sStr || '0', 10) || 0;
  m = Math.min(59, Math.max(0, m));
  s = Math.min(59, Math.max(0, s));
  return h * 3600 + m * 60 + s;
};

const SEGMENT_RANGES: Record<Segment, { start: number; end: number }> = {
  hours: { start: 0, end: 2 },
  minutes: { start: 5, end: 7 },
  seconds: { start: 12, end: 14 },
};

export const StageItem: React.FC<StageItemProps> = ({
  stage,
  isRunning,
  isDragging,
  onStageChange,
  onDeleteStage,
  onDuplicateStage,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  const { hours, minutes, seconds } = secondsToHMS(stage.duration);

  const [hoursStr, setHoursStr] = useState(hours.toString().padStart(2, '0'));
  const [minutesStr, setMinutesStr] = useState(minutes.toString().padStart(2, '0'));
  const [secondsStr, setSecondsStr] = useState(seconds.toString().padStart(2, '0'));

  const [activeSegment, setActiveSegment] = useState<Segment>('seconds');
  const [segmentFresh, setSegmentFresh] = useState<boolean>(true);

  const timeRef = useRef<HTMLInputElement | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // при внешнем изменении duration (пресеты и т.п.) — синкаем строки
  useEffect(() => {
    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');
    setHoursStr(h);
    setMinutesStr(m);
    setSecondsStr(s);
  }, [stage.id, stage.duration, hours, minutes, seconds]);

  const displayValue = `${hoursStr}h, ${minutesStr}min, ${secondsStr}s`;

  const focusSegment = (seg: Segment) => {
    setActiveSegment(seg);
    setSegmentFresh(true);
    const input = timeRef.current;
    if (!input) return;
    const { start, end } = SEGMENT_RANGES[seg];
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start, end);
    }, 0);
  };

  const applyDuration = (h: string, m: string, s: string) => {
    const total = toSeconds(h, m, s);
    onStageChange(stage.id, 'duration', total);
  };

  const handleTimeFocus = () => {
    if (isRunning) return;
    focusSegment('seconds');
  };

  const handleTimeClick = () => {
    if (isRunning) return;
    const input = timeRef.current;
    if (!input) return;
    const pos = input.selectionStart ?? 0;
    if (pos <= SEGMENT_RANGES.hours.end) {
      focusSegment('hours');
    } else if (pos <= SEGMENT_RANGES.minutes.end) {
      focusSegment('minutes');
    } else {
      focusSegment('seconds');
    }
  };

  const handleTimeBlur = () => {
    const total = toSeconds(hoursStr, minutesStr, secondsStr);
    if (total === 0) {
      setHoursStr('00');
      setMinutesStr('00');
      setSecondsStr('05');
      onStageChange(stage.id, 'duration', 5);
    }
  };

  const handleTimeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isRunning) return;

    const key = e.key;

    if (key === 'Tab') return;

    if (/^[0-9]$/.test(key)) {
      e.preventDefault();

      let h = hoursStr;
      let m = minutesStr;
      let s = secondsStr;

      const currentStr = activeSegment === 'hours' ? h : activeSegment === 'minutes' ? m : s;

      const base = segmentFresh || currentStr === '00' ? '' : currentStr;
      const raw = (base + key).slice(-2);
      const nextStr = raw.length === 1 ? raw.padStart(2, '0') : raw.padStart(2, '0');

      if (activeSegment === 'hours') {
        h = nextStr;
        setHoursStr(nextStr);
      } else if (activeSegment === 'minutes') {
        m = nextStr;
        setMinutesStr(nextStr);
      } else {
        s = nextStr;
        setSecondsStr(nextStr);
      }

      setSegmentFresh(false);
      applyDuration(h, m, s);

      if (base.length + 1 >= 2) {
        const nextSeg = activeSegment === 'hours' ? 'minutes' : activeSegment === 'minutes' ? 'seconds' : 'seconds';
        if (nextSeg !== activeSegment) {
          focusSegment(nextSeg);
        }
      }

      return;
    }

    if (key === 'Backspace') {
      e.preventDefault();

      let h = hoursStr;
      let m = minutesStr;
      let s = secondsStr;

      if (activeSegment === 'hours') {
        h = '00';
        setHoursStr('00');
      } else if (activeSegment === 'minutes') {
        m = '00';
        setMinutesStr('00');
      } else {
        s = '00';
        setSecondsStr('00');
      }

      setSegmentFresh(true);
      applyDuration(h, m, s);
      return;
    }

    e.preventDefault();
  };

  // ---------- РЕНДЕР ----------

  return (
    <Box
      draggable={!isRunning}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
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
          backgroundColor: isDragging && !isRunning ? 'rgba(0,0,0,0.04)' : 'inherit',
        }}
      >
        {isMobile ? (
          // ---------- МОБИЛЬНЫЙ ЛЕЙАУТ ----------
          <Stack spacing={1.5}>
            {/* строка 1 — иконка + название */}
            <Stack direction='row' spacing={1} alignItems='center'>
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
                sx={{ flex: 1 }}
              />
            </Stack>

            {/* строка 2 — длительность, цвет, звук, кнопки */}
            <Stack spacing={1}>
              <TextField
                label='Длительность'
                size='small'
                value={displayValue}
                inputRef={timeRef}
                onFocus={handleTimeFocus}
                onClick={handleTimeClick}
                onBlur={handleTimeBlur}
                onKeyDown={handleTimeKeyDown}
                onChange={() => {}}
                disabled={isRunning}
                fullWidth
                sx={{ fontVariantNumeric: 'tabular-nums' }}
              />

              <Stack direction='row' spacing={1}>
                <Box sx={{ flex: 1 }}>
                  <ColorSelect
                    value={stage.color}
                    onChange={(value) => onStageChange(stage.id, 'color', value)}
                    disabled={isRunning}
                    size='small'
                    fullWidth
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <SoundSelect
                    value={stage.sound ?? SoundEffect.NONE}
                    onChange={(value) => onStageChange(stage.id, 'sound', value)}
                    disabled={isRunning}
                    fullWidth
                  />
                </Box>
              </Stack>

              <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
                <IconButton size='small' onClick={() => onDuplicateStage(stage.id)} disabled={isRunning}>
                  <ContentCopyIcon fontSize='small' />
                </IconButton>
                <IconButton size='small' color='error' onClick={() => onDeleteStage(stage.id)} disabled={isRunning}>
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>
        ) : (
          // ---------- ДЕСКТОПНЫЙ ЛЕЙАУТ (как было) ----------
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
              label='Длительность'
              size='small'
              value={displayValue}
              inputRef={timeRef}
              onFocus={handleTimeFocus}
              onClick={handleTimeClick}
              onBlur={handleTimeBlur}
              onKeyDown={handleTimeKeyDown}
              onChange={() => {}}
              disabled={isRunning}
              sx={{ flex: 2, fontVariantNumeric: 'tabular-nums' }}
            />

            <Box sx={{ flex: 1 }}>
              <ColorSelect
                value={stage.color}
                onChange={(value) => onStageChange(stage.id, 'color', value)}
                disabled={isRunning}
                size='small'
                fullWidth
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <SoundSelect
                value={stage.sound ?? SoundEffect.NONE}
                onChange={(value) => onStageChange(stage.id, 'sound', value)}
                disabled={isRunning}
                fullWidth
              />
            </Box>

            <IconButton size='small' onClick={() => onDuplicateStage(stage.id)} disabled={isRunning}>
              <ContentCopyIcon fontSize='small' />
            </IconButton>

            <IconButton size='small' color='error' onClick={() => onDeleteStage(stage.id)} disabled={isRunning}>
              <DeleteIcon fontSize='small' />
            </IconButton>
          </Stack>
        )}
      </Paper>
    </Box>
  );
};
