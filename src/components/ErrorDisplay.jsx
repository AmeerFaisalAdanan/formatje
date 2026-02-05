import React from "react";
import { Alert } from "./ui/alert";

export function ErrorDisplay({ error }) {
  if (!error) return null;
  return (
    <Alert variant="destructive" className="mb-2">
      {error}
    </Alert>
  );
}
