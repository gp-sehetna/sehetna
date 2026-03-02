"use client"

import { UserResponse } from "@/features/auth/auth.types"
import { api } from "@/shared/api"
import { useUserStore } from "@/stores/user/use-user"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { EXPIRE } from "../auth/token"

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const setUser = useUserStore((s) => s.setUser)

    const { data: user } = useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const { user } = await api.get<UserResponse>("api/user/me").json()
            return user
        },
        retry: false,
        staleTime: EXPIRE.access,
    })

    useEffect(() => {
        if (user) setUser(user)
    }, [user, setUser])

    return children
}
