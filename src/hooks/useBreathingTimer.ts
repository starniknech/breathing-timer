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

export const useBreathingTimer = (stages: Stage[], rounds: number): BreathingTimerResult => {
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [stageElapsedMs, setStageElapsedMs] = useState<number>(0);

  const currentStage = useMemo(() => stages[currentStageIndex] ?? null, [stages, currentStageIndex]);

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

  useEffect(() => {
    if (!isRunning) return;
    const stage = currentStage;
    if (!stage) return;

    const durationMs = stage.duration * 1000;

    if (stageElapsedMs < durationMs) return;

    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
      setStageElapsedMs(0);
    } else if (currentRound < rounds) {
      setCurrentRound(currentRound + 1);
      setCurrentStageIndex(0);
      setStageElapsedMs(0);
    } else {
      setIsRunning(false);
      setIsCompleted(true);
    }
  }, [stageElapsedMs, isRunning, currentStage, currentStageIndex, currentRound, rounds, stages.length]);

  const elapsedSec = stageElapsedMs / 1000;
  const durationSec = currentStage?.duration ?? 1;

  const remaining = currentStage ? durationSec - elapsedSec : 0;
  const displayTime = currentStage ? Math.max(0, Math.ceil(remaining)) : 0;

  const clampedElapsed = Math.min(Math.max(elapsedSec, 0), durationSec);
  const progressValue = currentStage ? (clampedElapsed / durationSec) * 100 : 0;

  console.log('[useBreathingTimer] tick', {
    stage: currentStage?.name,
    round: currentRound,
    elapsedSec: Number(elapsedSec.toFixed(2)),
    displayTime,
    progressValue: Number(progressValue.toFixed(2)),
  });

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
