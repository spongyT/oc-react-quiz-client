import {type ChangeEvent, useState} from 'react'

export function useInput(
  defaultValue: string,
  validateFn: (value: string) => string[]
) {
  const [value, setValue] = useState<string>(defaultValue)
  const [touched, setTouched] = useState<boolean>(false)

  const errors = validateFn(value)
  const hasError = errors.length > 0 && touched

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setValue(e.target.value)
  }
  function onBlur() {
    setTouched(true)
  }
  function reset() {
    setValue(defaultValue)
    setTouched(false)
  }

  return { value, onChange, onBlur, hasError, errors, reset, touched, setValue }
}