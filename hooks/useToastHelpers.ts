import { useToast } from '@/contexts/ToastContext';

export function useToastHelpers() {
  const { addToast } = useToast();

  const success = (title: string, message?: string, duration: number = 5000) => {
    addToast({
      type: 'success',
      title,
      message,
      duration,
    });
  };

  const error = (title: string, message?: string, duration: number = 7000) => {
    addToast({
      type: 'error',
      title,
      message,
      duration,
    });
  };

  const warning = (title: string, message?: string, duration: number = 5000) => {
    addToast({
      type: 'warning',
      title,
      message,
      duration,
    });
  };

  const info = (title: string, message?: string, duration: number = 5000) => {
    addToast({
      type: 'info',
      title,
      message,
      duration,
    });
  };

  return {
    success,
    error,
    warning,
    info,
  };
} 