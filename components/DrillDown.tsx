"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Download, Filter, CheckCircle, X } from "lucide-react";
import {
  mockDataStore,
  User as CortexUser,
  FilterConfig,
  Control,
} from "@/lib/mockDataStore";

interface DrillDownProps {
  user: CortexUser;
  selectedMetric: string;
  selectedValue: string;
  filters: FilterConfig;
  onBack: () => void;
}

const DrillDown = ({
  user,
  selectedMetric,
  selectedValue,
  filters,
  onBack,
}: DrillDownProps) => {
  const [controls, setControls] = useState<Control[]>([]);
  const [filteredControls, setFilteredControls] = useState<Control[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  useEffect(() => {
    // Get controls based on the selected metric and value
    let filteredData = mockDataStore.getControls(filters);

    // Apply additional filtering based on the selected metric
    if (selectedMetric === "effectiveness") {
      filteredData = filteredData.filter(
        (control) => control.effectiveness === selectedValue
      );
    } else if (selectedMetric === "automation") {
      filteredData = filteredData.filter(
        (control) => control.automationType === selectedValue
      );
    } else if (selectedMetric === "cortexMatch") {
      filteredData = filteredData.filter(
        (control) => control.cortexMatch === selectedValue
      );
    }

    setControls(filteredData);
    setFilteredControls(filteredData);
  }, [selectedMetric, selectedValue, filters]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    let filtered = controls;

    if (term) {
      filtered = filtered.filter(
        (control) =>
          control.code.toLowerCase().includes(term.toLowerCase()) ||
          control.name.toLowerCase().includes(term.toLowerCase()) ||
          control.owner.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (statusFilter.length > 0) {
      filtered = filtered.filter((control) =>
        statusFilter.includes(control.cortexMatch)
      );
    }

    setFilteredControls(filtered);
    setCurrentPage(1);
  };

  const handleRowSelection = (controlId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(controlId)) {
      newSelected.delete(controlId);
    } else {
      newSelected.add(controlId);
    }
    setSelectedRows(newSelected);
  };

  const handleBulkStatusUpdate = (newStatus: string) => {
    if (selectedRows.size === 0) return;

    selectedRows.forEach((controlId) => {
      mockDataStore.updateControl(
        controlId,
        {
          cortexMatch: newStatus as
            | "Gap"
            | "Unmatched"
            | "Matched"
            | "Resolved",
        },
        user.id
      );
    });

    // Refresh data
    const updatedControls = mockDataStore.getControls(filters);
    setControls(updatedControls);
    setFilteredControls(updatedControls);
    setSelectedRows(new Set());
  };

  const handleExport = () => {
    const exportData = filteredControls.map((control) => ({
      "Control ID": control.code,
      "Control Name": control.name,
      Owner: control.owner,
      Effectiveness: control.effectiveness,
      "Automation Type": control.automationType,
      "Cortex Match": control.cortexMatch,
      "Business Line": control.businessLine,
      Function: control.function,
    }));

    // In a real app, this would trigger a CSV download
    console.log("Exporting data:", exportData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Matched":
        return "bg-cortex-green";
      case "Unmatched":
        return "bg-amber-500";
      case "Gap":
        return "bg-cortex-red";
      case "Resolved":
        return "bg-cortex-blue";
      default:
        return "bg-cortex-gray";
    }
  };

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case "Effective":
        return "bg-cortex-green";
      case "Ineffective":
        return "bg-cortex-red";
      case "Needs Improvement":
        return "bg-amber-500";
      case "Not Yet Rated":
        return "bg-cortex-gray";
      default:
        return "bg-cortex-gray";
    }
  };

  const totalPages = Math.ceil(filteredControls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredControls.length);
  const currentItems = filteredControls.slice(startIndex, endIndex);

  return (
    <div className="flex-1 bg-navy-darker min-h-screen">
      {/* Header */}
      <div className="bg-glass-aurora backdrop-blur-sm border-b border-glass-border px-6 py-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-glass-border"></div>
            <h1 className="text-white text-lg font-semibold">
              {selectedMetric === "effectiveness"
                ? "Control Effectiveness"
                : selectedMetric === "automation"
                ? "Control Automation"
                : "Cortex Matching Status"}{" "}
              - {selectedValue}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExport}
              className="bg-cortex-blue text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600 flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-glass-aurora backdrop-blur-sm px-6 py-4 border-b border-glass-border shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search controls..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-glass-mystic backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-glass-border placeholder-gray-400 focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowStatusFilter(!showStatusFilter)}
              className="bg-glass-mystic backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-glass-border hover:bg-glass-hover transition-colors flex items-center space-x-2"
            >
              <Filter size={16} />
              <span>Filter by Status</span>
            </button>
            {showStatusFilter && (
              <div className="absolute right-0 top-full mt-2 bg-glass-aurora backdrop-blur-sm border border-glass-border rounded-lg shadow-xl z-50 w-64">
                <div className="p-4 space-y-2">
                  {["Matched", "Unmatched", "Gap", "Resolved"].map((status) => (
                    <label key={status} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={statusFilter.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setStatusFilter([...statusFilter, status]);
                          } else {
                            setStatusFilter(
                              statusFilter.filter((s) => s !== status)
                            );
                          }
                        }}
                        className="w-4 h-4 text-cortex-blue bg-navy-light border-gray-300 rounded focus:ring-cortex-blue"
                      />
                      <span className="text-white text-sm">{status}</span>
                    </label>
                  ))}
                  <button
                    onClick={() => {
                      setStatusFilter([]);
                      handleSearch(searchTerm);
                    }}
                    className="w-full text-left text-gray-400 hover:text-white text-sm py-1"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-glass-aurora backdrop-blur-sm rounded-lg p-4 border border-glass-border">
            <div className="text-2xl font-bold text-white">
              {filteredControls.length}
            </div>
            <div className="text-gray-300 text-sm">Total Controls</div>
          </div>
          <div className="bg-glass-aurora backdrop-blur-sm rounded-lg p-4 border border-glass-border">
            <div className="text-2xl font-bold text-cortex-green">
              {
                filteredControls.filter((c) => c.cortexMatch === "Matched")
                  .length
              }
            </div>
            <div className="text-gray-300 text-sm">Matched</div>
          </div>
          <div className="bg-glass-aurora backdrop-blur-sm rounded-lg p-4 border border-glass-border">
            <div className="text-2xl font-bold text-amber-500">
              {
                filteredControls.filter((c) => c.cortexMatch === "Unmatched")
                  .length
              }
            </div>
            <div className="text-gray-300 text-sm">Unmatched</div>
          </div>
          <div className="bg-glass-aurora backdrop-blur-sm rounded-lg p-4 border border-glass-border">
            <div className="text-2xl font-bold text-cortex-red">
              {filteredControls.filter((c) => c.cortexMatch === "Gap").length}
            </div>
            <div className="text-gray-300 text-sm">Gaps</div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRows.size > 0 && (
          <div className="bg-glass-mystic backdrop-blur-sm rounded-lg p-4 mb-6 border border-glass-border">
            <div className="flex items-center justify-between">
              <span className="text-white">
                {selectedRows.size} control{selectedRows.size > 1 ? "s" : ""}{" "}
                selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkStatusUpdate("Resolved")}
                  className="bg-cortex-blue text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Mark as Resolved
                </button>
                <button
                  onClick={() => setSelectedRows(new Set())}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controls Table */}
        <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="text-left text-white text-[10px] font-medium p-3">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.size === currentItems.length &&
                        currentItems.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(
                            new Set(currentItems.map((item) => item.id))
                          );
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                      className="w-4 h-4 text-cortex-blue bg-navy-light border-gray-300 rounded focus:ring-cortex-blue"
                    />
                  </th>
                  <th
                    className="text-left text-white text-[10px] font-medium p-3 cursor-pointer hover:bg-glass-mystic"
                    onClick={() => handleSort("code")}
                  >
                    Control ID{" "}
                    {sortField === "code" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="text-left text-white text-[10px] font-medium p-3 cursor-pointer hover:bg-glass-mystic"
                    onClick={() => handleSort("name")}
                  >
                    Control Name{" "}
                    {sortField === "name" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="text-left text-white text-[10px] font-medium p-3 cursor-pointer hover:bg-glass-mystic"
                    onClick={() => handleSort("owner")}
                  >
                    Owner{" "}
                    {sortField === "owner" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3">
                    Effectiveness
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3">
                    Automation Type
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3">
                    Cortex Match
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3">
                    Business Line
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3">
                    Function
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((control) => (
                  <tr
                    key={control.id}
                    className="border-b border-glass-border hover:bg-glass-mystic transition-colors"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(control.id)}
                        onChange={() => handleRowSelection(control.id)}
                        className="w-4 h-4 text-cortex-blue bg-navy-light border-gray-300 rounded focus:ring-cortex-blue"
                      />
                    </td>
                    <td className="text-white text-xs p-3 font-mono">
                      {control.code}
                    </td>
                    <td className="text-white text-xs p-3">{control.name}</td>
                    <td className="text-white text-xs p-3">{control.owner}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-medium text-white ${getEffectivenessColor(
                          control.effectiveness
                        )}`}
                      >
                        {control.effectiveness}
                      </span>
                    </td>
                    <td className="text-white text-xs p-3">
                      {control.automationType}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-medium text-white ${getStatusColor(
                          control.cortexMatch
                        )}`}
                      >
                        {control.cortexMatch}
                      </span>
                    </td>
                    <td className="text-white text-xs p-3">
                      {control.businessLine}
                    </td>
                    <td className="text-white text-xs p-3">
                      {control.function}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 flex justify-between items-center">
            <div className="text-gray-400 text-xs">
              Showing {startIndex + 1}-{endIndex} of {filteredControls.length}{" "}
              controls
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-xs rounded ${
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
                    className={`px-3 py-1 text-xs rounded ${
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
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-xs rounded ${
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
    </div>
  );
};

export default DrillDown;
