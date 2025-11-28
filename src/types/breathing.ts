export enum ColorEnum {
  PURPLE = 'purple',
  BLUE = 'blue',
  GREEN = 'green',
  ORANGE = 'orange',
  RED = 'red',
  TEAL = 'teal',
  PINK = 'pink',
  AMBER = 'amber',
  YELLOW = 'yellow',
}

export interface Stage {
  id: string;
  name: string;
  duration: number;
  color: ColorEnum;
  sound?: SoundEffect;
}

export interface Preset {
  id: string;
  name: string;
  color: ColorEnum;
  stages: Stage[];
  rounds: number;
}

export enum SoundEffect {
  NONE = 'none',
  MARIMBA = 'sound1',
  RINGTONE = 'sound2',
  TIMER_TICK = 'sound3',
}

export type RawStage = {
  id?: string;
  name?: string;
  duration?: number;
  color?: string;
  sound?: string;
};

export type RawPreset = {
  id?: string;
  name?: string;
  color?: string;
  rounds?: number;
  stages?: RawStage[];
};
