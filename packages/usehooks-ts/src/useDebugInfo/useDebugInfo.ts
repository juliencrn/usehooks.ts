import { useEffect, useRef } from 'react'

export function isEmpty(value: any) {
  if (value == null) {
    return true
  }
  if (
    Array.isArray(value) ||
    typeof value == 'string' ||
    typeof value.splice == 'function'
  ) {
    return !value.length
  }
  for (const key in value) {
    if (Object.hasOwnProperty.call(value, key)) {
      return false
    }
  }
  return true
}

const useRenderCount = (): number => {
  const count = useRef(1)

  useEffect(() => {
    // Updated in useEffect() to not count twice if using React.StrictMode
    count.current += 1
  })

  return count.current
}

export type ChangedProps = Record<
  string,
  {
    prev: unknown
    new: unknown
  }
>

const useDebugPropChanges = (
  props: Readonly<Record<string, unknown>>,
): ChangedProps => {
  const previousProps = useRef<Record<string, unknown>>(props)
  const changedProps = useRef<ChangedProps>({})

  if (previousProps.current) {
    // const allKeys = new Set(Object.keys({ ...props, ...previousProps.current }));
    const propKeys = Object.keys({ ...props, ...previousProps.current })

    changedProps.current = propKeys.reduce((changedPropsObj, key) => {
      if (props[key] !== previousProps.current[key]) {
        return {
          ...changedPropsObj,
          [key]: {
            prev: previousProps.current[key],
            new: props[key],
          },
        }
      }

      return changedPropsObj
    }, {} as ChangedProps)
  }

  previousProps.current = props

  return changedProps.current
}

interface DebugInfo {
  renderCount: number
  changedProps: ChangedProps
  timeSinceLastRender: number
  lastRenderTimestamp: number
}

const useDebugInfo = (
  componentName: string,
  props: Readonly<Record<string, unknown>>,
  logOnlyWhenPropsChange?: boolean,
) => {
  const componentDisplayName = `<${componentName} />`
  const renderCount = useRenderCount()
  const changedProps = useDebugPropChanges(props)
  const lastRenderTimestamp = useRef<number>(Date.now())
  const initialPropsRef = useRef(props)

  const info: DebugInfo = {
    renderCount,
    changedProps,
    timeSinceLastRender: Date.now() - lastRenderTimestamp.current,
    lastRenderTimestamp: lastRenderTimestamp.current,
  }

  useEffect(() => {
    lastRenderTimestamp.current = Date.now()
    const propsHaveChanged = !isEmpty(info.changedProps)

    if (!logOnlyWhenPropsChange || propsHaveChanged) {
      console.log(
        `%c[debug-info] %c${componentDisplayName} Re-rendered`,
        'color: orange',
        `color: ${propsHaveChanged ? 'orange' : 'initial'}`,
        info,
      )
    }
  })

  useEffect(() => {
    console.log(
      `%c[debug-info] %c${componentDisplayName} Mounted`,
      'color: orange',
      'color: green',
      initialPropsRef.current,
    )

    return () => {
      console.log(
        `%c[debug-info] %c${componentDisplayName} Unmounted`,
        'color: orange',
        'color: pink',
      )
    }
  }, [componentName])
}

export default useDebugInfo
