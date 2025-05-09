import { toast } from "sonner";

const useToast = () => {
  return (message:string) => {
    const toastId = toast(message, {
      action: {
        label: "Close",
        onClick: () => toast.dismiss(toastId),
      },
    });
  };
};

export default useToast;
