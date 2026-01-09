"use client";

import { ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";

export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider
        theme={{
          token: {
            // Primary
            colorPrimary: "var(--color-primary-400)",

            // Status
            colorSuccess: "var(--color-green-300)",
            colorWarning: "var(--color-yellow-100)",
            colorError: "#ef4444",

            // Base
            colorBgBase: "var(--background)",
            colorTextBase: "var(--foreground)",

            borderRadius: 4,
          },

          components: {
            Button: {
              colorPrimary: "var(--color-primary-400)",
              colorPrimaryHover: "var(--color-primary-300)",
              colorPrimaryActive: "var(--color-primary-500)",
            },

            Typography: {
              colorLink: "var(--color-primary-400)",
              colorLinkHover: "var(--color-primary-300)",
              colorLinkActive: "var(--color-primary-500)",
            },

            Alert: {
              colorSuccessBg: "var(--color-green-100)",
              colorWarningBg: "var(--color-yellow-100)",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}
