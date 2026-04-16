"use client"

import Link from "next/link"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/shadcn/navigation-menu"
import Divider from "../../GlobalControls/Divider"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type NavItemsProps = {
    navigationItems: {
        [group: string]: {
            title: string
            href: string
        }[]
    }
}
export default function NavItems({ navigationItems }: NavItemsProps) {
    return (
        <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
                {Object.entries(navigationItems).map(([group, items]) => (
                    <NavigationMenuItem key={group}>
                        <NavigationMenuTrigger>{group}</NavigationMenuTrigger>
                        <NavigationMenuContent className="relative flex flex-col">
                            <p className="p-4 px-6">{group}</p>
                            <Divider className="bg-accent" hideDecorations></Divider>
                            <div className="flex flex-col p-2">
                                {items.map((item) => (
                                    <NavigationMenuLink
                                        key={item.href}
                                        asChild
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            "w-64 justify-between"
                                        )}
                                    >
                                        <Link href={item.href}>
                                            {item.title}
                                            <ArrowUpRight size={16} />
                                        </Link>
                                    </NavigationMenuLink>
                                ))}
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    )
}
