import { UserWithoutPassword } from "@/features/auth/auth.types"
import { create } from "zustand"

type UserState = {
    user: UserWithoutPassword | null

    setUser: (newUser: UserWithoutPassword | null) => void
}

export const useUserStore = create<UserState>((set) => {
    return {
        user: null,
        setUser: (user) => set({ user }),
    }
})
