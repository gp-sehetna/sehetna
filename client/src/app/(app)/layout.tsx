import HomeLayout from "@/components/ui/layouts/AppLayout"

const defaultHomeLayout = ({ children }: { children: React.ReactNode }) => {
    return <HomeLayout>{children}</HomeLayout>
}

export default defaultHomeLayout
