// hooks/useBreathingTimer.ts
import { useEffect, useMemo, useState } from 'react';
import { Stage } from '../types/breathing';

export type BreathingTimerResult = {
  currentStage: Stage | null;
  currentRound: number;
  isRunning: boolean;
  isCompleted: boolean;
  displayTime: number;
  progressValue: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
};

type StageCompleteCallback = (finishedStage: Stage, round: number, nextStage: Stage | null) => void;

export const useBreathingTimer = (
  stages: Stage[],
  rounds: number,
  onStageComplete?: StageCompleteCallback,
): BreathingTimerResult => {
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [stageElapsedMs, setStageElapsedMs] = useState<number>(0);

  const currentStage = useMemo(() => stages[currentStageIndex] ?? null, [stages, currentStageIndex]);

  // ресет индекса, если изменилось количество стадий
  useEffect(() => {
    if (!stages.length) {
      setIsRunning(false);
      setIsCompleted(false);
      setCurrentRound(1);
      setCurrentStageIndex(0);
      setStageElapsedMs(0);
      return;
    }

    setCurrentStageIndex((prev) => {
      if (prev < 0 || prev >= stages.length) return 0;
      return prev;
    });
  }, [stages.length]);

  // сам таймер (requestAnimationFrame)
  useEffect(() => {
    if (!isRunning) return;
    if (!currentStage) return;

    let frameId: number;
    let prevTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const delta = now - prevTime;
      prevTime = now;

      setStageElapsedMs((prev) => prev + delta);

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isRunning, currentStageIndex, currentRound, stages.length, currentStage]);

  // переходы между этапами/кругами + КОЛБЭК завершения этапа
  useEffect(() => {
    if (!isRunning) return;
    const stage = currentStage;
    if (!stage) return;

    const durationMs = stage.duration * 1000;
    if (stageElapsedMs < durationMs) return;

    const finishedStage = stage;
    const isLastStageInRound = currentStageIndex === stages.length - 1;
    const isLastRound = currentRound === rounds;

    let nextStage: Stage | null = null;

    if (!isLastStageInRound) {
      nextStage = stages[currentStageIndex + 1];
    } else if (!isLastRound) {
      nextStage = stages[0];
    } else {
      nextStage = null;
    }

    // 👉 вызываем колбэк именно в момент завершения stage
    if (onStageComplete) {
      onStageComplete(finishedStage, currentRound, nextStage);
    }

    // дальше уже переключаем состояние
    if (!isLastStageInRound) {
      setCurrentStageIndex(currentStageIndex + 1);
      setStageElapsedMs(0);
    } else if (!isLastRound) {
      setCurrentRound(currentRound + 1);
      setCurrentStageIndex(0);
      setStageElapsedMs(0);
    } else {
      setIsRunning(false);
      setIsCompleted(true);
    }
  }, [stageElapsedMs, isRunning, currentStage, currentStageIndex, currentRound, rounds, stages, onStageComplete]);

  const elapsedSec = stageElapsedMs / 1000;
  const durationSec = currentStage?.duration ?? 1;

  const remaining = currentStage ? durationSec - elapsedSec : 0;
  const displayTime = currentStage ? Math.max(0, Math.ceil(remaining)) : 0;

  const clampedElapsed = Math.min(Math.max(elapsedSec, 0), durationSec);
  const progressValue = currentStage ? (clampedElapsed / durationSec) * 100 : 0;

  const start = () => {
    if (!stages.length) return;

    if (isCompleted || !currentStage) {
      setCurrentRound(1);
      setCurrentStageIndex(0);
      setStageElapsedMs(0);
      setIsCompleted(false);
      setIsRunning(true);
      return;
    }

    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setCurrentRound(1);
    setCurrentStageIndex(0);
    setStageElapsedMs(0);
  };

  return {
    currentStage,
    currentRound,
    isRunning,
    isCompleted,
    displayTime,
    progressValue,
    start,
    pause,
    reset,
  };
};
