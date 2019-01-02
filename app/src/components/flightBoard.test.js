import React from 'react'
import renderer from 'react-test-renderer'
import FlightBoard from './flightBoard'
import { countries, country, data, location, center } from '../tests/setup'
import wrapWithProvider from '../../wrap-with-provider'

describe("FlightBoard", () => {
  it("renders correctly", () => {
    const tree = renderer.create(wrapWithProvider(<FlightBoard
      countries={countries}
      country={country}
      data={data}
      location={location}
      center={center}/>)).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
