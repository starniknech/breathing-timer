import React from 'react';
import { Select, MenuItem, SelectProps, FormControl, InputLabel } from '@mui/material';
import { SoundEffect } from '../types/breathing';

type SoundSelectProps = Omit<SelectProps<SoundEffect>, 'value' | 'onChange' | 'label'> & {
  value: SoundEffect;
  onChange: (value: SoundEffect) => void;
  fullWidth?: boolean;
};

export const SoundSelect: React.FC<SoundSelectProps> = ({
  value,
  onChange,
  size = 'small',
  fullWidth,
  id,
  ...selectProps
}) => {
  const selectId = id ?? 'sound-select';
  const labelId = `${selectId}-label`;
  const label = "Звук"

  return (
    <FormControl size={size} fullWidth={fullWidth}>
      <InputLabel id={labelId}>{label}</InputLabel>

      <Select<SoundEffect>
        id={selectId}
        labelId={labelId}
        label={label}
        size={size}
        value={value}
        onChange={(e) => onChange(e.target.value as SoundEffect)}
        {...selectProps}
      >
        <MenuItem value={SoundEffect.NONE}>Нет</MenuItem>
        <MenuItem value={SoundEffect.TIMER_TICK}>Короткий звук</MenuItem>
        <MenuItem value={SoundEffect.RINGTONE}>Рингтон</MenuItem>
        <MenuItem value={SoundEffect.MARIMBA}>Маримба</MenuItem>
      </Select>
    </FormControl>
  );
};
