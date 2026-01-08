import * as React from "react";

export function Select({ value, onValueChange, children, className = '' }) {
  return (
    <select 
      value={value} 
      onChange={e => onValueChange(e.target.value)}
      className={`select ${className}`}
    >
      {children}
    </select>
  );
}
Select.Trigger = function Trigger({ children, ...props }) {
  return <div {...props}>{children}</div>;
};
Select.Content = function Content({ children }) {
  return <>{children}</>;
};
Select.Item = function Item({ value, children }) {
  return <option value={value}>{children}</option>;
};
