import Link from "next/link"
import { Github, Twitter, Linkedin, ArrowUpRight } from "lucide-react"
import Logo from "../../GlobalControls/Logo"
import { groupedNavItems, policiesItems } from "../nav/navigation-items"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import FooterLink from "./FooterLink"

const fancyBoxVariants = cva(
    "transition-all duration-500 ease-in-out", // Base styles
    {
        variants: {
            shape: {
                organic: "rounded-[7%_93%_19%_81%_/_89%_5%_95%_11%]",
                soft: "rounded-[3%_97%_26%_74%_/_97%_5%_95%_3%]",
                jelly: "rounded-[5%_95%_12%_88%_/_94%_12%_88%_6%]",
                leaf: "rounded-[0%_100%_0%_100%_/_0%_100%_0%_100%]",
            },
            hoverEffect: {
                true: "hover:scale-105 hover:rounded-[7%_93%_19%_81%_/_89%_5%_95%_11%]",
                false: "",
            },
            animations: {
                none: "",
                morph: "animate-morph",
            },
        },
        defaultVariants: {
            shape: "organic",
            hoverEffect: false,
        },
    }
)

export default function ComplexFooter() {
    return (
        <footer className={cn("bg-neutral-1000 relative border-t")}>
            <div className={cn("mx-auto p-12")}>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    <div
                        className={cn(
                            fancyBoxVariants({ shape: "soft" }),
                            "items-center lg:items-start",
                            "text-background bg-foreground/30 flex flex-col gap-6 px-10 py-4 lg:col-span-4"
                        )}
                    >
                        <Logo withText size={22} />
                        <p className="max-w-sm text-center text-sm leading-relaxed font-light text-neutral-600 lg:text-start">
                            An AI-powered analytics system predicting the impact of environmental
                            factors on public health — bridging the gap between environmental data
                            and actionable health intelligence.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon Icon={Twitter} href="#" />
                            <SocialIcon
                                Icon={Github}
                                href="https://github.com/gp-sehetna/sehetna"
                            />
                            <SocialIcon Icon={Linkedin} href="#" />
                        </div>
                    </div>

                    <div
                        className={cn(
                            fancyBoxVariants({ shape: "jelly" }),
                            "bg-foreground/20 text-background xs:grid-cols-3 grid grid-cols-2 gap-8 p-10 lg:col-span-8"
                        )}
                    >
                        {Object.entries(groupedNavItems).map(([category, links]) => (
                            <div key={category} className="flex flex-col gap-2">
                                <h6 className="text-sm! tracking-widest text-neutral-100 uppercase">
                                    {category}
                                </h6>
                                <ul className="flex flex-col gap-2">
                                    {links.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="group hover:text-primary-500 flex items-center text-sm font-light text-neutral-700 transition-colors"
                                            >
                                                {link.title}
                                                <ArrowUpRight className="ml-1 h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-border/10 mt-8 flex flex-col items-center justify-between gap-6 border-t pt-4 md:flex-row">
                    <p className="text-xs font-light text-neutral-800">
                        © &thinsp;{new Date().getFullYear().toString()}&thinsp; Sehetna Inc. All
                        rights reserved. Built for public health intelligence.
                    </p>
                    <div className="flex gap-8">
                        {policiesItems.map((item) => (
                            <FooterLink
                                className="text-neutral-800 hover:text-neutral-700"
                                key={item.href}
                                href={item.href}
                            >
                                {item.title}
                            </FooterLink>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

// Small helper for Social Icons
function SocialIcon({ Icon, href }: { Icon: any; href: string }) {
    return (
        <a
            href={href}
            target="_blank"
            className="border-border/10 hover:border-primary hover:text-primary flex h-8 w-8 items-center justify-center rounded-xl border bg-neutral-900/10 text-neutral-800 transition-all hover:shadow-sm"
        >
            <Icon size={20} />
        </a>
    )
}
