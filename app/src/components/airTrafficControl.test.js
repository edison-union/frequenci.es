import React from 'react'
import renderer from 'react-test-renderer'
import { AirTrafficControl } from './airTrafficControl'
import { countries, country, data, location, center, mapBounds, testFlight } from '../tests/setup'
import wrapWithProvider from '../../wrap-with-provider'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { shallow, mount } from 'enzyme'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() });

const initialState = {
  spatialAudioEnabled: true,
  markerBounds: null,
  mapBounds: null
}

const mockStore = configureStore()
let store, wrapped, component, raw

beforeEach(() => {
    raw = <AirTrafficControl
      countries={countries}
      country={country}
      data={data}
      location={location}
      center={center}
      mapBounds={mapBounds}/>
    store = mockStore(initialState)
    component = shallow(raw);
    wrapped = (<Provider store={store}>{raw}</Provider>)
})

describe("AirTrafficControl", () => {
  it ("renders correctly", () => {
    expect(renderer.create(wrapped).toJSON()).toMatchSnapshot()
  })

  it ("convertDistanceToSpatial is correct", () => {
    expect(component.instance().convertDistanceToSpatial(testFlight)).toEqual({
       x: 0.8318062867676936,
       y: -0.07722801156759385,
       z: -0.186
    })
  })

  it ("isDecayedFlight returns true on old flight", () => {
    expect(component.instance().isDecayedFlight(testFlight)).toEqual(true);
  })

  it ("isDecayedFlight returns false on new flight", () => {
    testFlight.timestamp = Date.now;
    expect(component.instance().isDecayedFlight(testFlight)).toEqual(false);
  })
})
