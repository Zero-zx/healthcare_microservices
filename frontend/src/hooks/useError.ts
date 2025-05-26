import { useState, useCallback } from 'react';
import { useNotification } from './useNotification';

export const useError = () => {
  const [error, setError] = useState<string | null>(null);
  const { showError } = useNotification();

  const handleError = useCallback((error: unknown) => {
    let errorMessage = 'An unexpected error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    setError(errorMessage);
    showError(errorMessage);
  }, [showError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const withErrorHandling = useCallback(async <T>(callback: () => Promise<T>): Promise<T | null> => {
    try {
      clearError();
      return await callback();
    } catch (error) {
      handleError(error);
      return null;
    }
  }, [clearError, handleError]);

  return {
    error,
    handleError,
    clearError,
    withErrorHandling,
  };
}; 