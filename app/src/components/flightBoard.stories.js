import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import FlightBoard from './flightBoard'

const stories = storiesOf('FlightBoard', module)

stories.add('default', () => {
  return (
    <FlightBoard/>
  )
})
