"use client";

import { useState, useEffect } from "react";

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Initializing System");

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500); // 4.5 seconds for professional feel

    return () => clearTimeout(timer);
  }, []);

  const startLoading = (message?: string) => {
    setIsLoading(true);
    if (message) setLoadingMessage(message);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
  };
};
