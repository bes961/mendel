import * as React from "react"
import { CheckIcon, XIcon, AlertIcon } from "../../assets/icons/icons"

type ToastVariant = "default" | "destructive" | "warning"

export interface ToastProps {
  title?: string
  description?: string
  variant?: ToastVariant
  icon?: React.ReactNode
}

interface ToastContextValue {
  toast: (props: ToastProps) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([])

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { ...props, id }])

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, 5000)
  }, [])

  const getDefaultIcon = (variant: ToastVariant = "default") => {
    switch (variant) {
      case "destructive":
        return <XIcon size={20} color="#ef4444" />
      case "warning":
        return <AlertIcon size={20} color="#f59e0b" />
      default:
        return <CheckIcon size={20} color="#22c55e" />
    }
  }

  const getVariantClass = (variant: ToastVariant = "default") => {
    switch (variant) {
      case "destructive":
        return "toast-error";
      case "warning":
        return "toast-warning";
      default:
        return "toast-success";
    }
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${getVariantClass(toast.variant)}`}
          >
            <span className="toast-icon">
              {toast.icon || getDefaultIcon(toast.variant)}
            </span>
            <div className="flex flex-col">
              {toast.title && <h4 className="toast-title">{toast.title}</h4>}
              {toast.description && <p className="toast-description">{toast.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
} 