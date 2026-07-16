import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "HRFlow | Modern HR Management Platform",
  description:
    "Manage recruitment, payroll, attendance, leave, and employee performance from one intelligent HR platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${raleway.className} bg-slate-50 text-slate-900 antialiased`}>

        {children}
      </body>
    </html>
  );
}

 // No backend / no submission.