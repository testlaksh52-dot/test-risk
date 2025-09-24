# CORA Control & Risk Analytics Platform

A comprehensive end-to-end implementation of the CORA User Journey system for control and risk management analytics. This platform provides role-based access, advanced filtering, interactive dashboards, data ingestion, and control enhancement workflows.

## 🚀 Features Overview

### **Complete User Journey Implementation**

- **Journey 0**: Authentication & SSO simulation
- **Journey 1**: Data ingestion and mapping system
- **Journey 2**: Advanced dashboard with all KCIs and filtering
- **Journey 3**: Drill-down and reporting with table views
- **Journey 4**: Control management and enhancement workflow

### **Role-Based Access Control**

- **1LOD (First Line of Defense)**: Control owners and chief control office
- **1LOD Data Owner**: Data management and upload permissions
- **2LOD (Second Line of Defense)**: Risk management and compliance oversight
- **CORA Agent**: AI-powered analysis and recommendations
- **Manager**: Full access with audit trail and assignment capabilities

### **Advanced Analytics & Reporting**

- Real-time Key Control Indicators (KCIs)
- Interactive charts with drill-down capability
- Multi-format export (PDF, Excel, CSV, PowerPoint)
- Saved views and personal dashboards
- Comprehensive audit trail

## 📁 Project Structure

```
Risk & Controls/
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout with authentication
│   └── page.tsx             # Main application entry point
├── components/
│   ├── AuthSystem.tsx       # Authentication and login system
│   ├── Dashboard.tsx        # Main analytics dashboard
│   ├── ControlManagement.tsx # Control management interface
│   ├── DataIngestion.tsx    # Data upload and mapping system
│   ├── DrillDown.tsx        # Detailed control analysis
│   ├── ControlEnhancement.tsx # Control enhancement workflow
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── AssignedToDropdown.tsx # User assignment dropdown
│   └── Loader.tsx           # Professional loading screen
├── lib/
│   ├── mockDataStore.ts     # Comprehensive data management
│   └── mockData.ts          # Legacy mock data (deprecated)
├── hooks/
│   └── useLoading.ts        # Global loading state management
└── public/
    └── images/
        └── logos/
            └── amp.png      # Application logo
```

## 🎯 User Journeys

### **Journey 0: Authentication**

- **Component**: `AuthSystem.tsx`
- **Features**:
  - Professional login interface with glassmorphism design
  - Role-based authentication with demo credentials
  - Session management with localStorage
  - Security protocols and access control

**Demo Credentials:**

- 1LOD: `john.smith` / `password123`
- Data Owner: `sarah.jones` / `password123`
- 2LOD: `mike.wilson` / `password123`
- Manager: `lisa.brown` / `password123`

### **Journey 1: Data Ingestion**

- **Component**: `DataIngestion.tsx`
- **Features**:
  - File upload with progress tracking
  - Field mapping interface (drag-and-drop)
  - Data validation and error handling
  - Status filtering (Live, Draft, etc.)
  - Real-time preview of uploaded data
  - Role-based access control

**Supported Formats:**

- Excel files (.xlsx, .xls)
- CSV files (.csv)
- Pre-integrated templates for Archer and ServiceNow

### **Journey 2: Analytics Dashboard**

- **Component**: `Dashboard.tsx`
- **Features**:
  - Real-time KCI calculations
  - Interactive charts with hover tooltips
  - Advanced filtering system
  - Saved views management
  - Export functionality (PDF, Excel, CSV, PowerPoint)
  - Role-based permissions

**Key Metrics:**

- CORA Matching Status (Matched, Unmatched, Gap, Resolved)
- Control Effectiveness (Effective, Ineffective, Needs Improvement, Not Yet Rated)
- Control Automation (Manual, Semi-Automated, IT Dependent, Automated)

### **Journey 3: Drill-down Analysis**

- **Component**: `DrillDown.tsx`
- **Features**:
  - Detailed table views with sorting
  - Advanced search and filtering
  - Bulk actions for status updates
  - Export capabilities
  - Pagination for large datasets
  - Real-time metrics summary

### **Journey 4: Control Enhancement**

- **Component**: `ControlEnhancement.tsx`
- **Features**:
  - AI-powered recommendations
  - Side-by-side comparison (current vs suggested)
  - Workflow status management
  - Root cause analysis
  - Assignment and tracking
  - Complete audit trail

## 🏗️ Technical Architecture

### **Data Layer**

