import { useToast, ToastAction } from '@/contexts/ToastContext';

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

  const confirm = (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void,
    confirmLabel: string = 'Confirm',
    cancelLabel: string = 'Cancel'
  ) => {
    const actions: ToastAction[] = [
      {
        label: cancelLabel,
        onClick: onCancel || (() => {}),
        variant: 'secondary'
      },
      {
        label: confirmLabel,
        onClick: onConfirm,
        variant: 'danger'
      }
    ];

    addToast({
      type: 'confirm',
      title,
      message,
      actions,
      duration: 0, // No auto-dismiss for confirmations
    });
  };

  return {
    success,
    error,
    warning,
    info,
    confirm,
  };
} 