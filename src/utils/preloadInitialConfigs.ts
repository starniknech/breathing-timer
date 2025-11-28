import { DEFAULT_PRESETS, DEFAULT_STAGES, LOCAL_STORAGE_KEY, PRESETS_STORAGE_KEY } from '../constants/constants';
import { ColorEnum, Preset, Stage } from '../types/breathing';

export const loadInitialConfig = (): { stages: Stage[]; rounds: number } => {
  if (typeof window === 'undefined') {
    return { stages: DEFAULT_STAGES, rounds: 4 };
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return { stages: DEFAULT_STAGES, rounds: 4 };
    }

    const parsed = JSON.parse(raw) as { stages?: Stage[]; rounds?: number };

    const stages =
      parsed.stages && Array.isArray(parsed.stages) && parsed.stages.length
        ? parsed.stages.map((s, index) => ({
            id: s.id ?? `stage-${index}-${Date.now()}`,
            name: s.name || 'Этап',
            duration: Number(s.duration) > 0 ? Number(s.duration) : 1,
            color: Object.values(ColorEnum).includes(s.color as ColorEnum) ? (s.color as ColorEnum) : ColorEnum.PURPLE,
          }))
        : DEFAULT_STAGES;

    const rounds = typeof parsed.rounds === 'number' && parsed.rounds > 0 ? parsed.rounds : 4;

    return { stages, rounds };
  } catch {
    return { stages: DEFAULT_STAGES, rounds: 4 };
  }
};

export const loadInitialPresets = (): Preset[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_PRESETS;
  }

  try {
    const raw = window.localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PRESETS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return DEFAULT_PRESETS;
    }
    return parsed as Preset[];
  } catch {
    return DEFAULT_PRESETS;
  }
};
