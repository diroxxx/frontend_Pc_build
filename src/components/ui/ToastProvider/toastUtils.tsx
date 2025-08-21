import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  warning: (message: string) => toast(message, {
    icon: '⚠️',
    style: {
      border: '1px solid #f59e0b',
      background: '#fef3c7',
      color: '#92400e',
    },
  }),
  info: (message: string) => toast(message, {
    icon: 'ℹ️',
    style: {
      border: '1px solid #3b82f6',
      background: '#dbeafe',
      color: '#1e40af',
    },
  }),
};
