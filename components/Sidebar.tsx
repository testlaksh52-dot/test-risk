"use client";

import {
  Grid,
  List,
  MessageCircle,
  Settings,
  User,
  Upload,
  BarChart3,
  Wrench,
} from "lucide-react";

interface SidebarProps {
  activeView:
    | "dashboard"
    | "control-management"
    | "data-ingestion"
    | "drilldown"
    | "enhancement";
  onViewChange: (
    view:
      | "dashboard"
      | "control-management"
      | "data-ingestion"
      | "drilldown"
      | "enhancement"
  ) => void;
}

const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  return (
    <div className="w-16 bg-navy-darker flex flex-col items-center py-4 space-y-6">
      {/* Logo */}
      <button
        onClick={() => onViewChange("dashboard")}
        className="hover:opacity-80 transition-opacity duration-300"
      >
        <img src="/images/logos/amp.png" alt="Logo" width={32} height={32} />
      </button>

      {/* Navigation Icons */}
      <div className="flex flex-col space-y-3">
        <button
          onClick={() => onViewChange("dashboard")}
          className={`w-10 h-10 rounded flex items-center justify-center transition-all duration-300 ${
            activeView === "dashboard"
              ? "bg-cortex-blue"
              : "bg-transparent hover:bg-navy-light"
          }`}
        >
          <Grid
            size={20}
            className={
              activeView === "dashboard" ? "text-white" : "text-gray-400"
            }
          />
        </button>
        <button
          onClick={() => onViewChange("control-management")}
          className={`w-10 h-10 rounded flex items-center justify-center transition-all duration-300 ${
            activeView === "control-management"
              ? "bg-cortex-blue"
              : "bg-transparent hover:bg-navy-light"
          }`}
        >
          <List
            size={20}
            className={
              activeView === "control-management"
                ? "text-white"
                : "text-gray-400"
            }
          />
        </button>
        <button
          onClick={() => onViewChange("data-ingestion")}
          className={`w-10 h-10 rounded flex items-center justify-center transition-all duration-300 ${
            activeView === "data-ingestion"
              ? "bg-cortex-blue"
              : "bg-transparent hover:bg-navy-light"
          }`}
        >
          <Upload
            size={20}
            className={
              activeView === "data-ingestion" ? "text-white" : "text-gray-400"
            }
          />
        </button>
        <button
          onClick={() => onViewChange("enhancement")}
          className={`w-10 h-10 rounded flex items-center justify-center transition-all duration-300 ${
            activeView === "enhancement"
              ? "bg-cortex-blue"
              : "bg-transparent hover:bg-navy-light"
          }`}
        >
          <Wrench
            size={20}
            className={
              activeView === "enhancement" ? "text-white" : "text-gray-400"
            }
          />
        </button>
        <button className="w-10 h-10 bg-transparent hover:bg-navy-light rounded flex items-center justify-center transition-all duration-300">
          <MessageCircle size={20} className="text-gray-400" />
        </button>
        <button className="w-10 h-10 bg-transparent hover:bg-navy-light rounded flex items-center justify-center transition-all duration-300">
          <Settings size={20} className="text-gray-400" />
        </button>
        <button className="w-10 h-10 bg-transparent hover:bg-navy-light rounded flex items-center justify-center transition-all duration-300">
          <User size={20} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
