import {Label} from "./label.tsx";
import {Input} from "./input.tsx";
import * as React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string,
  name: string,
  label: string,
  placeholder?: string,
  value: string,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  errors?: string[],
  type?: string,
  touched?: boolean
}

function CustomInput(props: Props) {
  const {
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    errors,
    type,
    touched,
    ...rest
  } = props
  return (
      <div className="grid gap-3">
        <Label htmlFor={id}>{label}</Label>
        <Input
            type={type ? type : 'text'}
            id={id}
            name={name}
            placeholder={placeholder ? placeholder : undefined}
            value={value}
            onChange={onChange}
            {...rest}
        />
        {touched && errors?.map((err, i) => (
            <div key={i} style={{color: 'red'}}>
              {err}
            </div>
        ))}
      </div>
  )
}

export default CustomInput
