import { UserWithoutPassword } from "@/features/auth/auth.types"
import { create } from "zustand"

type UserState = {
    user?: UserWithoutPassword

    setUser: (newUser: UserWithoutPassword) => void
}

export const useUserStore = create<UserState>((set, get) => {
    return {
        user: undefined,
        setUser: (user) => set({ user }),
    }
})
