import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import "./globals.css";
import { getConfig } from "@/wagmi.config";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "TripAnon",
  description: "TripAnon app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie") ?? ""
  );
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poppins.className} bg-opacity-90 text-foreground antialiased`}
      >
        <div className="fixed inset-0 w-full h-full bg-repeat bg-noise opacity-25 bg-[length:350px] z-[-20] before:content-[''] before:absolute before:w-[2500px] before:h-[2500px] before:rounded-full before:blur-[100px] before:-left-[1000px] before:-top-[2000px] before:bg-white before:opacity-50 before:z-[-100]"></div>
        <main className="flex flex-col lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm max-w-screen mx-10 md:mx-auto pb-20">
          <Providers initialState={initialState}>
            <Navbar />
            {children}
          </Providers>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
