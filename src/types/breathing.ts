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
}

export interface Preset {
  id: string;
  name: string;
  color: ColorEnum;
  stages: Stage[];
  rounds: number;
}
