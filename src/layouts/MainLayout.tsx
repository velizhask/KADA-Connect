import type { ReactNode } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

interface LayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex flex-col justify-start min-h-[90vh]">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};


export default MainLayout;
