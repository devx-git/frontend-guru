import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "providers/ThemeProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KICKLAST - Predicciones Deportivas",
  description: "Gana con tu conocimiento deportivo. Compra Gurús, predice resultados y multiplica tus créditos con KICKLAST.",
  icons: {
    icon: "/images/kicklast-icon.png",
    shortcut: "/images/kicklastlogo.png",
    apple: "/images/kicklastlogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}