import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "The Green Table — Order",
  description: "Scan, browse, and order — table-side.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2a7c13",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background antialiased">
        {children}

        <Toaster
          position="top-right"
          closeButton
          duration={2500}
          offset={{ top: 72, right: 16 }}
          mobileOffset={{ top: 68, right: 12 }}
          toastOptions={{
            className: "!mx-0",
            style: {
              borderRadius: "16px",
              fontSize: "13px",
              fontWeight: 500,
              padding: "12px 14px",
              background: "var(--color-surface)", 
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border-light)",
            },
            classNames: {
              toast: "!bg-surface !text-text-primary !border !border-border-light !shadow-lg",
              title: "!text-sm !font-semibold !text-text-primary",
              description: "!text-xs !text-text-muted",
              success:
                "!bg-success-light !text-primary !border-primary-light/30",
              error:
                "!bg-surface !text-danger !border-danger/30",
              closeButton:
                "!bg-surface !border-border-light !text-text-secondary",
            },
          }}
        />
      </body>
    </html>
  );
}