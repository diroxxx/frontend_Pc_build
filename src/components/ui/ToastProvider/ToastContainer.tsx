import { Toaster } from 'react-hot-toast';

export default function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        duration: 8000,
        style: {
          background: '#fff',
          color: '#374151',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          maxWidth: '400px',
          padding: '16px',
        },
        success: {
          style: {
            border: '1px solid #10b981',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          style: {
            border: '1px solid #ef4444',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}