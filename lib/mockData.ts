export interface Control {
  id: string;
  code: string;
  name: string;
  description: string;
  owner: string;

  // Parent/Child Relationship
  hierarchyLevel: "Parent" | "Child";
  parentControlId?: string;
  childControlIds?: string[];

  // Status and Classifications
  status: "Not Started" | "In review" | "Completed";
  controlStatus: "Live" | "Retired" | "Demised";

  // Control Characteristics
  effectiveness:
    | "Effective"
    | "Ineffective"
    | "Needs Improvement"
    | "Not Rated";
  automationType: "Manual" | "Semi-Automated" | "IT Dependent" | "Automated";
  controlMethod: "Preventive" | "Detective" | "Predictive";
  controlType: "Prevent" | "Detect";
  frequency: string;

  // Business Context
  businessLine: string;
  function: string;
  location: string;

  // Risk Mapping
  linkedRisks: {
    riskId: string;
    riskName: string;
    riskCategory: "Business" | "Regulatory" | "IT" | "Operational";
  }[];

  // CORA Generated Data
  keyIndicators: "Gap" | "Needs Improvement" | "Manual";
  cortexMatch: "Gap" | "Unmatched" | "Matched" | "Resolved";
  finalScore: number;
  coraIndex: number;

  // Enhancement Workflow
  rewrite: "Generated" | "Not Started" | "Approved" | "Rejected";
  assignedTo: string;
  enhancementStatus: "Not Started" | "In Progress" | "Complete";
  enhancementRecommendation?: string;
  targetDate?: string;
  rootCause?: string;
  comments?: string;

  // Audit Trail
  lastUpdated: string;
  version: string;

  // Legacy fields for compatibility
  update: string;
}

