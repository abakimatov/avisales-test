export interface CheckboxProps {
  checked: boolean
}

export interface CheckboxFieldProps extends CheckboxProps {
  onChange: (value: string) => void
  value: string
  label: string
}
