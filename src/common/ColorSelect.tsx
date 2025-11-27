import React from 'react';
import { Box, MenuItem, Select } from '@mui/material';
import { ColorEnum } from '../types/breathing';
import { colorLabelMap, colorMap } from '../constants/breathing';

type ColorSelectProps = {
  value: ColorEnum;
  onChange: (value: ColorEnum) => void;
  size?: 'small' | 'medium';
  disabled?: boolean;
  fullWidth?: boolean;
};

export const ColorSelect: React.FC<ColorSelectProps> = ({ value, onChange, size = 'small', disabled, fullWidth }) => {
  return (
    <Select
      size={size}
      value={value}
      disabled={disabled}
      fullWidth={fullWidth}
      onChange={(e) => onChange(e.target.value as ColorEnum)}
    >
      {Object.values(ColorEnum).map((color) => (
        <MenuItem key={color} value={color}>
          {colorLabelMap[color]}
          <Box
            component='span'
            sx={{
              ml: 1,
              width: 14,
              height: 14,
              borderRadius: '50%',
              display: 'inline-block',
              bgcolor: colorMap[color],
            }}
          />
        </MenuItem>
      ))}
    </Select>
  );
};
