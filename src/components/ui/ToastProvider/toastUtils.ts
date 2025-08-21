import toast from 'react-hot-toast';

// Konfiguracja domyślna
const defaultOptions = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    borderRadius: '8px',
    background: '#363636',
    color: '#fff',
  },
};

// Własne funkcje toastów
export const showToast = {
  success: (message: string, options?: any) => {
    return toast.success(message, {
      ...defaultOptions,
      icon: '',
      style: {
        ...defaultOptions.style,
        background: '#10b981',
      },
      ...options,
    });
  },

  error: (message: string, options?: any) => {
    return toast.error(message, {
      ...defaultOptions,
      icon: '',
      duration: 6000, // Błędy dłużej
      style: {
        ...defaultOptions.style,
        background: '#ef4444',
      },
      ...options,
    });
  },

  warning: (message: string, options?: any) => {
    return toast(message, {
      ...defaultOptions,
      icon: '',
      duration: 5000,
      style: {
        ...defaultOptions.style,
        background: '#f59e0b',
        color: '#92400e',
      },
      ...options,
    });
  },

  info: (message: string, options?: any) => {
    return toast(message, {
      ...defaultOptions,
      icon: '',
      style: {
        ...defaultOptions.style,
        background: '#3b82f6',
      },
      ...options,
    });
  },

  loading: (message: string, options?: any) => {
    return toast.loading(message, {
      ...defaultOptions,
      ...options,
    });
  },

  // Funkcja do zamykania konkretnego toasta
  dismiss: (toastId?: string) => {
    return toast.dismiss(toastId);
  },

  // Funkcja do zamykania wszystkich toastów
  dismissAll: () => {
    return toast.dismiss();
  },
};

// Dla compatibility z istniejącym kodem
export default showToast;
