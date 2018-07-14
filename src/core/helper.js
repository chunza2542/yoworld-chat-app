import styled, {css} from 'styled-components'
// style global variable and function belong here

export const fonts = {
  header: `'Gaegu', cursive`,
  normal: `sans-sans-serif`,
}

export const fontSize = {
  header: 25,
  normal: 22,
}

// all helper function
const sizes = {
  giant: 1170,
  desktop: 1000,
  tablet: 600,
  phone: 376,
}

// iterate through the sizes and create a media template
export const media = Object.keys(sizes).reduce((accumulator, label) => {
  const emSize = sizes[label]
  accumulator[label] = (...args) => css`
    @media (max-width: ${emSize}px) {
      ${css(...args)}
    }
  `
  return accumulator
}, {})