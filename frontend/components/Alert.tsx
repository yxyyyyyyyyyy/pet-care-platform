import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  const className = `alert alert-${type}`;

  return (
    <div className={className}>
      {message}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-sm font-medium hover:underline"
        >
          关闭
        </button>
      )}
    </div>
  );
}
