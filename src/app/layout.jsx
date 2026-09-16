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
      <body>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
