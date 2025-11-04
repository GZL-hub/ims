import React from "react";
import { Check } from "lucide-react";

interface SuccessToastProps {
  message: string;
  isVisible: boolean;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
        <Check className="w-5 h-5" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default SuccessToast;
