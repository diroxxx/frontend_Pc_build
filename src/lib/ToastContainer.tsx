import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import React from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

const baseStyle = {
  borderRadius: '12px',
  maxWidth: '400px',
  padding: '10px 18px',
  fontSize: '14px',
  fontWeight: '500',
  backdropFilter: 'blur(12px)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const MAX_TOASTS = 1;
const activeToastIds: string[] = [];

const manageToastLimit = (newToastId: string) => {
  activeToastIds.push(newToastId);
  if (activeToastIds.length > MAX_TOASTS) {
    const oldestId = activeToastIds.shift();
    if (oldestId) {
      toast.dismiss(oldestId);
    }
  }
};

export const showToast = {
  success: (message: string) => {
    const id = toast.success(message, {
      duration: 3000,
      icon: <CheckCircle2 className="w-5 h-5 text-white" />,
      style: {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#ffffff',
        boxShadow: '0 8px 32px 0 rgba(16, 185, 129, 0.35), 0 2px 8px 0 rgba(0, 0, 0, 0.1)',
      },
    });
    manageToastLimit(id);
    return id;
  },
  
  error: (message: string) => {
    const id = toast.error(message, {
      duration: 4000,
      icon: <XCircle className="w-5 h-5 text-white" />,
      style: {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.95) 0%, rgba(200, 40, 50, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#ffffff',
        boxShadow: '0 8px 32px 0 rgba(230, 57, 70, 0.35), 0 2px 8px 0 rgba(0, 0, 0, 0.1)',
      },
    });
    manageToastLimit(id);
    return id;
  },
  
  warning: (message: string) => {
    const id = toast(message, {
      duration: 3500,
      icon: <AlertCircle className="w-5 h-5 text-white" />,
      style: {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.95) 0%, rgba(217, 119, 6, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#ffffff',
        boxShadow: '0 8px 32px 0 rgba(245, 158, 11, 0.35), 0 2px 8px 0 rgba(0, 0, 0, 0.1)',
      },
    });
    manageToastLimit(id);
    return id;
  },
  
  info: (message: string) => {
    const id = toast(message, {
      duration: 3000,
      icon: <Info className="w-5 h-5 text-white" />,
      style: {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(69, 123, 157, 0.95) 0%, rgba(29, 53, 87, 0.95) 100%)',
        border: '1px solid rgba(168, 218, 220, 0.3)',
        color: '#F1FAEE',
        boxShadow: '0 8px 32px 0 rgba(69, 123, 157, 0.35), 0 2px 8px 0 rgba(0, 0, 0, 0.1)',
      },
    });
    manageToastLimit(id);
    return id;
  },
  
  loading: (message: string) => {
    const id = toast.loading(message, {
      icon: <Loader2 className="w-5 h-5 text-white animate-spin" />,
      style: {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(168, 218, 220, 0.95) 0%, rgba(69, 123, 157, 0.95) 100%)',
        border: '1px solid rgba(241, 250, 238, 0.3)',
        color: '#1D3557',
        boxShadow: '0 8px 32px 0 rgba(69, 123, 157, 0.35), 0 2px 8px 0 rgba(0, 0, 0, 0.1)',
      },
    });
    manageToastLimit(id);
    return id;
  },

  dismiss: (toastId?: string) => toast.dismiss(toastId),
  dismissAll: () => toast.dismiss(),
};

type ToastProviderProps = {
    children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  return (
      <>
          <Toaster
              position="top-center"
              gutter={12}
              containerStyle={{
                  top: 20,
                  zIndex: 99999,
              }}
              toastOptions={{
                  className: '',
                  style: {
                    animation: 'slideIn 0.3s ease-out',
                  },
              }}
          />
          {children}
      </>
  );
  
  
}