export const mockControls: Control[] = [
  {
    id: "1",
    code: "CTR-0036",
    name: "Payment Authorization Control - Parent",
    description:
      "Master control for payment authorization across all channels ensuring dual approval for transactions above threshold limits.",
    owner: "Nina Petrova",

    // Parent/Child Relationship
    hierarchyLevel: "Parent",
    childControlIds: ["2", "3", "4"],

    // Status and Classifications
    status: "Not Started",
    controlStatus: "Live",

    // Control Characteristics
    effectiveness: "Effective",
    automationType: "Automated",
    controlMethod: "Preventive",
    controlType: "Prevent",
    frequency: "Real-time",

    // Business Context
    businessLine: "Retail Banking",
    function: "Payment Processing",
    location: "US",

    // Risk Mapping
    linkedRisks: [
      {
        riskId: "RSK-001",
        riskName: "Unauthorized Payment Risk",
        riskCategory: "Operational",
      },
      {
        riskId: "RSK-002",
        riskName: "Regulatory Compliance Risk",
        riskCategory: "Regulatory",
      },
    ],

    // CORA Generated Data
    keyIndicators: "Gap",
    cortexMatch: "Gap",
    finalScore: 85,
    coraIndex: 8.5,

    // Enhancement Workflow
    rewrite: "Not Started",
    assignedTo: "Maya Rodriguez",
    enhancementStatus: "Not Started",
    enhancementRecommendation:
      "Implement additional validation for high-value transactions",
    targetDate: "2024-06-30",
    comments: "Priority control for regulatory compliance",

    // Audit Trail
    lastUpdated: "2024-01-15",
    version: "2.1",

    // Legacy fields
    update: "",
  },
  {
    id: "2",
    code: "CTR-0037",
    name: "Online Banking Payment Authorization - Child",
    description:
      "Specific control for online banking channel payment authorization implementing dual approval workflow for transactions exceeding $10,000.",
    owner: "Sophia Nguyen",

    // Parent/Child Relationship
    hierarchyLevel: "Child",
    parentControlId: "1",

    // Status and Classifications
    status: "Not Started",
    controlStatus: "Live",

    // Control Characteristics
    effectiveness: "Needs Improvement",
    automationType: "Semi-Automated",
    controlMethod: "Preventive",
    controlType: "Prevent",
    frequency: "Real-time",

    // Business Context
    businessLine: "Retail Banking",
    function: "Digital Banking",
    location: "US",

    // Risk Mapping
    linkedRisks: [
      {
        riskId: "RSK-001",
        riskName: "Unauthorized Payment Risk",
        riskCategory: "Operational",
      },
      {
        riskId: "RSK-003",
        riskName: "Digital Channel Fraud Risk",
        riskCategory: "IT",
      },
    ],

    // CORA Generated Data
    keyIndicators: "Needs Improvement",
    cortexMatch: "Unmatched",
    finalScore: 72,
    coraIndex: 7.2,

    // Enhancement Workflow
    rewrite: "Generated",
    assignedTo: "James Allen",
    enhancementStatus: "In Progress",
    enhancementRecommendation: "Upgrade to real-time fraud detection system",
    targetDate: "2024-04-30",
    comments: "Requires integration with new fraud detection API",

    // Audit Trail
    lastUpdated: "2024-01-20",
    version: "1.8",

    // Legacy fields
    update: "",
  },
  {
    id: "3",
    code: "CTR-0038",
    name: "Wire Transfer Payment Authorization - Child",
    description:
      "Specialized control for wire transfer authorization requiring additional compliance checks and senior management approval for international transfers exceeding $50,000.",
    owner: "Amir Khan",

    // Parent/Child Relationship
    hierarchyLevel: "Child",
    parentControlId: "1",

    // Status and Classifications
    status: "Not Started",
    controlStatus: "Live",

    // Control Characteristics
    effectiveness: "Effective",
    automationType: "IT Dependent",
    controlMethod: "Preventive",
    controlType: "Prevent",
    frequency: "Real-time",

    // Business Context
    businessLine: "Commercial Banking",
    function: "Wire Transfer Operations",
    location: "US",

    // Risk Mapping
    linkedRisks: [
      {
        riskId: "RSK-001",
        riskName: "Unauthorized Payment Risk",
        riskCategory: "Operational",
      },
      {
        riskId: "RSK-004",
        riskName: "AML/BSA Compliance Risk",
        riskCategory: "Regulatory",
      },
      {
        riskId: "RSK-005",
        riskName: "International Transfer Risk",
        riskCategory: "Business",
      },
    ],

    // CORA Generated Data
    keyIndicators: "Manual",
    cortexMatch: "Matched",
    finalScore: 88,
    coraIndex: 8.8,

    // Enhancement Workflow
    rewrite: "Generated",
    assignedTo: "Maya Rodriguez",
    enhancementStatus: "Complete",
    enhancementRecommendation: "Implement automated OFAC screening",
    targetDate: "2024-03-15",
    comments: "Enhanced with real-time sanctions screening",

    // Audit Trail
    lastUpdated: "2024-01-25",
    version: "3.2",

    // Legacy fields
    update: "",
  },
  {
    id: "4",
    code: "CTR-0039",
    name: "Mobile Banking Payment Authorization - Child",
    description:
      "Mobile application specific payment control implementing biometric authentication and device binding for transactions above $5,000.",
    owner: "Daniel Rivera",

    // Parent/Child Relationship
    hierarchyLevel: "Child",
    parentControlId: "1",

    // Status and Classifications
    status: "Not Started",
    controlStatus: "Live",

    // Control Characteristics
    effectiveness: "Ineffective",
    automationType: "Manual",
    controlMethod: "Preventive",
    controlType: "Prevent",
    frequency: "Real-time",

    // Business Context
    businessLine: "Retail Banking",
    function: "Mobile Banking",
    location: "US",

    // Risk Mapping
    linkedRisks: [
      {
        riskId: "RSK-001",
        riskName: "Unauthorized Payment Risk",
        riskCategory: "Operational",
      },
      {
        riskId: "RSK-006",
        riskName: "Mobile Device Security Risk",
        riskCategory: "IT",
      },
      {
        riskId: "RSK-007",
        riskName: "Biometric Authentication Risk",
        riskCategory: "IT",
      },
    ],

    // CORA Generated Data
    keyIndicators: "Gap",
    cortexMatch: "Gap",
    finalScore: 65,
    coraIndex: 6.5,

    // Enhancement Workflow
    rewrite: "Approved",
    assignedTo: "Maya Rodriguez",
    enhancementStatus: "Not Started",
    enhancementRecommendation:
      "Upgrade biometric authentication system and implement advanced device fingerprinting",
    targetDate: "2024-08-30",
    comments: "Critical enhancement needed for mobile security compliance",

    // Audit Trail
    lastUpdated: "2024-01-10",
    version: "1.5",

    // Legacy fields
    update: "",
  },
  {
    id: "5",
    code: "CTR-0040",
    name: "Backup & Recovery Control - Data...",
    description:
      "Monitor ETL jobs monthly and escalate exceptions within 24 hours.",
    owner: "Maya Rodriguez",

    // Parent/Child Relationship
    hierarchyLevel: "Child" as "Child",
    parentControlId: "1",

    // Status and Classifications
    status: "Not Started" as "Not Started",
    controlStatus: "Live" as "Live",

    // Control Characteristics
    effectiveness: "Needs Improvement" as "Needs Improvement",
    automationType: "Semi-Automated" as "Semi-Automated",
    controlMethod: "Detective" as "Detective",
    controlType: "Detect" as "Detect",
    frequency: "Monthly",

    // Business Context
    businessLine: "Commercial Banking",
    function: "Data Management",
    location: "UK",

    // Risk Mapping
    linkedRisks: [
      {
        riskId: "RSK-005",
        riskName: "Data Loss Risk",
        riskCategory: "IT" as "IT",
      },
    ],

    // CORA Generated Data
    keyIndicators: "Needs Improvement" as "Needs Improvement",
    cortexMatch: "Unmatched" as "Unmatched",
    finalScore: 10,
    coraIndex: 1.0,

    // Enhancement Workflow
    rewrite: "Rejected" as "Rejected",
    assignedTo: "Grace Thompson",
    enhancementStatus: "Not Started" as "Not Started",
    enhancementRecommendation: "Improve monitoring frequency",
    targetDate: "2024-06-30",
    rootCause: "Insufficient monitoring",
    comments: "Needs better automation",
    lastUpdated: "2024-01-15",
    version: "1.0",

    // Legacy fields
    update: "",
  },
  {
    id: "6",
    code: "CTR-0041",
    name: "Backup & Recovery Control - Ledger...",
    description:
      "Validate deployment changes monthly to ensure operational integrity.",
    owner: "Priya Mehta",

    // Parent/Child Relationship
    hierarchyLevel: "Child" as "Child",
    parentControlId: "1",

    // Status and Classifications
    status: "Not Started" as "Not Started",
    controlStatus: "Live" as "Live",

    // Control Characteristics
    effectiveness: "Effective" as "Effective",
    automationType: "Automated" as "Automated",
    controlMethod: "Preventive" as "Preventive",
    controlType: "Prevent" as "Prevent",
    frequency: "Monthly",

    // Business Context
    businessLine: "Investment Banking",
    function: "Ledger Management",
    location: "US",

    // Risk Mapping
    linkedRisks: [
      {
        riskId: "RSK-006",
        riskName: "Operational Risk",
        riskCategory: "Operational" as "Operational",
      },
    ],

    // CORA Generated Data
    keyIndicators: "Manual" as "Manual",
    cortexMatch: "Matched" as "Matched",
    finalScore: 4,
    coraIndex: 0.4,

    // Enhancement Workflow
    rewrite: "Generated" as "Generated",
    assignedTo: "Travis Barker",
    enhancementStatus: "Not Started" as "Not Started",
    enhancementRecommendation: "Maintain current automation",
    targetDate: "2024-03-31",
    rootCause: "Good automation level",
    comments: "Well automated control",
    lastUpdated: "2024-01-15",
    version: "1.0",

    // Legacy fields
    update: "",
  },
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `${i + 7}`,
    code: `CTL${(i + 5).toString().padStart(3, "0")}`,
    name: `Control ${i + 7}`,
    description: `Sample control description for control ${i + 7}`,
    owner: ["Julie Smith", "Mike Johnson", "David Lee", "Sarah Wilson"][i % 4],

    // Parent/Child Relationship
    hierarchyLevel: (i % 3 === 0 ? "Parent" : "Child") as "Parent" | "Child",
    parentControlId: i % 3 === 0 ? undefined : "1",
    childControlIds: i % 3 === 0 ? ["2", "3"] : undefined,

    // Status and Classifications
    status: "Not Started" as "Not Started",
    controlStatus: "Live" as "Live",

    // Control Characteristics
    effectiveness: [
      "Effective",
      "Ineffective",
      "Needs Improvement",
      "Not Rated",
    ][i % 4] as "Effective" | "Ineffective" | "Needs Improvement" | "Not Rated",
    automationType: ["Manual", "Semi-Automated", "IT Dependent", "Automated"][
      i % 4
    ] as "Manual" | "Semi-Automated" | "IT Dependent" | "Automated",
    controlMethod: ["Preventive", "Detective", "Predictive"][i % 3] as
      | "Preventive"
      | "Detective"
      | "Predictive",
    controlType: ["Prevent", "Detect"][i % 2] as "Prevent" | "Detect",
    frequency: ["Daily", "Weekly", "Monthly", "Quarterly"][i % 4],

    // Business Context
    businessLine: [
      "Retail Banking",
      "Commercial Banking",
      "Investment Banking",
    ][i % 3],
    function: [
      "Customer Onboarding",
      "Risk Management",
      "AML Compliance",
      "Credit Risk",
    ][i % 4],
    location: ["US", "UK", "EU", "APAC"][i % 4],

    // Risk Mapping
    linkedRisks: [
      {
        riskId: `RSK-${i + 7}`,
        riskName: `Sample Risk ${i + 7}`,
        riskCategory: ["Business", "Regulatory", "IT", "Operational"][i % 4] as
          | "Business"
          | "Regulatory"
          | "IT"
          | "Operational",
      },
    ],

    // CORA Generated Data
    keyIndicators: ["Gap", "Needs Improvement", "Manual"][i % 3] as
      | "Gap"
      | "Needs Improvement"
      | "Manual",
    cortexMatch: ["Gap", "Unmatched", "Matched", "Resolved"][i % 4] as
      | "Gap"
      | "Unmatched"
      | "Matched"
      | "Resolved",
    finalScore: (i + 7) * 3 + 10,
    coraIndex: (i + 7) * 0.5,

    // Enhancement Workflow
    rewrite: ["Generated", "Not Started"][i % 2] as "Generated" | "Not Started",
    assignedTo:
      i % 2 === 0 ? `User ${i + 7} ${new Date().getDate()} Aug 25` : "Pending",
    enhancementStatus: "Not Started" as "Not Started",
    enhancementRecommendation: `Sample recommendation for control ${i + 7}`,
    targetDate: "2024-12-31",
    rootCause: "Sample root cause",
    comments: `Sample comments for control ${i + 7}`,
    lastUpdated: "2024-01-15",
    version: "1.0",

    // Legacy fields
    update: "",
  })),
  // Sample control with amber amber red indicators
  {
    id: "amber-sample",
    code: "CTR-0999",
    name: "Sample Control with Amber Amber Red",
    description:
      "Sample control demonstrating amber amber red key indicators for testing",
    owner: "Sample Owner",

    // Parent/Child Relationship
    hierarchyLevel: "Parent" as "Parent",
    childControlIds: [],

    // Status and Classifications
    status: "Not Started" as "Not Started",
    controlStatus: "Live" as "Live",

    // Control Characteristics - These create amber amber red
    effectiveness: "Needs Improvement" as "Needs Improvement", // amber
    automationType: "Manual" as "Manual", // red
    controlMethod: "Detective" as "Detective",
    controlType: "Detect" as "Detect",
    frequency: "Daily",

    // Business Context
    businessLine: "Retail Banking",
    function: "Risk Management",
    location: "US",

    // Risk Mapping
    linkedRisks: [
      {
        riskId: "RSK-999",
        riskName: "Sample Risk",
        riskCategory: "Operational" as "Operational",
      },
    ],

    // CORA Generated Data - This creates the first amber
    keyIndicators: "Needs Improvement" as "Needs Improvement",
    cortexMatch: "Unmatched" as "Unmatched", // amber
    finalScore: 45,
    coraIndex: 4.5,

    // Enhancement Workflow
    rewrite: "Not Started" as "Not Started",
    assignedTo: "Test User",
    enhancementStatus: "Not Started" as "Not Started",
    enhancementRecommendation: "Sample recommendation",
    targetDate: "2024-12-31",
    comments: "Sample control for testing amber amber red indicators",

    // Audit Trail
    lastUpdated: "2024-01-15",
    version: "1.0",

    // Legacy fields
    update: "",
  },
];

