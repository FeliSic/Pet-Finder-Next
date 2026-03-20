import styled from "styled-components";
import { Tiny } from "../typography";

export const Label = styled.label`
  margin: 5px;
`

export const Input = styled.input`
  width: 163px;
  height: 37px;
  color: #fff;
  background-color: #000;
  margin: 0px;
  padding: 0 8px;
  border-radius: var(--radius);
  border: 3px solid #fff;
`

export function TextField({label="label", placeholder="placeholder"}){
  return(
    <label>
      <Label>{label}</Label>
        <Input placeholder={placeholder}></Input>
    </label>
  )
}