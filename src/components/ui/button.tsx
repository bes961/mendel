import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "primary" | "destructive" | "success" | "warning";
  size?: "sm" | "md" | "lg" | "icon";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "md", 
    iconLeft,
    iconRight,
    children, 
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          "button", 
          variant && `button-${variant}`,
          size && `button-${size}`,
          iconLeft ? "has-icon-left" : "",
          iconRight ? "has-icon-right" : "",
          className
        )}
        ref={ref}
        {...props}
      >
        {iconLeft && <span className="button-icon button-icon-left">{iconLeft}</span>}
        {children}
        {iconRight && <span className="button-icon button-icon-right">{iconRight}</span>}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button } 