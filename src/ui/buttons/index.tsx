import styled from "styled-components";
import { BodyBold } from "../typography";


export const BlueButton = styled.button`
  background-color: var(--azul);
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center; 
  width: 163px;
  height: 37px;
  font-size: 16px;
  font-weight: bold;
  border-radius: var(--radius);
`

export const YellowButton = styled(BlueButton)`
  background-color: var(--amarillo);
`

export const FucsiaButton = styled(BlueButton)`
  background-color: var(--fucsia)
`