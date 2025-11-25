import React from "react";
import Barcode from "react-barcode";

interface BarcodeGeneratorProps {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  format?: "CODE128" | "EAN13" | "UPC" | "CODE39";
  className?: string;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  value,
  width = 2,
  height = 50,
  displayValue = true,
  format = "CODE128",
  className = "",
}) => {
  // Don't render if no barcode value
  if (!value || value.trim() === "") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-text-500 dark:text-text-400 text-sm">No barcode</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Barcode
        value={value}
        format={format}
        width={width}
        height={height}
        displayValue={displayValue}
        background="transparent"
        lineColor="currentColor"
        fontSize={12}
        margin={0}
      />
    </div>
  );
};

export default BarcodeGenerator;
