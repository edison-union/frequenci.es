import { createStore as reduxCreateStore } from 'redux'

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_SPATIAL_AUDIO':
      return {
        ...state,
        spatialAudioEnabled: action.enabled
      }
    case 'SET_MARKER_BOUNDS':
      return {
        ...state,
        markerBounds: action.bounds
      }
    case 'SET_MAP_BOUNDS':
      return {
        ...state,
        mapBounds: action.bounds
      }
  }

  return state
}

const initialState = {
  spatialAudioEnabled: true,
  markerBounds: null,
  mapBounds: null
}

const createStore = () => reduxCreateStore(reducer, initialState)
export default createStore
