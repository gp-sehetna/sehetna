import { ReactNode } from "react";

const DetailSection = ({ children, title }: { children: ReactNode; title: string }) => (
    <section>
        <h3 className="mb-2 text-sm font-semibold">{title}</h3>
        <dl className="rounded-lg border px-3">{children}</dl>
    </section>
)

export default DetailSection