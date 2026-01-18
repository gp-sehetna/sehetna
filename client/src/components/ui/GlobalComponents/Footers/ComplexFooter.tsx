type ComplexFooterProps = {
    [key: string]: string[]
}

export default function ComplexFooter({}: ComplexFooterProps) {
    return (
        <footer className="text-muted-foreground border-t border-gray-300 py-2 text-center text-sm">
            Complex
        </footer>
    )
}
