import React from 'react'
import styled from 'styled-components'

export const Input = styled.input``

export default function TextField({
  input,
  meta: { touched, error, warning, active },
  classes,
  ...props
}) {
  const inError = !!error && !!touched
  return (
    <Input
      {...input}
      {...props}
      error={inError}
      helperText={(inError && error) || ' '}
    />
  )
}
