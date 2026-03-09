"use client"

import Link from "next/link"
import { ArrowUpRight, Equal } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/shadcn/sheet"
import NavActions from "./NavActions"
import { Button } from "../../shadcn/button"
import { NavItemsProps } from "./NavItems"
import { cn } from "@/lib/utils"
import { navigationMenuTriggerStyle } from "../../shadcn/navigation-menu"
import Divider from "../../GlobalControls/Divider"

type MobileNavProps = {
    navigationItems: NavItemsProps["navigationItems"]
    isScrolled: boolean
}
export default function MobileNav({ isScrolled, navigationItems }: MobileNavProps) {
    return (
        <div className="flex md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        className={cn(isScrolled ? "" : "text-background")}
                        size="icon"
                        variant="text"
                    >
                        <Equal />
                    </Button>
                </SheetTrigger>
                <SheetContent side="top" className="px-0 pt-2">
                    <SheetHeader className="p-0">
                        <SheetTitle className="p-0" />
                    </SheetHeader>
                    <div className="grid w-full grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                        {Object.entries(navigationItems).map(([group, items]) => (
                            <div key={group}>
                                <div className="gap-2 text-center">
                                    <h6 className="text-sm font-medium">{group}</h6>
                                    <Divider hideDecorations />
                                </div>
                                <nav className="flex flex-col">
                                    {items.map((item) => (
                                        <Link
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                "w-full justify-between"
                                            )}
                                            key={item.href}
                                            href={item.href}
                                        >
                                            {item.title}
                                            <ArrowUpRight size={16} />
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        ))}
                    </div>
                    <div className="flex w-full justify-end px-6">
                        <NavActions />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
