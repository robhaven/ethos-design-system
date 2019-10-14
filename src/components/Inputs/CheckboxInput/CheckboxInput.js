import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Body } from '../../Type/Body.js'
import useErrorMessage from '../../../hooks/useErrorMessage.js'
import useInputValidation from '../../../hooks/useInputValidation.js'
import styles from './CheckboxInput.module.scss'
import errorStyles from '../Errors.module.scss'

const Facade = () => {
  return (
    <svg
      className={styles.Facade}
      width="18"
      height="18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.75 12.127L3.623 9l-1.065 1.057L6.75 14.25l9-9-1.057-1.058-7.943 7.935z"
        fill="#fff"
      />
    </svg>
  )
}

export const CheckboxInput = ({
  formChangeHandler,
  validator,
  children,
  name,
  checked,
  ...rest
}) => {
  const initialChecked = checked ? checked : false
  const [touched, setTouched] = useState(initialChecked)
  const [isChecked, setIsChecked] = useState(initialChecked)
  const [getError, setError, validate] = useErrorMessage(validator)
  const [doValidation] = useInputValidation({validate, setError, formChangeHandler})

  const onChange = (ev) => {
    if (!touched) setTouched(true)
    const target = ev.target;
    const val = target.type === 'checkbox' ? target.checked : target.value;
    doValidation(val, touched)
    setIsChecked(val)
  }

  const getClasses = () => {
    return !!getError() ? `${styles.CheckboxInput} ${errorStyles.Error}` : `${styles.CheckboxInput}`
  }

  const id = name
  const otherProps = { ...rest, id, name }

  return (
    <>
      <label htmlFor={id} className={styles.root}>
        <div className={styles.checkboxWrapper}>
          <input
            className={styles.CheckboxInput}
            type="checkbox"
            onChange={onChange}
            checked={isChecked}
            {...otherProps}
          />
          <Facade />
        </div>
        <Body.Regular400>{children}</Body.Regular400>
      </label>
      {getError()}
    </>
  )
}

CheckboxInput.propTypes = {
  name: PropTypes.string.isRequired, // must be unique
  'data-tid': PropTypes.string.isRequired,
  checked: PropTypes.bool,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  allCaps: PropTypes.bool,
  validator: PropTypes.func,
  formChangeHandler: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
}