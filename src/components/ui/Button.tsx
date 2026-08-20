/**
 * Button component for rendering a styled button element.
 * This component accepts standard button attributes and additional props for customization.
 * It applies default styles for a consistent look and feel across the application.
 */
import type { ButtonHTMLAttributes , ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
};

const Button = ({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={[
        "rounded-lg px-4 py-3 text-sm font-medium transition",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_STYLES[variant],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
};

export default Button;