import * as React from "react";

export const Select = React.forwardRef(({ className = "", ...props }, ref) => (
  <select ref={ref} className={`select ${className}`} {...props} />
));
Select.displayName = "Select";
