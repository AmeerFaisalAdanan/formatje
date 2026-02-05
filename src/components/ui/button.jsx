import * as React from "react";

export const Button = React.forwardRef(
  (
    { className = "", variant = "primary", size = "default", ...props },
    ref,
  ) => {
    const baseStyles = "btn";
    const variantStyles =
      variant === "primary" ? "btn-primary" : "btn-secondary";
    const sizeStyles = size === "sm" ? "text-sm px-3 py-1.5" : "px-5 py-2.5";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
