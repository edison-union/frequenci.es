import styled from 'styled-components'
import { colours, fonts, spacing, timings } from '../style/variables'

export const Heading = styled.h4`
  align-self: start;
  color: ${colours.heading};
`

export const Subheading = styled.h5`
  color: ${colours.subheading};
  align-self: start;
  margin-bottom: .5rem;
  margin-top: .75rem;
`

export const Copy = styled.p`
  align-self: start;
  color: ${colours.copy};
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
  color: ${colours.link.default};
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 2px 0 0 currentColor;
  transition: color ${timings.md}s ease-out, border ${timings.md}s ease-out;

  &:hover,
  &:focus,
  &:active {
    box-shadow: 0 2px 0 0 currentColor;
    border-bottom: 4px solid ${colours.white};
    color: ${colours.link.hover};
  }
`

export const Input = styled.input`
  box-sizing: border-box;
  display: flex;
  font-family: ${fonts.button};
  font-size: 1.4rem;
  font-weight: 700;
  padding: ${spacing.sm};
  width: 100%;

  &:focus {
    outline: none;
  }

  & + * {
    margin-top: ${spacing.default};
  }
`
