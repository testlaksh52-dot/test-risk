"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  X,
  AlertCircle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import {
  mockDataStore,
  User as CortexUser,
  Control,
  AIRecommendation,
} from "@/lib/mockDataStore";

interface ControlEnhancementProps {
  user: CortexUser;
  onBack: () => void;
}

const ControlEnhancement = ({ user, onBack }: ControlEnhancementProps) => {
  const [controls, setControls] = useState<Control[]>([]);
  const [filteredControls, setFilteredControls] = useState<Control[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedRecommendations, setSelectedRecommendations] = useState<
    Set<string>
  >(new Set());
  const [enhancementStatus, setEnhancementStatus] = useState<string>("");
  const [targetDate, setTargetDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    // Get controls that need enhancement (Red and Amber status)
    const allControls = mockDataStore.getControls({});
    const enhancementControls = allControls.filter(
      (control) =>
        control.cortexMatch === "Gap" ||
        control.cortexMatch === "Unmatched" ||
        control.effectiveness === "Ineffective" ||
        control.effectiveness === "Needs Improvement"
    );
    setControls(enhancementControls);
    setFilteredControls(enhancementControls);
  }, []);

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
  };

  const handleControlSelect = (control: Control) => {
    setSelectedControl(control);
    setShowRecommendations(true);
    setEnhancementStatus(control.enhancementStatus || "Not Reviewed");
    setTargetDate(control.targetDate || "");
    setAssignedTo(control.assignedTo || "");
    setRootCause(control.rootCause || "");
    setComments(control.comments || "");
  };

  const handleRecommendationSelect = (recommendationId: string) => {
    const newSelected = new Set(selectedRecommendations);
    if (newSelected.has(recommendationId)) {
      newSelected.delete(recommendationId);
    } else {
      newSelected.add(recommendationId);
    }
    setSelectedRecommendations(newSelected);
  };

  const handleSaveEnhancement = () => {
    if (!selectedControl) return;

    const updates = {
      enhancementStatus: enhancementStatus as
        | "Not Reviewed"
        | "In Review"
        | "In Re-design"
        | "In Approval"
        | "Complete",
      targetDate,
      assignedTo,
      rootCause,
      comments,
    };

    mockDataStore.updateControl(selectedControl.id, updates, user.id);

    // Update local state
    const updatedControls = controls.map((control) =>
      control.id === selectedControl.id ? { ...control, ...updates } : control
    );
    setControls(updatedControls);
    setFilteredControls(updatedControls);

    // Reset form
    setSelectedControl(null);
    setShowRecommendations(false);
    setSelectedRecommendations(new Set());
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

  const getEnhancementStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-cortex-green";
      case "In Review":
        return "bg-cortex-blue";
      case "In Re-design":
        return "bg-amber-500";
      case "In Approval":
        return "bg-cortex-blue";
      case "Not Reviewed":
        return "bg-cortex-gray";
      default:
        return "bg-cortex-gray";
    }
  };

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
              <ArrowRight size={20} className="rotate-180" />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-glass-border"></div>
            <h1 className="text-white text-lg font-semibold">
              Control Enhancement and Management
            </h1>
          </div>
          <div className="text-sm text-gray-300">
            {filteredControls.length} controls requiring enhancement
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-glass-aurora backdrop-blur-sm px-6 py-4 border-b border-glass-border shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by Control ID, Name, or Owner..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-glass-mystic backdrop-blur-sm text-white pl-10 pr-4 py-2 rounded-lg border border-glass-border placeholder-gray-400 focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter[0] || ""}
              onChange={(e) =>
                setStatusFilter(e.target.value ? [e.target.value] : [])
              }
              className="bg-glass-mystic backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border"
            >
              <option value="">All Statuses</option>
              <option value="Gap">Gap</option>
              <option value="Unmatched">Unmatched</option>
              <option value="Matched">Matched</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls List */}
          <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl">
            <div className="p-4 border-b border-glass-border">
              <h3 className="text-white text-sm font-semibold">
                Controls Requiring Enhancement
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredControls.map((control) => (
                <div
                  key={control.id}
                  onClick={() => handleControlSelect(control)}
                  className={`p-4 border-b border-glass-border cursor-pointer hover:bg-glass-mystic transition-colors ${
                    selectedControl?.id === control.id ? "bg-glass-mystic" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-mono text-sm">
                        {control.code}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-medium text-white ${getStatusColor(
                          control.cortexMatch
                        )}`}
                      >
                        {control.cortexMatch}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-medium text-white ${getEnhancementStatusColor(
                        control.enhancementStatus || "Not Reviewed"
                      )}`}
                    >
                      {control.enhancementStatus || "Not Reviewed"}
                    </span>
                  </div>
                  <div className="text-white text-sm mb-1">{control.name}</div>
                  <div className="text-gray-300 text-xs mb-2">
                    {control.owner}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-medium text-white ${getEffectivenessColor(
                        control.effectiveness
                      )}`}
                    >
                      {control.effectiveness}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {control.automationType}
                    </span>
                  </div>
                  {control.aiRecommendations &&
                    control.aiRecommendations.length > 0 && (
                      <div className="mt-2 flex items-center space-x-1">
                        <Lightbulb size={12} className="text-amber-500" />
                        <span className="text-amber-500 text-xs">
                          {control.aiRecommendations.length} AI recommendation
                          {control.aiRecommendations.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* Control Details and Enhancement */}
          {selectedControl && (
            <div className="space-y-6">
              {/* Control Information */}
              <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl p-6">
                <h3 className="text-white text-lg font-semibold mb-4">
                  Control Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-300 text-sm">Control ID</label>
                    <div className="text-white font-mono">
                      {selectedControl.code}
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">
                      Control Name
                    </label>
                    <div className="text-white">{selectedControl.name}</div>
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Description</label>
                    <div className="text-white text-sm">
                      {selectedControl.description}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-300 text-sm">Owner</label>
                      <div className="text-white">{selectedControl.owner}</div>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">
                        Business Line
                      </label>
                      <div className="text-white">
                        {selectedControl.businessLine}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              {selectedControl.aiRecommendations &&
                selectedControl.aiRecommendations.length > 0 && (
                  <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
                      <Lightbulb size={20} className="text-amber-500" />
                      <span>AI Recommendations</span>
                    </h3>
                    <div className="space-y-4">
                      {selectedControl.aiRecommendations.map(
                        (recommendation) => (
                          <div
                            key={recommendation.id}
                            className={`p-4 rounded-lg border ${
                              selectedRecommendations.has(recommendation.id)
                                ? "border-cortex-blue bg-cortex-blue/10"
                                : "border-glass-border bg-glass-mystic"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedRecommendations.has(
                                  recommendation.id
                                )}
                                onChange={() =>
                                  handleRecommendationSelect(recommendation.id)
                                }
                                className="w-4 h-4 text-cortex-blue bg-navy-light border-gray-300 rounded focus:ring-cortex-blue mt-1"
                              />
                              <div className="flex-1">
                                <div className="text-white font-medium mb-2">
                                  {recommendation.title}
                                </div>
                                <div className="text-gray-300 text-sm mb-2">
                                  {recommendation.description}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Confidence:{" "}
                                  {Math.round(recommendation.confidence * 100)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Enhancement Form */}
              <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl p-6">
                <h3 className="text-white text-lg font-semibold mb-4">
                  Enhancement Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Status
                    </label>
                    <select
                      value={enhancementStatus}
                      onChange={(e) => setEnhancementStatus(e.target.value)}
                      className="w-full bg-glass-mystic backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border"
                    >
                      <option value="Not Reviewed">Not Reviewed</option>
                      <option value="In Review">In Review</option>
                      <option value="In Re-design">In Re-design</option>
                      <option value="In Approval">In Approval</option>
                      <option value="Complete">Complete</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full bg-glass-mystic backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Assigned To
                    </label>
                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="Enter assignee name"
                      className="w-full bg-glass-mystic backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Root Cause
                    </label>
                    <select
                      value={rootCause}
                      onChange={(e) => setRootCause(e.target.value)}
                      className="w-full bg-glass-mystic backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border"
                    >
                      <option value="">Select Root Cause</option>
                      <option value="Insufficient monitoring">
                        Insufficient monitoring
                      </option>
                      <option value="Unclear control description">
                        Unclear control description
                      </option>
                      <option value="Inadequate training">
                        Inadequate training
                      </option>
                      <option value="Process gaps">Process gaps</option>
                      <option value="Technology limitations">
                        Technology limitations
                      </option>
                      <option value="Resource constraints">
                        Resource constraints
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Comments
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Enter additional comments..."
                      rows={3}
                      className="w-full bg-glass-mystic backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border placeholder-gray-400"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setSelectedControl(null)}
                      className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEnhancement}
                      className="bg-cortex-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
    </div>
  );
};

export default ControlEnhancement;
