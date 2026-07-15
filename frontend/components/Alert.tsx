'use client';

export default function Alert({ type, message, onClose }: {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}) {
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
