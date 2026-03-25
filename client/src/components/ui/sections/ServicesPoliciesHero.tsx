import { Clock, Shield } from "lucide-react"
import SectionEyebrow from "./SectionEyebrow"
import SectionShell from "./SectionShell"

export default function ServicesPoliciesHero() {
    return (
        <SectionShell
            texture="dots"
            className="to-primary-50 bg-linear-to-b from-transparent"
            containerClassName="max-w-4xl items-center gap-5 text-center lg:px-8"
        >
            <div className="glassy-chip inline-flex items-center gap-2 rounded-full px-4 py-2">
                <Shield size={13} className="text-primary" strokeWidth={2} />
                <span className="text-xs font-semibold text-neutral-800">
                    Legal, Privacy, and Governance
                </span>
            </div>
            <SectionEyebrow label="Services & Policies" className="text-primary" align="center" />
            <div className="flex flex-col gap-4">
                <h1>Services & Policies</h1>
                <p className="mx-auto max-w-2xl text-base text-neutral-800">
                    Review how Sehetna governs platform access, handles personal and operational
                    data, manages cookies, and supports responsible institutional use.
                </p>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                <Clock size={12} />
                <span>Last updated: March 25, 2026</span>
            </div>
        </SectionShell>
    )
}
