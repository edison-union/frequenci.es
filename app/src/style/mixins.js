import { css } from 'styled-components';

export const media = {
  xxl: 1600,
  xl: 1420,
  lg: 1200,
  md: 840,
  sm: 600,
  xs: 360
}

export const above = Object.keys(media).reduce((accumulator, label) => {
  accumulator[label] = (...args) => css`
    @media (min-width: ${media[label]}px) {
      ${css(...args)};
    }
  `
  return accumulator
}, {})

export const below = Object.keys(media).reduce((accumulator, label) => {
  accumulator[label] = (...args) => css`
    @media (max-width: ${media[label]}px) {
      ${css(...args)};
    }
  `
  return accumulator
}, {})

export const gpuStyles = () => {
  return css`
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000;
  `;
}
