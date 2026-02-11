import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KopiConnect - Find Your Lunch Buddy in Singapore",
  description: "Connect with like-minded people for a casual lunch at Singapore's best food courts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
