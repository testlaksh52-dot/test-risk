"use client";

import "./globals.css";
import { useLoading } from "@/hooks/useLoading";
import Loader from "@/components/Loader";
import AuthSystem from "@/components/AuthSystem";
import { useState, useCallback } from "react";
import { User as CoraUser } from "@/lib/mockDataStore";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useLoading();
  const [currentUser, setCurrentUser] = useState<CoraUser | null>(null);

  const handleLogin = useCallback((user: CoraUser) => {
    setCurrentUser(user);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return (
    <html lang="en">
      <body className="font-sans" suppressHydrationWarning={true}>
        <Loader isLoading={isLoading} />
        {!isLoading && (
          <>
            <AuthSystem onLogin={handleLogin} onLogout={handleLogout} />
            {currentUser && children}
          </>
        )}
      </body>
    </html>
  );
}
