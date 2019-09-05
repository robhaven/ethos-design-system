import React from 'react'
import renderer from 'react-test-renderer'
import useErrorMessage from './useErrorMessage.js'
import testHook from './testHook.js';

describe('useErrorMessage hook', () => {
  test('validate callback', () => {
    const validatorMock = jest.fn().mockReturnValue('problemo');
    testHook(() => {
      const [getError, setError, validate] = useErrorMessage(validatorMock)
      validate('foo');
      expect(validatorMock.mock.calls.length).toBe(1);
      expect(validatorMock.mock.calls[0][0]).toBe('foo');
      expect(validatorMock.mock.results[0].value).toBe('problemo');
    })
  })
})