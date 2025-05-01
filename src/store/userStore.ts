import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
    user: {
        userName: string,
        email: string
    } | null;
    setUser: (user: { userName: string, email: string }) => void;
    logout: () => void;


}


export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'user-storage', // localStorage key
        }
    )
);


interface Breadcramb {
    path: string[];
    setPath: (newPath: string[]) => void
}

export const breadCrambStore = create<Breadcramb>((set) => ({
    path: [],
    setPath: (newPath) => set({ path: newPath })
}));