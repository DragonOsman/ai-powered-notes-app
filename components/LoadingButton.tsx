"use client";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export default function LoadingButton({
  children,
  isLoading,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className="rounded border px-4 py-2 disabled:opacity-50"
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}