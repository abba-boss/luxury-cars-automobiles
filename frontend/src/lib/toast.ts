import { toast } from "sonner";
import { ApiError } from "@/lib/api";

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (error: unknown) => {
  let message = "An unexpected error occurred";
  
  if (error instanceof ApiError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  toast.error(message);
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};

export const updateToast = (toastId: string | number, type: 'success' | 'error', message: string) => {
  if (type === 'success') {
    toast.success(message, { id: toastId });
  } else {
    toast.error(message, { id: toastId });
  }
};
