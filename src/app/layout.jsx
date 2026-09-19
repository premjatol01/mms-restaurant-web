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
          richColors
          closeButton
          duration={2500}
          offset={{ top: 72, right: 16 }}     // desktop / wider screens
          mobileOffset={{ top: 68, right: 12 }} // small screens
          toastOptions={{
            className: "!mx-0", // don't auto-center; keep right-aligned
            style: {
              borderRadius: "16px",
              fontSize: "13px",
              fontWeight: 500,
              padding: "12px 14px",
            },
            classNames: {
              toast: "!shadow-lg !border !border-border-light",
              title: "!text-sm !font-semibold",
              description: "!text-xs !text-text-muted",
              success:
                "!bg-success-light !text-primary !border-primary-light/30",
              error: "!bg-danger/10 !text-danger !border-danger/20",
              closeButton:
                "!bg-surface !border-border-light !text-text-secondary",
            },
          }}
        />
      </body>
    </html>
  );
}