export interface Control {
  id: string;
  code: string;
  name: string;
  description: string;
  owner: string;
  keyIndicators: "Gap" | "Needs Improvement" | "Manual";
  rewrite: "Generated" | "Not Started" | "Approved" | "Rejected";
  assignedTo: string;
  status:
    | "In review"
    | "Pending"
    | "Outstanding"
    | "Completed"
    | "On Hold"
    | "Blocked"
    | "Open";
  update: string;
  effectiveness:
    | "Effective"
    | "Ineffective"
    | "Needs Improvement"
    | "Not Rated";
  automationType: "Manual" | "Semi-Automated" | "IT Dependent" | "Automated";
  frequency: string;
  controlType: string;
  businessLine: string;
  function: string;
  location: string;
  cortexMatch: "Gap" | "Unmatched" | "Matched" | "Resolved";
  finalScore: number;
}

export const mockControls: Control[] = [
  {
    id: "1",
    code: "CTR-0036",
    name: "Approval Control - Core Banking",
    description:
      "Reconcile deployment changes daily against source of record to prevent...",
    owner: "Nina Petrova",
    keyIndicators: "Gap",
    rewrite: "Not Started",
    assignedTo: "Maya Rodriguez",
    status: "Completed",
    update: "",
    effectiveness: "Effective",
    automationType: "Automated",
    frequency: "Daily",
    controlType: "Preventive",
    businessLine: "Retail Banking",
    function: "Core Banking",
    location: "US",
    cortexMatch: "Gap",
    finalScore: 40,
  },
  {
    id: "2",
    code: "CTR-0037",
    name: "Reconciliation Control - Cloud Infra",
    description:
      "Automate production database backups to minimize manual errors and improve...",
    owner: "Sophia Nguyen",
    keyIndicators: "Needs Improvement",
    rewrite: "Generated",
    assignedTo: "James Allen",
    status: "On Hold",
    update: "",
    effectiveness: "Needs Improvement",
    automationType: "Semi-Automated",
    frequency: "Daily",
    controlType: "Detective",
    businessLine: "Commercial Banking",
    function: "Cloud Infrastructure",
    location: "UK",
    cortexMatch: "Unmatched",
    finalScore: 50,
  },
  {
    id: "3",
    code: "CTR-0038",
    name: "Change Control - Trade Surveillance",
    description:
      "Automate third-party integrations to minimize manual errors and improve...",
    owner: "Amir Khan",
    keyIndicators: "Manual",
    rewrite: "Generated",
    assignedTo: "Maya Rodriguez",
    status: "Blocked",
    update: "",
    effectiveness: "Effective",
    automationType: "IT Dependent",
    frequency: "Real-time",
    controlType: "Detective",
    businessLine: "Investment Banking",
    function: "Trade Surveillance",
    location: "US",
    cortexMatch: "Matched",
    finalScore: 16,
  },
  {
    id: "4",
    code: "CTR-0039",
    name: "Backup & Recovery Control - AML...",
    description:
      "Reconcile ETL jobs daily against source of record to prevent misstatement.",
    owner: "Daniel Rivera",
    keyIndicators: "Gap",
    rewrite: "Approved",
    assignedTo: "Maya Rodriguez",
    status: "Open",
    update: "",
    effectiveness: "Ineffective",
    automationType: "Manual",
    frequency: "Daily",
    controlType: "Preventive",
    businessLine: "Retail Banking",
    function: "AML Compliance",
    location: "EU",
    cortexMatch: "Gap",
    finalScore: 10,
  },
  {
    id: "5",
    code: "CTR-0040",
    name: "Backup & Recovery Control - Data...",
    description:
      "Monitor ETL jobs monthly and escalate exceptions within 24 hours.",
    owner: "Maya Rodriguez",
    keyIndicators: "Needs Improvement",
    rewrite: "Rejected",
    assignedTo: "Grace Thompson",
    status: "On Hold",
    update: "",
    effectiveness: "Needs Improvement",
    automationType: "Semi-Automated",
    frequency: "Monthly",
    controlType: "Detective",
    businessLine: "Commercial Banking",
    function: "Data Management",
    location: "UK",
    cortexMatch: "Unmatched",
    finalScore: 10,
  },
  {
    id: "6",
    code: "CTR-0041",
    name: "Backup & Recovery Control - Ledger...",
    description:
      "Validate deployment changes monthly to ensure operational integrity.",
    owner: "Priya Mehta",
    keyIndicators: "Manual",
    rewrite: "Generated",
    assignedTo: "Travis Barker",
    status: "Open",
    update: "",
    effectiveness: "Effective",
    automationType: "Automated",
    frequency: "Monthly",
    controlType: "Preventive",
    businessLine: "Investment Banking",
    function: "Ledger Management",
    location: "US",
    cortexMatch: "Matched",
    finalScore: 4,
  },
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `${i + 7}`,
    code: `CTL${(i + 5).toString().padStart(3, "0")}`,
    name: `Control ${i + 7}`,
    description: `Sample control description for control ${i + 7}`,
    owner: ["Julie Smith", "Mike Johnson", "David Lee", "Sarah Wilson"][i % 4],
    keyIndicators: ["Gap", "Needs Improvement", "Manual"][i % 3] as
      | "Gap"
      | "Needs Improvement"
      | "Manual",
    rewrite: ["Generated", "Not Started"][i % 2] as "Generated" | "Not Started",
    assignedTo:
      i % 2 === 0 ? `User ${i + 7} ${new Date().getDate()} Aug 25` : "Pending",
    status: ["In review", "Outstanding", "Pending"][i % 3] as
      | "In review"
      | "Outstanding"
      | "Pending",
    update: "",
    effectiveness: [
      "Effective",
      "Ineffective",
      "Needs Improvement",
      "Not Rated",
    ][i % 4] as "Effective" | "Ineffective" | "Needs Improvement" | "Not Rated",
    automationType: ["Manual", "Semi-Automated", "IT Dependent", "Automated"][
      i % 4
    ] as "Manual" | "Semi-Automated" | "IT Dependent" | "Automated",
    frequency: ["Daily", "Weekly", "Monthly", "Quarterly"][i % 4],
    controlType: ["Preventive", "Detective", "Corrective"][i % 3],
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
    cortexMatch: ["Gap", "Unmatched", "Matched", "Resolved"][i % 4] as
      | "Gap"
      | "Unmatched"
      | "Matched"
      | "Resolved",
    finalScore: (i + 7) * 3 + 10,
  })),
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
