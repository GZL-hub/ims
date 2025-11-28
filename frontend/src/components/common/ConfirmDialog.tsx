import React from "react";
import ReactDOM from "react-dom";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "danger" | "warning" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  type = "warning",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: <XCircle className="w-12 h-12 text-red-600 dark:text-red-500" />,
      iconBg: "bg-red-100 dark:bg-red-900/30",
      confirmBtn: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
    },
    warning: {
      icon: <AlertTriangle className="w-12 h-12 text-orange-600 dark:text-orange-500" />,
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      confirmBtn: "bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600",
    },
    info: {
      icon: <Info className="w-12 h-12 text-blue-600 dark:text-blue-500" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      confirmBtn: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
    },
    success: {
      icon: <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500" />,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      confirmBtn: "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600",
    },
  };

  const style = typeStyles[type];

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-background-50 rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`mx-auto w-16 h-16 rounded-full ${style.iconBg} flex items-center justify-center mb-4`}>
          {style.icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-text-900 dark:text-white text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-text-600 dark:text-text-400 text-center mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg font-medium border border-background-300 dark:border-background-400 hover:bg-background-100 dark:hover:bg-background-200 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2 rounded-lg font-medium text-white transition shadow-sm ${style.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;
