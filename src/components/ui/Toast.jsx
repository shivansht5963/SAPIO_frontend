import { createPortal } from 'react-dom';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import './Toast.css';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return createPortal(
    <div className="toast-container" aria-live="polite">
      {toasts.map(toast => {
        const Icon = icons[toast.type] || Info;
        return (
          <div key={toast.id} className={`toast toast--${toast.type}`}>
            <Icon size={18} className="toast__icon" />
            <span className="toast__message">{toast.message}</span>
            <button className="toast__close" onClick={() => dismissToast(toast.id)} aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
