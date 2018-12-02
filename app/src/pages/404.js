import React from 'react'
import Layout from '../components/layout'
import styled from 'styled-components'

const NotFoundPage = () => (
  <Layout>
    <Container>
      <h1>Frequencies</h1>
      <h3>Music From Airports</h3>
      <h4>404 Page Not Found</h4>
    </Container>
  </Layout>
)

const Container = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  width: 100vw;
`

export default NotFoundPage
