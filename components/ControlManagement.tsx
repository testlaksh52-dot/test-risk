"use client";

import { ChevronDown, ArrowLeft, Edit } from "lucide-react";
import {
  mockControls,
  keyIndicatorRecommendations,
  keyIndicatorUpdates,
  improvementGeneration,
  filterOptions,
} from "@/lib/mockData";
import { useState } from "react";
import AssignedToDropdown from "./AssignedToDropdown";
import ControlDetailModal from "./ControlDetailModal";
import { User } from "@/lib/mockDataStore";

interface ControlManagementProps {
  onViewChange?: (view: "dashboard" | "control-management") => void;
  user?: User;
}

const ControlManagement = ({ onViewChange, user }: ControlManagementProps) => {
  const [selectedControlOwner, setSelectedControlOwner] = useState("");
  const [selectedControlId, setSelectedControlId] = useState("");
  const [selectedAssignedTo, setSelectedAssignedTo] = useState("");
  const [selectedUpdateRows, setSelectedUpdateRows] = useState<Set<string>>(
    new Set()
  );
  const [showKeyIndicatorUpdate, setShowKeyIndicatorUpdate] = useState(false);
  const [selectedKeyIndicators, setSelectedKeyIndicators] = useState<
    Set<string>
  >(new Set());
  const [showImprovement, setShowImprovement] = useState(false);
  const [committedRows, setCommittedRows] = useState<Set<string>>(new Set());
  const [selectedControlForUpdate, setSelectedControlForUpdate] =
    useState<any>(null);
  const [selectedIndicatorDescriptions, setSelectedIndicatorDescriptions] =
    useState<{ id: string; description: string }[]>([]);
  const [selectedControl, setSelectedControl] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"all" | "parent" | "child">("all");
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Assigned To options with avatars
  const assignedToOptions = [
    {
      id: "maya-rodriguez",
      name: "Maya Rodriguez",
      initials: "MR",
      color: "bg-blue-500",
    },
    {
      id: "james-allen",
      name: "James Allen",
      initials: "JA",
      color: "bg-blue-500",
    },
    {
      id: "grace-thompson",
      name: "Grace Thompson",
      initials: "GT",
      color: "bg-green-500",
    },
    {
      id: "travis-barker",
      name: "Travis Barker",
      initials: "TB",
      color: "bg-orange-500",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Gap":
        return "bg-cora-red";
      case "Needs Improvement":
        return "bg-amber-500";
      case "Unmatched":
        return "bg-amber-500";
      case "Manual":
        return "bg-cora-red";
      case "Generated":
        return "bg-cora-green";
      case "Not Started":
        return "bg-cora-gray";
      case "In review":
        return "bg-cora-blue";
      case "Completed":
        return "bg-cora-green";
      case "Outstanding":
        return "bg-amber-500";
      default:
        return "bg-cora-gray";
    }
  };

  const getRecommendationColor = (color: string) => {
    switch (color) {
      case "red":
        return "bg-cora-red";
      case "orange":
        return "bg-amber-500";
      case "green":
        return "bg-cora-green";
      default:
        return "bg-cora-gray";
    }
  };

  const handleUpdateCheckbox = (controlId: string) => {
    const newSelected = new Set(selectedUpdateRows);
    if (newSelected.has(controlId)) {
      newSelected.delete(controlId);
      if (selectedControlForUpdate?.id === controlId) {
        setSelectedControlForUpdate(null);
      }
    } else {
      newSelected.add(controlId);
      // Find the control data for the selected row
      const control = mockControls.find((c) => c.id === controlId);
      setSelectedControlForUpdate(control);
      setSelectedControl(control); // Auto-select in the left panel

      // Clear any previously selected key indicators when selecting a new control
      setSelectedKeyIndicators(new Set());
      setSelectedIndicatorDescriptions([]);
    }
    setSelectedUpdateRows(newSelected);
    setShowKeyIndicatorUpdate(newSelected.size > 0);
  };

  const handleKeyIndicatorSelection = (indicatorIndex: string) => {
    const newSelected = new Set(selectedKeyIndicators);
    if (newSelected.has(indicatorIndex)) {
      newSelected.delete(indicatorIndex);
      setSelectedIndicatorDescriptions(
        selectedIndicatorDescriptions.filter(
          (desc) => desc.id !== indicatorIndex
        )
      );
    } else {
      newSelected.add(indicatorIndex);
      // Add description based on the indicator index
      const descriptions: { [key: string]: string } = {
        "1": "This control does not align with CORA standardized controls framework. The control needs to be redesigned to meet CORA standards for effective risk management.",
        "2": "The control description lacks clarity and completeness. Key elements such as objectives, procedures, responsibilities, and escalation paths need to be documented.",
        "3": "This control relies on manual processes which introduces operational risk. Consider automation opportunities to improve efficiency and reduce human error.",
      };
      setSelectedIndicatorDescriptions([
        ...selectedIndicatorDescriptions,
        { id: indicatorIndex, description: descriptions[indicatorIndex] || "" },
      ]);
    }
    setSelectedKeyIndicators(newSelected);
    setShowImprovement(newSelected.size > 0);
  };

  const handleCommit = () => {
    const newCommitted = new Set(committedRows);
    selectedUpdateRows.forEach((rowId) => {
      newCommitted.add(rowId);
      // Update the control status to "Completed" in the mock data
      const controlIndex = mockControls.findIndex((c) => c.id === rowId);
      if (controlIndex !== -1) {
        mockControls[controlIndex].status = "Completed";

        // Update key indicators based on selected improvements
        // If first two indicators are selected, update them to "Matched" and "Effective"
        if (selectedKeyIndicators.has("1")) {
          mockControls[controlIndex].coraMatch = "Matched";
        }
        if (selectedKeyIndicators.has("2")) {
          mockControls[controlIndex].effectiveness = "Effective";
        }
        // Third indicator (automation) stays as is for now
        // You can add logic here if needed for automation improvements
      }
    });
    setCommittedRows(newCommitted);
    setSelectedUpdateRows(new Set());
    setSelectedKeyIndicators(new Set());
    setShowKeyIndicatorUpdate(false);
    setShowImprovement(false);
    setSelectedControlForUpdate(null);
    setSelectedIndicatorDescriptions([]);
  };

  const getKeyIndicatorBoxes = (control: any) => {
    // Dynamic values based on each control's actual data
    return [
      {
        color: getStatusColor(control.coraMatch),
        text: control.coraMatch,
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

  const getDynamicKeyIndicatorRecommendations = () => {
    if (!selectedControlForUpdate) return [];

    const boxes = getKeyIndicatorBoxes(selectedControlForUpdate);
    return keyIndicatorRecommendations.map((item, index) => ({
      ...item,
      color: boxes[index]?.color.replace("bg-", "") || item.color,
    }));
  };

  const controlsRequiringEnhancement = mockControls.filter(
    (control) => control.status !== "Completed"
  );

  // Helper functions for parent/child navigation
  const getRelatedControls = (control: any) => {
    const related = {
      parent: null as any,
      children: [] as any[],
    };

    if (control.hierarchyLevel === "Child" && control.parentControlId) {
      related.parent = mockControls.find(
        (c) => c.id === control.parentControlId
      );
    }

    if (control.hierarchyLevel === "Parent" && control.childControlIds) {
      related.children = mockControls.filter((c) =>
        control.childControlIds?.includes(c.id)
      );
    }

    return related;
  };

  const navigateToControl = (controlId: string) => {
    const control = mockControls.find((c) => c.id === controlId);
    if (control) {
      setSelectedControlForUpdate(control);
      setSelectedControl(control);
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
    console.log("Control updated:", updatedControl);
  };

  const handleNavigateToControl = (control: any) => {
    setSelectedControl(control);
    // The modal will re-render with the new control
  };

  return (
    <div className="flex-1 bg-navy-darker min-h-screen">
      {/* Header */}
      <div className="bg-glass-aurora backdrop-blur-sm border-b border-glass-border px-6 py-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onViewChange?.("dashboard")}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-glass-border"></div>
            <h1 className="text-white text-lg font-semibold">
              CONTROL MANAGEMENT
            </h1>
          </div>
          <div className="text-right">
            <h3 className="text-white text-sm font-semibold">CORA</h3>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-glass-aurora backdrop-blur-sm px-6 py-4 border-b border-glass-border">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <label className="text-white text-xs mb-1 font-sans">
              Control Owner
            </label>
            <div className="relative">
              <select
                value={selectedControlOwner}
                onChange={(e) => setSelectedControlOwner(e.target.value)}
                className="bg-glass-aurora text-white px-4 py-2 rounded-xl border border-glass-border appearance-none pr-8 min-w-[200px] backdrop-blur-sm hover:bg-glass-mystic transition-all duration-500 shadow-lg text-sm"
              >
                <option value="">Select Control Owner</option>
                {filterOptions.owners.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-white text-xs mb-1 font-sans">
              Control ID
            </label>
            <div className="relative">
              <select
                value={selectedControlId}
                onChange={(e) => setSelectedControlId(e.target.value)}
                className="bg-glass-aurora text-white px-4 py-2 rounded-xl border border-glass-border appearance-none pr-8 min-w-[200px] backdrop-blur-sm hover:bg-glass-mystic transition-all duration-500 shadow-lg text-sm"
              >
                <option value="">Select Control ID</option>
                {mockControls.map((control) => (
                  <option key={control.id} value={control.id}>
                    {control.code}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-white text-xs mb-1 font-sans">
              Assigned To
            </label>
            <AssignedToDropdown
              value={selectedAssignedTo}
              onChange={setSelectedAssignedTo}
              options={assignedToOptions}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedControlOwner("");
                setSelectedControlId("");
                setSelectedAssignedTo("");
              }}
              className="bg-cora-red text-white mt-4 px-4 py-2 rounded text-sm font-medium hover:bg-red-600"
            >
              RESET
            </button>
          </div>
        </div>
      </div>

      {/* Control Detail Table */}
      <div className="px-6 py-4 border-b border-glass-border">
        <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl">
          <div className="flex justify-between items-center p-4 border-b border-glass-border">
            <div className="flex items-center space-x-4">
              <h3 className="text-white text-sm font-medium">Control Detail</h3>

              {/* Hierarchy View Toggle */}
              <div className="flex items-center space-x-2">
                <label className="text-white text-xs font-medium">View:</label>
                <div className="bg-navy-dark rounded-lg p-1 flex">
                  <button
                    onClick={() => setViewMode("all")}
                    className={`px-3 py-1 text-xs rounded-md transition-all duration-300 ${
                      viewMode === "all"
                        ? "bg-cora-blue text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setViewMode("parent")}
                    className={`px-3 py-1 text-xs rounded-md transition-all duration-300 flex items-center space-x-1 ${
                      viewMode === "parent"
                        ? "bg-cora-blue text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>↗</span>
                    <span>Parents</span>
                  </button>
                  <button
                    onClick={() => setViewMode("child")}
                    className={`px-3 py-1 text-xs rounded-md transition-all duration-300 flex items-center space-x-1 ${
                      viewMode === "child"
                        ? "bg-cora-blue text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>↘</span>
                    <span>Children</span>
                  </button>
                </div>
              </div>
            </div>
            <h3 className="text-white text-sm font-medium">
              Control Enhancement and Action
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Control id
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
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Hierarchy
                  </th>
                  <th className="text-center text-white text-[10px] font-medium p-3 font-sans">
                    Key Indicator
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Final score
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Test
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Assigned To
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Status
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans"></th>
                </tr>
              </thead>
              <tbody>
                {mockControls
                  .filter((control) => {
                    // Existing filters
                    if (
                      selectedControlOwner &&
                      control.owner !== selectedControlOwner
                    )
                      return false;
                    if (selectedControlId && control.code !== selectedControlId)
                      return false;
                    if (selectedAssignedTo) {
                      const selectedPerson = assignedToOptions.find(
                        (option) => option.id === selectedAssignedTo
                      );
                      if (
                        selectedPerson &&
                        control.assignedTo !== selectedPerson.name
                      )
                        return false;
                    }

                    // Hierarchy view filter
                    if (
                      viewMode === "parent" &&
                      control.hierarchyLevel !== "Parent"
                    ) {
                      return false;
                    }
                    if (
                      viewMode === "child" &&
                      control.hierarchyLevel !== "Child"
                    ) {
                      return false;
                    }

                    return true;
                  })
                  .slice(0, 10)
                  .map((control) => {
                    const isCommitted = committedRows.has(control.id);
                    return (
                      <tr
                        key={control.id}
                        onClick={() => handleRowClick(control)}
                        className={`border-b border-glass-border hover:bg-glass-mystic cursor-pointer ${
                          isCommitted ? "bg-green-900 bg-opacity-20" : ""
                        }`}
                      >
                        <td className="text-white text-xs p-3 font-sans">
                          {control.code}
                        </td>
                        <td className="text-white text-xs p-3 font-sans">
                          {control.name}
                        </td>
                        <td className="text-white text-xs p-3 max-w-xs truncate font-sans">
                          {control.description}
                        </td>
                        <td className="text-white text-xs p-3 font-sans">
                          {control.owner}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-medium text-white ${
                              control.hierarchyLevel === "Parent"
                                ? "bg-cora-blue"
                                : "bg-amber-500"
                            } font-sans`}
                          >
                            {control.hierarchyLevel === "Parent"
                              ? "↗ Parent"
                              : "↘ Child"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col items-center space-y-1">
                            {/* Row of boxes */}
                            <div className="flex space-x-1">
                              {getKeyIndicatorBoxes(control).map(
                                (box, index) => (
                                  <div
                                    key={index}
                                    className={`w-4 h-4 rounded ${box.color}`}
                                  ></div>
                                )
                              )}
                            </div>
                            {/* Text labels */}
                            <div className="flex space-x-1 text-xs text-white">
                              {getKeyIndicatorBoxes(control).map(
                                (box, index) => (
                                  <span
                                    key={index}
                                    className="text-center min-w-[20px] text-[10px]"
                                  >
                                    {box.text}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-white text-xs p-3 font-sans">
                          {control.finalScore}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-medium text-white ${getStatusColor(
                              control.rewrite
                            )} font-sans`}
                          >
                            {control.rewrite}
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
                        <td className="text-center p-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateCheckbox(control.id);
                            }}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                              selectedUpdateRows.has(control.id)
                                ? "bg-cora-blue text-white"
                                : "bg-glass-mystic text-gray-400 hover:text-white hover:bg-cora-blue"
                            }`}
                          >
                            <Edit size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Section - Control Enhancement and Management Layout */}
      {selectedUpdateRows.size > 0 ? (
        <div className="p-6">
          <div className="bg-glass-aurora backdrop-blur-sm border-b border-glass-border px-6 py-3 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-lg font-semibold">
                Control Enhancement and Management
              </h2>
              <div className="text-sm text-gray-300">
                {controlsRequiringEnhancement.length} controls requiring
                enhancement
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Controls Requiring Enhancement */}
            <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl">
              <div className="p-4 border-b border-glass-border">
                <h3 className="text-white text-sm font-semibold">
                  Controls Requiring Enhancement
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {controlsRequiringEnhancement.slice(0, 3).map((control) => (
                  <div
                    key={control.id}
                    onClick={() => setSelectedControl(control)}
                    className={`p-4 border-b border-glass-border cursor-pointer hover:bg-glass-mystic transition-colors ${
                      selectedControl?.id === control.id
                        ? "bg-glass-mystic"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-amber-500 font-mono text-sm font-medium">
                          {control.code}
                        </span>
                        <span className="text-cora-blue text-xs px-2 py-1 bg-cora-blue bg-opacity-20 rounded">
                          In Review
                        </span>
                      </div>
                    </div>
                    <div className="text-white text-sm mb-1">
                      {control.name}
                    </div>
                    <div className="text-gray-300 text-xs mb-2">
                      {control.owner}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-amber-500 text-xs">
                        IT Dependent
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400 text-xs">
                        9 AI Recommendation
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Control Details and Enhancement */}
            {selectedControlForUpdate && (
              <div className="space-y-6">
                {/* Control Information */}
                <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-semibold">
                      Control Details
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedControlForUpdate.hierarchyLevel === "Parent"
                            ? "bg-cora-blue text-white"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {selectedControlForUpdate.hierarchyLevel}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          selectedControlForUpdate.controlStatus === "Live"
                            ? "bg-cora-green text-white"
                            : "bg-cora-gray text-white"
                        }`}
                      >
                        {selectedControlForUpdate.controlStatus}
                      </span>
                    </div>
                  </div>

                  {/* Parent/Child Navigation */}
                  {(() => {
                    const related = getRelatedControls(
                      selectedControlForUpdate
                    );
                    return (
                      <div className="mb-6 p-4 bg-navy-dark rounded-lg border border-glass-border">
                        <h4 className="text-white font-medium mb-3 flex items-center">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          Control Hierarchy Navigation
                        </h4>

                        {/* Parent Control */}
                        {related.parent && (
                          <div className="mb-3">
                            <label className="text-gray-300 text-xs mb-1 block">
                              Parent Control
                            </label>
                            <button
                              onClick={() =>
                                navigateToControl(related.parent.id)
                              }
                              className="bg-cora-blue bg-opacity-20 hover:bg-opacity-30 border border-cora-blue text-white px-3 py-2 rounded-lg text-sm transition-all duration-300 flex items-center space-x-2"
                            >
                              <span>↑</span>
                              <span>
                                {related.parent.code} - {related.parent.name}
                              </span>
                            </button>
                          </div>
                        )}

                        {/* Child Controls */}
                        {related.children.length > 0 && (
                          <div>
                            <label className="text-gray-300 text-xs mb-2 block">
                              Child Controls ({related.children.length})
                            </label>
                            <div className="space-y-2">
                              {related.children.map((child: any) => (
                                <button
                                  key={child.id}
                                  onClick={() => navigateToControl(child.id)}
                                  className={`w-full text-left bg-amber-500 bg-opacity-20 hover:bg-opacity-30 border border-amber-500 text-white px-3 py-2 rounded-lg text-sm transition-all duration-300 flex items-center space-x-2 ${
                                    selectedControlForUpdate.id === child.id
                                      ? "ring-2 ring-amber-500"
                                      : ""
                                  }`}
                                >
                                  <span>↓</span>
                                  <span>
                                    {child.code} - {child.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {!related.parent && related.children.length === 0 && (
                          <div className="text-gray-400 text-sm italic">
                            No parent or child controls found
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <label className="text-gray-300 text-sm">
                        Control ID
                      </label>
                      <div className="text-white font-mono">
                        {selectedControlForUpdate.code}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Control Method
                      </label>
                      <div className="text-white">
                        {selectedControlForUpdate.controlMethod ||
                          "Detective (or Predictive)"}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Control Type
                      </label>
                      <div className="text-white">
                        {selectedControlForUpdate.controlType ||
                          "Prevent/Detect"}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Control Name
                      </label>
                      <div className="text-white">
                        {selectedControlForUpdate.name}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Automation Type
                      </label>
                      <div className="text-white">
                        {selectedControlForUpdate.automationType}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Control Hierarchy
                      </label>
                      <div className="text-white">
                        {selectedControlForUpdate.hierarchyLevel}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Description
                      </label>
                      <div className="text-white">
                        {selectedControlForUpdate.description}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Linked Risks
                      </label>
                      <div className="text-white text-xs space-y-1">
                        {selectedControlForUpdate.linkedRisks?.map(
                          (risk: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  risk.riskCategory === "Operational"
                                    ? "bg-cora-red"
                                    : risk.riskCategory === "Regulatory"
                                    ? "bg-amber-500"
                                    : risk.riskCategory === "IT"
                                    ? "bg-cora-blue"
                                    : "bg-cora-green"
                                }`}
                              ></span>
                              <span>
                                {risk.riskId} - {risk.riskName}
                              </span>
                            </div>
                          )
                        ) || <span>No linked risks</span>}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">Frequency</label>
                      <div className="text-white">
                        {selectedControlForUpdate.frequency}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">Owner</label>
                      <div className="text-white">
                        {selectedControlForUpdate.owner}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Business Line
                      </label>
                      <div className="text-white">
                        {selectedControlForUpdate.businessLine}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">
                        CORA Index
                      </label>
                      <div className="text-white font-mono">
                        {selectedControlForUpdate.coraIndex || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendations Section */}
                  <div className="mt-6 pt-4 border-t border-glass-border">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-4 h-4 bg-amber-500 rounded"></div>
                      <h4 className="text-white font-medium">
                        AI Recommendations
                      </h4>
                      {/* <span className="text-gray-400 text-sm">Summary?</span>
                      <span className="text-gray-400 text-sm ml-auto">
                        Part of Enhancement User Journey
                      </span> */}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked
                          readOnly
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-white text-sm">
                          Expand Monitoring Coverage
                        </span>
                      </div>
                      <div className="text-gray-400 text-xs ml-6">
                        Confidence: 92%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Indicator Recommendations */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Side: Actual colors from selected row with checkboxes */}
                  <div className="bg-glass-aurora backdrop-blur-sm rounded-lg border border-glass-border p-4">
                    <h4 className="text-white font-medium mb-4">
                      Key Indicator Recommendations for Control Enhancement
                    </h4>
                    <div className="space-y-3">
                      {getKeyIndicatorBoxes(selectedControlForUpdate).map(
                        (box, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <div
                              className={`w-4 h-4 rounded ${box.color}`}
                            ></div>
                            <input
                              type="checkbox"
                              checked={selectedKeyIndicators.has(
                                (index + 1).toString()
                              )}
                              onChange={() =>
                                handleKeyIndicatorSelection(
                                  (index + 1).toString()
                                )
                              }
                              className="w-4 h-4 rounded border-gray-400"
                            />
                            <span className="text-white text-sm">
                              {index === 0
                                ? "Not a standardized CORA control."
                                : index === 1
                                ? "The control information should be reviewed for improvement."
                                : index === 2
                                ? "This is a manual control."
                                : `Key Indicator ${index + 1}`}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Right Side: Preview colors (what it will become after save) without checkboxes */}
                  <div className="bg-glass-aurora backdrop-blur-sm rounded-lg border border-glass-border p-4">
                    <h4 className="text-white font-medium mb-4">
                      Key Indicator Update on Submission
                    </h4>
                    <div className="space-y-3 mb-4">
                      {getKeyIndicatorBoxes(selectedControlForUpdate).map(
                        (box, index) => {
                          const isCommitted = committedRows.has(
                            selectedControlForUpdate.id
                          );
                          const isSelected = selectedKeyIndicators.has(
                            (index + 1).toString()
                          );

                          // Preview logic:
                          // - If already committed (saved), show green for first two
                          // - If not committed but checkbox selected, show what it would become (green for improvement)
                          // - Otherwise keep original color
                          let previewColor = box.color;
                          if (isCommitted && index < 2) {
                            previewColor = "bg-cora-green";
                          } else if (!isCommitted && isSelected && index < 2) {
                            previewColor = "bg-cora-green"; // Preview of improvement
                          }

                          return (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <div
                                className={`w-4 h-4 rounded ${previewColor}`}
                              ></div>
                              {/* No checkbox - this is just a preview */}
                              <span className="text-white text-sm ml-6">
                                {index === 0
                                  ? "Not a standardized CORA control."
                                  : index === 1
                                  ? "The control information should be reviewed for improvement."
                                  : index === 2
                                  ? "This is a manual control."
                                  : `Key Indicator ${index + 1}`}
                              </span>
                              {/* Show preview indicator */}
                              {!isCommitted && isSelected && index < 2 && (
                                <span className="text-cora-green text-xs italic">
                                  → Will improve
                                </span>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>

                    {/* Associated Risks */}
                    <div className="mt-4 border-t border-gray-600 pt-4">
                      <h5 className="text-white font-medium mb-2">
                        Associated Risks
                      </h5>
                      <div className="text-gray-300 text-sm">
                        <div className="mb-1">
                          Risk Location:{" "}
                          {selectedControlForUpdate.location || "US"}
                        </div>
                        <div>Name of linked risks here</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Improvement Generation */}
                {showImprovement && (
                  <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">
                      Improvement Generation
                    </h3>
                    <div className="text-white text-sm mb-4">
                      Changes based on which indicator
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      {/* Current Control Description */}
                      <div>
                        <div className="flex items-center mb-3">
                          <div className="w-4 h-4 bg-amber-500 rounded mr-3"></div>
                          <h5 className="text-white font-medium">
                            Current Control Description
                          </h5>
                        </div>
                        <div className="text-white text-xs mb-2">
                          Date last tested
                        </div>
                        <div className="bg-navy-dark rounded p-4 text-white text-sm leading-relaxed">
                          {improvementGeneration.current.content}
                        </div>
                      </div>

                      {/* Suggested Control Description */}
                      <div>
                        <div className="flex items-center mb-3">
                          <div className="w-4 h-4 bg-cora-green rounded mr-3"></div>
                          <h5 className="text-white font-medium">
                            Suggested Control Description
                          </h5>
                        </div>
                        <div className="bg-navy-dark rounded p-4 text-white text-sm leading-relaxed">
                          <div className="space-y-4">
                            <div>
                              <div className="font-semibold text-cora-blue mb-2">
                                OBJECTIVES:
                              </div>
                              <div className="pl-3">
                                To detect payment processing errors, fraud,
                                misallocations, operational failures, and
                                regulatory breaches to ensure all payment
                                movements are fully reconciled and discrepancies
                                are resolved or escalated as appropriate.
                              </div>
                            </div>

                            <div>
                              <div className="font-semibold text-cora-green mb-2">
                                WHAT:
                              </div>
                              <div className="pl-3">
                                Review and reconcile all incoming and outgoing
                                payments to identify, investigate, and resolve
                                discrepancies between internal records and
                                external statements.
                              </div>
                            </div>

                            <div>
                              <div className="font-semibold text-amber-500 mb-2">
                                WHEN:
                              </div>
                              <div className="pl-3">
                                Reconciliations must be performed daily, with
                                unresolved issues escalated promptly in line
                                with internal escalation protocols.
                              </div>
                            </div>

                            <div>
                              <div className="font-semibold text-purple-400 mb-2">
                                WHO:
                              </div>
                              <div className="pl-3">
                                Reconciliation is performed by Operations.
                                Outstanding issues are escalated to Finance or
                                relevant Control Owners.
                              </div>
                            </div>

                            <div>
                              <div className="font-semibold text-cora-red mb-2">
                                HOW:
                              </div>
                              <div className="pl-3">
                                Reconciliation is completed in the central
                                payments ledger and reconciliation tool,
                                referencing both bank statements and internal
                                accounting records.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhancement Details */}
                <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl p-6">
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Enhancement Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Status
                      </label>
                      <div className="text-white">In Re-design</div>
                      <div className="text-gray-400 text-xs mt-1">
                        Demo Status we are limiting to Not Started, In Progress,
                        Completed
                        <br />
                        duplicative of table above
                      </div>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Target Date
                      </label>
                      <div className="text-white">29/02/2024</div>
                      <div className="text-gray-400 text-xs mt-1">
                        We don't set targets so perhaps last changed date?
                      </div>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Assigned To
                      </label>
                      <div className="text-white">Alice Johnson</div>
                      <div className="text-gray-400 text-xs mt-1">
                        Duplicative of table can remove
                      </div>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Root Cause
                      </label>
                      <select className="w-full bg-glass-mystic backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border">
                        <option>Select Root Cause</option>
                        <option>
                          Not in the MVP but I like this for Phase 2 (thematic
                          root causes) but remove from Demo
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Comments
                      </label>
                      <div className="text-white mb-2">
                        Need to expand monitoring to cover all privileged
                        accounts
                      </div>
                      <div className="text-gray-400 text-xs">
                        This is actually a very good call out - we don't have a
                        space for comments and notes. Not technically in the
                        user journey - but can we keep?
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button className="bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700">
                        Cancel
                      </button>
                      <button
                        onClick={handleCommit}
                        className="bg-cora-red text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-600"
                      >
                        Save Enhancement
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400 text-center">
            <p>
              Select an "Update" checkbox from the table above to view
              enhancement details
            </p>
          </div>
        </div>
      )}

      {/* Control Detail Modal */}
      <ControlDetailModal
        control={selectedControl}
        user={user || null}
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        onSave={handleSaveControl}
        onNavigateToControl={handleNavigateToControl}
      />
    </div>
  );
};

export default ControlManagement;
