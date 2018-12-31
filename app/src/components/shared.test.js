import React from 'react'
import renderer from 'react-test-renderer'
import { Card } from './shared'

describe("Card", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Card/>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("renders gatsby link", () => {
    const card = renderer.create(<Card to="/404"/>);
    expect(typeof card.toTree().rendered.rendered.type).toBe('function');
  })

  it("renders normal link", () => {
    const card = renderer.create(<Card href="http://test.com"/>);
    expect(typeof card.toTree().rendered.rendered.type).toBe('string');
  })
})
