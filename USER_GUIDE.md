# 🚀 CORA Control & Risk Analytics Platform - User Guide

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication & Login](#authentication--login)
3. [Dashboard Overview](#dashboard-overview)
4. [Data Ingestion (Journey 1)](#data-ingestion-journey-1)
5. [Analytics Dashboard (Journey 2)](#analytics-dashboard-journey-2)
6. [Drill-down Analysis (Journey 3)](#drill-down-analysis-journey-3)
7. [Control Enhancement (Journey 4)](#control-enhancement-journey-4)
8. [Role-Based Features](#role-based-features)
9. [Export & Reporting](#export--reporting)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Getting Started

### **System Requirements**

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- No additional software installation required

### **Access the Platform**

1. Navigate to the application URL
2. You'll see the CORA login screen
3. Use the provided demo credentials to access the system

---

## 🔐 Authentication & Login

### **Login Screen Features**

- **Professional Design**: Glassmorphism UI with CORA branding
- **Secure Authentication**: Username/password validation
- **Session Management**: Automatic login persistence
- **Role-Based Access**: Different permissions per user type

### **Demo Credentials**

```
1LOD (First Line of Defense):
Username: john.smith
Password: password123

Data Owner:
Username: sarah.jones
Password: password123

2LOD (Second Line of Defense):
Username: mike.wilson
Password: password123

Manager:
Username: lisa.brown
Password: password123
```

### **Logout Functionality**

- **Location**: Top-right corner of the Dashboard header
- **Button**: Gray "Logout" button with logout icon
- **Action**: Clears session and returns to login screen

---

## 📊 Dashboard Overview

### **Main Dashboard Features**

- **Real-time Metrics**: Live KCI calculations
- **Interactive Charts**: Clickable segments for drill-down
- **Advanced Filtering**: Multi-dimensional filtering system
- **Saved Views**: Personal filter configurations
- **Export Capabilities**: Multiple format options

### **Key Metrics Displayed**

1. **CORA Matching Status**

   - Gaps (Red)
   - Unmatched (Amber)
   - Matched (Green)
   - Resolved (Blue)

2. **Control Effectiveness**

   - Effective
   - Ineffective
   - Needs Improvement
   - Not Yet Rated

3. **Control Automation**
   - Manual
   - Semi-Automated
   - IT Dependent
   - Automated

### **Interactive Features**

- **Clickable Charts**: Click any chart segment to drill down
- **Hover Tooltips**: Detailed information on hover
- **Filter Integration**: Charts update based on active filters
- **Real-time Updates**: Metrics recalculate automatically

---

## 📁 Data Ingestion (Journey 1)

### **Access Requirements**

- **Role**: Data Owner (sarah.jones)
- **Permission**: `upload_data` required
- **Navigation**: Sidebar → Data Ingestion

### **Upload Process**

1. **File Selection**

   - Drag & drop or browse for files
   - Supported formats: Excel (.xlsx, .xls), CSV (.csv)
   - File validation and processing

2. **Field Mapping**

   - Map your data fields to CORA data model
   - Required fields must be mapped
   - Visual mapping interface
   - Error highlighting for missing mappings

3. **Data Preview**

   - First 3 rows displayed
   - Field validation results
   - Status filtering options

4. **Confirmation & Upload**
   - Review mapped fields
   - Select control status filter
   - Confirm upload
   - Success summary with statistics

### **Field Mapping Options**

- Control Code
- Control Name
- Description
- Owner
- Business Line
- Function
- Control Type
- Control Frequency
- Automation Type
- Location
- Region
- Status

---

## 📈 Analytics Dashboard (Journey 2)

### **Filtering System**

- **Location**: Geographic filtering
- **Business Line**: Organizational units
- **Function**: Business functions
- **Control Type**: Type of controls
- **Control Frequency**: How often controls run
- **Date Range**: Time-based filtering

### **Saved Views**

- **Save Current View**: Save filter configuration
- **Load Saved Views**: Apply previously saved filters
- **Personal Defaults**: User-specific default views
- **Reset Filters**: Clear all active filters

### **Export Options**

- **Formats**: PDF, Excel, CSV, PowerPoint
- **Orientations**: Landscape, Portrait
- **Include Charts**: Toggle chart inclusion
- **Include Audit Trail**: Add audit information

### **Interactive Charts**

1. **CORA Index Rating Match**

   - Visual distribution of matching status
   - Click segments for detailed analysis

2. **Control Effectiveness Distribution**

   - Effectiveness ratings breakdown
   - Interactive hover effects

3. **Control Automation Distribution**
   - Automation level analysis
   - Drill-down capability

---

## 🔍 Drill-down Analysis (Journey 3)

### **Accessing Drill-down**

- **Method 1**: Click any chart segment on Dashboard
- **Method 2**: Click metric cards (Gaps, Unmatched, etc.)
- **Method 3**: Use filter combinations

### **Drill-down Features**

- **Back Navigation**: Return to Dashboard
- **Summary Cards**: Total, Matched, Unmatched, Gaps
- **Advanced Filtering**: Search and status filters
- **Bulk Actions**: Multi-select and status updates
- **Export**: CSV/Excel export of filtered data

### **Table Features**

- **Sortable Columns**: Click headers to sort
- **Search Functionality**: Find specific controls
- **Status Filtering**: Filter by CORA match status
- **Row Selection**: Checkbox selection for bulk actions
- **Pagination**: Navigate through large datasets

### **Bulk Operations**

- **Select Multiple**: Use checkboxes to select rows
- **Bulk Status Update**: Change status for multiple controls
- **Export Selected**: Export only selected items

---

## ⚡ Control Enhancement (Journey 4)

### **Access Requirements**

- **Role**: Any authenticated user
- **Navigation**: Sidebar → Control Enhancement

### **Enhancement Workflow**

1. **Control Selection**

   - Search for specific controls
   - Filter by status (Gap, Unmatched, Ineffective)
   - Select controls requiring improvement

2. **AI Recommendations**

   - AI-powered suggestions for improvement
   - Structural enhancements
   - Reassignment recommendations
   - Frequency adjustments

3. **Side-by-side Comparison**

   - Current vs. suggested control descriptions
   - Highlighted differences
   - Accept/Reject recommendations

4. **Workflow Management**
   - Status tracking (Not Reviewed → Complete)
   - Target date setting
   - Assignment to team members
   - Root cause analysis

### **AI Recommendations Types**

- **Rewrite Suggestions**: Improve control descriptions
- **Deduplication**: Identify duplicate controls
- **Structural Changes**: Reassignment, reclassification
- **Frequency Adjustments**: Optimize control frequency

---

## 👥 Role-Based Features

### **1LOD (First Line of Defense)**

- **Username**: john.smith
- **Permissions**: View dashboard, filter controls, export data, assign controls
- **Features**: Basic analytics, control management, drill-down analysis

### **Data Owner**

- **Username**: sarah.jones
- **Permissions**: All 1LOD permissions + upload data, manage mappings
- **Features**: Data ingestion, field mapping, advanced analytics

### **2LOD (Second Line of Defense)**

- **Username**: mike.wilson
- **Permissions**: Enhanced analytics, control enhancement, audit access
- **Features**: Advanced filtering, control improvement, compliance reporting

### **Manager**

- **Username**: lisa.brown
- **Permissions**: Full system access, user management, advanced reporting
- **Features**: Executive dashboards, comprehensive analytics, audit trails

---

## 📤 Export & Reporting

### **Export Formats**

- **PDF**: Professional reports with charts
- **Excel**: Detailed data with formatting
- **CSV**: Raw data for analysis
- **PowerPoint**: Presentation-ready slides

### **Export Options**

- **Include Charts**: Add visualizations to exports
- **Include Audit Trail**: Add compliance information
- **Orientation**: Landscape or portrait
- **Date Range**: Export specific time periods

### **Report Types**

- **Dashboard Summary**: Key metrics overview
- **Control Details**: Comprehensive control information
- **Drill-down Results**: Filtered analysis results
- **Enhancement Reports**: Improvement recommendations

---

## 🛠️ Troubleshooting

### **Common Issues**

#### **Login Problems**

- **Issue**: Cannot log in with credentials
- **Solution**: Use exact demo credentials (case-sensitive)
- **Alternative**: Clear browser cache and try again

#### **Data Upload Issues**

- **Issue**: File upload fails
- **Solution**: Ensure file format is supported (.xlsx, .csv)
- **Check**: File size and format compatibility

#### **Filter Problems**

- **Issue**: Filters not working
- **Solution**: Reset filters using "Reset" button
- **Alternative**: Clear browser cache

#### **Export Issues**

- **Issue**: Export not generating
- **Solution**: Check browser popup blockers
- **Alternative**: Try different export format

### **Performance Tips**

- **Large Datasets**: Use pagination for better performance
- **Filters**: Apply specific filters to reduce data load
- **Browser**: Use modern browsers for optimal performance

### **Browser Compatibility**

- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript**: Must be enabled
- **Cookies**: Required for session management

---

## 🎯 Best Practices

### **Dashboard Usage**

1. **Start with Overview**: Use default dashboard view first
2. **Apply Filters Gradually**: Add filters one at a time
3. **Save Views**: Save frequently used filter combinations
4. **Export Regularly**: Export important analyses

### **Data Management**

1. **Validate Data**: Check data quality before upload
2. **Map Fields Carefully**: Ensure accurate field mapping
3. **Review Results**: Always review upload summaries
4. **Backup Data**: Keep copies of important datasets

### **Analytics Workflow**

1. **Start Broad**: Begin with high-level metrics
2. **Drill Down**: Use interactive charts for detailed analysis
3. **Filter Systematically**: Apply filters in logical order
4. **Document Findings**: Export results for documentation

### **Control Enhancement**

1. **Prioritize Issues**: Focus on high-risk controls first
2. **Use AI Recommendations**: Leverage AI suggestions
3. **Track Progress**: Monitor enhancement status
4. **Collaborate**: Assign tasks to appropriate team members

---

## 📞 Support & Resources

### **System Features**

- **Real-time Analytics**: Live metric calculations
- **Interactive Dashboards**: Clickable charts and filters
- **Role-based Access**: Tailored permissions per user type
- **Audit Trail**: Complete action logging
- **Export Capabilities**: Multiple format options

### **Technical Specifications**

- **Framework**: React 18+ with Next.js 15
- **Styling**: Tailwind CSS with custom glassmorphism
- **Data**: Mock data store with 100+ controls
- **Authentication**: Session-based with localStorage
- **Export**: Client-side generation

### **Getting Help**

- **Documentation**: Comprehensive README and user guide
- **Demo Data**: Pre-loaded with realistic scenarios
- **Error Handling**: Graceful error messages and recovery
- **Browser Console**: Check for technical details

---

**🚀 Ready to explore the CORA Control & Risk Analytics Platform!**

_This user guide covers all major features and workflows. For technical details, refer to the README.md file._


User-Friendly Access: Web-based, no installation; secure login with role-based permissions.
Interactive Dashboard: Real-time metrics, drill-downs, advanced filters, saved views, and exports.
Data Ingestion: Upload Excel/CSV, map fields visually, preview data, validate, and confirm.
Analytics Dashboard: Slice data by geography, business line, function, etc.; save views; export (PDF, Excel, CSV, PPT).
Drill-down Analysis: Click charts or metrics to explore details; search, filter, bulk edit, and export.
Control Enhancement: AI-powered suggestions for improving controls; compare, accept/reject, assign, and track status.
Role-Based Features:

1LOD: View/filter dashboards, assign controls.
Data Owner: Plus data upload & mappings.
2LOD: Advanced analytics, control improvement, compliance reports.
Manager: Full access, user & report management.
Export & Reporting: Generate professional reports (PDF/Excel/CSV/PPT) with charts and audit trails.
Troubleshooting & Best Practices: Guidance on login, uploads, filters, performance, and effective workflows.
Support & Specs: Real-time analytics, audit trail, React/Next.js app, Tailwind styling, demo data, and clear error handling.