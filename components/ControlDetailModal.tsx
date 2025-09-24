"use client";

import { useState, useEffect } from "react";
import { X, Save, Edit3, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Control, User } from "@/lib/mockDataStore";
import { mockDataStore } from "@/lib/mockDataStore";
import { mockControls } from "@/lib/mockData";

interface ControlDetailModalProps {
  control: Control | null;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedControl: Control) => void;
  onNavigateToControl?: (control: Control) => void;
}

const ControlDetailModal = ({
  control,
  user,
  isOpen,
  onClose,
  onSave,
  onNavigateToControl,
}: ControlDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedControl, setEditedControl] = useState<Control | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Check if user has edit permissions
  const canEdit =
    user?.permissions.includes("edit_controls") ||
    user?.role === "Manager" ||
    user?.role === "Cortex_Agent" ||
    user?.role === "2LOD";

  // Helper functions for parent/child navigation
  const getRelatedControls = (control: Control) => {
    const related = {
      parent: null as Control | null,
      children: [] as Control[],
    };

    if (control.hierarchyLevel === "Child" && control.parentControlId) {
      related.parent =
        mockControls.find((c) => c.id === control.parentControlId) || null;
    }

    if (control.hierarchyLevel === "Parent" && control.childControlIds) {
      related.children = mockControls.filter((c) =>
        control.childControlIds?.includes(c.id)
      );
    }

    return related;
  };

  const handleNavigateToControl = (targetControl: Control) => {
    if (onNavigateToControl) {
      onNavigateToControl(targetControl);
    }
  };

  useEffect(() => {
    if (control) {
      setEditedControl({ ...control });
      setIsEditing(false);
      setHasChanges(false);
    }
  }, [control]);

  const handleFieldChange = (field: keyof Control, value: any) => {
    if (editedControl) {
      const updated = { ...editedControl, [field]: value };
      setEditedControl(updated);
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    if (editedControl && user) {
      // Update in mock data store
      mockDataStore.updateControl(editedControl.id, editedControl, user.id);

      // Log audit entry
      mockDataStore.addAuditEntry({
        timestamp: new Date().toISOString(),
        userId: user.id,
        action: "UPDATE_CONTROL",
        entityType: "control",
        entityId: editedControl.id,
        reason: `Control ${editedControl.code} updated via detailed view`,
      });

      onSave(editedControl);
      setIsEditing(false);
      setHasChanges(false);
    }
  };

  const handleCancel = () => {
    if (control) {
      setEditedControl({ ...control });
      setIsEditing(false);
      setHasChanges(false);
    }
  };

  if (!isOpen || !control || !editedControl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[99999] p-4">
      <div className="bg-modal-bg backdrop-blur-md rounded-2xl border border-glass-border shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-glass-border bg-modal-bg relative z-10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-white">
              Control Details
            </h2>
            <span className="bg-cortex-blue text-white px-2 py-1 rounded text-xs font-medium">
              {control.code}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {canEdit && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isEditing
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-cortex-blue text-white hover:bg-blue-600"
                }`}
              >
                {isEditing ? <Lock size={16} /> : <Edit3 size={16} />}
                <span>{isEditing ? "View Mode" : "Edit Mode"}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Parent/Child Navigation */}
        {control &&
          (() => {
            const related = getRelatedControls(control);
            return (
              (related.parent || related.children.length > 0) && (
                <div className="px-6 py-4 bg-navy-dark border-b border-glass-border">
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

                  <div className="flex flex-wrap gap-2">
                    {/* Parent Control */}
                    {related.parent && (
                      <button
                        onClick={() => handleNavigateToControl(related.parent!)}
                        className="bg-cortex-blue bg-opacity-20 hover:bg-opacity-30 border border-cortex-blue text-white px-3 py-2 rounded-lg text-sm transition-all duration-300 flex items-center space-x-2"
                      >
                        <span>↑</span>
                        <span>Parent: {related.parent.code}</span>
                      </button>
                    )}

                    {/* Child Controls */}
                    {related.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handleNavigateToControl(child)}
                        className="bg-amber-500 bg-opacity-20 hover:bg-opacity-30 border border-amber-500 text-white px-3 py-2 rounded-lg text-sm transition-all duration-300 flex items-center space-x-2"
                      >
                        <span>↓</span>
                        <span>Child: {child.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            );
          })()}

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Basic Information
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Control Code
                  </label>
                  <input
                    type="text"
                    value={editedControl.code}
                    onChange={(e) => handleFieldChange("code", e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Control Name
                  </label>
                  <input
                    type="text"
                    value={editedControl.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editedControl.description}
                    onChange={(e) =>
                      handleFieldChange("description", e.target.value)
                    }
                    disabled={!isEditing}
                    rows={3}
                    className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Owner
                  </label>
                  <input
                    type="text"
                    value={editedControl.owner}
                    onChange={(e) => handleFieldChange("owner", e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    value={editedControl.assignedTo || ""}
                    onChange={(e) =>
                      handleFieldChange("assignedTo", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Control Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Control Metrics
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Business Line
                  </label>
                  <select
                    value={editedControl.businessLine}
                    onChange={(e) =>
                      handleFieldChange("businessLine", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                  >
                    <option value="Retail Banking">Retail Banking</option>
                    <option value="Corporate Banking">Corporate Banking</option>
                    <option value="Investment Banking">
                      Investment Banking
                    </option>
                    <option value="Wealth Management">Wealth Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Function
                  </label>
                  <select
                    value={editedControl.function}
                    onChange={(e) =>
                      handleFieldChange("function", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                  >
                    <option value="Risk Management">Risk Management</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Operations">Operations</option>
                    <option value="IT">IT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Control Type
                  </label>
                  <select
                    value={editedControl.controlType}
                    onChange={(e) =>
                      handleFieldChange("controlType", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                  >
                    <option value="Preventive">Preventive</option>
                    <option value="Detective">Detective</option>
                    <option value="Corrective">Corrective</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Control Frequency
                  </label>
                  <select
                    value={editedControl.controlFrequency}
                    onChange={(e) =>
                      handleFieldChange("controlFrequency", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Automation Type
                  </label>
                  <select
                    value={editedControl.automationType}
                    onChange={(e) =>
                      handleFieldChange("automationType", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Semi-Automated">Semi-Automated</option>
                    <option value="IT Dependent">IT Dependent</option>
                    <option value="Automated">Automated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Effectiveness
                  </label>
                  <select
                    value={editedControl.effectiveness}
                    onChange={(e) =>
                      handleFieldChange("effectiveness", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                  >
                    <option value="Effective">Effective</option>
                    <option value="Ineffective">Ineffective</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                    <option value="Not Yet Rated">Not Yet Rated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Cortex Match
                  </label>
                  <select
                    value={editedControl.cortexMatch}
                    onChange={(e) =>
                      handleFieldChange("cortexMatch", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                  >
                    <option value="Matched">Matched</option>
                    <option value="Unmatched">Unmatched</option>
                    <option value="Gap">Gap</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editedControl.status}
                    onChange={(e) =>
                      handleFieldChange("status", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                  >
                    <option value="Live">Live</option>
                    <option value="Retired">Retired</option>
                    <option value="Draft">Draft</option>
                    <option value="Under Review">Under Review</option>
                    <option value="In review">In review</option>
                    <option value="Outstanding">Outstanding</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Open">Open</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Final Score
                  </label>
                  <input
                    type="number"
                    value={editedControl.finalScore}
                    onChange={(e) =>
                      handleFieldChange(
                        "finalScore",
                        parseInt(e.target.value) || 0
                      )
                    }
                    disabled={!isEditing}
                    min="0"
                    max="100"
                    className="w-full bg-modal-input backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Additional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editedControl.location}
                  onChange={(e) =>
                    handleFieldChange("location", e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full bg-glass-mystic backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Region
                </label>
                <input
                  type="text"
                  value={editedControl.region}
                  onChange={(e) => handleFieldChange("region", e.target.value)}
                  disabled={!isEditing}
                  className="w-full bg-glass-mystic backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Created Date
                </label>
                <input
                  type="date"
                  value={editedControl.createdDate}
                  onChange={(e) =>
                    handleFieldChange("createdDate", e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full bg-glass-mystic backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Last Updated
                </label>
                <input
                  type="date"
                  value={editedControl.lastUpdated}
                  onChange={(e) =>
                    handleFieldChange("lastUpdated", e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full bg-glass-mystic backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border focus:ring-2 focus:ring-cortex-blue focus:border-cortex-blue disabled:bg-navy-darker disabled:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-glass-border bg-modal-bg relative z-10 flex-shrink-0">
          <div className="flex items-center space-x-2">
            {!canEdit && (
              <div className="flex items-center space-x-2 text-amber-500">
                <Lock size={16} />
                <span className="text-sm">Read-only access</span>
              </div>
            )}
            {hasChanges && (
              <div className="flex items-center space-x-2 text-amber-500">
                <AlertCircle size={16} />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {isEditing && (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="flex items-center space-x-2 px-4 py-2 bg-cortex-blue text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </>
            )}
            {!isEditing && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlDetailModal;
