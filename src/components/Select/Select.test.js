import React from 'react'
import { Select } from './Select.js'
import { render } from '@testing-library/react'

describe('Select', () => {
  const mockProps = {
    className: 'foo',
    isCompact: true,
    'data-tid': 'my-select',
  }

  test('matches snapshot', () => {
    const tree = render(<Select {...mockProps} />)
    expect(tree).toMatchSnapshot()
  })

  test('adding a title prop adds a div and aria-label', () => {
    const tree = render(<Select {...mockProps} title="Hello World" />)
    expect(tree).toMatchSnapshot()
  })
})
