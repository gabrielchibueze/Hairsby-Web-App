import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
// import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { HairsbyIcon } from "@/components/general/logo";
import { useAuth } from "@/lib/contexts/auth.context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hairsby - Your Beauty Service Marketplace",
  description:
    "Book beauty services, buy products, and connect with top beauty professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { user, isLoading } = useAuth();
  // if (isLoading) {
  //   return (
  //     <div className="relative flex min-h-screen items-center justify-center bg-[#0a0e17]">
  //       <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-hairsby-orange"></div>
  //       <div className="absolute">
  //         <HairsbyIcon />
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col justify-between min-h-[100vh]">
            <div>
              <Navbar />
              {children}
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
