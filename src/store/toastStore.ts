import { create } from "zustand";

interface ToastState {
  visible: boolean;

  title: string;

  message: string;

  showToast: (title: string, message: string) => void;

  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,

  title: "",

  message: "",

  showToast: (title, message) => {
    set({
      visible: true,
      title,
      message,
    });

    setTimeout(() => {
      set({
        visible: false,
      });
    }, 4000);
  },

  hideToast: () =>
    set({
      visible: false,
    }),
}));
