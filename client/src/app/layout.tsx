import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import {plusJakarta, spaceGrotesk} from "@/src/config/fonts"
import AntdProvider from "../providers/AantDProvider";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Use plusJakarta as default body font */}
      <body className={plusJakarta.className}>
        {/* Use spaceGrotesk class only on headings */}
        <div className={spaceGrotesk.className}>
          <AntdRegistry>
            <AntdProvider>{children}</AntdProvider>
          </AntdRegistry>
        </div>
      </body>
    </html>
  );
}
