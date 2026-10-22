import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Katasphere — Practice. Improve. Repeat.",
  description:
    "A modern full-stack online coding practice platform. Solve algorithmic problems, execute code across Java, Python, C++, and JavaScript, and master technical interviews.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
