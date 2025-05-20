import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, containerClassName, ...props }, ref) => {
    if (leftIcon || rightIcon) {
      return (
        <div className={cn("input-container", containerClassName)}>
          {leftIcon && <span className="input-left-icon">{leftIcon}</span>}
          <input
            type={type}
            className={cn(
              "input",
              leftIcon ? "has-left-icon" : "",
              rightIcon ? "has-right-icon" : "",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && <span className="input-right-icon">{rightIcon}</span>}
        </div>
      );
    }
    
    return (
      <input
        type={type}
        className={cn("input", className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input } 