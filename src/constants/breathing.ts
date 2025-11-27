import { ColorEnum, Preset, SoundEffect, Stage } from '../types/breathing';

export const colorMap: Record<ColorEnum, string> = {
  [ColorEnum.PURPLE]: '#9c27b0',
  [ColorEnum.BLUE]: '#1976d2',
  [ColorEnum.GREEN]: '#2e7d32',
  [ColorEnum.ORANGE]: '#ed6c02',
  [ColorEnum.RED]: '#d32f2f',
  [ColorEnum.TEAL]: '#00897b',
  [ColorEnum.PINK]: '#d81b60',
  [ColorEnum.AMBER]: '#ffb300',
  [ColorEnum.YELLOW]: '#ffed29',
};

export const colorLabelMap: Record<ColorEnum, string> = {
  [ColorEnum.PURPLE]: 'Фиолетовый',
  [ColorEnum.BLUE]: 'Синий',
  [ColorEnum.GREEN]: 'Зелёный',
  [ColorEnum.ORANGE]: 'Оранжевый',
  [ColorEnum.RED]: 'Красный',
  [ColorEnum.TEAL]: 'Бирюзовый',
  [ColorEnum.PINK]: 'Розовый',
  [ColorEnum.AMBER]: 'Янтарный',
  [ColorEnum.YELLOW]: 'Желтый',
};

export const DEFAULT_STAGES: Stage[] = [
  {
    id: 'inhale-4',
    name: 'Вдох',
    duration: 4,
    color: ColorEnum.PURPLE,
    sound: SoundEffect.NONE,
  },
  {
    id: 'exhale-7',
    name: 'Выдох',
    duration: 7,
    color: ColorEnum.GREEN,
    sound: SoundEffect.NONE,
  },
];

export const LOCAL_STORAGE_KEY = 'breathing-timer-config';
export const THEME_KEY = 'breathing-timer-theme';
export const PRESETS_STORAGE_KEY = 'breathing-timer-presets';

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

export const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'preset-basic-4-7',
    name: '4–7 расслабление',
    color: ColorEnum.PURPLE,
    rounds: 5,
    stages: [
      {
        id: 'p1-inhale-4',
        name: 'Вдох',
        duration: 4,
        color: ColorEnum.PURPLE,
      },
      {
        id: 'p1-exhale-7',
        name: 'Выдох',
        duration: 7,
        color: ColorEnum.GREEN,
      },
    ],
  },
  {
    id: 'preset-4-7-8',
    name: '4–7–8 сон',
    color: ColorEnum.TEAL,
    rounds: 4,
    stages: [
      {
        id: 'p2-inhale-4',
        name: 'Вдох',
        duration: 4,
        color: ColorEnum.BLUE,
      },
      {
        id: 'p2-hold-7',
        name: 'Задержка',
        duration: 7,
        color: ColorEnum.AMBER,
      },
      {
        id: 'p2-exhale-8',
        name: 'Выдох',
        duration: 8,
        color: ColorEnum.GREEN,
      },
    ],
  },
  {
    id: 'preset-box-4',
    name: 'Box 4–4–4–4',
    color: ColorEnum.AMBER,
    rounds: 4,
    stages: [
      {
        id: 'p3-inhale-4',
        name: 'Вдох',
        duration: 4,
        color: ColorEnum.BLUE,
      },
      {
        id: 'p3-hold-4-1',
        name: 'Задержка',
        duration: 4,
        color: ColorEnum.AMBER,
      },
      {
        id: 'p3-exhale-4',
        name: 'Выдох',
        duration: 4,
        color: ColorEnum.GREEN,
      },
      {
        id: 'p3-hold-4-2',
        name: 'Задержка',
        duration: 4,
        color: ColorEnum.AMBER,
      },
    ],
  },
];

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
