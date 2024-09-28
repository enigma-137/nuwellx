"use client";

import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/SideBar';
import { ReminderModal } from '@/components/ReminderModal';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Handle checking if the screen is large (client-side only)
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true); // Automatically open the sidebar on large screens
      } else {
        setIsSidebarOpen(false); // Close the sidebar on smaller screens
      }
    };

    // Set initial state on mount
    handleResize();

    // Add event listener to handle window resizing
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute='class'>
        <div className=" min-h-screen">
          <div className="flex lg:hidden justify-between items-center p-4">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className=" shadow-lg rounded-full p-4"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Main Grid Layout */}
          <div className="lg:grid lg:grid-cols-[250px,1fr] h-full">
            {/* Sidebar (Only visible on large screens or if the mobile sidebar is open) */}
            <div className={`fixed inset-0 lg:static z-50 transition-all duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
              {/* Pass isOpen prop to the Sidebar */}
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content Area */}
            <main className="p-4 lg:ml-64">
              {children}
            </main>
          </div>
        </div>

        {/* Reminder Modal */}
        <ReminderModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
