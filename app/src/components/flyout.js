import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { above, gpuStyles } from '../style/mixins'
import { colours, spacing } from '../style/variables'

const Flyout = ({ children }) => {
  return (<Container>{children}</Container>);
};

export default Flyout

const Container = styled.section`
  background-color: ${colours.navigation.background_hover};
  box-sizing: border-box;
  align-items: center;
  color: ${colours.navigation.text};
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: ${spacing.default};
  overflow-y: auto;
  width: 100%;

  ${gpuStyles``}

  ${above.md`
    width: 24rem;
  `}
`

Flyout.propTypes = {
  children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
}
