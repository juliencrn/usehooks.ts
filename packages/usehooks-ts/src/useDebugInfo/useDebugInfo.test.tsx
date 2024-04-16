import { type ReactElement, useCallback, useEffect, useState } from 'react'

// import { act, renderHook } from '@testing-library/react-hooks';
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useDebugInfo, { isEmpty } from './useDebugInfo'

const renderTime = 40

function renderWithSetup(component: ReactElement) {
  const consoleLogSpy = jest.spyOn(console, 'log')

  let consoleLogSpyNthCall = 1

  return {
    user: userEvent.setup(),
    checkConsoleLog: (componentName: string, ...args: any[]) => {
      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        consoleLogSpyNthCall,
        ...(!!args && args.length > 0
          ? [
              `%c[debug-info] %c<${componentName} /> ${
                args[0].renderCount
                  ? 'Re-rendered'
                  : isEmpty(args[0])
                  ? 'Unmounted'
                  : 'Mounted'
              }`,
              'color: orange',
              expect.any(String),
              ...(isEmpty(args[0]) ? [] : args),
            ]
          : [componentName]),
      )
      consoleLogSpyNthCall++
    },
    checkNoConsoleLog: (nthCallsInLatestEvent: number) => {
      expect(consoleLogSpy).not.toHaveBeenCalledTimes(
        nthCallsInLatestEvent + (consoleLogSpyNthCall - 1),
      )
    },
    ...render(component),
  }
}

function TestComponent() {
  const [string, setString] = useState('0')
  const [number, setNumber] = useState(0)

  useDebugInfo('TestComponent', {
    string,
    number,
  })

  useEffect(() => {
    console.log('TestComponent useEffect ran')
  }, [string, number])

  function incrementString() {
    setString(prev => String(Number(prev) + 1))
  }

  function incrementNumber() {
    setNumber(prev => prev + 1)
  }

  function incrementAll() {
    incrementString()
    incrementNumber()
  }

  return (
    <>
      <p>String: {string}</p>
      <p>Number: {number}</p>
      <button onClick={incrementAll}>Increment All</button>
    </>
  )
}

function TestOnlyChangedPropsComponent() {
  const [string, setString] = useState('0')
  const [number, setNumber] = useState(0)

  useDebugInfo(
    'TestOnlyChangedPropsComponent',
    {
      string,
      number,
    },
    true,
  )

  useEffect(() => {
    console.log('TestOnlyChangedPropsComponent useEffect ran')
  }, [string, number])

  function incrementString() {
    setString(prev => String(Number(prev) + 1))
  }

  function incrementNumber() {
    setNumber(prev => prev + 1)
  }

  function incrementAll() {
    incrementString()
    incrementNumber()
  }

  return (
    <>
      <p>String: {string}</p>
      <p>Number: {number}</p>
      <button onClick={incrementAll}>Increment All</button>
    </>
  )
}

function TestPrimitivesComponent({
  initialSymbol,
  updatedSymbol,
}: {
  initialSymbol: symbol
  updatedSymbol: symbol
}) {
  const [string, setString] = useState('0')
  const [number, setNumber] = useState(0)
  const [bigint, setBigint] = useState(BigInt(0))
  const [boolean, setBoolean] = useState(false)
  const [symbol, setSymbol] = useState(initialSymbol)

  const [nullVal, setNullVal] = useState(null)
  const [undefinedVal, setUndefinedVal] = useState(undefined)

  useDebugInfo('TestPrimitivesComponent', {
    string,
    number,
    bigint,
    boolean,
    symbol,
    nullVal,
    undefinedVal,
  })

  useEffect(() => {
    console.log('TestPrimitivesComponent useEffect ran')
  }, [string, number, bigint, boolean, symbol, nullVal, undefinedVal])

  function incrementString() {
    setString(prev => String(Number(prev) + 1))
  }

  function incrementNumber() {
    setNumber(prev => prev + 1)
  }

  function incrementBigint() {
    setBigint(prev => BigInt(Number(prev) + 1))
  }

  function toggleBoolean() {
    setBoolean(prev => !prev)
  }

  function updateSymbol() {
    setSymbol(updatedSymbol)
  }

  function updateNullVal() {
    setNullVal(null)
  }

  function updateUndefinedVal() {
    setUndefinedVal(undefined)
  }

  return (
    <>
      <p>String: {string}</p>
      <p>Number: {number}</p>
      <p>Bigint: {String(bigint)}</p>
      <p>Boolean: {String(boolean)}</p>
      <p>Symbol: {String(symbol)}</p>
      <p>NullVal: {String(nullVal)}</p>
      <p>UndefinedVal: {String(undefinedVal)}</p>
      <button onClick={incrementString}>Increment String</button>
      <button onClick={incrementNumber}>Increment Number</button>
      <button onClick={incrementBigint}>Increment Bigint</button>
      <button onClick={toggleBoolean}>Toggle Boolean</button>
      <button onClick={updateSymbol}>Update Symbol</button>
      <button onClick={updateNullVal}>Update NullVal</button>
      <button onClick={updateUndefinedVal}>Update UndefinedVal</button>
    </>
  )
}