- **MockDataStore**: Comprehensive data management system
- **User Management**: Role-based access with permissions
- **Audit Trail**: Complete logging for compliance
- **Export System**: Professional reporting capabilities

### **Component Architecture**

- **Modular Design**: Each journey is a separate component
- **Reusable Components**: Shared UI elements and utilities
- **State Management**: React hooks for local state
- **Type Safety**: Full TypeScript implementation

### **Styling System**

- **Tailwind CSS**: Utility-first styling
- **Glassmorphism**: Modern, professional design
- **Custom Colors**: CORA-specific color palette
- **Responsive Design**: Works across all screen sizes

## 🎨 Design System

### **Color Palette**

```css
/* Primary Colors */
navy-darker: #07233d
cortex-blue: #3170f9
cortex-red: #dc2626
cortex-green: #059669
cortex-orange: #fde68a (legacy)
amber-500: #f59e0b (current)

/* Glassmorphism */
glass-aurora: rgba(255, 255, 255, 0.03)
glass-mystic: rgba(255, 255, 255, 0.06)
glass-border: rgba(255, 255, 255, 0.12)
```

### **Typography**

- **Font Family**: Inter (Google Fonts)
- **Sizes**: Responsive from 8px to 24px
- **Weights**: 300-700 (Light to Bold)

### **Components**

- **Cards**: Glassmorphism with backdrop blur
- **Buttons**: Hover effects and transitions
- **Forms**: Dark theme with focus states
- **Tables**: Sortable with pagination
- **Modals**: Professional overlay design

## 🔧 Installation & Setup

### **Prerequisites**

- Node.js 18+
- npm or yarn
- Modern browser with ES6+ support

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd "Risk & Controls"

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### **Environment Setup**

No environment variables required - uses mock data store.

## 📊 Data Models

### **User Model**

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  role: "1LOD" | "1LOD_Data_Owner" | "2LOD" | "CORA_Agent" | "Manager";
  permissions: string[];
  businessLine?: string;
  function?: string;
  region?: string;
  lastLogin?: string;
}
```

### **Control Model**

```typescript
interface Control {
  id: string;
  code: string;
  name: string;
  description: string;
  parentControlId?: string;
  isParent: boolean;
  level: 1 | 2;
  businessLine: string;
  function: string;
  controlType: string;
  controlFrequency: string;
  automationType: "Manual" | "Semi-Automated" | "IT Dependent" | "Automated";
  effectiveness:
    | "Effective"
    | "Ineffective"
    | "Needs Improvement"
    | "Not Yet Rated";
  cortexMatch: "Matched" | "Unmatched" | "Gap" | "Resolved";
  owner: string;
  assignedTo?: string;
  location: string;
  region: string;
  status: "Live" | "Retired" | "Draft" | "Under Review";
  createdDate: string;
  lastUpdated: string;
  riskId?: string;
  keyControlIndicators: string[];
  auditTrail: AuditEntry[];
  enhancementStatus?:
    | "Not Reviewed"
    | "In Review"
    | "In Re-design"
    | "In Approval"
    | "Complete";
  targetDate?: string;
  rootCause?: string;
  comments?: string;
  aiRecommendations?: AIRecommendation[];
}
```

## 🔐 Security & Compliance

### **Role-Based Permissions**

- **1LOD**: View dashboard, filter controls, export data, assign controls
- **1LOD Data Owner**: All 1LOD permissions + upload data, manage mappings
- **2LOD**: View dashboard, filter controls, export data, audit trail, challenge outcomes
- **CORA Agent**: Analyze controls, generate recommendations, classify controls, rate controls
- **Manager**: All permissions + audit trail, export audit

### **Audit Trail**

- Complete logging of all user actions
- Timestamp and user identification
- IP address and user agent tracking
- Change tracking (old vs new values)
- Export capabilities for compliance

## 📈 Key Features

### **Interactive Dashboards**

- Real-time metrics calculation
- Clickable charts for drill-down
- Hover tooltips with detailed information
- Responsive design for all screen sizes

### **Advanced Filtering**

- Multi-select filters
- Saved views with personal defaults
- Real-time filter application
- Export filtered data

### **Data Management**

- File upload with validation
- Field mapping interface
- Data preview and error handling
- Status-based filtering

### **Control Enhancement**

- AI-powered recommendations
- Workflow status tracking
- Root cause analysis
- Assignment and deadline management

### **Export & Reporting**

- Multiple formats (PDF, Excel, CSV, PowerPoint)
- Landscape and portrait orientations
- Chart inclusion options
- Audit trail inclusion

## 🚀 Getting Started

### **1. Login**

Use any of the demo credentials to access the system:

- Navigate to the application
- Enter username and password
- Select your role-based view

### **2. Dashboard Navigation**

- **Dashboard**: Main analytics view with KPIs
- **Control Management**: Detailed control information
- **Data Ingestion**: Upload and map new data
- **Enhancement**: Manage control improvements

### **3. Data Upload (Data Owners)**

- Navigate to Data Ingestion
- Upload Excel/CSV files
- Map fields to CORA data model
- Validate and preview data
- Complete upload process

### **4. Analytics & Filtering**

- Use filters to narrow down data
- Click on chart segments for drill-down
- Save views for quick access
- Export data in various formats

### **5. Control Enhancement**

- Navigate to Enhancement view
- Select controls requiring improvement
- Review AI recommendations
- Update status and assign tasks
- Track progress and completion

## 🔄 Data Flow

### **Authentication Flow**

1. User enters credentials
2. System validates against mock data store
3. Role-based permissions applied
4. Session stored in localStorage
5. Redirect to appropriate dashboard

### **Data Upload Flow**

1. User selects file for upload
2. System processes and validates file
3. Field mapping interface presented
4. User maps fields to CORA model
5. Data preview and validation
6. Upload completion and dashboard update

### **Analytics Flow**

1. User applies filters
2. System calculates real-time metrics
3. Charts update with new data
4. User can drill-down for details
5. Export options available

### **Enhancement Flow**

1. System identifies controls needing improvement
2. AI generates recommendations
3. User reviews and selects recommendations
4. Status updated and assigned
5. Progress tracked through workflow

## 🛠️ Development

### **Adding New Features**

1. Create new component in `/components`
2. Add to main navigation in `Sidebar.tsx`
3. Update routing in `app/page.tsx`
4. Add permissions to `mockDataStore.ts`
5. Update TypeScript interfaces

### **Styling Guidelines**

- Use Tailwind CSS classes
- Follow glassmorphism design patterns
- Maintain consistent spacing and typography
- Ensure responsive design
- Test across different screen sizes

### **Data Management**

- All data operations go through `mockDataStore`
- Maintain audit trail for all changes
- Use TypeScript interfaces for type safety
- Implement proper error handling

## 📝 API Reference

### **MockDataStore Methods**

```typescript
// User Management
getUserById(id: string): User | undefined
getUserByUsername(username: string): User | undefined
authenticateUser(username: string, password: string): User | null

