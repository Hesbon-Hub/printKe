import type { Metadata } from "next";
import "./globals.css";
import "./header.css";
import "./storefront.css";
import "./product-detail.css";
import "./browse.css";
import "./category-discovery.css";
import "./campaign-social.css";
import "./login.css";
import "./cart.css";
import SiteHeader from "./site-header";
import { CartProvider } from "./cart-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://shop.odeondigital.co.ke"),
  title: "Odeon Print | Print. Brand. Stand Out.",
  description:
    "Professional printing and branding in Kenya. Order business cards, flyers, banners, branded apparel, packaging and more.",
  openGraph: {
    title: "Odeon Print | Print. Brand. Stand Out.",
    description: "Professional printing and branding for businesses, events and individuals in Kenya.",
    url: "https://shop.odeondigital.co.ke",
    siteName: "Odeon Print",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><CartProvider><SiteHeader />{children}</CartProvider></body>
    </html>
  );
}