export const dashboardMetrics = {
  cortexMatch: {
    gaps: 136,
    unmatched: 125,
    matched: 110,
    resolved: 129,
  },
  effectiveness: {
    ineffective: 149,
    needsImprovement: 117,
    notRated: 107,
    effective: 127,
  },
  automation: {
    manual: 117,
    semiAutomated: 109,
    itDependent: 35,
    automated: 139,
  },
};

export const filterOptions = {
  locations: ["US", "UK", "EU", "APAC"],
  businessLines: [
    "Retail Banking",
    "Commercial Banking",
    "Investment Banking",
    "Private Banking",
  ],
  functions: [
    "Customer Onboarding",
    "Risk Management",
    "AML Compliance",
    "Credit Risk",
    "Operations",
  ],
  controlTypes: ["Preventive", "Detective", "Corrective"],
  controlFrequencies: ["Real-time", "Daily", "Weekly", "Monthly", "Quarterly"],
  statuses: ["Active", "Inactive", "Under Review"],
  owners: [
    "Julie Smith",
    "Mike Johnson",
    "David Lee",
    "Sarah Wilson",
    "John Brown",
  ],
};

export const keyIndicatorRecommendations = [
  {
    id: "1",
    text: "Not a standardized CORA control.",
    checked: false,
    color: "red",
  },
  {
    id: "2",
    text: "The control information should be reviewed for improvement.",
    checked: true,
    color: "orange",
  },
  {
    id: "3",
    text: "This is a manual control.",
    checked: false,
    color: "red",
  },
];

