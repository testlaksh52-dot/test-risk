// Comprehensive Mock Data Store for CORA System
// Supports all user journeys and role-based access

export interface User {
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

export interface Control {
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
  coraMatch: "Matched" | "Unmatched" | "Gap" | "Resolved";
  owner: string;
  assignedTo?: string;
  location: string;
  region: string;
  status:
    | "Live"
    | "Retired"
    | "Draft"
    | "Under Review"
    | "In review"
    | "Outstanding"
    | "Completed"
    | "On Hold"
    | "Blocked"
    | "Open";
  createdDate: string;
  lastUpdated: string;
  riskId?: string;
  keyControlIndicators: string[];
  auditTrail: AuditEntry[];
  finalScore: number;
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

export interface AIRecommendation {
  id: string;
  type: "rewrite" | "merge" | "improve" | "reassign" | "frequency_adjust";
  title: string;
  description: string;
  currentValue: string;
  suggestedValue: string;
  rationale: string;
  confidence: number;
  status: "pending" | "accepted" | "rejected" | "deferred";
  createdAt: string;
  acceptedBy?: string;
  acceptedAt?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  entityType: "control" | "user" | "system";
  entityId: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SavedView {
  id: string;
  name: string;
  userId: string;
  filters: FilterConfig;
  isDefault: boolean;
  createdAt: string;
}

export interface FilterConfig {
  location?: string[];
  businessLine?: string[];
  function?: string[];
  controlType?: string[];
  controlFrequency?: string[];
  automationType?: string[];
  effectiveness?: string[];
  coraMatch?: string[];
  owner?: string[];
  region?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ExportConfig {
  format: "PDF" | "XLS" | "CSV" | "PPT";
  orientation: "portrait" | "landscape";
  includeCharts: boolean;
  includeAuditTrail: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Mock Users with Role-Based Access
export const mockUsers: User[] = [
  {
    id: "user-1",
    username: "john.smith",
    email: "john.smith@bank.com",
    role: "1LOD",
    permissions: [
      "view_dashboard",
      "filter_controls",
      "export_data",
      "assign_controls",
    ],
    businessLine: "Retail Banking",
    function: "Operations",
    region: "North America",
    lastLogin: "2024-01-15T10:30:00Z",
  },
  {
    id: "user-2",
    username: "sarah.jones",
    email: "sarah.jones@bank.com",
    role: "1LOD_Data_Owner",
    permissions: [
      "view_dashboard",
      "filter_controls",
      "export_data",
      "upload_data",
      "manage_mappings",
    ],
    businessLine: "Corporate Banking",
    function: "Risk Management",
    region: "Europe",
    lastLogin: "2024-01-15T09:15:00Z",
  },
  {
    id: "user-3",
    username: "mike.wilson",
    email: "mike.wilson@bank.com",
    role: "2LOD",
    permissions: [
      "view_dashboard",
      "filter_controls",
      "export_data",
      "audit_trail",
      "challenge_outcomes",
    ],
    businessLine: "Investment Banking",
    function: "Compliance",
    region: "Asia Pacific",
    lastLogin: "2024-01-15T11:45:00Z",
  },
  {
    id: "user-4",
    username: "cortex.agent",
    email: "cortex.agent@bank.com",
    role: "CORA_Agent",
    permissions: [
      "analyze_controls",
      "generate_recommendations",
      "classify_controls",
      "rate_controls",
    ],
    businessLine: "All",
    function: "AI/ML",
    region: "Global",
    lastLogin: "2024-01-15T12:00:00Z",
  },
  {
    id: "user-5",
    username: "lisa.brown",
    email: "lisa.brown@bank.com",
    role: "Manager",
    permissions: [
      "view_dashboard",
      "filter_controls",
      "export_data",
      "assign_controls",
      "audit_trail",
      "export_audit",
    ],
    businessLine: "Retail Banking",
    function: "Operations",
    region: "North America",
    lastLogin: "2024-01-15T08:30:00Z",
  },
];

// Enhanced Mock Controls with Full Journey Support
export const mockControls: Control[] = [
  // Parent Controls (Level 1)
  {
    id: "ctrl-001",
    code: "CTR-001",
    name: "Access Control Management",
    description:
      "Comprehensive access control framework for all systems and applications",
    isParent: true,
    level: 1,
    businessLine: "Retail Banking",
    function: "Operations",
    controlType: "Preventive",
    controlFrequency: "Daily",
    automationType: "Automated",
    effectiveness: "Effective",
    coraMatch: "Matched",
    owner: "John Smith",
    assignedTo: "Sarah Johnson",
    location: "New York",
    region: "North America",
    status: "In review",
    createdDate: "2023-01-15",
    lastUpdated: "2024-01-10",
    riskId: "RISK-001",
    finalScore: 85,
    keyControlIndicators: [
      "Access Reviews",
      "Segregation of Duties",
      "Privileged Access",
    ],
    auditTrail: [
      {
        id: "audit-001",
        timestamp: "2024-01-10T14:30:00Z",
        userId: "user-1",
        action: "CONTROL_UPDATED",
        entityType: "control",
        entityId: "ctrl-001",
        oldValue: { effectiveness: "Needs Improvement" },
        newValue: { effectiveness: "Effective" },
        reason: "Enhanced monitoring implemented",
        ipAddress: "192.168.1.100",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    ],
    enhancementStatus: "Complete",
    targetDate: "2024-02-15",
    rootCause: "Insufficient monitoring",
    comments: "Implemented automated access reviews",
    aiRecommendations: [],
  },
  {
    id: "ctrl-002",
    code: "CTR-002",
    name: "Data Loss Prevention",
    description:
      "Prevent unauthorized data exfiltration and ensure data integrity",
    isParent: true,
    level: 1,
    businessLine: "Corporate Banking",
    function: "Risk Management",
    controlType: "Preventive",
    controlFrequency: "Real-time",
    automationType: "IT Dependent",
    effectiveness: "Needs Improvement",
    coraMatch: "Unmatched",
    owner: "Mike Wilson",
    assignedTo: "Lisa Brown",
    location: "London",
    region: "Europe",
    status: "Outstanding",
    createdDate: "2023-03-20",
    lastUpdated: "2024-01-12",
    riskId: "RISK-002",
    finalScore: 65,
    keyControlIndicators: [
      "Data Classification",
      "DLP Alerts",
      "User Training",
    ],
    auditTrail: [
      {
        id: "audit-002",
        timestamp: "2024-01-12T09:15:00Z",
        userId: "user-2",
        action: "CONTROL_FLAGGED",
        entityType: "control",
        entityId: "ctrl-002",
        reason: "Control description unclear",
        ipAddress: "192.168.1.101",
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    ],
    enhancementStatus: "In Review",
    targetDate: "2024-03-01",
    rootCause: "Unclear control description",
    comments: "Need to clarify DLP scope and coverage",
    aiRecommendations: [
      {
        id: "rec-001",
        type: "rewrite",
        title: "Clarify DLP Scope",
        description:
          "Control description should specify which data types are covered",
        currentValue:
          "Prevent unauthorized data exfiltration and ensure data integrity",
        suggestedValue:
          "Prevent unauthorized exfiltration of PII, financial data, and confidential business information through automated DLP tools and user training",
        rationale:
          "Current description is too vague and doesn't specify data types or methods",
        confidence: 0.85,
        status: "pending",
        createdAt: "2024-01-12T09:20:00Z",
      },
    ],
  },
  // Child Controls (Level 2)
  {
    id: "ctrl-003",
    code: "CTR-003",
    name: "User Access Reviews",
    description: "Quarterly review of user access rights and permissions",
    parentControlId: "ctrl-001",
    isParent: false,
    level: 2,
    businessLine: "Retail Banking",
    function: "Operations",
    controlType: "Detective",
    controlFrequency: "Quarterly",
    automationType: "Semi-Automated",
    effectiveness: "Effective",
    coraMatch: "Matched",
    owner: "John Smith",
    assignedTo: "Tom Davis",
    location: "New York",
    region: "North America",
    status: "Completed",
    createdDate: "2023-01-20",
    lastUpdated: "2024-01-05",
    riskId: "RISK-001",
    finalScore: 92,
    keyControlIndicators: [
      "Access Review Completion",
      "Exception Handling",
      "Remediation Time",
    ],
    auditTrail: [],
    enhancementStatus: "Complete",
  },
  {
    id: "ctrl-004",
    code: "CTR-004",
    name: "Privileged Access Monitoring",
    description: "Monitor and log all privileged access activities",
    parentControlId: "ctrl-001",
    isParent: false,
    level: 2,
    businessLine: "Retail Banking",
    function: "Operations",
    controlType: "Detective",
    controlFrequency: "Real-time",
    automationType: "Automated",
    effectiveness: "Ineffective",
    coraMatch: "Gap",
    owner: "John Smith",
    assignedTo: "Alice Johnson",
    location: "New York",
    region: "North America",
    status: "On Hold",
    createdDate: "2023-02-01",
    lastUpdated: "2024-01-08",
    riskId: "RISK-001",
    finalScore: 58,
    keyControlIndicators: [
      "Monitoring Coverage",
      "Alert Response Time",
      "False Positive Rate",
    ],
    auditTrail: [
      {
        id: "audit-003",
        timestamp: "2024-01-08T16:45:00Z",
        userId: "user-4",
        action: "AI_ANALYSIS_COMPLETE",
        entityType: "control",
        entityId: "ctrl-004",
        reason: "Control identified as ineffective due to monitoring gaps",
        ipAddress: "192.168.1.102",
        userAgent: "CORA-Agent/1.0",
      },
    ],
    enhancementStatus: "In Re-design",
    targetDate: "2024-02-28",
    rootCause: "Insufficient monitoring coverage",
    comments: "Need to expand monitoring to cover all privileged accounts",
    aiRecommendations: [
      {
        id: "rec-002",
        type: "improve",
        title: "Expand Monitoring Coverage",
        description: "Include all privileged accounts in monitoring scope",
        currentValue: "Monitor and log all privileged access activities",
        suggestedValue:
          "Monitor and log all privileged access activities across all systems, including service accounts, with real-time alerting for suspicious activities",
        rationale:
          "Current scope is too narrow and misses critical privileged accounts",
        confidence: 0.92,
        status: "pending",
        createdAt: "2024-01-08T16:50:00Z",
      },
    ],
  },
];

// Additional controls to reach 100+ for realistic testing
export const generateAdditionalControls = (): Control[] => {
  const additionalControls: Control[] = [];
  const businessLines = [
    "Retail Banking",
    "Corporate Banking",
    "Investment Banking",
    "Wealth Management",
  ];
  const functions = [
    "Operations",
    "Risk Management",
    "Compliance",
    "IT",
    "Finance",
  ];
  const controlTypes = ["Preventive", "Detective", "Corrective"];
  const frequencies = [
    "Daily",
    "Weekly",
    "Monthly",
    "Quarterly",
    "Annually",
    "Real-time",
  ];
  const automationTypes = [
    "Manual",
    "Semi-Automated",
    "IT Dependent",
    "Automated",
  ];
  const effectivenessTypes = [
    "Effective",
    "Ineffective",
    "Needs Improvement",
    "Not Yet Rated",
  ];
  const coraMatchTypes = ["Matched", "Unmatched", "Gap", "Resolved"];
  const statusTypes = [
    "Live",
    "In review",
    "Outstanding",
    "Completed",
    "On Hold",
    "Blocked",
    "Open",
  ];
  const locations = ["New York", "London", "Singapore", "Toronto", "Sydney"];
  const regions = ["North America", "Europe", "Asia Pacific", "Latin America"];
  const owners = [
    "John Smith",
    "Sarah Johnson",
    "Mike Wilson",
    "Lisa Brown",
    "Tom Davis",
    "Alice Johnson",
  ];

  for (let i = 5; i <= 100; i++) {
    const isParent = Math.random() > 0.7;
    const parentControlId = isParent
      ? undefined
      : `ctrl-${Math.floor(Math.random() * 4) + 1}`;

    additionalControls.push({
      id: `ctrl-${i.toString().padStart(3, "0")}`,
      code: `CTR-${i.toString().padStart(3, "0")}`,
      name: `Control ${i} - ${
        controlTypes[Math.floor(Math.random() * controlTypes.length)]
      }`,
      description: `Description for control ${i} covering ${
        functions[Math.floor(Math.random() * functions.length)]
      } activities`,
      parentControlId,
      isParent,
      level: isParent ? 1 : 2,
      businessLine:
        businessLines[Math.floor(Math.random() * businessLines.length)],
      function: functions[Math.floor(Math.random() * functions.length)],
      controlType:
        controlTypes[Math.floor(Math.random() * controlTypes.length)],
      controlFrequency:
        frequencies[Math.floor(Math.random() * frequencies.length)],
      automationType: automationTypes[
        Math.floor(Math.random() * automationTypes.length)
      ] as any,
      effectiveness: effectivenessTypes[
        Math.floor(Math.random() * effectivenessTypes.length)
      ] as any,
      coraMatch: coraMatchTypes[
        Math.floor(Math.random() * coraMatchTypes.length)
      ] as any,
      owner: owners[Math.floor(Math.random() * owners.length)],
      assignedTo: owners[Math.floor(Math.random() * owners.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      status: statusTypes[
        Math.floor(Math.random() * statusTypes.length)
      ] as any,
      createdDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(
        2,
        "0"
      )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      lastUpdated: `2024-01-${String(
        Math.floor(Math.random() * 15) + 1
      ).padStart(2, "0")}`,
      riskId: `RISK-${Math.floor(Math.random() * 10) + 1}`,
      finalScore: Math.floor(Math.random() * 100) + 1,
      keyControlIndicators: ["KCI-1", "KCI-2", "KCI-3"],
      auditTrail: [],
      enhancementStatus: Math.random() > 0.5 ? "Not Reviewed" : "In Review",
    });
  }

  return additionalControls;
};

// Combine all controls
export const allControls = [...mockControls, ...generateAdditionalControls()];

// Mock Saved Views
export const mockSavedViews: SavedView[] = [
  {
    id: "view-1",
    name: "My Controls",
    userId: "user-1",
    filters: {
      owner: ["John Smith"],
      businessLine: ["Retail Banking"],
    },
    isDefault: true,
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "view-2",
    name: "High Risk Controls",
    userId: "user-2",
    filters: {
      effectiveness: ["Ineffective", "Needs Improvement"],
      coraMatch: ["Gap", "Unmatched"],
    },
    isDefault: false,
    createdAt: "2024-01-12T14:30:00Z",
  },
];

// Mock Audit Trail
export const mockAuditTrail: AuditEntry[] = [
  {
    id: "audit-001",
    timestamp: "2024-01-15T10:30:00Z",
    userId: "user-1",
    action: "LOGIN",
    entityType: "user",
    entityId: "user-1",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "audit-002",
    timestamp: "2024-01-15T10:35:00Z",
    userId: "user-1",
    action: "FILTER_APPLIED",
    entityType: "system",
    entityId: "dashboard",
    oldValue: { filters: {} },
    newValue: { filters: { businessLine: ["Retail Banking"] } },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "audit-003",
    timestamp: "2024-01-15T10:40:00Z",
    userId: "user-1",
    action: "EXPORT_GENERATED",
    entityType: "system",
    entityId: "export-001",
    newValue: { format: "PDF", recordCount: 25 },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
];

// Mock Data Store Class
export class MockDataStore {
  private controls: Control[] = allControls;
  private users: User[] = mockUsers;
  private savedViews: SavedView[] = mockSavedViews;
  private auditTrail: AuditEntry[] = mockAuditTrail;

  // User Management
  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }

  authenticateUser(username: string, password: string): User | null {
    const user = this.getUserByUsername(username);
    if (user && password === "password123") {
      // Mock authentication
      this.addAuditEntry({
        timestamp: new Date().toISOString(),
        userId: user.id,
        action: "LOGIN",
        entityType: "user",
        entityId: user.id,
        ipAddress: "192.168.1.100",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      });
      return user;
    }
    return null;
  }

  // Control Management
  getControls(filters?: FilterConfig): Control[] {
    let filteredControls = [...this.controls];

    if (filters) {
      if (filters.businessLine?.length) {
        filteredControls = filteredControls.filter((control) =>
          filters.businessLine!.includes(control.businessLine)
        );
      }
      if (filters.function?.length) {
        filteredControls = filteredControls.filter((control) =>
          filters.function!.includes(control.function)
        );
      }
      if (filters.effectiveness?.length) {
        filteredControls = filteredControls.filter((control) =>
          filters.effectiveness!.includes(control.effectiveness)
        );
      }
      if (filters.coraMatch?.length) {
        filteredControls = filteredControls.filter((control) =>
          filters.coraMatch!.includes(control.coraMatch)
        );
      }
      if (filters.automationType?.length) {
        filteredControls = filteredControls.filter((control) =>
          filters.automationType!.includes(control.automationType)
        );
      }
      if (filters.owner?.length) {
        filteredControls = filteredControls.filter((control) =>
          filters.owner!.includes(control.owner)
        );
      }
    }

    return filteredControls;
  }

  getControlById(id: string): Control | undefined {
    return this.controls.find((control) => control.id === id);
  }

  updateControl(
    id: string,
    updates: Partial<Control>,
    userId: string
  ): Control | null {
    const controlIndex = this.controls.findIndex(
      (control) => control.id === id
    );
    if (controlIndex === -1) return null;

    const oldControl = { ...this.controls[controlIndex] };
    this.controls[controlIndex] = {
      ...this.controls[controlIndex],
      ...updates,
    };

    this.addAuditEntry({
      timestamp: new Date().toISOString(),
      userId,
      action: "CONTROL_UPDATED",
      entityType: "control",
      entityId: id,
      oldValue: oldControl,
      newValue: this.controls[controlIndex],
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    });

    return this.controls[controlIndex];
  }

  // Saved Views
  getSavedViews(userId: string): SavedView[] {
    return this.savedViews.filter((view) => view.userId === userId);
  }

  saveView(view: Omit<SavedView, "id" | "createdAt">): SavedView {
    const newView: SavedView = {
      ...view,
      id: `view-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.savedViews.push(newView);
    return newView;
  }

  // Audit Trail
  getAuditTrail(entityId?: string, entityType?: string): AuditEntry[] {
    let filteredTrail = [...this.auditTrail];

    if (entityId) {
      filteredTrail = filteredTrail.filter(
        (entry) => entry.entityId === entityId
      );
    }
    if (entityType) {
      filteredTrail = filteredTrail.filter(
        (entry) => entry.entityType === entityType
      );
    }

    return filteredTrail.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  addAuditEntry(entry: Omit<AuditEntry, "id">): AuditEntry {
    const newEntry: AuditEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    this.auditTrail.push(newEntry);
    return newEntry;
  }

  // Analytics and Reporting
  getDashboardMetrics(filters?: FilterConfig) {
    const controls = this.getControls(filters);

    return {
      totalControls: controls.length,
      coraMatch: {
        matched: controls.filter((c) => c.coraMatch === "Matched").length,
        unmatched: controls.filter((c) => c.coraMatch === "Unmatched").length,
        gap: controls.filter((c) => c.coraMatch === "Gap").length,
        resolved: controls.filter((c) => c.coraMatch === "Resolved").length,
      },
      effectiveness: {
        effective: controls.filter((c) => c.effectiveness === "Effective")
          .length,
        ineffective: controls.filter((c) => c.effectiveness === "Ineffective")
          .length,
        needsImprovement: controls.filter(
          (c) => c.effectiveness === "Needs Improvement"
        ).length,
        notRated: controls.filter((c) => c.effectiveness === "Not Yet Rated")
          .length,
      },
      automation: {
        manual: controls.filter((c) => c.automationType === "Manual").length,
        semiAutomated: controls.filter(
          (c) => c.automationType === "Semi-Automated"
        ).length,
        itDependent: controls.filter((c) => c.automationType === "IT Dependent")
          .length,
        automated: controls.filter((c) => c.automationType === "Automated")
          .length,
      },
    };
  }

  // Export functionality
  exportControls(filters: FilterConfig, config: ExportConfig): string {
    const controls = this.getControls(filters);
    const timestamp = new Date().toISOString();

    this.addAuditEntry({
      timestamp,
      userId: "current-user", // Would be actual user ID
      action: "EXPORT_GENERATED",
      entityType: "system",
      entityId: `export-${timestamp}`,
      newValue: { format: config.format, recordCount: controls.length },
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    });

    return `export-${timestamp}.${config.format.toLowerCase()}`;
  }
}

// Create singleton instance
export const mockDataStore = new MockDataStore();
