"use client";

import { ChevronDown } from "lucide-react";
import {
  mockControls,
  keyIndicatorRecommendations,
  keyIndicatorUpdates,
  improvementGeneration,
  filterOptions,
} from "@/lib/mockData";
import { useState } from "react";
import AssignedToDropdown from "./AssignedToDropdown";
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
        return "bg-cortex-red";
      case "Needs Improvement":
        return "bg-amber-500";
      case "Manual":
        return "bg-cortex-red";
      case "Generated":
        return "bg-cortex-green";
      case "Not Started":
        return "bg-amber-500";
      case "In review":
        return "bg-cortex-blue";
      case "Outstanding":
        return "bg-amber-500";
      default:
        return "bg-cortex-gray";
    }
  };

  const getRecommendationColor = (color: string) => {
    switch (color) {
      case "red":
        return "bg-cortex-red";
      case "orange":
        return "bg-amber-500";
      case "green":
        return "bg-cortex-green";
      default:
        return "bg-cortex-gray";
    }
  };

  const handleUpdateCheckbox = (controlId: string) => {
    const newSelected = new Set(selectedUpdateRows);
    if (newSelected.has(controlId)) {
      newSelected.delete(controlId);
    } else {
      newSelected.add(controlId);
    }
    setSelectedUpdateRows(newSelected);
    setShowKeyIndicatorUpdate(newSelected.size > 0);
  };

  const handleKeyIndicatorSelection = (indicatorId: string) => {
    const newSelected = new Set(selectedKeyIndicators);
    if (newSelected.has(indicatorId)) {
      newSelected.delete(indicatorId);
    } else {
      newSelected.add(indicatorId);
    }
    setSelectedKeyIndicators(newSelected);
    setShowImprovement(newSelected.size > 0);
  };

  const handleCommit = () => {
    const newCommitted = new Set(committedRows);
    selectedUpdateRows.forEach((rowId) => newCommitted.add(rowId));
    setCommittedRows(newCommitted);
    setSelectedUpdateRows(new Set());
    setSelectedKeyIndicators(new Set());
    setShowKeyIndicatorUpdate(false);
    setShowImprovement(false);
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
    <div className="flex-1 bg-navy-darker">
      {/* Content */}
      <div className="p-6">
        {/* Title and CORA Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">
              CONTROL MANAGEMENT
            </h2>

            {/* Control Owner and Control ID Filters */}
            <div className="flex items-center space-x-4 mb-6">
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
                  className="bg-cortex-red text-white mt-4 px-4 py-2 rounded text-sm font-medium hover:bg-red-600"
                >
                  RESET
                </button>
              </div>
            </div>
          </div>

          <div className="text-right">
            <h3 className="text-white text-sm font-semibold">CORA</h3>
          </div>
        </div>

        {/* Control Detail Table */}
        <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl mb-6">
          <div className="flex justify-between items-center p-4 border-b border-glass-border">
            <h3 className="text-white text-sm font-medium">Control Detail</h3>
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
                    Key Indicator
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Final score
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Rewrite
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Assigned To
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Status
                  </th>
                  <th className="text-left text-white text-[10px] font-medium p-3 font-sans">
                    Update
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockControls
                  .filter((control) => {
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
                    return true;
                  })
                  .slice(0, 2)
                  .map((control) => {
                    const isCommitted = committedRows.has(control.id);
                    return (
                      <tr
                        key={control.id}
                        className={`border-b border-glass-border hover:bg-glass-mystic ${
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
                          <input
                            type="checkbox"
                            checked={selectedUpdateRows.has(control.id)}
                            onChange={() => handleUpdateCheckbox(control.id)}
                            className="w-4 h-4 text-cortex-blue bg-navy-light border-gray-300 rounded focus:ring-cortex-blue"
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Indicator Recommendations and Updates */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Key Indicator Recommendations */}
          <div className="bg-navy-light rounded-lg p-4">
            <h4 className="text-white font-medium mb-4">
              Key Indicator Recommendations for Control Enhancement
            </h4>
            <div className="space-y-3">
              {keyIndicatorRecommendations.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded ${getRecommendationColor(
                      item.color
                    )}`}
                  ></div>
                  <input
                    type="checkbox"
                    checked={selectedKeyIndicators.has(item.id)}
                    onChange={() => handleKeyIndicatorSelection(item.id)}
                    className="w-4 h-4 rounded border-gray-400"
                  />
                  <span className="text-white text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Indicator Updates - Only show when update checkbox is selected */}
          {showKeyIndicatorUpdate && (
            <div className="bg-navy-light rounded-lg p-4">
              <h4 className="text-white font-medium mb-4">
                Key Indicator Update on Submission
              </h4>
              <div className="space-y-3 mb-4">
                {keyIndicatorUpdates.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded ${getRecommendationColor(
                        item.color
                      )}`}
                    ></div>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      className="w-4 h-4 rounded border-gray-400"
                      readOnly
                    />
                    <span className="text-white text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h5 className="text-white font-medium mb-2">
                  Associated Risks
                </h5>
                <div className="text-gray-300 text-sm mb-2">
                  Risk Location: US
                </div>
                <div className="text-gray-300 text-sm">
                  Name of linked risks here
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Improvement Generation - Only show when key indicators are selected */}
        {showImprovement && (
          <div className="bg-navy-light rounded-lg p-4">
            <h4 className="text-white font-medium mb-4">
              Improvement Generation
            </h4>
            <div className="grid grid-cols-2 gap-6">
              {/* Current Control Description */}
              <div>
                <div className="flex items-center mb-3">
                  <div className="w-4 h-4 bg-amber-500 rounded mr-3"></div>
                  <h5 className="text-white font-medium">
                    {improvementGeneration.current.title}
                  </h5>
                </div>
                <div className="bg-navy-dark rounded p-4 text-white text-sm leading-relaxed">
                  {improvementGeneration.current.content}
                </div>
              </div>

              {/* Suggested Control Description */}
              <div>
                <div className="flex items-center mb-3">
                  <div className="w-4 h-4 bg-cortex-green rounded mr-3"></div>
                  <h5 className="text-white font-medium">
                    {improvementGeneration.suggested.title}
                  </h5>
                </div>
                <div className="bg-navy-dark rounded p-4 text-white text-sm leading-relaxed">
                  {improvementGeneration.suggested.content}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCommit}
                className="bg-cortex-red text-white px-6 py-2 rounded text-sm font-medium hover:bg-red-600"
              >
                COMMIT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlManagement;
