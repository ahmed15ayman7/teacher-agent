import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import InfintyProvider from "@/components/providers/InfintyProvider";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "المساعد في متابعة العملية التعليمية | أداة تعليمية احترافية",
  description:
    "المساعد في متابعة العملية التعليمية يساعد المدارس والمعلمين على إدارة العملية التعليمية بكفاءة، ومتابعة أداء الطلاب والمعلمين، وتحقيق أقصى استفادة من التقنيات الحديثة في التعليم.",
  keywords:
    "متابعة العملية التعليمية, إدارة التعليم, تحسين التعليم, أدوات التعليم, متابعة أداء الطلاب, تطبيق تعليمي, التعليم الحديث",
  authors: [{ name: "Ahmed Aymen", url: "https://ahmed15ayman7.vercel.app" }],
  openGraph: {
    title: "المساعد في متابعة العملية التعليمية",
    description:
      "أداة احترافية لتحسين إدارة العملية التعليمية ومتابعة أداء الطلاب والمعلمين بسهولة.",
    url: "https://teacher-agent.vercel.app/",
    siteName: "المساعد في متابعة العملية التعليمية",
    images: [
      {
        url: "https://teacher-agent.vercel.app/images/logo.png",
        width: 1200,
        height: 630,
        alt: "المساعد في متابعة العملية التعليمية",
      },
    ],
    locale: "ar_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "المساعد في متابعة العملية التعليمية",
    description:
      "تحسين إدارة العملية التعليمية ومتابعة أداء الطلاب والمعلمين بكفاءة وفعالية.",
    images: ["https://teacher-agent.vercel.app/images/twitter-image.png"],
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <InfintyProvider>
      <html lang="ar">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          dir="rtl"
        >
          {children}
        </body>
      </html>
    </InfintyProvider>
  );
}
