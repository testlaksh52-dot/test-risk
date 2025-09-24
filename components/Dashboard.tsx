"use client";

import {
  ChevronDown,
  User,
  Settings,
  Download,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  X,
  LogOut,
} from "lucide-react";
import {
  mockDataStore,
  User as CortexUser,
  FilterConfig,
  SavedView,
  ExportConfig,
} from "@/lib/mockDataStore";
import { mockControls, dashboardMetrics, filterOptions } from "@/lib/mockData";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ExportManager, ExportData } from "@/lib/exportUtils";
import ControlDetailModal from "./ControlDetailModal";

interface DashboardProps {
  onViewChange?: (
    view: "dashboard" | "control-management" | "data-ingestion"
  ) => void;
  user?: CortexUser;
  onDrillDown?: (
    selectedMetric: string,
    selectedValue: string,
    filters: FilterConfig
  ) => void;
  onLogout?: () => void;
}

const Dashboard = ({
  onViewChange,
  user,
  onDrillDown,
  onLogout,
}: DashboardProps) => {
  const [selectedFilters, setSelectedFilters] = useState<FilterConfig>({
    location: [],
    businessLine: [],
    function: [],
    controlType: [],
    controlFrequency: [],
    automationType: [],
    effectiveness: [],
    cortexMatch: [],
    owner: [],
    region: [],
  });

  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showSaveViewModal, setShowSaveViewModal] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [selectedEffectivenessFilter, setSelectedEffectivenessFilter] =
    useState<string | null>(null);
  const [selectedAutomationFilter, setSelectedAutomationFilter] = useState<
    string | null
  >(null);
  const [selectedCortexMatchFilter, setSelectedCortexMatchFilter] = useState<
    string | null
  >(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [datePickerPosition, setDatePickerPosition] = useState({ x: 0, y: 0 });
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showControlMatrix, setShowControlMatrix] = useState(true);
  const [showRiskControls, setShowRiskControls] = useState(true);
  const [showEnhancementStats, setShowEnhancementStats] = useState(true);
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: "PDF",
    orientation: "landscape",
    includeCharts: true,
    includeAuditTrail: false,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [selectedControl, setSelectedControl] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  // Close date picker when clicking outside (portal approach)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        showDatePicker &&
        !target.closest('[data-date-picker="trigger"]') &&
        !target.closest('[data-date-picker="modal"]')
      ) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  // Load saved views on component mount
  useEffect(() => {
    if (user) {
      const views = mockDataStore.getSavedViews(user.id);
      setSavedViews(views);
    }
  }, [user]);

  // Get filtered data from mock data store with drill-down filters
  const getFilteredData = () => {
    let filters = { ...selectedFilters };

    // Apply drill-down filters
    if (selectedEffectivenessFilter) {
      filters.effectiveness = [selectedEffectivenessFilter];
    }
    if (selectedAutomationFilter) {
      filters.automationType = [selectedAutomationFilter];
    }
    if (selectedCortexMatchFilter) {
      filters.cortexMatch = [selectedCortexMatchFilter];
    }

    return mockDataStore.getControls(filters);
  };

  const filteredData = getFilteredData();

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  // Get dashboard metrics from mock data store
  const dashboardMetrics = mockDataStore.getDashboardMetrics(selectedFilters);

  const resetFilters = () => {
    setSelectedFilters({
      location: [],
      businessLine: [],
      function: [],
      controlType: [],
      controlFrequency: [],
      automationType: [],
      effectiveness: [],
      cortexMatch: [],
      owner: [],
      region: [],
    });
    setSelectedEffectivenessFilter(null);
    setSelectedAutomationFilter(null);
    setSelectedCortexMatchFilter(null);
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  const saveCurrentView = () => {
    if (user && newViewName.trim()) {
      const view: Omit<SavedView, "id" | "createdAt"> = {
        name: newViewName,
        userId: user.id,
        filters: selectedFilters,
        isDefault: false,
      };
      const savedView = mockDataStore.saveView(view);
      setSavedViews([...savedViews, savedView]);
      setNewViewName("");
      setShowSaveViewModal(false);
    }
  };

  const loadSavedView = (view: SavedView) => {
    setSelectedFilters(view.filters);
    setShowViewDropdown(false);
  };

  const handleExport = async () => {
    if (!user) return;

    try {
      // Show loading state
      setIsExporting(true);
      setShowExportDropdown(false);

      // Prepare export data
      const exportData: ExportData = {
        controls: filteredData,
        filters: selectedFilters,
        exportConfig,
        dashboardMetrics: mockDataStore.getDashboardMetrics(selectedFilters),
        auditTrail: exportConfig.includeAuditTrail
          ? mockDataStore.getAuditTrail()
          : undefined,
      };

      // Perform export
      await ExportManager.exportData(exportData);

      // Log audit entry
      mockDataStore.addAuditEntry({
        timestamp: new Date().toISOString(),
        userId: user.id,
        action: "EXPORT",
        entityType: "system",
        entityId: "dashboard",
        reason: `Exported ${filteredData.length} controls in ${exportConfig.format} format`,
      });

      console.log(`Export completed successfully: ${exportConfig.format}`);
    } catch (error) {
      console.error("Export failed:", error);
      alert(
        `Export failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleRowClick = (control: any) => {
    setSelectedControl(control);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedControl(null);
  };

  const handleSaveControl = (updatedControl: any) => {
    // The control is already updated in the mockDataStore by the modal
    // We just need to refresh the data if needed
    console.log("Control updated:", updatedControl);
  };

  const MetricCard = ({
    title,
    value,
    color,
    bgColor,
    titleColor = "text-white",
    onClick,
  }: {
    title: string;
    value: number;
    color: string;
    bgColor: string;
    titleColor?: string;
    onClick?: () => void;
  }) => (
    <div
      className={`${bgColor} rounded-lg p-3 min-w-[100px] flex flex-col items-center justify-center ${
        onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
      }`}
      onClick={onClick}
    >
      <div className={`text-lg font-semibold ${color} mb-1 font-sans`}>
        {value}
      </div>
      <div
        className={`text-[10px] font-medium ${titleColor} font-sans uppercase tracking-wide`}
      >
        {title}
      </div>
    </div>
  );

  const InteractiveSegment = ({
    width,
    color,
    label,
    value,
    percentage,
    onClick,
    isSelected,
    onMouseEnter,
    onMouseLeave,
  }: {
    width: string;
    color: string;
    label: string;
    value: number;
    percentage: number;
    onClick: () => void;
    isSelected: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }) => (
    <div
      className={`${color} cursor-pointer transition-all duration-200 relative ${
        isSelected ? "ring-2 ring-white ring-opacity-50" : ""
      } hover:opacity-80 hover:scale-105`}
      style={{ width }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {hoveredSegment === label && (
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-glass-aurora backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg shadow-2xl border border-glass-border whitespace-nowrap z-[99999] pointer-events-none">
          <div className="font-semibold">
            {value} {label}
          </div>
          <div className="text-gray-300">{percentage.toFixed(1)}%</div>
        </div>
      )}
    </div>
  );

  const EffectivenessBar = () => {
    const total =
      dashboardMetrics.effectiveness.ineffective +
      dashboardMetrics.effectiveness.needsImprovement +
      dashboardMetrics.effectiveness.notRated +
      dashboardMetrics.effectiveness.effective;

    const segments = [
      {
        label: "Ineffective",
        value: dashboardMetrics.effectiveness.ineffective,
        color: "bg-cortex-red",
        textColor: "text-cortex-red",
      },
      {
        label: "Needs Improvement",
        value: dashboardMetrics.effectiveness.needsImprovement,
        color: "bg-amber-500",
        textColor: "text-amber-500",
      },
      {
        label: "Not Rated",
        value: dashboardMetrics.effectiveness.notRated,
        color: "bg-cortex-gray",
        textColor: "text-cortex-gray",
      },
      {
        label: "Effective",
        value: dashboardMetrics.effectiveness.effective,
        color: "bg-cortex-green",
        textColor: "text-cortex-green",
      },
    ];

    return (
      <div className="p-6">
        <div className="text-white text-sm font-semibold mb-3 font-sans">
          Control Effectiveness
        </div>
        <div className="flex h-10 rounded overflow-hidden mb-2 relative">
          {segments.map((segment) => {
            const percentage = (segment.value / total) * 100;
            return (
              <InteractiveSegment
                key={segment.label}
                width={`${percentage}%`}
                color={segment.color}
                label={segment.label}
                value={segment.value}
                percentage={percentage}
                onClick={() => {
                  const newFilter =
                    selectedEffectivenessFilter === segment.label
                      ? null
                      : segment.label;
                  setSelectedEffectivenessFilter(newFilter);
                  setCurrentPage(1);
                }}
                isSelected={selectedEffectivenessFilter === segment.label}
                onMouseEnter={() => {
                  console.log("Mouse enter:", segment.label);
                  setHoveredSegment(segment.label);
                }}
                onMouseLeave={() => {
                  console.log("Mouse leave:", segment.label);
                  setHoveredSegment(null);
                }}
              />
            );
          })}
        </div>
        <div className="relative flex text-[10px] text-white font-sans">
          {segments.map((segment, index) => {
            const percentage = (segment.value / total) * 100;
            const leftPosition = segments
              .slice(0, index)
              .reduce((acc, seg) => acc + (seg.value / total) * 100, 0);
            return (
              <span
                key={segment.label}
                className={`font-bold ${segment.textColor} absolute`}
                style={{
                  left: `${leftPosition + percentage / 2}%`,
                  transform: "translateX(-50%)",
                  minWidth: "max-content",
                }}
              >
                {segment.value} {segment.label}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  const AutomationBar = () => {
    const total =
      dashboardMetrics.automation.manual +
      dashboardMetrics.automation.semiAutomated +
      dashboardMetrics.automation.itDependent +
      dashboardMetrics.automation.automated;

    const segments = [
      {
        label: "Manual",
        value: dashboardMetrics.automation.manual,
        color: "bg-cortex-red",
        textColor: "text-cortex-red",
      },
      {
        label: "Semi-Automated",
        value: dashboardMetrics.automation.semiAutomated,
        color: "bg-amber-500",
        textColor: "text-amber-500",
      },
      {
        label: "IT Dependent",
        value: dashboardMetrics.automation.itDependent,
        color: "bg-cortex-green",
        textColor: "text-cortex-green",
      },
      {
        label: "Automated",
        value: dashboardMetrics.automation.automated,
        color: "bg-cortex-blue",
        textColor: "text-cortex-blue",
      },
    ];

    return (
      <div className="p-6">
        <div className="text-white text-sm font-semibold mb-3 font-sans">
          Control Automation
        </div>
        <div className="flex h-10 rounded overflow-hidden mb-2 relative">
          {segments.map((segment) => {
            const percentage = (segment.value / total) * 100;
            return (
              <InteractiveSegment
                key={segment.label}
                width={`${percentage}%`}
                color={segment.color}
                label={segment.label}
                value={segment.value}
                percentage={percentage}
                onClick={() => {
                  const newFilter =
                    selectedAutomationFilter === segment.label
                      ? null
                      : segment.label;
                  setSelectedAutomationFilter(newFilter);
                  setCurrentPage(1);
                }}
                isSelected={selectedAutomationFilter === segment.label}
                onMouseEnter={() => {
                  console.log("Mouse enter:", segment.label);
                  setHoveredSegment(segment.label);
                }}
                onMouseLeave={() => {
                  console.log("Mouse leave:", segment.label);
                  setHoveredSegment(null);
                }}
              />
            );
          })}
        </div>
        <div className="relative flex text-[10px] text-white font-sans">
          {segments.map((segment, index) => {
            const percentage = (segment.value / total) * 100;
            const leftPosition = segments
              .slice(0, index)
              .reduce((acc, seg) => acc + (seg.value / total) * 100, 0);
            return (
              <span
                key={segment.label}
                className={`font-bold ${segment.textColor} absolute`}
                style={{
                  left: `${leftPosition + percentage / 2}%`,
                  transform: "translateX(-50%)",
                  minWidth: "max-content",
                }}
              >
                {segment.value} {segment.label}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Gap":
        return "bg-cortex-red";
      case "Needs Improvement":
        return "bg-amber-500";
      case "Manual":
        return "bg-cortex-red";
      case "Generated":
        return "bg-cortex-red";
      case "Not Started":
        return "bg-cortex-green";
      case "Approved":
        return "bg-cortex-blue";
      case "Rejected":
        return "bg-cortex-red";
      case "Completed":
        return "bg-cortex-green";
      case "On Hold":
        return "bg-cortex-gray";
      case "Blocked":
        return "bg-cortex-red";
      case "Open":
        return "bg-cortex-gray";
      case "In review":
        return "bg-cortex-blue";
      case "Outstanding":
        return "bg-amber-500";
      default:
        return "bg-cortex-gray";
    }
  };

  const getKeyIndicatorBoxes = (control: any) => {
    // Dynamic values based on each control's actual data
    return [
      {
        color: getStatusColor(control.cortexMatch),
        text: control.cortexMatch,
      },
      {
        color: getStatusColor(control.effectiveness),
        text: control.effectiveness,
      },
      {
        color: getStatusColor(control.automationType),
        text: control.automationType,
      },
    ];
  };

  return (
    <div className="flex-1 bg-navy-darker min-h-screen">
      {/* Header */}
      <div className="bg-glass-aurora backdrop-blur-sm border-b border-glass-border px-6 py-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-white text-lg font-semibold tracking-wide font-sans">
              CORTEX DASHBOARD
            </h1>
            {user && (
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span>Welcome, {user.username}</span>
                <span>•</span>
                <span>{user.role}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSaveViewModal(true)}
              className="bg-cortex-red text-white px-4 py-2 rounded text-sm font-medium font-sans hover:bg-red-600 flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save as View</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium font-sans hover:bg-gray-700 flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}
            <div className="relative z-[99999]">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                disabled={isExporting}
                className={`px-4 py-2 rounded text-sm font-medium font-sans flex items-center space-x-2 ${
                  isExporting
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-cortex-blue text-white hover:bg-blue-600"
                }`}
              >
                <Download size={16} />
                <span>{isExporting ? "EXPORTING..." : "EXPORT"}</span>
                {!isExporting && <ChevronDown size={16} />}
              </button>
              {showExportDropdown &&
                createPortal(
                  <div className="fixed right-6 top-20 bg-dropdown-bg backdrop-blur-md border border-glass-border rounded-lg shadow-xl z-[99999] w-64">
                    <div className="p-4 space-y-3">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Format
                        </label>
                        <select
                          value={exportConfig.format}
                          onChange={(e) =>
                            setExportConfig({
                              ...exportConfig,
                              format: e.target.value as any,
                            })
                          }
                          className="w-full bg-glass-mystic backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border"
                        >
                          <option value="PDF">PDF</option>
                          <option value="XLS">Excel</option>
                          <option value="CSV">CSV</option>
                          <option value="PPT">PowerPoint</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Orientation
                        </label>
                        <select
                          value={exportConfig.orientation}
                          onChange={(e) =>
                            setExportConfig({
                              ...exportConfig,
                              orientation: e.target.value as any,
                            })
                          }
                          className="w-full bg-glass-mystic backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border"
                        >
                          <option value="landscape">Landscape</option>
                          <option value="portrait">Portrait</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exportConfig.includeCharts}
                          onChange={(e) =>
                            setExportConfig({
                              ...exportConfig,
                              includeCharts: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-cortex-blue bg-navy-light border-gray-300 rounded focus:ring-cortex-blue"
                        />
                        <label className="text-white text-sm">
                          Include Charts
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exportConfig.includeAuditTrail}
                          onChange={(e) =>
                            setExportConfig({
                              ...exportConfig,
                              includeAuditTrail: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-cortex-blue bg-navy-light border-gray-300 rounded focus:ring-cortex-blue"
                        />
                        <label className="text-white text-sm">
                          Include Audit Trail
                        </label>
                      </div>
                      <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className={`w-full py-2 rounded-lg transition-colors ${
                          isExporting
                            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                            : "bg-cortex-blue text-white hover:bg-blue-600"
                        }`}
                      >
                        {isExporting
                          ? "Generating Export..."
                          : "Generate Export"}
                      </button>
                    </div>
                  </div>,
                  document.body
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Save View Modal */}
      {showSaveViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[99999]">
          <div className="bg-modal-bg backdrop-blur-md rounded-2xl border border-glass-border shadow-2xl p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Save Current View
              </h3>
              <button
                onClick={() => setShowSaveViewModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  View Name
                </label>
                <input
                  type="text"
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue"
                  placeholder="Enter view name"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveViewModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCurrentView}
                  className="bg-cortex-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-glass-aurora backdrop-blur-sm px-6 py-4 border-b border-glass-border shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-white text-base font-semibold font-sans">
              Filters
            </h3>
            {(selectedEffectivenessFilter ||
              selectedAutomationFilter ||
              selectedCortexMatchFilter) && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-300">
                  Active drill-down:
                </span>
                {selectedCortexMatchFilter && (
                  <span
                    className={`text-white px-2 py-1 rounded text-xs ${
                      selectedCortexMatchFilter === "Gap"
                        ? "bg-cortex-red"
                        : selectedCortexMatchFilter === "Unmatched"
                        ? "bg-amber-500"
                        : selectedCortexMatchFilter === "Matched"
                        ? "bg-cortex-green"
                        : selectedCortexMatchFilter === "Resolved"
                        ? "bg-cortex-blue"
                        : "bg-gray-500"
                    }`}
                  >
                    Cortex: {selectedCortexMatchFilter}
                  </span>
                )}
                {selectedEffectivenessFilter && (
                  <span
                    className={`text-white px-2 py-1 rounded text-xs ${
                      selectedEffectivenessFilter === "Ineffective"
                        ? "bg-cortex-red"
                        : selectedEffectivenessFilter === "Needs Improvement"
                        ? "bg-amber-500"
                        : selectedEffectivenessFilter === "Not Rated"
                        ? "bg-cortex-gray"
                        : selectedEffectivenessFilter === "Effective"
                        ? "bg-cortex-green"
                        : "bg-gray-500"
                    }`}
                  >
                    Effectiveness: {selectedEffectivenessFilter}
                  </span>
                )}
                {selectedAutomationFilter && (
                  <span
                    className={`text-white px-2 py-1 rounded text-xs ${
                      selectedAutomationFilter === "Manual"
                        ? "bg-cortex-red"
                        : selectedAutomationFilter === "Semi-Automated"
                        ? "bg-amber-500"
                        : selectedAutomationFilter === "IT Dependent"
                        ? "bg-cortex-green"
                        : selectedAutomationFilter === "Automated"
                        ? "bg-cortex-blue"
                        : "bg-gray-500"
                    }`}
                  >
                    Automation: {selectedAutomationFilter}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowViewDropdown(!showViewDropdown)}
                className="bg-glass-mystic backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-glass-border hover:bg-glass-hover transition-colors flex items-center space-x-2"
              >
                <Eye size={16} />
                <span>Saved Views</span>
                <ChevronDown size={16} />
              </button>
              {showViewDropdown &&
                createPortal(
                  <div className="fixed right-32 top-32 bg-dropdown-bg backdrop-blur-md border border-glass-border rounded-lg shadow-xl z-[99999] w-64">
                    <div className="p-2">
                      {savedViews.map((view) => (
                        <button
                          key={view.id}
                          onClick={() => loadSavedView(view)}
                          className="w-full text-left text-white px-3 py-2 hover:bg-glass-mystic rounded-lg transition-colors"
                        >
                          {view.name}
                          {view.isDefault && (
                            <span className="text-xs text-gray-400 ml-2">
                              (Default)
                            </span>
                          )}
                        </button>
                      ))}
                      {savedViews.length === 0 && (
                        <div className="text-gray-400 px-3 py-2 text-sm">
                          No saved views
                        </div>
                      )}
                    </div>
                  </div>,
                  document.body
                )}
            </div>
            <button
              onClick={resetFilters}
              className="bg-cortex-red text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-600 flex items-center space-x-2"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex flex-col">
            <label className="text-white text-xs mb-1 font-sans">
              Location
            </label>
            <div className="relative">
              <select
                value={selectedFilters.location?.[0] || ""}
                onChange={(e) => {
                  setSelectedFilters({
                    ...selectedFilters,
                    location: e.target.value ? [e.target.value] : [],
                  });
                  setCurrentPage(1);
                }}
                className="bg-glass-aurora backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-glass-border appearance-none pr-8 font-sans hover:bg-glass-mystic hover:backdrop-blur-md transition-all duration-500 shadow-lg"
              >
                <option value="">Location</option>
                {filterOptions.locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
                size={16}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-white text-xs mb-1 font-sans">
              Business Line
            </label>
            <div className="relative">
              <select
                value={selectedFilters.businessLine?.[0] || ""}
                onChange={(e) =>
                  setSelectedFilters({
                    ...selectedFilters,
                    businessLine: e.target.value ? [e.target.value] : [],
                  })
                }
                className="bg-glass-aurora backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-glass-border appearance-none pr-8 font-sans hover:bg-glass-mystic hover:backdrop-blur-md transition-all duration-500 shadow-lg"
              >
                <option value="">Business Line</option>
                {filterOptions.businessLines.map((line) => (
                  <option key={line} value={line}>
                    {line}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
                size={16}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-white text-xs mb-1 font-sans">
              Function
            </label>
            <div className="relative">
              <select
                value={selectedFilters.function?.[0] || ""}
                onChange={(e) =>
                  setSelectedFilters({
                    ...selectedFilters,
                    function: e.target.value ? [e.target.value] : [],
                  })
                }
                className="bg-glass-aurora backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-glass-border appearance-none pr-8 font-sans hover:bg-glass-mystic hover:backdrop-blur-md transition-all duration-500 shadow-lg"
              >
                <option value="">Function</option>
                {filterOptions.functions.map((func) => (
                  <option key={func} value={func}>
                    {func}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
                size={16}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-white text-xs mb-1 font-sans">
              Control Type
            </label>
            <div className="relative">
              <select
                value={selectedFilters.controlType?.[0] || ""}
                onChange={(e) =>
                  setSelectedFilters({
                    ...selectedFilters,
                    controlType: e.target.value ? [e.target.value] : [],
                  })
                }
                className="bg-glass-aurora backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-glass-border appearance-none pr-8 font-sans hover:bg-glass-mystic hover:backdrop-blur-md transition-all duration-500 shadow-lg"
              >
                <option value="">Control Type</option>
                {filterOptions.controlTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
                size={16}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-white text-xs mb-1 font-sans">
              Control Frequency
            </label>
            <div className="relative">
              <select
                value={selectedFilters.controlFrequency?.[0] || ""}
                onChange={(e) =>
                  setSelectedFilters({
                    ...selectedFilters,
                    controlFrequency: e.target.value ? [e.target.value] : [],
                  })
                }
                className="bg-glass-aurora backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-glass-border appearance-none pr-8 font-sans hover:bg-glass-mystic hover:backdrop-blur-md transition-all duration-500 shadow-lg"
              >
                <option value="">Control Frequency</option>
                {filterOptions.controlFrequencies.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
                size={16}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-white text-xs mb-1 font-sans">
              Date Range
            </label>
            <div className="relative z-[10000]">
              <input
                type="text"
                placeholder="Start date - End date"
                value={
                  dateRange.start && dateRange.end
                    ? `${dateRange.start} - ${dateRange.end}`
                    : ""
                }
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const dropdownWidth = 320; // w-80 = 320px
                  const viewportWidth = window.innerWidth;

                  let x = rect.left;
                  // Adjust if dropdown would go off-screen to the right
                  if (x + dropdownWidth > viewportWidth) {
                    x = viewportWidth - dropdownWidth - 16; // 16px margin from edge
                  }

                  setDatePickerPosition({
                    x: Math.max(16, x), // Ensure at least 16px from left edge
                    y: rect.bottom + 8,
                  });
                  setShowDatePicker(!showDatePicker);
                }}
                readOnly
                data-date-picker="trigger"
                className="bg-glass-aurora backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-glass-border placeholder-gray-400 font-sans cursor-pointer hover:bg-glass-mystic hover:backdrop-blur-md transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue shadow-lg min-w-[250px] text-sm"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {showDatePicker &&
                createPortal(
                  <div
                    className="fixed bg-dropdown-bg backdrop-blur-md border border-glass-border rounded-lg shadow-xl z-[99999] w-80 p-4"
                    data-date-picker="modal"
                    style={{
                      left: `${datePickerPosition.x}px`,
                      top: `${datePickerPosition.y}px`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-white">
                        Date Range
                      </h3>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) =>
                            setDateRange({
                              ...dateRange,
                              start: e.target.value,
                            })
                          }
                          className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue transition-colors"
                          style={{ colorScheme: "dark" }}
                        />
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) =>
                            setDateRange({ ...dateRange, end: e.target.value })
                          }
                          className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue transition-colors"
                          style={{ colorScheme: "dark" }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setDateRange({ start: "", end: "" });
                          setShowDatePicker(false);
                        }}
                        className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                      >
                        Clear
                      </button>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-glass-mystic hover:bg-glass-hover rounded-lg transition-colors border border-glass-border"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="px-4 py-2 text-sm font-medium text-white bg-cortex-blue hover:bg-blue-600 rounded-lg transition-colors shadow-lg"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="bg-cortex-red text-white px-4 mt-4 py-2 rounded text-sm font-medium hover:bg-red-600"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* All Three Sections in One Row */}
        <div className="flex gap-6 mb-6">
          {/* Cortex Match Status */}
          <div className="flex-1">
            <div className="text-white text-sm font-semibold mb-3 font-sans">
              Cortex Matching Status
            </div>
            <div className="flex space-x-4">
              <MetricCard
                title="GAPS"
                value={dashboardMetrics.cortexMatch.gap}
                color="text-white"
                bgColor="bg-cortex-red"
                onClick={() => {
                  const newFilter =
                    selectedCortexMatchFilter === "Gap" ? null : "Gap";
                  setSelectedCortexMatchFilter(newFilter);
                  setCurrentPage(1);
                }}
              />
              <MetricCard
                title="UNMATCHED"
                value={dashboardMetrics.cortexMatch.unmatched}
                color="text-white"
                bgColor="bg-amber-500"
                titleColor="text-white"
                onClick={() => {
                  const newFilter =
                    selectedCortexMatchFilter === "Unmatched"
                      ? null
                      : "Unmatched";
                  setSelectedCortexMatchFilter(newFilter);
                  setCurrentPage(1);
                }}
              />
              <MetricCard
                title="MATCHED"
                value={dashboardMetrics.cortexMatch.matched}
                color="text-white"
                bgColor="bg-cortex-green"
                onClick={() => {
                  const newFilter =
                    selectedCortexMatchFilter === "Matched" ? null : "Matched";
                  setSelectedCortexMatchFilter(newFilter);
                  setCurrentPage(1);
                }}
              />
              <MetricCard
                title="RESOLVED"
                value={dashboardMetrics.cortexMatch.resolved}
                color="text-white"
                bgColor="bg-cortex-blue"
                onClick={() => {
                  const newFilter =
                    selectedCortexMatchFilter === "Resolved"
                      ? null
                      : "Resolved";
                  setSelectedCortexMatchFilter(newFilter);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Control Effectiveness */}
          <div className="flex-1">
            <EffectivenessBar />
          </div>

          {/* Control Automation */}
          <div className="flex-1">
            <AutomationBar />
          </div>
        </div>

        {/* Control Detail Table */}
        <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl">
          <div className="p-4 border-b border-glass-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-sm font-medium font-sans">
                Control Detail
              </h3>
              <h3 className="text-white text-sm font-medium font-sans">
                Control Enhancement and Action
              </h3>
            </div>
            <div className="flex justify-start">
              <input
                type="text"
                placeholder="Search in table"
                className="bg-glass-aurora backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-glass-border placeholder-gray-400 font-sans hover:bg-glass-mystic hover:backdrop-blur-md transition-all duration-500 shadow-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Control ID
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Control name
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Description
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Owner
                  </th>
                  <th className="text-center text-white text-[10px] font-medium p-3 font-sans">
                    Key Indicators
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Final score
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Approval
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Assignee
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((control) => (
                  <tr
                    key={control.id}
                    onClick={() => handleRowClick(control)}
                    className="border-b border-glass-border hover:bg-glass-mystic hover:backdrop-blur-sm transition-all duration-500 cursor-pointer"
                  >
                    <td className="text-white text-xs p-3 font-sans">
                      {control.code}
                    </td>
                    <td className="text-white text-xs p-3 font-sans">
                      {control.name}
                    </td>
                    <td className="text-white text-sm p-3 max-w-xs truncate font-sans">
                      {control.description}
                    </td>
                    <td className="text-white text-xs p-3 font-sans">
                      {control.owner}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col items-center space-y-1">
                        {/* Row of boxes */}
                        <div className="flex space-x-1">
                          {getKeyIndicatorBoxes(control).map((box, index) => (
                            <div
                              key={index}
                              className={`w-4 h-4 rounded ${box.color}`}
                            ></div>
                          ))}
                        </div>
                        {/* Text labels */}
                        <div className="flex space-x-1 text-xs text-white">
                          {getKeyIndicatorBoxes(control).map((box, index) => (
                            <span
                              key={index}
                              className="text-center min-w-[20px] text-[8px] font-sans"
                            >
                              {box.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="text-white text-xs p-3 font-sans">
                      {control.finalScore}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-medium text-white ${getStatusColor(
                          control.cortexMatch
                        )} font-sans`}
                      >
                        {control.cortexMatch}
                      </span>
                    </td>
                    <td className="text-white text-xs p-3 font-sans">
                      {control.assignedTo}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-medium text-white ${getStatusColor(
                          control.status
                        )} font-sans`}
                      >
                        {control.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 flex justify-between items-center">
            <div className="text-gray-400 text-xs font-sans">
              Showing {startIndex + 1}-{endIndex} of {totalItems} controls
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-xs rounded font-sans ${
                  currentPage === 1
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-400 hover:text-white hover:bg-navy-darker"
                }`}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1 text-xs rounded font-sans ${
                      currentPage === pageNumber
                        ? "bg-cortex-blue text-white"
                        : "text-gray-400 hover:text-white hover:bg-navy-darker"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-xs rounded font-sans ${
                  currentPage === totalPages
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-400 hover:text-white hover:bg-navy-darker"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-glass-aurora backdrop-blur-sm border-t border-glass-border px-6 py-2 shadow-2xl">
        <div className="flex justify-between items-center text-[10px] text-gray-400">
          <div className="flex items-center space-x-2">
            <span>production</span>
            <div className="w-2 h-2 bg-cortex-blue rounded-full"></div>
            <span>main</span>
            <span>Latest</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>No queries running</span>
            <button className="hover:text-white">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <span>Debug</span>
            <button className="hover:text-white">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button className="hover:text-white">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Control Detail Modal */}
      <ControlDetailModal
        control={selectedControl}
        user={user || null}
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        onSave={handleSaveControl}
      />
    </div>
  );
};

export default Dashboard;
