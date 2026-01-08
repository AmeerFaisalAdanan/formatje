import * as React from "react";

export function Alert({ variant = 'default', className = '', children }) {
  const variantStyles = variant === 'destructive' ? 'alert-destructive' : 'bg-blue-50 border-blue-200 text-blue-700';
  return (
    <div className={`alert ${variantStyles} ${className}`}>
      <span className="font-medium">⚠️ Error:</span> {children}
    </div>
  );
}
