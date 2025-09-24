"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { User } from "@/lib/mockDataStore";

interface DataIngestionProps {
  user: User;
  onUploadComplete: () => void;
}

interface FieldMapping {
  userField: string;
  cortexField: string;
  required: boolean;
  mapped: boolean;
}

interface UploadStatus {
  status:
    | "idle"
    | "uploading"
    | "mapping"
    | "validating"
    | "complete"
    | "error";
  progress: number;
  message: string;
  errors: string[];
}

const DataIngestion = ({ user, onUploadComplete }: DataIngestionProps) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: "idle",
    progress: 0,
    message: "",
    errors: [],
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [dataPreview, setDataPreview] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("Live");

  // Check if user has data upload permissions
  if (!user.permissions.includes("upload_data")) {
    return (
      <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl p-8 text-center">
        <AlertCircle className="w-16 h-16 text-cortex-red mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-300">
          You don't have permission to upload data. Contact your administrator.
        </p>
      </div>
    );
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadStatus({
        status: "uploading",
        progress: 0,
        message: "Processing file...",
        errors: [],
      });

      // Simulate file processing
      setTimeout(() => {
        setUploadStatus({
          status: "mapping",
          progress: 50,
          message: "File processed. Setting up field mapping...",
          errors: [],
        });

        // Mock field mappings
        const mockMappings: FieldMapping[] = [
          {
            userField: "Control ID",
            cortexField: "Control Code",
            required: true,
            mapped: true,
          },
          {
            userField: "Control Name",
            cortexField: "Control Name",
            required: true,
            mapped: true,
          },
          {
            userField: "Description",
            cortexField: "Description",
            required: true,
            mapped: true,
          },
          {
            userField: "Owner",
            cortexField: "Owner",
            required: true,
            mapped: true,
          },
          {
            userField: "Business Unit",
            cortexField: "Business Line",
            required: true,
            mapped: true,
          },
          {
            userField: "Function",
            cortexField: "Function",
            required: true,
            mapped: true,
          },
          {
            userField: "Type",
            cortexField: "Control Type",
            required: true,
            mapped: true,
          },
          {
            userField: "Frequency",
            cortexField: "Control Frequency",
            required: true,
            mapped: true,
          },
          {
            userField: "Automation",
            cortexField: "Automation Type",
            required: false,
            mapped: false,
          },
          {
            userField: "Location",
            cortexField: "Location",
            required: false,
            mapped: false,
          },
        ];

        setFieldMappings(mockMappings);

        // Mock data preview
        const mockPreview = [
          {
            "Control ID": "CTR-001",
            "Control Name": "Access Control",
            Owner: "John Smith",
            Status: "Live",
          },
          {
            "Control ID": "CTR-002",
            "Control Name": "Data Protection",
            Owner: "Sarah Johnson",
            Status: "Live",
          },
          {
            "Control ID": "CTR-003",
            "Control Name": "Risk Assessment",
            Owner: "Mike Wilson",
            Status: "Draft",
          },
        ];

        setDataPreview(mockPreview);
      }, 2000);
    }
  };

  const handleFieldMapping = (index: number, cortexField: string) => {
    const newMappings = [...fieldMappings];
    newMappings[index].cortexField = cortexField;
    newMappings[index].mapped = cortexField !== "";
    setFieldMappings(newMappings);
  };

  const validateMappings = () => {
    const requiredFields = fieldMappings.filter((f) => f.required);
    const unmappedRequired = requiredFields.filter((f) => !f.mapped);

    if (unmappedRequired.length > 0) {
      setUploadStatus({
        status: "error",
        progress: 0,
        message: "Validation failed",
        errors: [
          `Required fields not mapped: ${unmappedRequired
            .map((f) => f.userField)
            .join(", ")}`,
        ],
      });
      return false;
    }
    return true;
  };

  const handleCompleteUpload = () => {
    if (!validateMappings()) return;

    setUploadStatus({
      status: "validating",
      progress: 75,
      message: "Validating data...",
      errors: [],
    });

    setTimeout(() => {
      setUploadStatus({
        status: "complete",
        progress: 100,
        message: "Upload completed successfully!",
        errors: [],
      });

      setTimeout(() => {
        onUploadComplete();
      }, 2000);
    }, 3000);
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setFieldMappings([]);
    setDataPreview([]);
    setUploadStatus({
      status: "idle",
      progress: 0,
      message: "",
      errors: [],
    });
  };

  return (
    <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Data Refresh</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <span>User: {user.username}</span>
          <span>•</span>
          <span>Role: {user.role}</span>
        </div>
      </div>

      {uploadStatus.status === "idle" && (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-glass-border rounded-xl p-8 text-center">
            <Upload className="w-12 h-12 text-cortex-blue mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Upload Control Library File
            </h3>
            <p className="text-gray-300 mb-4">
              Select an Excel, CSV, or other supported file format
            </p>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".xlsx,.xls,.csv"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-cortex-blue text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-blue-600 transition-colors inline-block"
            >
              Browse Files
            </label>
          </div>

          <div className="bg-glass-mystic backdrop-blur-sm rounded-xl p-4">
            <h4 className="text-white font-semibold mb-2">Supported Formats</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Excel files (.xlsx, .xls)</li>
              <li>• CSV files (.csv)</li>
              <li>• Pre-integrated templates for Archer and ServiceNow</li>
            </ul>
          </div>
        </div>
      )}

      {uploadStatus.status === "uploading" && (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cortex-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">{uploadStatus.message}</p>
          <div className="w-full bg-glass-mystic rounded-full h-2 mt-4">
            <div
              className="bg-cortex-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadStatus.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {uploadStatus.status === "mapping" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Field Mapping</h3>
            <span className="text-sm text-gray-300">
              File: {uploadedFile?.name}
            </span>
          </div>

          <div className="bg-glass-mystic backdrop-blur-sm rounded-xl p-4">
            <h4 className="text-white font-semibold mb-3">
              Map Your Fields to Cortex Data Model
            </h4>
            <div className="space-y-3">
              {fieldMappings.map((mapping, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-white text-sm font-medium mb-1">
                      {mapping.userField}
                      {mapping.required && (
                        <span className="text-cortex-red ml-1">*</span>
                      )}
                    </label>
                    <select
                      value={mapping.cortexField}
                      onChange={(e) =>
                        handleFieldMapping(index, e.target.value)
                      }
                      className={`w-full bg-glass-aurora backdrop-blur-sm text-white px-3 py-2 rounded-lg border ${
                        mapping.required && !mapping.mapped
                          ? "border-cortex-red"
                          : "border-glass-border"
                      }`}
                    >
                      <option value="">Select Cortex Field</option>
                      <option value="Control Code">Control Code</option>
                      <option value="Control Name">Control Name</option>
                      <option value="Description">Description</option>
                      <option value="Owner">Owner</option>
                      <option value="Business Line">Business Line</option>
                      <option value="Function">Function</option>
                      <option value="Control Type">Control Type</option>
                      <option value="Control Frequency">
                        Control Frequency
                      </option>
                      <option value="Automation Type">Automation Type</option>
                      <option value="Location">Location</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    {mapping.mapped ? (
                      <CheckCircle className="w-5 h-5 text-cortex-green" />
                    ) : mapping.required ? (
                      <AlertCircle className="w-5 h-5 text-cortex-red" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-glass-mystic backdrop-blur-sm rounded-xl p-4">
            <h4 className="text-white font-semibold mb-3">
              Control Status Filter
            </h4>
            <p className="text-gray-300 text-sm mb-3">
              Select which control statuses to import (e.g., exclude retired
              controls)
            </p>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-glass-aurora backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-glass-border"
            >
              <option value="Live">Live Controls Only</option>
              <option value="All">All Statuses</option>
              <option value="Draft">Draft Controls</option>
            </select>
          </div>

          <div className="bg-glass-mystic backdrop-blur-sm rounded-xl p-4">
            <h4 className="text-white font-semibold mb-3">Data Preview</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-glass-border">
                    {Object.keys(dataPreview[0] || {}).map((key) => (
                      <th key={key} className="text-left text-white py-2 px-3">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataPreview.slice(0, 3).map((row, index) => (
                    <tr key={index} className="border-b border-glass-border">
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="text-gray-300 py-2 px-3">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              Showing first 3 rows of {dataPreview.length} total records
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={resetUpload}
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCompleteUpload}
              className="bg-cortex-blue text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors"
            >
              Complete Upload
            </button>
          </div>
        </div>
      )}

      {uploadStatus.status === "validating" && (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cortex-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">{uploadStatus.message}</p>
          <div className="w-full bg-glass-mystic rounded-full h-2 mt-4">
            <div
              className="bg-cortex-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadStatus.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {uploadStatus.status === "complete" && (
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-cortex-green mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Upload Successful!
          </h3>
          <div className="bg-glass-mystic backdrop-blur-sm rounded-xl p-4 mb-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-300">Records Processed</div>
                <div className="text-white font-semibold">1,247</div>
              </div>
              <div>
                <div className="text-gray-300">Successfully Mapped</div>
                <div className="text-cortex-green font-semibold">1,203</div>
              </div>
              <div>
                <div className="text-gray-300">Validation Issues</div>
                <div className="text-cortex-red font-semibold">44</div>
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-sm">
            Your control data has been processed and is now available in the
            dashboard.
          </p>
        </div>
      )}

      {uploadStatus.status === "error" && (
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-cortex-red mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Upload Failed
          </h3>
          <div className="bg-cortex-red/10 border border-cortex-red/20 rounded-lg p-4 mb-4">
            {uploadStatus.errors.map((error, index) => (
              <p key={index} className="text-cortex-red text-sm">
                {error}
              </p>
            ))}
          </div>
          <button
            onClick={resetUpload}
            className="bg-cortex-blue text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default DataIngestion;
