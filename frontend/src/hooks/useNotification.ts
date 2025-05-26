import { useCallback } from 'react';
import { useSnackbar, OptionsObject } from 'notistack';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

export const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showNotification = useCallback((message: string, type: NotificationType = 'info', options?: Partial<OptionsObject>) => {
    enqueueSnackbar(message, {
      variant: type,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      ...options,
    });
  }, [enqueueSnackbar]);

  const showSuccess = useCallback((message: string, options?: Partial<OptionsObject>) => {
    showNotification(message, 'success', options);
  }, [showNotification]);

  const showError = useCallback((message: string, options?: Partial<OptionsObject>) => {
    showNotification(message, 'error', options);
  }, [showNotification]);

  const showWarning = useCallback((message: string, options?: Partial<OptionsObject>) => {
    showNotification(message, 'warning', options);
  }, [showNotification]);

  const showInfo = useCallback((message: string, options?: Partial<OptionsObject>) => {
    showNotification(message, 'info', options);
  }, [showNotification]);

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
 