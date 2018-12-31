import React from 'react'
import { storiesOf } from '@storybook/react'
import Info from './info'

const stories = storiesOf('Info', module)

stories.add('default', () => {
  return (
    <Info/>
  )
})
