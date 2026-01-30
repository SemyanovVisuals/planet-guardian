import {setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"

export function setInterval(callback: () => void, delay: number): any {
  let cancelled = false

  const intervalFunc = () => {
    if (!cancelled) {
      callback()
      setTimeout(intervalFunc, delay)
    }
  }

  setTimeout(intervalFunc, delay)

  return {
    cancel: () => {
      cancelled = true
    }
  }
}