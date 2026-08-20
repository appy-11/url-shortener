/**
 * A custom React hook that manages the state of an asynchronous operation.
 * It provides a way to execute an asynchronous function and track its loading state, result, and any errors that may occur.
 * This hook is useful for handling API calls or other asynchronous tasks in React components.
 * The hook accepts an asynchronous function and an optional immediate flag that
 * determines whether the function should be executed immediately upon mounting.
 * @param asyncFunction - The asynchronous function to be executed. It should return a Promise.
 * @param immediate - A boolean flag indicating whether to execute the asyncFunction immediately upon mounting. Defaults to true.
 */
import { useCallback, useEffect, useState } from 'react'

interface UseAsyncResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  execute: () => Promise<void>
}

export const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
): UseAsyncResult<T> => {
  const [data, setData] = useState<T | null>(null)

  const [isLoading, setIsLoading] = useState(immediate)

  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await asyncFunction()

      setData(result)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      void execute()
    }
  }, [execute, immediate])

  return {
    data,
    isLoading,
    error,
    execute,
  }
}