function TestFunctionComponent({
  initialFunction,
  rerenderedFunction,
  depsChangedFunction,
  initialMemoizedFunction,
  depsChangedMemoizedFunction,
}: {
  initialFunction: () => void
  rerenderedFunction: () => void
  depsChangedFunction: () => void
  initialMemoizedFunction: () => void
  depsChangedMemoizedFunction: () => void
}) {
  const [hasRerendered, setHasRerendered] = useState(false)
  const [memoizedFunctionDepsChange, setMemoizedFunctionDepsChange] =
    useState(false)

  // This simulates a function changing on each rerender (of the state)
  const Function = memoizedFunctionDepsChange
    ? depsChangedFunction
    : hasRerendered
    ? rerenderedFunction
    : initialFunction

  const MemoizedFunction = useCallback(
    // This simulates a function changing when the `useCallback` deps change
    memoizedFunctionDepsChange
      ? depsChangedMemoizedFunction
      : initialMemoizedFunction,
    [memoizedFunctionDepsChange],
  )

  useDebugInfo('TestFunctionComponent', {
    Function,
    MemoizedFunction,
  })

  useEffect(() => {
    console.log('TestFunctionComponent useEffect ran')
  }, [Function, MemoizedFunction])

  function triggerRerender() {
    setHasRerendered(true)
  }

  function triggerMemoizedFunctionDepsChange() {
    setMemoizedFunctionDepsChange(true)
  }

  return (
    <>
      <button onClick={triggerRerender}>Trigger Rerender</button>
      <button onClick={triggerMemoizedFunctionDepsChange}>
        Trigger Memoized Function Deps Change
      </button>
    </>
  )
}

function TestObjectComponent({
  initialObject,
  updatedObject,
}: {
  initialObject: Record<string, unknown>
  updatedObject: Record<string, unknown>
}) {
  const [object, setObject] = useState(initialObject)
  const [otherDep, setOtherDep] = useState(0)

  useDebugInfo('TestObjectComponent', {
    object,
    otherDep,
  })

  useEffect(() => {
    console.log('TestObjectComponent useEffect ran')
  }, [object, otherDep])

  function updateObject() {
    setObject(updatedObject)
  }

  function updateOtherDep() {
    setOtherDep(prev => prev + 1)
  }

  return (
    <>
      <p>{`Object: ${object}`}</p>
      <p>OtherDep: {otherDep}</p>
      <button onClick={updateObject}>Update Object</button>
      <button onClick={updateOtherDep}>Update OtherDep</button>
    </>
  )
}

function TestDateComponent({
  initialDate,
  updatedDate,
}: {
  initialDate: Date
  updatedDate: Date
}) {
  const [date, setDate] = useState(initialDate)
  const [otherDep, setOtherDep] = useState(0)

  useDebugInfo('TestDateComponent', {
    date,
    otherDep,
  })

  useEffect(() => {
    console.log('TestDateComponent useEffect ran')
  }, [date, otherDep])

  function updateDate() {
    setDate(updatedDate)
  }

  function updateOtherDep() {
    setOtherDep(prev => prev + 1)
  }

  return (
    <>
      <p>Date: {String(date)}</p>
      <p>OtherDep: {otherDep}</p>
      <button onClick={updateDate}>Update Date</button>
      <button onClick={updateOtherDep}>Update OtherDep</button>
    </>
  )
}

