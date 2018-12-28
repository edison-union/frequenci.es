import React from 'react'
import styled from 'styled-components'
import { colours, fonts, spacing, timings } from '../style/variables'
import { Link } from 'gatsby'
import { gpuStyles } from '../style/mixins'

const LinkSwitch = (props) => {
  if (props.href) {
    return (<a {...props}>{props.children}</a>)
  }

  return <Link {...props}>{props.children}</Link>
}

export const Heading = styled.h4`
  align-self: start;
  color: ${colours.heading};
`

export const Subheading = styled.h5`
  align-self: start;
  color: ${colours.subheading};
  margin-bottom: .5rem;
  margin-top: .75rem;
`

export const Copy = styled.p`
  align-self: start;
  color: ${colours.copy};
  font-size: 1rem;
  margin: 0 0 1rem;
`

export const Button = styled.button`
  background-color: ${colours.button.background};
  border: 0;
  box-shadow: 4px 5px 0 ${colours.button.shadow};
  color: ${colours.button.text};
  display: flex;
  font-family: ${fonts.button};
  justify-content: center;
  outline: none;
  padding: ${spacing.sm} ${spacing.default};

  &:hover {
    background-color: ${colours.button.hover}
  }
`

export const ButtonRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: ${spacing.sm};

  button {
    flex: 1 0 auto;
  }

  button + button {
    margin-left: ${spacing.sm};
  }
`

export const TextLink = styled.a`
  box-shadow: 0 2px 0 0 currentColor;
  color: ${colours.link.default};
  font-weight: 700;
  text-decoration: none;
  transition: color ${timings.md}s ease-out, border ${timings.md}s ease-out;

  &:hover,
  &:focus,
  &:active {
    border-bottom: 4px solid ${colours.white};
    box-shadow: 0 2px 0 0 currentColor;
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

export const Card = styled(LinkSwitch)`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-size: .8rem;
  min-height: min-content;
  padding: ${spacing.xs} ${spacing.sm};
  text-decoration: none;
  transform: rotateX(-90deg);
  transition: transform ${timings.sm}s ease-out, opacity ${timings.lg}s ease-out;
  width: 100%;

  ${gpuStyles``}

  &.is-transitioning {
    transform: rotateX(0deg);
  }

  &.is-old {
    opacity: .8;
  }

  & + & {
    margin-top: ${spacing.xs};
  }
`

export const CardTitle = styled.strong`
  font-family: ${fonts.button};
  font-size: 1rem;
  font-weight: 600;
`

export const CardCopy = styled.p`
  margin: 0;
`
