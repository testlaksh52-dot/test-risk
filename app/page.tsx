"use client";

import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import ControlManagement from "@/components/ControlManagement";
import DataIngestion from "@/components/DataIngestion";
import DrillDown from "@/components/DrillDown";
import ControlEnhancement from "@/components/ControlEnhancement";
import Sidebar from "@/components/Sidebar";
import { User as CortexUser } from "@/lib/mockDataStore";

export default function Home() {
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "control-management"
    | "data-ingestion"
    | "drilldown"
    | "enhancement"
  >("dashboard");
  const [currentUser, setCurrentUser] = useState<CortexUser | null>(null);
  const [drillDownProps, setDrillDownProps] = useState<{
    selectedMetric: string;
    selectedValue: string;
    filters: any;
  } | null>(null);

  useEffect(() => {
    // Get current user from localStorage
    const savedUser = localStorage.getItem("cortex-user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleViewChange = (
    view:
      | "dashboard"
      | "control-management"
      | "data-ingestion"
      | "drilldown"
      | "enhancement"
  ) => {
    setActiveView(view);
  };

  const handleDrillDown = (
    selectedMetric: string,
    selectedValue: string,
    filters: any
  ) => {
    setDrillDownProps({ selectedMetric, selectedValue, filters });
    setActiveView("drilldown");
  };

  const handleBackToDashboard = () => {
    setActiveView("dashboard");
    setDrillDownProps(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("cortex-user");
    setCurrentUser(null);
    // The AuthSystem will handle showing the login screen
    window.location.reload();
  };

  if (!currentUser) {
    return null; // AuthSystem will handle the login
  }

  return (
    <div className="flex h-screen bg-navy-darker">
      <Sidebar onViewChange={handleViewChange} activeView={activeView} />

      {activeView === "dashboard" && (
        <Dashboard
          onViewChange={handleViewChange}
          user={currentUser}
          onDrillDown={handleDrillDown}
          onLogout={handleLogout}
        />
      )}

      {activeView === "control-management" && (
        <ControlManagement onViewChange={handleViewChange} user={currentUser} />
      )}

      {activeView === "data-ingestion" && (
        <DataIngestion
          user={currentUser}
          onUploadComplete={() => setActiveView("dashboard")}
        />
      )}

      {activeView === "drilldown" && drillDownProps && (
        <DrillDown
          user={currentUser}
          selectedMetric={drillDownProps.selectedMetric}
          selectedValue={drillDownProps.selectedValue}
          filters={drillDownProps.filters}
          onBack={handleBackToDashboard}
        />
      )}

      {activeView === "enhancement" && (
        <ControlEnhancement user={currentUser} onBack={handleBackToDashboard} />
      )}
    </div>
  );
}
