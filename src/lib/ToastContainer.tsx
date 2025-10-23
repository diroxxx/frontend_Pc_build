import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import React from "react";

// Style definitions
const glassmorphismStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: '12px',
  color: '#1f2937',
  boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.25)',
  maxWidth: '300px',
  padding: '12px 16px',
  fontSize: '13px',
  fontWeight: '600',
};

const neonStyle = {
  background: '#0f0f23',
  border: '2px solid #00ff88',
  borderRadius: '8px',
  color: '#ffffff',
  boxShadow: '0 0 15px rgba(0, 255, 136, 0.4), inset 0 0 15px rgba(0, 255, 136, 0.08)',
  textShadow: '0 0 8px rgba(0, 255, 136, 0.6)',
  maxWidth: '300px',
  padding: '10px 14px',
  fontSize: '13px', 
  fontWeight: '600',
};

export const showToast = {
  success: (message: string) => toast.success(message, {
    duration: 2000,
    icon: null,
    style: {
      background: 'rgba(16, 185, 129, 0.95)',
      border: '1px solid rgba(16, 185, 129, 0.5)',
      borderRadius: '12px',
      color: '#ffffff',
      boxShadow: '0 4px 16px 0 rgba(16, 185, 129, 0.3)',
      maxWidth: '300px',
      padding: '12px 16px',
      fontSize: '13px',
      fontWeight: '600',
      backdropFilter: 'blur(10px)',
    },
  }),
  
  error: (message: string) => toast.error(message, {
    duration: 3000,
    style: {
      background: 'rgba(239, 68, 68, 0.95)',
      border: '1px solid rgba(239, 68, 68, 0.5)',
      borderRadius: '12px',
      color: '#ffffff',
      boxShadow: '0 4px 16px 0 rgba(239, 68, 68, 0.3)',
      maxWidth: '300px',
      padding: '12px 16px',
      fontSize: '13px',
      fontWeight: '600',
      backdropFilter: 'blur(10px)',
    },
  }),
  
  warning: (message: string) => toast(message, {
    duration: 2500,
    style: {
      background: 'rgba(245, 158, 11, 0.95)',
      border: '1px solid rgba(245, 158, 11, 0.5)',
      borderRadius: '12px',
      color: '#ffffff', 
      boxShadow: '0 4px 16px 0 rgba(245, 158, 11, 0.3)',
      maxWidth: '300px',
      padding: '12px 16px',
      fontSize: '13px',
      fontWeight: '600',
      backdropFilter: 'blur(10px)',
    },
  }),
  
  info: (message: string) => toast(message, {
    duration: 2000,
    style: {
      background: 'rgba(59, 130, 246, 0.95)',
      border: '1px solid rgba(59, 130, 246, 0.5)',
      borderRadius: '12px',
      color: '#ffffff',
      boxShadow: '0 4px 16px 0 rgba(59, 130, 246, 0.3)',
      maxWidth: '300px',
      padding: '12px 16px',
      fontSize: '13px',
      fontWeight: '600',
      backdropFilter: 'blur(10px)',
    },
  }),
  
  loading: (message: string) => toast.loading(message, {
    style: {
      background: 'rgba(99, 102, 241, 0.95)',
      border: '1px solid rgba(99, 102, 241, 0.5)',
      borderRadius: '12px',
      color: '#ffffff',
      boxShadow: '0 4px 16px 0 rgba(99, 102, 241, 0.3)',
      maxWidth: '300px',
      padding: '12px 16px',
      fontSize: '13px',
      fontWeight: '600',
      backdropFilter: 'blur(10px)',
    },
  }),

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
              position="top-right"
              gutter={8}
              containerStyle={{
                  top: 20,
                  right: 20,
              }}
              toastOptions={{
                  style: glassmorphismStyle,
              }}
          />
          {children}
      </>

  );
}