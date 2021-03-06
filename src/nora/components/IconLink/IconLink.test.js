import React from 'react'
import renderer from 'react-test-renderer'
import { IconLink } from './IconLink'

describe('IconLink', () => {
  it('renders default IconLink', () => {
    const tree = renderer
      .create(
        <IconLink
          iconPrefix="fas"
          iconName="check-square"
          iconClassName="iconClassName"
          iconContainerClassName="iconContainerClasses"
          textClassName="linkClassName"
          textPosition="right"
          copy="Completed"
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('calls onClick when provided', () => {
    const onClickStub = jest.fn()
    const tree = renderer.create(
      <IconLink
        iconPrefix="fas"
        iconName="check-square"
        iconClassName="iconClassName"
        iconContainerClassName="iconContainerClasses"
        textClassName="linkClassName"
        textPosition="right"
        copy="Completed"
        onClick={onClickStub}
      />
    )

    renderer.act(() => {
      tree.root.props.onClick()
    })

    expect(onClickStub).toHaveBeenCalledTimes(1)
  })
})
