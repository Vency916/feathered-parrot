import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Feather & Home | Companion Parrot Rescue & Adoption",
  description: "Every parrot deserves a home that understands. Thoughtful adoption placements built around each bird's individual needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-cream-50 text-forest-900 selection:bg-forest-100 selection:text-forest-900">
        {children}
      </body>
    </html>
  );
}
