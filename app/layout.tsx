import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Polibrand Agency | The Leading Political Branding Partner for Women Leaders",
  description: "Strategic branding, campaign communication, and leadership development for women shaping the future of governance across Africa.",
  keywords: "political branding, women leaders, Africa, campaign communication, leadership development, political strategy",
  openGraph: {
    title: "The Polibrand Agency",
    description: "The Leading Political Branding Partner for Women Leaders",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
