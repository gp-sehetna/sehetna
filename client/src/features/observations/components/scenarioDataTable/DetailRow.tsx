import { ReactNode } from "react";

const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="flex items-center justify-between gap-4 border-b py-2 text-sm last:border-b-0">
        <dt className="text-muted-foreground">{label}</dt>
        <dd className="text-right font-medium">{value}</dd>
    </div>
)

export default DetailRow