import { create } from "zustand";

export const useNotificationModalStore = create((set) => ({
    isNotificationModalOpen: false,
    openNotificationModal: () => set({ isNotificationModalOpen: true }),
    closeNotificationModal: () => set({ isNotificationModalOpen: false }),
}));