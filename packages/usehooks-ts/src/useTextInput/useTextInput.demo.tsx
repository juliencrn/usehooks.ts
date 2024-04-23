import { ChangeEvent } from 'react'

import useTextInput from './useTextInput'

export default function Component() {
  const { value, error, onChange } = useTextInput({
    validators: [validateEmail],
  })

  return (
    <>
      <input
        placeholder="email"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value.trim())
        }
      />
      <p>{error}</p>
    </>
  )
}

function validateEmail(email: string) {
  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )
  if (!emailRegex.test(email)) {
    throw Error('Please enter a valid email')
  }
}
