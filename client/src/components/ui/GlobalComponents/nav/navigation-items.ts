import { LucideIcon, Telescope, Waypoints, ShieldCheck, Info } from "lucide-react"

type NavigationRouteItem = {
    title: string
    href: string
    icon?: LucideIcon
    description?: string
}

const ALL_ROUTES = {
    map: { title: "Live Map", href: "/map", icon: Map },
    explorer: { title: "Data Explorer", href: "/data-explorer", icon: Telescope },
    methodology: { title: "Methodology", href: "/methodology", icon: Waypoints },
    security: { title: "Security", href: "/settings/security", icon: ShieldCheck },
    support: { title: "Support", href: "/support", icon: Info },
    policies: { title: "Services & Policies", href: "/support/services-and-policies" },
    privacyPolicy: {
        title: "Privacy Policy",
        href: "/support/services-and-policies#privacy-policy",
    },
    termsOfService: {
        title: "Terms of Service",
        href: "/support/services-and-policies#terms-of-service",
    },
    cookieUse: {
        title: "Cookie Use",
        href: "/support/services-and-policies#cookie-use",
    },
    about: { title: "More About Us", href: "/more-about-us" },

    // Use Cases
    healthMon: { title: "Health Monitoring", href: "/use-cases/health-monitoring" },
    healthPrep: { title: "Health Preparedness", href: "/use-cases/health-preparedness" },
    policyPlan: { title: "Policy Planning", href: "/use-cases/policy-planning" },
    research: { title: "Research Insights", href: "/use-cases/research-insights" },
} as const

type RouteKey = keyof typeof ALL_ROUTES

const getRoutes = (keys: RouteKey[]): NavigationRouteItem[] => {
    return keys.map((key) => ALL_ROUTES[key]) as NavigationRouteItem[]
}

const getGroupedRoutes = (config: Record<string, RouteKey[]>) => {
    return Object.entries(config).reduce(
        (acc, [group, keys]) => {
            acc[group] = getRoutes(keys)
            return acc
        },
        {} as Record<string, NavigationRouteItem[]>
    )
}

const compactSidebarItems = getRoutes(["map", "explorer", "methodology", "security", "support"])
const simpleFooterItems = getRoutes([
    "about",
    "methodology",
    "termsOfService",
    "privacyPolicy",
    "cookieUse",
    "support",
])
const policiesItems = getRoutes(["privacyPolicy", "termsOfService", "cookieUse"])

const groupedNavItems = getGroupedRoutes({
    Data: ["methodology", "explorer"],
    Services: ["map", "explorer"],
    "Use Cases": ["healthMon", "healthPrep", "policyPlan", "research"],
    Company: ["about", "support", "policies"],
})

export { compactSidebarItems, simpleFooterItems, groupedNavItems, policiesItems }
