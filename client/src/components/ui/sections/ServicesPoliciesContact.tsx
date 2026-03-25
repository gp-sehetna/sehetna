import { Mail, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "../shadcn/button"
import SectionShell from "./SectionShell"

export default function ServicesPoliciesContact() {
    return (
        <SectionShell className="py-12 lg:py-12">
            <div className="glassy from-primary-50/40 via-muted/50 to-success-100/20 border-muted flex flex-col gap-4 rounded-3xl border bg-linear-to-r p-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <ShieldCheck size={18} className="text-success mt-1 shrink-0" />
                        <div className="flex flex-col gap-1">
                            <h6 className="text-neutral-1000 text-sm font-semibold">
                                Questions about our policies?
                            </h6>
                            <p className="max-w-3xl text-xs text-neutral-800">
                                Our compliance team can help with institutional reviews, data
                                handling questions, procurement documentation, and legal concerns
                                related to the Sehetna platform.
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    size="lg"
                    className="bg-success text-background hover:bg-success-300/90 rounded-xl transition-all hover:-translate-y-px"
                    asChild
                >
                    <Link href="mailto:support@sehetna.from-masr.com">
                        <Mail size={14} strokeWidth={1.5} />
                        Contact Legal Team
                    </Link>
                </Button>
            </div>
        </SectionShell>
    )
}
