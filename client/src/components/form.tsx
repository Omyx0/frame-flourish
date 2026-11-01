import React from "react";

export const inputCls =
  "w-full h-12 rounded-md border-2 border-input bg-card px-3 text-base outline-none transition-colors focus:border-frame focus:shadow-hard-sm aria-[invalid=true]:border-destructive";

export function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string | undefined;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">
        {label} {required && <span className="text-primary" aria-hidden>*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-sm text-destructive" role="alert">{error}</span>}
    </label>
  );
}
