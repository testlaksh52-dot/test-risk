"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

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
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((option) => option.id === value);

  // Calculate dropdown position when opening
  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        x: rect.left,
        y: rect.bottom + 8,
      });
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
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

      {isOpen &&
        createPortal(
          <div
            className="fixed bg-dropdown-bg backdrop-blur-md border border-glass-border rounded-lg shadow-2xl z-[99999] w-48 animate-fadeIn"
            style={{
              left: `${dropdownPosition.x}px`,
              top: `${dropdownPosition.y}px`,
            }}
          >
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
          </div>,
          document.body
        )}
    </div>
  );
};

export default AssignedToDropdown;