const date = new Date(2000, 1, 1, 13)

describe('useDebugInfo', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    // tell vitest we use mocked time
    jest.useFakeTimers({ shouldAdvanceTime: true })
    jest.setSystemTime(date)
  })

  afterEach(() => {
    // restoring date after each test run
    jest.useRealTimers()
  })

  test('outputs the logs as expected', async () => {
    const { user, checkConsoleLog } = renderWithSetup(<TestComponent />)

    checkConsoleLog('TestComponent', {
      renderCount: 1,
      changedProps: {},
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: 0,
    })
    checkConsoleLog('TestComponent', {
      string: '0',
      number: 0,
    })
    checkConsoleLog('TestComponent useEffect ran')

    expect(screen.getByText('String: 0'))
    expect(screen.getByText('Number: 0'))

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }))
    })

    checkConsoleLog('TestComponent', {
      renderCount: 2,
      changedProps: {
        string: { prev: '0', new: '1' },
        number: { prev: 0, new: 1 },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestComponent useEffect ran')

    expect(screen.getByText('String: 1'))
    expect(screen.getByText('Number: 1'))

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }))
    })

    checkConsoleLog('TestComponent', {
      renderCount: 3,
      changedProps: {
        string: { prev: '1', new: '2' },
        number: { prev: 1, new: 2 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 2,
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestComponent useEffect ran')

    expect(screen.getByText('String: 2'))
    expect(screen.getByText('Number: 2'))

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }))
    })

    checkConsoleLog('TestComponent', {
      renderCount: 4,
      changedProps: {
        string: { prev: '2', new: '3' },
        number: { prev: 2, new: 3 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 4,
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestComponent useEffect ran')

    expect(screen.getByText('String: 3'))
    expect(screen.getByText('Number: 3'))

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }))
    })

    checkConsoleLog('TestComponent', {
      renderCount: 5,
      changedProps: {
        string: { prev: '3', new: '4' },
        number: { prev: 3, new: 4 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 6,
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestComponent useEffect ran')

    expect(screen.getByText('String: 4'))
    expect(screen.getByText('Number: 4'))
  })

  test('outputs only the logs when props change', async () => {
    const { user, checkConsoleLog } = renderWithSetup(
      <TestOnlyChangedPropsComponent />,
    )

    checkConsoleLog('TestOnlyChangedPropsComponent', {
      string: '0',
      number: 0,
    })
    checkConsoleLog('TestOnlyChangedPropsComponent useEffect ran')

    expect(screen.getByText('String: 0'))
    expect(screen.getByText('Number: 0'))

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }))
    })

    checkConsoleLog('TestOnlyChangedPropsComponent', {
      renderCount: 2,
      changedProps: {
        string: { prev: '0', new: '1' },
        number: { prev: 0, new: 1 },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestOnlyChangedPropsComponent useEffect ran')

    expect(screen.getByText('String: 1'))
    expect(screen.getByText('Number: 1'))

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }))
    })

    checkConsoleLog('TestOnlyChangedPropsComponent', {
      renderCount: 3,
      changedProps: {
        string: { prev: '1', new: '2' },
        number: { prev: 1, new: 2 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 2,
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestOnlyChangedPropsComponent useEffect ran')

    expect(screen.getByText('String: 2'))
    expect(screen.getByText('Number: 2'))

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }))
    })

    checkConsoleLog('TestOnlyChangedPropsComponent', {
      renderCount: 4,
      changedProps: {
        string: { prev: '2', new: '3' },
        number: { prev: 2, new: 3 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 4,
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestOnlyChangedPropsComponent useEffect ran')

    expect(screen.getByText('String: 3'))
    expect(screen.getByText('Number: 3'))

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }))
    })

    checkConsoleLog('TestOnlyChangedPropsComponent', {
      renderCount: 5,
      changedProps: {
        string: { prev: '3', new: '4' },
        number: { prev: 3, new: 4 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 6,
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestOnlyChangedPropsComponent useEffect ran')

    expect(screen.getByText('String: 4'))
    expect(screen.getByText('Number: 4'))
  })

  // Primitives: string, number, bigint, boolean, symbol, null and undefined
  test('handles primitives as expected', async () => {
    const initialSymbol = Symbol(0)
    const updatedSymbol = Symbol(1)

    const { user, checkConsoleLog, checkNoConsoleLog } = renderWithSetup(
      <TestPrimitivesComponent
        initialSymbol={initialSymbol}
        updatedSymbol={updatedSymbol}
      />,
    )

    // Check the handling of the mounted initial values
    checkConsoleLog('TestPrimitivesComponent', {
      renderCount: 1,
      changedProps: {},
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: 0,
    })
    checkConsoleLog('TestPrimitivesComponent', {
      string: '0',
      number: 0,
      bigint: BigInt(0),
      boolean: false,
      symbol: initialSymbol,
      nullVal: null,
      // `undefinedVal` should not appear as a result of initial value being `undefined`
    })
    checkConsoleLog('TestPrimitivesComponent useEffect ran')

    expect(screen.getByText('String: 0'))
    expect(screen.getByText('Number: 0'))
    expect(screen.getByText(`Bigint: ${BigInt(0)}`))
    expect(screen.getByText('Boolean: false'))
    expect(screen.getByText(`Symbol: ${String(initialSymbol)}`))
    expect(screen.getByText('NullVal: null'))
    expect(screen.getByText('UndefinedVal: undefined'))

    // NOTE: Checking each data type seperately shows that each does not appear when it has not been changed

    // String
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment String' }))
    })

    checkConsoleLog('TestPrimitivesComponent', {
      renderCount: 2,
      changedProps: {
        string: { prev: '0', new: '1' },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestPrimitivesComponent useEffect ran')

    expect(screen.getByText('String: 1'))

    // Number
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment Number' }))
    })

    checkConsoleLog('TestPrimitivesComponent', {
      renderCount: 3,
      changedProps: {
        number: { prev: 0, new: 1 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 2,
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestPrimitivesComponent useEffect ran')

    expect(screen.getByText('Number: 1'))

    // Bigint
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment Bigint' }))
    })

    checkConsoleLog('TestPrimitivesComponent', {
      renderCount: 4,
      changedProps: {
        bigint: { prev: BigInt(0), new: BigInt(1) },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 4,
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestPrimitivesComponent useEffect ran')

    expect(screen.getByText(`Bigint: ${BigInt(1)}`))

    // Boolean
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Toggle Boolean' }))
    })

    checkConsoleLog('TestPrimitivesComponent', {
      renderCount: 5,
      changedProps: {
        boolean: { prev: false, new: true },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 6,
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestPrimitivesComponent useEffect ran')

    expect(screen.getByText('Boolean: true'))

    // Symbol
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update Symbol' }))
    })

    checkConsoleLog('TestPrimitivesComponent', {
      renderCount: 6,
      changedProps: {
        symbol: { prev: initialSymbol, new: updatedSymbol },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 8,
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestPrimitivesComponent useEffect ran')

    expect(screen.getByText(`Symbol: ${String(updatedSymbol)}`))

    // Null
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update NullVal' }))
    })

    checkNoConsoleLog(2)

    expect(screen.getByText('NullVal: null'))

    // Undefined
    await act(async () => {
      await user.click(
        screen.getByRole('button', { name: 'Update UndefinedVal' }),
      )
    })

    checkNoConsoleLog(2)

    expect(screen.getByText('UndefinedVal: undefined'))
  })

  // TODO: Find a better way to test standard and memoized functions without simulating behaviour
  test('handles functions as expected', async () => {
    const initialFunction = () => console.log('initialFunction ran')
    const rerenderedFunction = () => console.log('rerenderedFunction ran')
    const depsChangedFunction = () => console.log('depsChangedFunction ran')
    const initialMemoizedFunction = () =>
      console.log('initialMemoizedFunction ran')
    const depsChangedMemoizedFunction = () =>
      console.log('depsChangedMemoizedFunction ran')

    const { user, checkConsoleLog } = renderWithSetup(
      <TestFunctionComponent
        initialFunction={initialFunction}
        rerenderedFunction={rerenderedFunction}
        depsChangedFunction={depsChangedFunction}
        initialMemoizedFunction={initialMemoizedFunction}
        depsChangedMemoizedFunction={depsChangedMemoizedFunction}
      />,
    )

    checkConsoleLog('TestFunctionComponent', {
      renderCount: 1,
      changedProps: {},
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: 0,
    })
    checkConsoleLog('TestFunctionComponent', {
      Function: initialFunction,
      MemoizedFunction: initialMemoizedFunction,
    })
    checkConsoleLog('TestFunctionComponent useEffect ran')

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Trigger Rerender' }))
    })

    checkConsoleLog('TestFunctionComponent', {
      renderCount: 2,
      changedProps: {
        Function: { prev: initialFunction, new: rerenderedFunction },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestFunctionComponent useEffect ran')

    await act(async () => {
      await user.click(
        screen.getByRole('button', {
          name: 'Trigger Memoized Function Deps Change',
        }),
      )
    })

    checkConsoleLog('TestFunctionComponent', {
      renderCount: 3,
      changedProps: {
        Function: { prev: rerenderedFunction, new: depsChangedFunction },
        MemoizedFunction: {
          prev: initialMemoizedFunction,
          new: depsChangedMemoizedFunction,
        },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 2,
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestFunctionComponent useEffect ran')
  })

  test('handles an object as expected', async () => {
    // NOTE: Objects have the exact same structure, but memory references are different
    const initialObject = { test: 'test' }
    const updatedObject = { test: 'test' }

    const { user, checkConsoleLog } = renderWithSetup(
      <TestObjectComponent
        initialObject={initialObject}
        updatedObject={updatedObject}
      />,
    )

    checkConsoleLog('TestObjectComponent', {
      renderCount: 1,
      changedProps: {},
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: 0,
    })
    checkConsoleLog('TestObjectComponent', {
      object: initialObject,
      otherDep: 0,
    })
    checkConsoleLog('TestObjectComponent useEffect ran')

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update Object' }))
    })

    checkConsoleLog('TestObjectComponent', {
      renderCount: 2,
      changedProps: {
        object: { prev: initialObject, new: updatedObject },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestObjectComponent useEffect ran')

    expect(screen.getByText(`Object: ${updatedObject}`))
    expect(screen.getByText('OtherDep: 0'))

    // NOTE: This test shows that a date does not appear when it has not been changed

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update OtherDep' }))
    })

    checkConsoleLog('TestObjectComponent', {
      renderCount: 3,
      changedProps: {
        otherDep: { prev: 0, new: 1 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 2,
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestObjectComponent useEffect ran')

    expect(screen.getByText('OtherDep: 1'))
  })

  test('handles a date as expected', async () => {
    const initialDate = new Date('2001-02-02T12:00:00')
    const updatedDate = new Date('2001-02-02T13:00:00')

    const { user, checkConsoleLog } = renderWithSetup(
      <TestDateComponent initialDate={initialDate} updatedDate={updatedDate} />,
    )

    checkConsoleLog('TestDateComponent', {
      renderCount: 1,
      changedProps: {},
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: 0,
    })
    checkConsoleLog('TestDateComponent', {
      date: initialDate,
      otherDep: 0,
    })
    checkConsoleLog('TestDateComponent useEffect ran')

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update Date' }))
    })

    checkConsoleLog('TestDateComponent', {
      renderCount: 2,
      changedProps: {
        date: { prev: initialDate, new: updatedDate },
      },
      lastRenderTimestamp: date.valueOf(),
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestDateComponent useEffect ran')

    screen.getByText(`Date: ${updatedDate}`)
    expect(screen.getByText('OtherDep: 0'))

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update OtherDep' }))
    })

    checkConsoleLog('TestDateComponent', {
      renderCount: 3,
      changedProps: {
        otherDep: { prev: 0, new: 1 },
      },
      lastRenderTimestamp: date.valueOf() + renderTime * 2,
      timeSinceLastRender: renderTime * 2,
    })
    checkConsoleLog('TestDateComponent useEffect ran')

    screen.getByText('OtherDep: 1')
  })
})
