import React from 'react'
import renderer from 'react-test-renderer'
import Search from './search'
import { countries } from '../tests/setup'
import wrapWithProvider from '../../wrap-with-provider'

describe("Search", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Search
      countries={countries.map((country) => {
       return {
         name: country.name,
         code: country.country.toLowerCase(),
         airports: country.airports.length
       }
     })} childActive={0}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
