import { ColorEnum, Preset, RawPreset, RawStage, SoundEffect, Stage } from '../types/breathing';
import rawStages from '../data/defaultStages.json';
import rawPresets from '../data/defaultPresets.json';

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

export const LOCAL_STORAGE_KEY = 'breathing-timer-config';
export const THEME_KEY = 'breathing-timer-theme';
export const PRESETS_STORAGE_KEY = 'breathing-timer-presets';

const normalizeStage = (s: RawStage, index: number): Stage => {
  const color: ColorEnum =
    s.color && Object.values(ColorEnum).includes(s.color as ColorEnum) ? (s.color as ColorEnum) : ColorEnum.PURPLE;

  const sound: SoundEffect =
    s.sound && Object.values(SoundEffect).includes(s.sound as SoundEffect)
      ? (s.sound as SoundEffect)
      : SoundEffect.NONE;

  return {
    id: s.id ?? `stage-${index}-${Date.now()}`,
    name: s.name ?? 'Этап',
    duration: typeof s.duration === 'number' && s.duration > 0 ? s.duration : 1,
    color,
    sound,
  };
};

export const DEFAULT_STAGES: Stage[] = (rawStages as RawStage[]).map((s, index) => normalizeStage(s, index));

export const DEFAULT_PRESETS: Preset[] = (rawPresets as RawPreset[]).map((p, presetIndex) => {
  const color: ColorEnum =
    p.color && Object.values(ColorEnum).includes(p.color as ColorEnum) ? (p.color as ColorEnum) : ColorEnum.PURPLE;

  const rounds = typeof p.rounds === 'number' && p.rounds > 0 ? p.rounds : 1;

  const stages = (p.stages ?? []).map((s, stageIndex) => normalizeStage(s, stageIndex));

  return {
    id: p.id ?? `preset-${presetIndex}-${Date.now()}`,
    name: p.name ?? 'Пресет',
    color,
    rounds,
    stages,
  };
});
