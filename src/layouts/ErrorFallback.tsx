import { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

const noConnectionMessage = 'NetworkError when attempting to fetch resource.';

interface ErrorFallbackProps extends Partial<FallbackProps> {
  fallbackText?: string;
}

export const ErrorFallback = ({ fallbackText, error }: ErrorFallbackProps) => {
  const { t } = useTranslation();
  const errorMessage =
    error?.message && error.message !== noConnectionMessage
      ? error.message
      : t('error.generic_error');
  const displayText = fallbackText ?? errorMessage;
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="w-full p-2 sm:p-4" />
      <div className="w-full p-2 sm:p-4" />
      <p className="text-center text-base font-medium">{displayText}</p>
    </div>
  );
};
