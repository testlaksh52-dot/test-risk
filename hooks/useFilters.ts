import { useState, useMemo } from 'react';
import { Control, filterOptions } from '@/lib/mockData';

export interface FilterState {
  location: string;
  businessLine: string;
  function: string;
  controlType: string;
  controlFrequency: string;
  status: string;
  dateRange: string;
  controlOwner: string;
  controlId: string;
}

const initialFilters: FilterState = {
  location: '',
  businessLine: '',
  function: '',
  controlType: '',
  controlFrequency: '',
  status: '',
  dateRange: '',
  controlOwner: '',
  controlId: ''
};

export const useFilters = (data: Control[]) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const filteredData = useMemo(() => {
    return data.filter((control) => {
      if (filters.location && control.location !== filters.location) return false;
      if (filters.businessLine && control.businessLine !== filters.businessLine) return false;
      if (filters.function && control.function !== filters.function) return false;
      if (filters.controlType && control.controlType !== filters.controlType) return false;
      if (filters.controlFrequency && control.frequency !== filters.controlFrequency) return false;
      if (filters.status && control.status !== filters.status) return false;
      if (filters.controlOwner && control.owner !== filters.controlOwner) return false;
      if (filters.controlId && control.code !== filters.controlId) return false;
      return true;
    });
  }, [data, filters]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const exportData = (format: 'csv' | 'xls' | 'pdf' | 'ppt') => {
    const dataToExport = filteredData;

    switch (format) {
      case 'csv':
        exportAsCSV(dataToExport);
        break;
      case 'xls':
        console.log('Exporting as Excel...', dataToExport);
        break;
      case 'pdf':
        console.log('Exporting as PDF...', dataToExport);
        break;
      case 'ppt':
        console.log('Exporting as PowerPoint...', dataToExport);
        break;
      default:
        console.log('Export format not supported');
    }
  };

  return {
    filters,
    filteredData,
    updateFilter,
    resetFilters,
    exportData
  };
};

const exportAsCSV = (data: Control[]) => {
  const headers = [
    'Control Code',
    'Control Name',
    'Control Description',
    'Control Owner',
    'Key Indicators',
    'Rewrite',
    'Assigned To',
    'Status',
    'Effectiveness',
    'Automation Type',
    'Frequency',
    'Control Type',
    'Business Line',
    'Function',
    'Location'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(control => [
      control.code,
      `"${control.name}"`,
      `"${control.description}"`,
      control.owner,
      control.keyIndicators,
      control.rewrite,
      control.assignedTo,
      control.status,
      control.effectiveness,
      control.automationType,
      control.frequency,
      control.controlType,
      control.businessLine,
      control.function,
      control.location
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `cortex-controls-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};