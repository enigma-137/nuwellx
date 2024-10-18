
"use client";

import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/SideBar';
import { ReminderModal } from '@/components/ReminderModal';
import { Button } from '@/components/ui/button';
import '../globals.css'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024;
      setIsLargeScreen(isLarge);
      setIsSidebarOpen(isLarge);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isMounted) {
    return null; 
  }

  return (
    <div className="min-h-[75vh]">
      <div className="flex lg:hidden justify-between items-center p-4">
        <Button
          onClick={() => setIsSidebarOpen(true)}
          className="shadow-lg rounded-full p-4"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </Button>
      </div>

      <div className="lg:grid lg:grid-cols-[250px,1fr] h-full">
        <div className={`fixed inset-0 lg:static z-50 transition-all duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>

        <main className="p-4 lg:ml-64">
          {children}
        </main>
      </div>

      <ReminderModal />
    </div>
  );
}