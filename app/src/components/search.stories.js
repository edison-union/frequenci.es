import React from 'react'
import { storiesOf } from '@storybook/react'
import Search from './search'
import countries from '../../data/airports.json'

const stories = storiesOf('Search', module)
console.log(countries);
stories.add('default', () => {
  return (
    <Search countries={countries.map((country) => {
      return {
        name: country.name,
        code: country.country.toLowerCase(),
        airports: country.airports.length
      }
    })} childActive={0}/>
  )
})
