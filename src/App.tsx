import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, CssBaseline, Fab } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { BreathingTimerView } from './components/BreathingTimerView';
import { BreathingDrawer } from './components/BreathingDrawer/BreathingDrawer';
import { useBreathingTimer } from './hooks/useBreathingTimer';
import { ColorEnum, Stage, Preset, SoundEffect } from './types/breathing';
import {
  LOCAL_STORAGE_KEY,
  THEME_KEY,
  PRESETS_STORAGE_KEY,
  loadInitialConfig,
  loadInitialPresets,
} from './constants/breathing';
import { playSound } from './utils/soundPlayer';

const initialConfig = loadInitialConfig();
const initialPresets = loadInitialPresets();

const App: React.FC = () => {
  const [stages, setStages] = useState<Stage[]>(initialConfig.stages);
  const [rounds, setRounds] = useState<number>(initialConfig.rounds);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [presets, setPresets] = useState<Preset[]>(initialPresets);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const [mode, setMode] = useState<PaletteMode>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = window.localStorage.getItem(THEME_KEY);
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  const handleStageComplete = (finishedStage: Stage) => {
    const sound = finishedStage.sound ?? SoundEffect.NONE;
    if (sound !== SoundEffect.NONE) {
      playSound(sound);
    }
  };

  const timer = useBreathingTimer(stages, rounds, handleStageComplete);

  const appTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                background: { default: 'rgb(33, 33, 33)' },
                text: { primary: '#ffffff' },
              }
            : {}),
        },
      }),
    [mode],
  );

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = { stages, rounds };
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  }, [stages, rounds]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
  }, [presets]);

  const handleRoundsChange = (value: number) => {
    const n = Number.isNaN(value) || value <= 0 ? 1 : value;
    setRounds(n);
  };

  const handleDuplicateStage = (id: string) => {
    setStages((prev) => {
      const index = prev.findIndex((s) => s.id === id);
      if (index === -1) return prev;

      const source = prev[index];
      const newStage: Stage = {
        ...source,
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: `${source.name} (копия)`,
        sound: SoundEffect.NONE,
      };

      const next = [...prev];
      next.splice(index + 1, 0, newStage);
      return next;
    });
  };

  const handleStageFieldChange = (
    id: string,
    field: 'name' | 'duration' | 'color' | 'sound',
    value: string | number,
  ) => {
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== id) return stage;

        if (field === 'duration') {
          const num = Number(value);
          return { ...stage, duration: num > 0 ? num : 1 };
        }

        if (field === 'color') {
          return { ...stage, color: value as ColorEnum };
        }

        if (field === 'sound') {
          return { ...stage, sound: value as SoundEffect };
        }

        return { ...stage, name: String(value) };
      }),
    );
  };

  const handleAddStage = () => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const newStage: Stage = {
      id,
      name: 'Новый этап',
      duration: 5,
      color: ColorEnum.PURPLE,
    };
    setStages((prev) => [...prev, newStage]);
  };

  const handleDeleteStage = (id: string) => {
    setStages((prev) => prev.filter((stage) => stage.id !== id));
  };

  const handleReorderStages = (sourceId: string, targetId: string) => {
    setStages((prev) => {
      const fromIndex = prev.findIndex((s) => s.id === sourceId);
      const toIndex = prev.findIndex((s) => s.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const applyPresetById = (id: string | null, presetsList: Preset[] = presets) => {
    if (!id) return;
    const preset = presetsList.find((p) => p.id === id);
    if (!preset) return;

    setRounds(preset.rounds);
    const clonedStages: Stage[] = preset.stages.map((s) => ({
      ...s,
      id: `${s.id}-${Math.random().toString(36).slice(2)}`,
    }));
    setStages(clonedStages);
  };

  const handleSelectPreset = (id: string | null) => {
    setSelectedPresetId(id);
    if (!id) return;
    applyPresetById(id);
  };

  const handleCreatePreset = (name: string, color: ColorEnum) => {
    const trimmedName = name.trim() || 'Новый пресет';
    const newPreset: Preset = {
      id: `preset-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: trimmedName,
      color,
      rounds,
      stages: stages.map((s) => ({ ...s })),
    };
    setPresets((prev) => [...prev, newPreset]);
  };

  const handleUpdatePreset = (id: string, name: string, color: ColorEnum) => {
    const trimmedName = name.trim() || 'Пресет';
    setPresets((prev) =>
      prev.map((preset) =>
        preset.id === id
          ? {
              ...preset,
              name: trimmedName,
              color,
            }
          : preset,
      ),
    );
  };

  const handleDuplicatePreset = (id: string) => {
    setPresets((prev) => {
      const original = prev.find((p) => p.id === id);
      if (!original) return prev;
      const copy: Preset = {
        ...original,
        id: `preset-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: `${original.name} (копия)`,
      };
      return [...prev, copy];
    });
  };

  const handleDeletePreset = (id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
    setSelectedPresetId((prev) => (prev === id ? null : prev));
  };

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: mode === 'dark' ? 'rgb(33, 33, 33)' : 'background.default',
          color: mode === 'dark' ? '#ffffff' : 'text.primary',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <BreathingTimerView
          mode={mode}
          currentStage={timer.currentStage}
          currentRound={timer.currentRound}
          rounds={rounds}
          displayTime={timer.displayTime}
          progressValue={timer.progressValue}
          isRunning={timer.isRunning}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={timer.reset}
        />

        <BreathingDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          stages={stages}
          rounds={rounds}
          isRunning={timer.isRunning}
          onRoundsChange={handleRoundsChange}
          onStageChange={handleStageFieldChange}
          onAddStage={handleAddStage}
          onDeleteStage={handleDeleteStage}
          onReorderStages={handleReorderStages}
          onDuplicateStage={handleDuplicateStage}
          presets={presets}
          selectedPresetId={selectedPresetId}
          onSelectPreset={handleSelectPreset}
          onCreatePreset={handleCreatePreset}
          onUpdatePreset={handleUpdatePreset}
          onDuplicatePreset={handleDuplicatePreset}
          onDeletePreset={handleDeletePreset}
        />

        <Fab
          size='small'
          color='default'
          sx={{ position: 'fixed', right: 16, bottom: 16 }}
          onClick={() => setIsDrawerOpen(true)}
        >
          <SettingsIcon />
        </Fab>

        <Fab size='small' color='default' sx={{ position: 'fixed', right: 16, top: 16 }} onClick={toggleMode}>
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </Fab>
      </Box>
    </ThemeProvider>
  );
};

export default App;
