import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://protops-empreendimentos.cpcley-100.chatgpt.site"),
  title: { default: "Pro-Tops Empreendimentos", template: "%s | Pro-Tops" },
  description: "Empreendimentos imobiliários em Uberlândia, Araguari e Sacramento. Conheça o portfólio da Pro-Tops.",
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
