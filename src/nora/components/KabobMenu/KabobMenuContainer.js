import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Options } from '../../../components/index'
import { KabobMenu } from './index'
import useScrollItemIntoView from '../../../hooks/useScrollItemIntoView'
import usePopoverNavigation from '../../../hooks/usePopoverNavigation'

export const KabobMenuContainer = ({
  focusRef,
  tabIndex,
  dataKey,
  items,
  isOpen,
  setIsOpen,
  setLastSelected,
  popoverContainerClasses,
}) => {
  const tabIndexResolved = tabIndex ? tabIndex : null
  const focusRefResolved = focusRef ? focusRef : null
  const [activeOption, setActiveOption] = useState(0)
  const [selectedOption, setSelectedOption] = useState(-1)
  const { scrollItemIntoView } = useScrollItemIntoView()
  const { handlePopoverNavigation } = usePopoverNavigation()

  const optionsRefs = Array(items.length)
    .fill(0)
    .map(() => React.createRef())

  const handleOnChange = (item) => {
    setLastSelected(item.name)
    setIsOpen(!isOpen)
  }

  const setSelectedAndActiveOptions = (index) => {
    setSelectedOption(index)
    setActiveOption(index)
  }

  return (
    <KabobMenu
      focusRef={focusRefResolved}
      tabIndex={tabIndexResolved}
      onClick={() => {
        setIsOpen(!isOpen)
      }}
      onKeyDown={(ev) =>
        handlePopoverNavigation({
          ev: ev,
          items: items,
          onChange: handleOnChange,
          optionsRefs: optionsRefs,
          activeOption: activeOption,
          setActiveOption: setActiveOption,
          scrollItemIntoView: scrollItemIntoView,
          showPopover: isOpen,
          setShowPopover: setIsOpen,
          setSelectedAndActiveOptions: setSelectedAndActiveOptions,
        })
      }
    >
      {isOpen ? (
        <ul className={popoverContainerClasses}>
          <Options
            activeOption={activeOption}
            dataKey={dataKey}
            entities={items}
            onChange={handleOnChange}
            optionsRefs={optionsRefs}
            selectedOption={selectedOption}
            setSelectedAndActiveOptions={setSelectedAndActiveOptions}
          />
        </ul>
      ) : (
        <> </>
      )}
    </KabobMenu>
  )
}

KabobMenuContainer.propTypes = {
  focusRef: PropTypes.object,
  tabIndex: PropTypes.number,
  setIsOpen: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  dataKey: PropTypes.string.isRequired,
  setLastSelected: PropTypes.func.isRequired,
  popoverContainerClasses: PropTypes.string.isRequired,
}
