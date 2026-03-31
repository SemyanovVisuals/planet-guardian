import {setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"

export interface Interval {
  cancel: () => void;
  setPaused: (state: boolean) => void;
}

export function setInterval(callback: () => void, delay: number): Interval {
  return setIntervalRandom(callback, delay, delay);
}

export function setIntervalRandom(callback: () => void, min: number, max: number): Interval {
  let cancelled = false
  let paused = false

  const intervalFunc = () => {
    if (!cancelled) {
      if (!paused) callback()
      setTimeout(intervalFunc, randint(min, max))
    }
  }

  setTimeout(intervalFunc, randint(min, max))

  return {
    cancel: () => {
      cancelled = true
    },
    setPaused: (state: boolean) => {
      paused = state;
    }
  }
}

export function randint(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}