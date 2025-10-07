import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gonçalo Gago — Portfolio",
  description: "Chatbot + CV site",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
