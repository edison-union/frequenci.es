import styled from 'styled-components'
import { colours, fonts, spacing } from '../style/variables'

export const Heading = styled.h4`
  align-self: start;
`

export const Copy = styled.p`
  margin: 0 0 1rem;
`

export const Button = styled.button`
  background: ${colours.button.background};
  border: 1px solid ${colours.button.border};
  color: ${colours.button.text};
  font-family: ${fonts.button};
  display: flex;
  justify-content: center;
  outline: none;
  padding: ${spacing.sm} ${spacing.default};

  &:hover {
    background: ${colours.button.hover}
  }
`
