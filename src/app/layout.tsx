import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Virtual DexTop",
  description: "Web-based operating system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-hidden m-0 p-0">
        {children}
      </body>
    </html>
  );
}
