"use client"

import { UserResponse } from "@/features/auth/auth.types"
import { EXPIRE } from "@/lib/auth/token"
import { api } from "@/shared/api"
import { useUserStore } from "@/stores/user/use-user"
import { useQuery } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const setUser = useUserStore((s) => s.setUser)
    const pathname = usePathname()
    const isAuthRoute = pathname.startsWith("/authenticate")

    const { data: user, isError } = useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const { user } = await api.get<UserResponse>("api/user/me").json()
            return user
        },
        enabled: !isAuthRoute,
        retry: false,
        staleTime: EXPIRE.access,
    })

    useEffect(() => {
        if (user) setUser(user)
        else if (isError || isAuthRoute) setUser(null)
    }, [user, isError, isAuthRoute, setUser])

    return children
}
