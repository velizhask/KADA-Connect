import type { ReactNode } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "sonner";

interface LayoutProps {
  children: ReactNode;
  isFullWidth?: boolean; 
}

const MainLayout = ({ children, isFullWidth = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex flex-col justify-start min-h-[90vh]">
        {isFullWidth ? (
          <div className="w-full flex-1">{children}</div>
        ) : (
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1 align-content-center">
            {children}
          </div>
        )}
      </main>

      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default MainLayout;
