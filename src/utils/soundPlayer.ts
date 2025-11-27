import { SoundEffect } from '../types/breathing';

// импортируешь реальные файлы:
import marimba from '../assets/sounds/marimba-loop.mp3';
import ringtone from '../assets/sounds/ringtone.mp3';
import timerTick from '../assets/sounds/timer-terminer.mp3';

const soundMap: Record<SoundEffect, string | null> = {
  [SoundEffect.NONE]: null,
  [SoundEffect.TIMER_TICK]: timerTick,
  [SoundEffect.RINGTONE]: ringtone,
  [SoundEffect.MARIMBA]: marimba,
};

export const playSound = (effect: SoundEffect) => {
  const src = soundMap[effect];
  if (!src) return;

  const audio = new Audio(src);
  audio.play().catch(() => {
    // если браузер заблокировал автоплей — просто игнорим
  });
};
