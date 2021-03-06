Note that you can define `--async-selected-color` and `--async-active-color` CSS properties in your application and the Ethos brand colors will be overriden as such. This is a global setting, so we only use this in our auxilarary applications e.g. Nora.

```jsx
import { useState } from 'react'
import { SearchInput } from '../index'

/**
 * This just serves of a simple example of an API
 * call. Note especially that in this case, the
 * meaningful field is `name` and thus we use it
 * also as the `dataKey` argument. You'll need to
 * do the same whether it's `dataKey="title"` or
 * whatever your JSON schema looks like.
 */
const API = 'http://restcountries.eu/rest/v2/name/'
const [location, setLocation] = useState({})
const getLocations = (name) => {
  return fetch(`${API}${name || 'a'}`, {
    params: { fields: 'name' },
  })
}

const handleOnChange = (value) => {
  console.log('Example handleOnChange called w/val: ', value)
  setLocation(value)
}

;<AsyncTypeahead
  renderInput={SearchInput}
  minChars={2}
  // The example restcountries.eu schema puts the dropdown option
  // displayable fields in a `name` property as in `item.name`
  // You'll need to map this key per your own JSON schema!
  // If you're schema requires descending into something like:
  // `data.items` you should additionally add `entitiesKey: "items"`.
  dataKey="name"
  lastSelectedValue={location}
  onChange={handleOnChange}
  placeholder="Find locations..."
  fetchCallback={getLocations}
/>
```
