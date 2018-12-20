import styled from 'styled-components'
import { colours, fonts, spacing } from '../style/variables'

export const Heading = styled.h4`
  align-self: start;
  color: ${colours.heading};
`

export const Subheading = styled.h5`
  align-self: start;
  margin-bottom: .5rem;
  margin-top: .75rem;
`

export const Copy = styled.p`
  align-self: start;
  margin: 0 0 1rem;
  font-size: 1rem;
`

export const Button = styled.button`
  background-color: ${colours.button.background};
  border: 0;
  color: ${colours.button.text};
  font-family: ${fonts.button};
  display: flex;
  justify-content: center;
  outline: none;
  padding: ${spacing.sm} ${spacing.default};
  box-shadow: 4px 5px 0 ${colours.button.shadow};

  &:hover {
    background-color: ${colours.button.hover}
  }
`

export const Link = styled.a`
  &:hover {

  }
`
