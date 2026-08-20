/**
 * A React component that displays a form error message.
 * @param message - The error message to display.
 * @returns A paragraph element with the error message, or null if no message is provided.
 */
interface FormErrorProps {
  message?: string;
}

const FormError = ({ message }: FormErrorProps) => {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  );
};

export default FormError;