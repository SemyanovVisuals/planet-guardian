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
  let paused = true

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

export function getScriptComponent<T extends BaseScriptComponent>(component: new () => T, obj: SceneObject): T | null {
    const allComponents = obj.getComponents("Component.ScriptComponent")
    const name = component.prototype.getTypeName();

    for (let i = 0; i < allComponents.length; i++) {
        const comp = allComponents[i]

        if (comp && comp.getTypeName() == name) {
            return comp as unknown as T
        }
    }
    return null
}