import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";


export const metadata: Metadata = {
  title: "Gonçalo Gago — Portfolio",
  description: "Chatbot + CV site",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidget /> {/* aparece em todo o site */}
      </body>
    </html>
  );
}