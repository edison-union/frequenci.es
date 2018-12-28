import React from 'react'
import PropTypes from 'prop-types'
import Div100vh from 'react-div-100vh'
import styled from 'styled-components'
import Layout from '../components/layout'
import Navigation from '../components/navigation'

class IndexTemplate extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    pageContext: PropTypes.shape({
      countries: PropTypes.array.isRequired
    })
  }

  render() {
    const { location, pageContext } = this.props;
    return (
      <Layout location={location} pageContext={pageContext}>
        <Container>
          <Navigation location={location} countries={pageContext.countries}/>
          <h1>Frequencies</h1>
          <h3>Music from Airports</h3>
        </Container>
      </Layout>
    )
  }
}

const Container = styled(Div100vh)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export default IndexTemplate
