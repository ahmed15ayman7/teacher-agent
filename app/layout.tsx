"use client";
// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import CssBaseline from "@mui/material/CssBaseline";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import "react-toastify/dist/ReactToastify.css";
import InfintyProvider from "@/components/providers/InfintyProvider";
import Background from "@/components/card/bg";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <InfintyProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        dir="rtl"
        >
           <ThemeProvider theme={baselightTheme}>

        <CssBaseline />
        <Background />
        {children}
        <ToastContainer/>
           </ThemeProvider>
      </body>
    </html>
        </InfintyProvider>
  );
}
