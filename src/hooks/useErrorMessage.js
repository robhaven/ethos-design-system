import React, { useState } from 'react'
import { InfoMessage } from '../components/InfoMessage'
import { Spacer } from '../components'

const useErrorMessage = (validator) => {
  const [displayError, setDisplayError] = useState('')

  const setError = (msg) => {
    setDisplayError(msg)
  }

  const getError = () => {
    if (displayError) {
      // WIP do InfoMessage styling later
      return (
        <>
          <Spacer.H8 />
          <InfoMessage.Error>{displayError} </InfoMessage.Error>
        </>
      )
    }
    return ''
  }

  const validate = (thingToValidate) => {
    if (!validator) {
      return ''
    }
    return validator.call(null, thingToValidate)
  }

  return [getError, setError, validate]
}

export default useErrorMessage