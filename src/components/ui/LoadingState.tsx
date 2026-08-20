/**
 * A React component that displays a loading state with an optional message.
 * This component is typically used to indicate that data is being fetched or processed.
 * It shows a spinner animation along with a message to inform users that the content is loading.
 * The component accepts the following props:
 * - `message`: An optional string to display as the loading message. Defaults to "Loading...".
 */
interface LoadingStateProps {
  message?: string
}

const LoadingState = ({ message = 'Loading...' }: LoadingStateProps) => {
  return (
    <div
      className="flex items-center justify-center py-12"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
          aria-hidden="true"
        />

        {message}
      </div>
    </div>
  )
}

export default LoadingState
