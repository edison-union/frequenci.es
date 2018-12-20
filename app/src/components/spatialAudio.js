import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Flyout from './flyout'
import { Heading, Button, Copy } from './shared'

class SpatialAudio extends Component {
  render() {
    const { toggleSpatialAudio, spatialAudioEnabled } = this.props;
    return (<Flyout>
      <Heading>Spatial Audio</Heading>
      <Copy>Hear flight departures in 3D relative to their position on the map!</Copy>
      {!spatialAudioEnabled && <Button onClick={() => toggleSpatialAudio(true)}>Enable Spatial Audio</Button>}
      {spatialAudioEnabled && <Button onClick={() => toggleSpatialAudio(false)}>Disable Spatial Audio</Button>}
    </Flyout>);
  }
}

SpatialAudio.propTypes = {
  toggleSpatialAudio: PropTypes.func.isRequired,
  spatialAudioEnabled: PropTypes.bool.isRequired
}

const mapStateToProps = state => {
  return {
    spatialAudioEnabled: state.spatialAudioEnabled
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleSpatialAudio: (enabled) => {
      dispatch({
        type: 'TOGGLE_SPATIAL_AUDIO',
        enabled: enabled
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpatialAudio)
