import { ColorEnum, Stage } from '../types/breathing';

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

export const DEFAULT_STAGES: Stage[] = [
  {
    id: 'inhale-4',
    name: 'Вдох',
    duration: 4,
    color: ColorEnum.PURPLE,
  },
  {
    id: 'exhale-7',
    name: 'Выдох',
    duration: 7,
    color: ColorEnum.GREEN,
  },
];

export const LOCAL_STORAGE_KEY = 'breathing-timer-config';
export const THEME_KEY = 'breathing-timer-theme';

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
            color:
              Object.values(ColorEnum).includes(s.color as ColorEnum)
                ? (s.color as ColorEnum)
                : ColorEnum.PURPLE,
          }))
        : DEFAULT_STAGES;

    const rounds =
      typeof parsed.rounds === 'number' && parsed.rounds > 0
        ? parsed.rounds
        : 4;

    return { stages, rounds };
  } catch {
    return { stages: DEFAULT_STAGES, rounds: 4 };
  }
};