export const keyIndicatorUpdates = [
  {
    id: "1",
    text: "Not a standardized CORA control.",
    checked: false,
    color: "red",
  },
  {
    id: "2",
    text: "The control information should be reviewed for improvement.",
    checked: false,
    color: "green",
  },
  {
    id: "3",
    text: "This is a manual control.",
    checked: false,
    color: "red",
  },
];

export const improvementGeneration = {
  current: {
    title: "Current Control Description",
    content: `Payments need to be checked to confirm accurate. If an error is found in each payment or if a payment is inaccurate, it should be resolved. If there are issues relating to an error in the system, it can be resolved. If something cannot be fixed, escalation is required. This is important so that we do not get misled.

Check check items to the payment statements to confirm if missing or duplicated, it should be checked. If this and it there's if an issue, it should be resolved. If something cannot be fixed, escalation is required.`,
  },
  suggested: {
    title: "Suggested Control Description",
    content: `Objectives:
To detect payment processing errors, fraud, misallocations, operational failures, and regulatory breaches to ensure all payment movements are fully reconciled and discrepancies are resolved or escalated as appropriate.

What:
Review and reconcile all incoming and outgoing payments to identify, investigate, and resolve discrepancies between internal records and external statements.

When:
Reconciliations must be performed daily, with unresolved issues escalated promptly in line with internal escalation protocols.

Who:
Reconciliation is performed by Operations. Outstanding issues are escalated to Finance or relevant Control Owners.

How:
Reconciliation is completed in the central payments ledger and reconciliation tool, referencing both bank statements and internal accounting records.`,
  },
};
