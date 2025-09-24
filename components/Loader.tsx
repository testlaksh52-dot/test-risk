"use client";

import { useState, useEffect } from "react";

interface LoaderProps {
  isLoading: boolean;
}

const Loader = ({ isLoading }: LoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing System");

  useEffect(() => {
    if (!isLoading) return;

    const loadingSteps = [
      { text: "Initializing System", duration: 800 },
      { text: "Loading Security Protocols", duration: 1200 },
      { text: "Authenticating Access", duration: 1000 },
      { text: "Preparing Dashboard", duration: 900 },
      { text: "Finalizing Setup", duration: 600 },
    ];

    let currentStep = 0;
    let currentProgress = 0;
    const totalDuration = loadingSteps.reduce(
      (sum, step) => sum + step.duration,
      0
    );
    const progressIncrement = 100 / totalDuration;

    const interval = setInterval(() => {
      currentProgress += progressIncrement;
      setProgress(Math.min(currentProgress, 100));

      // Update loading text based on progress
      const stepProgress = currentProgress / 20; // Each step is 20% of total
      if (stepProgress > currentStep && currentStep < loadingSteps.length) {
        setLoadingText(loadingSteps[currentStep].text);
        currentStep++;
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setLoadingText("Ready");
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-navy-darker z-[99999] flex items-center justify-center">
      {/* Professional Background */}
      <div className="absolute inset-0">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cortex-blue/5 via-transparent to-cortex-green/5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md mx-auto px-8">
        {/* Professional Logo */}
        <div className="relative">
          <div className="w-16 h-16 bg-glass-aurora backdrop-blur-sm rounded-xl border border-glass-border shadow-lg flex items-center justify-center">
            <img
              src="/images/logos/amp.png"
              alt="Logo"
              width={40}
              height={40}
            />
          </div>
          {/* Subtle rotating ring */}
          <div
            className="absolute inset-0 w-16 h-16 rounded-xl border border-cortex-blue/30 animate-spin"
            style={{ animationDuration: "3s" }}
          ></div>
        </div>

        {/* Company Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-wide font-sans">
            CORA
          </h1>
          <p className="text-gray-300 text-sm font-medium">
            Control & Risk Analytics Platform
          </p>
        </div>

        {/* Professional Progress Bar */}
        <div className="w-full space-y-4">
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-2 bg-glass-aurora backdrop-blur-sm rounded-full border border-glass-border overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cortex-blue to-cortex-green rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {/* Progress Percentage */}
            <div className="absolute -top-6 right-0 text-white text-sm font-medium">
              {Math.round(progress)}%
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center">
            <p className="text-white text-base font-medium mb-2">
              {loadingText}
            </p>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-1.5 h-1.5 bg-cortex-blue rounded-full animate-bounce"></div>
              <div
                className="w-1.5 h-1.5 bg-cortex-blue rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-cortex-blue rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="flex items-center space-x-2 text-gray-300 text-sm">
          <div className="w-2 h-2 bg-cortex-green rounded-full"></div>
          <span>Enterprise Security Active</span>
        </div>

        {/* System Status Grid */}
        <div className="grid grid-cols-3 gap-3 w-full">
          <div className="bg-glass-aurora backdrop-blur-sm px-3 py-2 rounded-lg border border-glass-border text-center">
            <div className="text-cortex-green text-xs font-semibold">
              SECURE
            </div>
          </div>
          <div className="bg-glass-aurora backdrop-blur-sm px-3 py-2 rounded-lg border border-glass-border text-center">
            <div className="text-cortex-blue text-xs font-semibold">
              ENCRYPTED
            </div>
          </div>
          <div className="bg-glass-aurora backdrop-blur-sm px-3 py-2 rounded-lg border border-glass-border text-center">
            <div className="text-cortex-green text-xs font-semibold">
              MONITORED
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-xs">
            © 2024 Ampli Agent Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
