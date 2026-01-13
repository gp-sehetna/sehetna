
type ComplexFooterProps = {
    [key: string]: string[]
}

export default function ComplexFooter({ }: ComplexFooterProps) {
    return (
        <footer className="py-2 border-t border-gray-300 text-center text-sm text-muted-foreground">
            Complex
        </footer>
    )
}
