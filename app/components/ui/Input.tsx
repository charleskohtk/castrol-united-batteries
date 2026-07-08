"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Field, Label, Input as HUIInput, Description } from "@headlessui/react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <Field className="flex flex-col gap-2">
        {label && (
          <Label htmlFor={id} className="text-base font-bold text-foreground">
            {label}
          </Label>
        )}
        <div className="relative">
          <HUIInput
            ref={ref}
            id={id}
            type={isPassword && showPassword ? "text" : type}
            className={`w-full rounded-[var(--radius)] border border-input bg-background px-3 py-3 text-base mb-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring data-[disabled]:opacity-50 ${isPassword ? "pr-10" : ""} ${error ? "border-destructive" : ""} ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <Description id={`${id}-error`} className="text-xs text-destructive" role="alert">
            {error}
          </Description>
        )}
      </Field>
    );
  }
);

Input.displayName = "Input";
