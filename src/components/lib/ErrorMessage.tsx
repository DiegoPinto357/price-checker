import { PiWarning } from 'react-icons/pi';

type ErrorMessageProps = {
  message: string;
  className?: string;
};

const ErrorMessage = ({ message, className }: ErrorMessageProps) => {
  return (
    <div className={`${className} flex items-start gap-2 text-danger`}>
      <PiWarning className="mt-0.5 w-5 h-5 flex-shrink-0" />
      <p className="flex-shrink">{message}</p>
    </div>
  );
};

export default ErrorMessage;
