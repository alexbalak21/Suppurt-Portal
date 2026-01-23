import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading = false, variant = "primary", fullWidth = false, className = "", disabled, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
    
    const variants = {
      primary: "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-70",
      secondary: "text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-400 disabled:opacity-70",
      danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:opacity-70",
    };

    const widthClass = fullWidth ? "w-full flex" : "";
    const finalClasses = `${baseClasses} ${variants[variant]} ${widthClass} ${className}`;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={finalClasses}
        {...props}
      >
        {loading ? "..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
