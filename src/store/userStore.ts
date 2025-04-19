import { create } from 'zustand'

interface UserState {
    user: {
        userName: String,
        email: String
    } | null;
    setUser: (user: { userName: string, email: string }) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));