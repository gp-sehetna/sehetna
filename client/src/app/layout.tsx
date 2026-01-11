import "./globals.css";
import { plusJakarta, spaceGrotesk } from "@/src/fonts/fonts"


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Use plusJakarta as default body font */}
      <body className={plusJakarta.className}>
        {/* Use spaceGrotesk class only on headings */}
        <div className={spaceGrotesk.className}>
          {children}
        </div>y
      </body>
    </html>
  );
}