// Control Management
getControls(filters?: FilterConfig): Control[]
getControlById(id: string): Control | undefined
updateControl(id: string, updates: Partial<Control>, userId: string): Control | null

// Saved Views
getSavedViews(userId: string): SavedView[]
saveView(view: Omit<SavedView, 'id' | 'createdAt'>): SavedView

// Audit Trail
getAuditTrail(entityId?: string, entityType?: string): AuditEntry[]
addAuditEntry(entry: Omit<AuditEntry, 'id'>): AuditEntry

// Analytics
getDashboardMetrics(filters?: FilterConfig): DashboardMetrics

// Export
exportControls(filters: FilterConfig, config: ExportConfig): string
```

## 🐛 Troubleshooting

### **Common Issues**

**Authentication Problems**

- Clear localStorage and try again
- Check username/password combination
- Verify role permissions

**Data Upload Issues**

- Ensure file format is supported
- Check field mapping completeness
- Validate required fields are mapped

**Performance Issues**

- Large datasets may require pagination
- Consider implementing virtual scrolling
- Optimize filter operations

**Styling Issues**

- Check Tailwind CSS configuration
- Verify custom color definitions
- Ensure responsive breakpoints

### **Debug Mode**

- Open browser developer tools
- Check console for error messages
- Verify network requests
- Inspect component state

## 🔮 Future Enhancements

### **Planned Features**

- Real-time collaboration
- Advanced AI recommendations
- Mobile application
- API integration
- Advanced reporting
- Workflow automation

### **Technical Improvements**

- Database integration
- Real-time updates
- Performance optimization
- Security enhancements
- Testing coverage

## 📞 Support

### **Documentation**

- Component documentation in code comments
- TypeScript interfaces for type safety
- README files for each major component

### **Development Resources**

- React documentation
- Tailwind CSS documentation
- TypeScript handbook
- Next.js documentation

## 📄 License

This project is proprietary software developed for internal use. All rights reserved.

---

**Built with ❤️ using React, Next.js, TypeScript, and Tailwind CSS**
