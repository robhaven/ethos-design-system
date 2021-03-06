import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './useGridSorting.module.scss'

const DIR = {
  UP: 'up',
  DOWN: 'down',
  DEFAULT: 'default',
}

export const useGridSorting = (rows, columns) => {
  const [currentSort, setCurrentSort] = useState({})

  const SortIcon = ({ direction }) => {
    let sortIcon
    if (direction === DIR.UP) {
      sortIcon = (
        <FontAwesomeIcon
          icon={['fas', 'sort-up']}
          className={[styles.icon, styles.iconUp].join(' ')}
        />
      )
    } else if (direction === DIR.DOWN) {
      sortIcon = (
        <FontAwesomeIcon
          icon={['fas', 'sort-down']}
          className={[styles.icon, styles.iconDown].join(' ')}
        />
      )
    } else {
      sortIcon = (
        <FontAwesomeIcon
          icon={['fas', 'sort']}
          className={[styles.icon, styles.iconDefault].join(' ')}
        />
      )
    }
    return sortIcon
  }

  const getSortDirection = (key) => {
    if (currentSort[key] && currentSort[key].direction === DIR.UP) {
      return DIR.UP
    } else if (currentSort[key] && currentSort[key].direction === DIR.DOWN) {
      return DIR.DOWN
    } else {
      return DIR.DEFAULT
    }
  }

  const getSortIcon = (key) => {
    const sortDirection = getSortDirection(key)
    return <SortIcon direction={sortDirection} />
  }

  const setSortState = (key) => {
    let nextSort
    // Have we sorted by this key before? If so, follow next state rules.
    if (currentSort[key]) {
      if (currentSort[key].direction === DIR.DOWN) {
        nextSort = DIR.UP
      } else if (currentSort[key].direction === DIR.UP) {
        nextSort = DIR.DOWN
      }
      currentSort[key].direction = nextSort
    } else {
      // First time sorting by this key, so we'll assume current direction is
      // 'default', and update it to DIR.DOWN.
      nextSort = DIR.DOWN
      currentSort[key] = {
        direction: nextSort,
        key,
      }
    }

    // When we sort by a certain column, we want the other columns to go back
    // to being unsorted, so, we overwrite our state with only `currentSort[key]`
    const newSortState = {}
    newSortState[key] = { ...currentSort[key] }
    setCurrentSort(newSortState)
  }

  const [sortedRows, setSortedRows] = useState(rows)

  const columnRefs = [columns.map(() => React.createRef())]

  const mapRowsRefs = (rowsCopy) => {
    return rowsCopy.map(() => columns.map(() => React.createRef()))
  }

  const initialRowRefs = mapRowsRefs(rows)

  const [rowsRefs, setRowsRefs] = useState(initialRowRefs || [])

  const updateRowsRefs = (sortedRowsCopy) => {
    setSortedRows(sortedRowsCopy)
    const sorted = mapRowsRefs(sortedRowsCopy)
    setRowsRefs(sorted)
  }

  // Refactored version of https://reactjsexample.com/a-lightweight-and-extendable-datagrid-for-react/
  const defaultSortMethod = (a, b) => {
    // force null and undefined to the bottom
    a = a === null || a === undefined ? -Infinity : a
    b = b === null || b === undefined ? -Infinity : b
    // force any string values to lowercase, and if dollar currency strip extraneous
    // Admittedly hacky and we'll do proper international currencies later ;)
    a = typeof a === 'string' ? a.toLowerCase().replace(/(^\$|,)/g, '') : a
    b = typeof b === 'string' ? b.toLowerCase().replace(/(^\$|,)/g, '') : b

    a = !isNaN(a) ? Number(a) : a
    b = !isNaN(b) ? Number(b) : b

    if (a > b) {
      return 1
    }
    if (a < b) {
      return -1
    }
    return 0
  }

  const compareBy = (key, sortMethod = defaultSortMethod) => {
    setSortState(key)

    const nextSort = currentSort[key].direction

    return function(a, b) {
      switch (nextSort) {
        case DIR.DOWN:
          return sortMethod(a[key], b[key])
        case DIR.UP:
          return sortMethod(b[key], a[key])
      }
    }
  }

  return {
    rowsRefs,
    columnRefs,
    sortedRows,
    compareBy,
    setSortState,
    updateRowsRefs,
    getSortDirection,
    getSortIcon,
  }
}
