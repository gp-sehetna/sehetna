import { UserWithoutPassword } from "@/features/auth/auth.types"
import { create } from "zustand"

type UserState = {
    user: UserWithoutPassword | null
    isAuth: boolean // Check if user is authenticated

    setUser: (newUser: UserWithoutPassword | null) => void
}

export const useUserStore = create<UserState>((set) => {
    return {
        user: null,
        isAuth: false,
        setUser: (user) => set({ user, isAuth: !!user }),
    }
})
