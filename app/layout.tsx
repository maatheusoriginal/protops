import type { Metadata } from "next";
import { metadataOrigin } from "@/lib/site-metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(metadataOrigin),
  title: { default: "Pro-Tops Empreendimentos", template: "%s | Pro-Tops" },
  description: "Empreendimentos imobiliários em Uberlândia, Araguari e Sacramento. Conheça o portfólio da Pro-Tops.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Pro-Tops Empreendimentos",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
