import { useCallback, useState } from 'react'

import type { Dispatch, SetStateAction } from 'react'

/** Represents the second element of the output of the `useStep` hook. */
type UseStepActions = {
  /** Go to the next step in the process. */
  goToNextStep: () => void
  /** Go to the previous step in the process. */
  goToPrevStep: () => void
  /** Reset the step to the initial step. */
  reset: () => void
  /** Check if the next step is available. */
  canGoToNextStep: boolean
  /** Check if the previous step is available. */
  canGoToPrevStep: boolean
  /** Set the current step to a specific value. */
  setStep: Dispatch<SetStateAction<number>>
}

type SetStepCallbackType = (step: number | ((step: number) => number)) => void

/**
 * Custom hook that manages and navigates between steps in a multi-step process.
 * @param {number} maxStep - The maximum step in the process.
 * @param {number} initialStep - The initial step.
 * @returns {[number, UseStepActions]} An tuple containing the current step and helper functions for navigating steps.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-step)
 * @example
 * ```tsx
 * const [currentStep, { goToNextStep, goToPrevStep, reset, canGoToNextStep, canGoToPrevStep, setStep }] = useStep(3);
 * // Access and use the current step and provided helper functions.
 * ```
 */
export function useStep(maxStep: number, initialStep: number = 1): [number, UseStepActions] {
  if (initialStep < 1 || initialStep > maxStep) {
    throw new Error(`initialStep must be in range 1 - ${maxStep}`)
  }

  const [currentStep, setCurrentStep] = useState(initialStep)

  const canGoToNextStep = currentStep + 1 <= maxStep
  const canGoToPrevStep = currentStep - 1 > 0

  const setStep = useCallback<SetStepCallbackType>(
    step => {
      // Allow value to be a function so we have the same API as useState
      const newStep = step instanceof Function ? step(currentStep) : step

      if (newStep >= 1 && newStep <= maxStep) {
        setCurrentStep(newStep)
        return
      }

      throw new Error('Step not valid')
    },
    [maxStep, currentStep],
  )

  const goToNextStep = useCallback(() => {
    if (canGoToNextStep) {
      setCurrentStep(step => step + 1)
    }
  }, [canGoToNextStep])

  const goToPrevStep = useCallback(() => {
    if (canGoToPrevStep) {
      setCurrentStep(step => step - 1)
    }
  }, [canGoToPrevStep])

  const reset = useCallback(() => {
    setCurrentStep(1)
  }, [])

  return [
    currentStep,
    {
      goToNextStep,
      goToPrevStep,
      canGoToNextStep,
      canGoToPrevStep,
      setStep,
      reset,
    },
  ]
}
