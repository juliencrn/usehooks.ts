import { act, renderHook } from '@testing-library/react-hooks/dom'

import useTextInput from './useTextInput'

describe('useTextInput()', () => {
  it('should successfully change the value', () => {
    const { result } = renderHook(() => useTextInput())
    const { onChange } = result.current
    act(() => {
      onChange('hello')
    })
    expect(result.current.value).toBe('hello')
    expect(result.current.error).toBe('')
  })

  it('should update error if the validator throws an error', () => {
    const { result } = renderHook(() =>
      useTextInput({ validators: [validateEmail] }),
    )
    const { onChange } = result.current
    act(() => {
      onChange('hello')
    })
    expect(result.current.value).toBe('hello')
    expect(result.current.error).toBe('Please enter a valid email')
  })

  it("should update the error to be the first validator's error if multiple validators throw errors", () => {
    const { result } = renderHook(() =>
      useTextInput({ validators: [validateEmail, validatePassword] }),
    )
    const { onChange } = result.current
    act(() => {
      onChange('hello')
    })
    expect(result.current.error).toBe('Please enter a valid email')
  })
})

function validateEmail(email: string) {
  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )
  if (!emailRegex.test(email)) {
    throw Error('Please enter a valid email')
  }
}

function validatePassword(password: string) {
  const passwordRegex = new RegExp(
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/,
  )
  if (!passwordRegex.test(password)) {
    throw Error(
      'Passwords must be between 8-16 characters and must include at least one alphabet, number, and special character each',
    )
  }
}
