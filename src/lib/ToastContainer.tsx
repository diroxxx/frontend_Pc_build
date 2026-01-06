import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import React from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

const baseStyle = {
  borderRadius: '8px',
  maxWidth: '400px',
  padding: '12px 20px',
  fontSize: '14px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  // border: '2px solid',
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
      icon: <CheckCircle2 className="w-5 h-5" />,
      style: {
        ...baseStyle,
        background: '#10b981',
        borderColor: '#059669',
        color: '#ffffff',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
      },
    });
    manageToastLimit(id);
    return id;
  },
  
  error: (message: string) => {
    const id = toast.error(message, {
      duration: 4000,
      icon: <XCircle className="w-5 h-5" />,
      style: {
        ...baseStyle,
        background: '#e63946',
        borderColor: '#c8282e',
        color: '#ffffff',
        boxShadow: '0 4px 12px rgba(230, 57, 70, 0.25)',
      },
    });
    manageToastLimit(id);
    return id;
  },
  
  warning: (message: string) => {
    const id = toast(message, {
      duration: 3500,
      icon: <AlertCircle className="w-5 h-5" />,
      style: {
        ...baseStyle,
        background: '#f59e0b',
        borderColor: '#d97706',
        color: '#ffffff',
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
      },
    });
    manageToastLimit(id);
    return id;
  },
  
  info: (message: string) => {
    const id = toast(message, {
      duration: 3000,
      icon: <Info className="w-5 h-5" />,
      style: {
        ...baseStyle,
        background: '#457B9D',
        borderColor: '#1D3557',
        color: '#F1FAEE',
        boxShadow: '0 4px 12px rgba(69, 123, 157, 0.25)',
      },
    });
    manageToastLimit(id);
    return id;
  },
  
  loading: (message: string) => {
    const id = toast.loading(message, {
      icon: <Loader2 className="w-5 h-5 animate-spin" />,
      style: {
        ...baseStyle,
        background: '#A8DADC',
        borderColor: '#457B9D',
        color: '#1D3557',
        boxShadow: '0 4px 12px rgba(168, 218, 220, 0.25)',
      },
    });
    manageToastLimit(id);
    return id;
  },
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

