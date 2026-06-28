import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import Footer from "../components/Footer";
import ScrollToTop from '../components/ScrollToTop';
import SmoothScroll from "../components/SmoothScroll";
import LoadingScreen from "../components/LoadingScreen";
import FloatingParticles from "../components/FloatingParticles";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#581C87",
};

export const metadata = {
  title: "JeshuVerse | Premium Clothing & Royal Jewellery Store",
  description: "JeshuVerse - Fashion For Everyone. Explore high-end Kanchipuram silk sarees, designer men's ethnic kurtas, kids fashion gowns, and royal 24K gold-plated Kundan necklace sets.",
  keywords: "saree, ethnic wear, jewellery, gold necklace, kids wear, designer kurtas, kundan choker, bridal fashion, buy online",
  author: "JeshuVerse",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192x192.png",
  },
  openGraph: {
    title: "JeshuVerse | Fashion For Everyone",
    description: "Shop beautiful Indian ethnic wear and royal wedding jewellery.",
    url: "https://jeshuverse.vercel.app",
    siteName: "JeshuVerse",
    images: [
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-transparent text-white flex flex-col font-sans relative overflow-x-hidden">
        {/* Ambient floating particle system */}
        <FloatingParticles />
        {/* Luxury intro loader (once per session) */}
        <LoadingScreen />
        {/* Cinematic smooth/inertia scrolling */}
        <SmoothScroll />

        {/* Vibrant ambient gold & purple glow blobs */}
        <div className="absolute top-10 left-[-15%] w-[45rem] h-[45rem] rounded-full bg-amber-900/25 blur-[150px] pointer-events-none -z-20 animate-pulse-slow" />
        <div className="absolute top-[35%] right-[-15%] w-[40rem] h-[40rem] rounded-full bg-purple-900/30 blur-[150px] pointer-events-none -z-20" />
        <div className="absolute bottom-20 left-[20%] w-[35rem] h-[35rem] rounded-full bg-amber-800/20 blur-[130px] pointer-events-none -z-20 animate-pulse-slow" />

        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ScrollToTop />
              <Header />
              <main className="flex-grow pb-16 md:pb-0">
                {children}
              </main>
              <BottomNavigation />
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
