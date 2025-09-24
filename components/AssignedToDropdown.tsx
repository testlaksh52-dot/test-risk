"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface AssignedToDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    id: string;
    name: string;
    initials: string;
    color: string;
  }>;
}

const AssignedToDropdown = ({
  value,
  onChange,
  options,
}: AssignedToDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.id === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-glass-aurora backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-glass-border appearance-none pr-8 min-w-[200px] hover:bg-glass-mystic transition-all duration-500 shadow-lg flex items-center justify-between text-sm"
      >
        <div className="flex items-center space-x-2">
          {selectedOption ? (
            <>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${selectedOption.color}`}
              >
                {selectedOption.initials}
              </div>
              <span className="text-white text-sm">{selectedOption.name}</span>
            </>
          ) : (
            <span className="text-gray-400 text-sm">Assigned To</span>
          )}
        </div>
        <ChevronDown className="text-gray-400" size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-dropdown-bg backdrop-blur-md border border-glass-border rounded-lg shadow-2xl z-50">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dropdown-hover transition-colors border-b border-glass-border last:border-b-0"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${option.color}`}
              >
                {option.initials}
              </div>
              <span className="text-white text-sm">{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedToDropdown;
