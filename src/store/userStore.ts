import { create } from 'zustand'

interface UserState {
    user: {
        userName: string,
        email: string
    } | null;
    setUser: (user: { userName: string, email: string }) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null })
}));