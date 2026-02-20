import AppLayout from "@/components/ui/layouts/AppLayout"

const defaultLayout = ({ children }: { children: React.ReactNode }) => {
    return <AppLayout>{children}</AppLayout>
}

export default defaultLayout
