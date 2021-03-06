### Accessible React Grid

This `Grid` follows the [wai-aria-practices-1.1](https://www.w3.org/TR/wai-aria-practices-1.1/#grid) specifications for data grids. It's influenced by [juanca's](https://github.com/juanca) original [react-aria-components](https://github.com/juanca/react-aria-components) data-grid component in the way the keyboard navigation and roles are assigned, but otherwise is a complete rewrite with the following added features:

- The class-based lifecycle components were all converted to use functional hook-based components
- Simpler API
- Boilerplate default styles
- Sort by column
- Uses `columnheader` for header cells which is more idiomatic then `rowheader` which is usually used on the first column of
  a row to act as a header for just that row
- Responsive stacking at mobile and lower with column label on left and values on the right

### Aria Support in Screen Readers

While support from screenreaders for aria roles is not yet perfect, it's on an [upward trend](https://www.powermapper.com/tests/screen-readers/aria/) so it would seem that having a data grid that complies is a worthwhile endeavor!

### Usage

Place focus anywhere just above the data grid and then tab. You've put focus on the grid. Now, use your arrow keys to navigate within the grid. On a Mac, `fn-rightarrow` simulates a _Page Right_, `fn-downarrow` a _Page Down_ and so on.

#### Skinning the data grid

If you look at `grid-example.module.scss` that we'r'e using below, you'll note that we've
pretty much overriden every `--ariagrid-*` property, and thus skinned our Grid to our
liking. Please note, that this is a one-time global override, and so it's best to use if you
have a separate application that uses a differing color scheme. An example of this is the
Nora application which utilizes this.

```jsx
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Grid } from './Grid.js'
import { Row } from './Row.js'
import { Column } from './Column.js'
import { useGridSorting } from './useGridSorting.js'
import styles from './grid-example.module.scss'

const columns = [
  {
    name: 'Description',
    labelCopy: 'Task',
    interactive: true,
    sortable: true /* will use default sort function */,
    flexBasis: '40%',
  },
  {
    name: 'Type',
    labelCopy: 'Type of Task',
    flexBasis: '30%',
  },
  {
    name: 'Date',
    labelCopy: 'Task Date',
    flexBasis: '15%',
    sortable: true,
    // Custom sort function example
    sortFn: (a, b) => {
      if (a > b) {
        return 1
      } else if (a < b) {
        return -1
      }
      return 0
    },
  },
  {
    name: 'Cost',
    flexBasis: '15%',
    interactive: true,
    sortable: true /* will use default sort function */,
  },
]
const rows = [
  {
    Description: 'Learn Typescript',
    Type: 'Education',
    Date: '2020-01-15',
    Cost: '$100.00',
  },
  {
    Description: 'Las Vegas Trip',
    Type: 'Travel',
    Date: '2020-01-04',
    Cost: '$999.99',
  },
  {
    Description: 'Coffee and Bagel',
    Type: 'Food',
    Date: '2020-02-22',
    Cost: '$11.00',
  },
  {
    Description: 'Guitar Lessons',
    Type: 'Education',
    Date: '2018-03-11',
    Cost: '$300.00',
  },
  {
    Description: 'Haircut',
    Type: 'Grooming',
    Date: '2019-12-19',
    Cost: '$25.00',
  },
]

function GridExample() {
  const {
    rowsRefs,
    columnRefs,
    sortedRows,
    compareBy,
    updateRowsRefs,
    getSortIcon,
  } = useGridSorting(rows, columns)

  const sortBy = (ev) => {
    ev.preventDefault()
    const key = ev.currentTarget.dataset.key
    let rowsCopy = sortedRows
    let sortFunction
    // See if we have a custom sort function. If `sortFunction` is
    // `undefined`, `compareBy` will fallback to its own default sort
    const idx = columns.findIndex((c) => c.name === key)
    if (columns[idx].sortFn) {
      sortFunction = columns[idx].sortFn
    }
    rowsCopy.sort(compareBy(key, sortFunction))
    updateRowsRefs(rowsCopy)
  }

  return (
    columns.length > 0 && (
      <Grid rowRefs={rowsRefs} columnRefs={columnRefs}>
        <Row key="headers" columnRefs={columnRefs[0]}>
          {columns.map((col, x) => {
            if (col.sortable) {
              return (
                <Column
                  name={col.name}
                  key={uuidv4()}
                  columnRef={columnRefs[0][x]}
                  flexBasis={col.flexBasis}
                  header
                  interactive
                  sortable
                >
                  {(active, columnRef) => (
                    <a
                      href="./#"
                      onClick={sortBy}
                      tabIndex={active ? 0 : -1}
                      className={styles.iconContainer}
                      data-key={col.name}
                      ref={columnRef}
                    >
                      {col.labelCopy || col.name}
                      {getSortIcon(col.name)}
                    </a>
                  )}
                </Column>
              )
            }
            return (
              <Column
                name={col.name}
                key={uuidv4()}
                columnRef={columnRefs[0][x]}
                flexBasis={col.flexBasis}
                header
              >
                {(active) => (
                  <span
                    data-key={col.name}
                    className={active ? 'active' : undefined}
                  >
                    {col.labelCopy || col.name}
                  </span>
                )}
              </Column>
            )
          })}
        </Row>
        {sortedRows.map((row, y) => (
          <Row key={uuidv4()} columnRefs={rowsRefs[y]}>
            {columns.map((col, x) => {
              if (col.interactive) {
                return (
                  <Column
                    name={col.name}
                    key={uuidv4()}
                    columnRef={rowsRefs[y][x]}
                    flexBasis={col.flexBasis}
                    interactive
                  >
                    {(active, columnRef) => (
                      <a href="./#" tabIndex={active ? 0 : -1} ref={columnRef}>
                        {row[col.name]}
                      </a>
                    )}
                  </Column>
                )
              }
              return (
                <Column
                  name={col.name}
                  key={uuidv4()}
                  columnRef={rowsRefs[y][x]}
                  flexBasis={col.flexBasis}
                >
                  {() => (
                    <div className={styles.iconContainer}>
                      {row[col.name]}{' '}
                      {col.name === 'Type' && row[col.name] === 'Food' && (
                        <FontAwesomeIcon
                          icon={['far', 'hamburger']}
                          className={styles.icon}
                        />
                      )}
                    </div>
                  )}
                </Column>
              )
            })}
          </Row>
        ))}
      </Grid>
    )
  )
}

;<GridExample />
```
