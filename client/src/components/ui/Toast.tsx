import { toast } from "sonner";

const activeToasts = new Set<string>();

const useToast = () => {
  return (message: string, description: string = '') => {
    if (activeToasts.has(message)) return
    activeToasts.add(message);

    const toastId = toast(message, {
      description: description,
      action: {
        label: "Close",
        onClick: () => { toast.dismiss(toastId) }
      },
      onDismiss() {
        activeToasts.delete(message);
      },
      onAutoClose() {
        activeToasts.delete(message);
      },
    });
  };
};

export default useToast;
