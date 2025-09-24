import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { Control, FilterConfig, ExportConfig } from "./mockDataStore";

export interface ExportData {
  controls: Control[];
  filters: FilterConfig;
  exportConfig: ExportConfig;
  dashboardMetrics?: any;
  auditTrail?: any[];
}

export class ExportManager {
  static async exportToPDF(data: ExportData): Promise<void> {
    const { controls, filters, exportConfig, dashboardMetrics } = data;
    const doc = new jsPDF({
      orientation: exportConfig.orientation,
      unit: "mm",
      format: exportConfig.orientation === "landscape" ? "a4" : "a4",
    });

    // Add title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("CORA Dashboard Export", 20, 20);

    // Add export info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`Total Controls: ${controls.length}`, 20, 35);

    // Initialize yPos for content positioning
    let yPos = 45;

    // Add filters info
    if (Object.values(filters).some((filter) => filter.length > 0)) {
      doc.text("Applied Filters:", 20, yPos);
      yPos += 10;
      Object.entries(filters).forEach(([key, value]) => {
        if (value.length > 0) {
          doc.text(`• ${key}: ${value.join(", ")}`, 25, yPos);
          yPos += 5;
        }
      });
    }

    // Add dashboard metrics if available
    if (dashboardMetrics && exportConfig.includeCharts) {
      doc.text("Dashboard Metrics:", 20, yPos + 10);
      yPos += 25;

      // CORA Match Status
      doc.text("CORA Match Status:", 20, yPos);
      yPos += 5;
      doc.text(`• Gaps: ${dashboardMetrics.cortexMatch.gap}`, 25, yPos);
      yPos += 5;
      doc.text(
        `• Unmatched: ${dashboardMetrics.cortexMatch.unmatched}`,
        25,
        yPos
      );
      yPos += 5;
      doc.text(`• Matched: ${dashboardMetrics.cortexMatch.matched}`, 25, yPos);
      yPos += 5;
      doc.text(
        `• Resolved: ${dashboardMetrics.cortexMatch.resolved}`,
        25,
        yPos
      );
      yPos += 10;

      // Control Effectiveness
      doc.text("Control Effectiveness:", 20, yPos);
      yPos += 5;
      doc.text(
        `• Ineffective: ${dashboardMetrics.effectiveness.ineffective}`,
        25,
        yPos
      );
      yPos += 5;
      doc.text(
        `• Needs Improvement: ${dashboardMetrics.effectiveness.needsImprovement}`,
        25,
        yPos
      );
      yPos += 5;
      doc.text(
        `• Not Rated: ${dashboardMetrics.effectiveness.notRated}`,
        25,
        yPos
      );
      yPos += 5;
      doc.text(
        `• Effective: ${dashboardMetrics.effectiveness.effective}`,
        25,
        yPos
      );
      yPos += 10;

      // Control Automation
      doc.text("Control Automation:", 20, yPos);
      yPos += 5;
      doc.text(`• Manual: ${dashboardMetrics.automation.manual}`, 25, yPos);
      yPos += 5;
      doc.text(
        `• Semi-Automated: ${dashboardMetrics.automation.semiAutomated}`,
        25,
        yPos
      );
      yPos += 5;
      doc.text(
        `• IT Dependent: ${dashboardMetrics.automation.itDependent}`,
        25,
        yPos
      );
      yPos += 5;
      doc.text(
        `• Automated: ${dashboardMetrics.automation.automated}`,
        25,
        yPos
      );
      yPos += 15;
    }

    // Add controls table
    if (controls.length > 0) {
      const tableData = controls.map((control) => [
        control.code,
        control.name,
        control.description?.substring(0, 50) +
          (control.description?.length > 50 ? "..." : ""),
        control.owner,
        control.cortexMatch,
        control.effectiveness,
        control.automationType,
        control.finalScore?.toString() || "N/A",
        control.status,
      ]);

      autoTable(doc, {
        head: [
          [
            "Control ID",
            "Name",
            "Description",
            "Owner",
            "CORA Match",
            "Effectiveness",
            "Automation",
            "Final Score",
            "Status",
          ],
        ],
        body: tableData,
        startY: yPos,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [41, 112, 249], // CORA blue
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: 20, right: 20 },
      });
    }

    // Add audit trail if requested
    if (
      data.auditTrail &&
      exportConfig.includeAuditTrail &&
      data.auditTrail.length > 0
    ) {
      const finalY = (doc as any).lastAutoTable.finalY || 100;
      doc.addPage();

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Audit Trail", 20, 20);

      const auditData = data.auditTrail.map((entry) => [
        new Date(entry.timestamp).toLocaleString(),
        entry.userId,
        entry.action,
        entry.entityType,
        entry.entityId,
        entry.reason || "",
      ]);

      autoTable(doc, {
        head: [
          [
            "Timestamp",
            "User",
            "Action",
            "Entity Type",
            "Entity ID",
            "Details",
          ],
        ],
        body: auditData,
        startY: 30,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [220, 38, 38], // Red
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: 20, right: 20 },
      });
    }

    // Save the PDF
    const fileName = `cortex-dashboard-export-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  }

  static exportToExcel(data: ExportData): void {
    const { controls, filters, dashboardMetrics, auditTrail } = data;
    const workbook = XLSX.utils.book_new();

    // Controls sheet
    if (controls.length > 0) {
      const controlsData = controls.map((control) => ({
        "Control ID": control.code,
        "Control Name": control.name,
        Description: control.description,
        Owner: control.owner,
        "CORA Match": control.cortexMatch,
        Effectiveness: control.effectiveness,
        "Automation Type": control.automationType,
        "Final Score": control.finalScore,
        Status: control.status,
        "Assigned To": control.assignedTo,
        "Created Date": control.createdDate,
        "Last Updated": control.lastUpdated,
        "Risk ID": control.riskId,
      }));

      const controlsSheet = XLSX.utils.json_to_sheet(controlsData);
      XLSX.utils.book_append_sheet(workbook, controlsSheet, "Controls");
    }

    // Dashboard Metrics sheet
    if (dashboardMetrics) {
      const metricsData = [
        {
          Metric: "CORA Match - Gaps",
          Value: dashboardMetrics.cortexMatch.gap,
        },
        {
          Metric: "CORA Match - Unmatched",
          Value: dashboardMetrics.cortexMatch.unmatched,
        },
        {
          Metric: "CORA Match - Matched",
          Value: dashboardMetrics.cortexMatch.matched,
        },
        {
          Metric: "CORA Match - Resolved",
          Value: dashboardMetrics.cortexMatch.resolved,
        },
        {
          Metric: "Effectiveness - Ineffective",
          Value: dashboardMetrics.effectiveness.ineffective,
        },
        {
          Metric: "Effectiveness - Needs Improvement",
          Value: dashboardMetrics.effectiveness.needsImprovement,
        },
        {
          Metric: "Effectiveness - Not Rated",
          Value: dashboardMetrics.effectiveness.notRated,
        },
        {
          Metric: "Effectiveness - Effective",
          Value: dashboardMetrics.effectiveness.effective,
        },
        {
          Metric: "Automation - Manual",
          Value: dashboardMetrics.automation.manual,
        },
        {
          Metric: "Automation - Semi-Automated",
          Value: dashboardMetrics.automation.semiAutomated,
        },
        {
          Metric: "Automation - IT Dependent",
          Value: dashboardMetrics.automation.itDependent,
        },
        {
          Metric: "Automation - Automated",
          Value: dashboardMetrics.automation.automated,
        },
      ];

      const metricsSheet = XLSX.utils.json_to_sheet(metricsData);
      XLSX.utils.book_append_sheet(workbook, metricsSheet, "Dashboard Metrics");
    }

    // Filters sheet
    const filtersData = Object.entries(filters).map(([key, value]) => ({
      Filter: key,
      Applied: value.length > 0 ? value.join(", ") : "None",
    }));

    const filtersSheet = XLSX.utils.json_to_sheet(filtersData);
    XLSX.utils.book_append_sheet(workbook, filtersSheet, "Applied Filters");

    // Audit Trail sheet
    if (auditTrail && auditTrail.length > 0) {
      const auditData = auditTrail.map((entry) => ({
        Timestamp: new Date(entry.timestamp).toLocaleString(),
        "User ID": entry.userId,
        Action: entry.action,
        "Entity Type": entry.entityType,
        "Entity ID": entry.entityId,
        Reason: entry.reason || "",
      }));

      const auditSheet = XLSX.utils.json_to_sheet(auditData);
      XLSX.utils.book_append_sheet(workbook, auditSheet, "Audit Trail");
    }

    // Save the Excel file
    const fileName = `cortex-dashboard-export-${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  static exportToCSV(data: ExportData): void {
    const { controls } = data;

    if (controls.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Control ID",
      "Control Name",
      "Description",
      "Owner",
      "CORA Match",
      "Effectiveness",
      "Automation Type",
      "Final Score",
      "Status",
      "Assigned To",
      "Created Date",
      "Last Updated",
      "Risk ID",
    ];

    const csvContent = [
      headers.join(","),
      ...controls.map((control) =>
        [
          `"${control.code}"`,
          `"${control.name}"`,
          `"${control.description?.replace(/"/g, '""') || ""}"`,
          `"${control.owner}"`,
          `"${control.cortexMatch}"`,
          `"${control.effectiveness}"`,
          `"${control.automationType}"`,
          control.finalScore?.toString() || "N/A",
          `"${control.status}"`,
          `"${control.assignedTo}"`,
          `"${control.createdDate}"`,
          `"${control.lastUpdated}"`,
          `"${control.riskId}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const fileName = `cortex-dashboard-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    saveAs(blob, fileName);
  }

  static async exportToPowerPoint(data: ExportData): Promise<void> {
    // For PowerPoint, we'll create a simple HTML representation and convert to PDF
    // In a real application, you might use a library like PptxGenJS

    const html = `
      <html>
        <head>
          <title>CORA Dashboard Export</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { color: #2970f9; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #333; font-size: 18px; margin-bottom: 10px; }
            .metric { display: flex; justify-content: space-between; margin: 5px 0; }
            .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .table th { background-color: #2970f9; color: white; }
            .table tr:nth-child(even) { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">CORA Dashboard Export</div>
          <div class="section">
            <h2>Export Information</h2>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Controls:</strong> ${data.controls.length}</p>
          </div>
          ${
            data.dashboardMetrics
              ? `
            <div class="section">
              <h2>Dashboard Metrics</h2>
              <div class="metric"><span>CORA Match - Gaps:</span><span>${data.dashboardMetrics.cortexMatch.gap}</span></div>
              <div class="metric"><span>CORA Match - Unmatched:</span><span>${data.dashboardMetrics.cortexMatch.unmatched}</span></div>
              <div class="metric"><span>CORA Match - Matched:</span><span>${data.dashboardMetrics.cortexMatch.matched}</span></div>
              <div class="metric"><span>CORA Match - Resolved:</span><span>${data.dashboardMetrics.cortexMatch.resolved}</span></div>
            </div>
          `
              : ""
          }
          <div class="section">
            <h2>Controls Data</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Control ID</th>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Final Score</th>
                </tr>
              </thead>
              <tbody>
                ${data.controls
                  .slice(0, 50)
                  .map(
                    (control) => `
                  <tr>
                    <td>${control.code}</td>
                    <td>${control.name}</td>
                    <td>${control.owner}</td>
                    <td>${control.status}</td>
                    <td>${control.finalScore || "N/A"}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
            ${
              data.controls.length > 50
                ? `<p><em>Showing first 50 of ${data.controls.length} controls</em></p>`
                : ""
            }
          </div>
        </body>
      </html>
    `;

    // Create a temporary PDF (simulating PowerPoint export)
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("CORA Dashboard Export", 20, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`Total Controls: ${data.controls.length}`, 20, 35);

    // Add summary table
    const summaryData = [
      ["Metric", "Value"],
      ["Total Controls", data.controls.length.toString()],
      [
        "CORA Match - Gaps",
        data.dashboardMetrics?.cortexMatch.gap.toString() || "N/A",
      ],
      [
        "CORA Match - Unmatched",
        data.dashboardMetrics?.cortexMatch.unmatched.toString() || "N/A",
      ],
      [
        "CORA Match - Matched",
        data.dashboardMetrics?.cortexMatch.matched.toString() || "N/A",
      ],
      [
        "CORA Match - Resolved",
        data.dashboardMetrics?.cortexMatch.resolved.toString() || "N/A",
      ],
    ];

    autoTable(doc, {
      head: [summaryData[0]],
      body: summaryData.slice(1),
      startY: 50,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 112, 249],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    const fileName = `cortex-dashboard-export-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  }

  static async exportData(data: ExportData): Promise<void> {
    const { exportConfig } = data;

    try {
      switch (exportConfig.format) {
        case "PDF":
          await this.exportToPDF(data);
          break;
        case "XLS":
          this.exportToExcel(data);
          break;
        case "CSV":
          this.exportToCSV(data);
          break;
        case "PPT":
          await this.exportToPowerPoint(data);
          break;
        default:
          throw new Error(`Unsupported export format: ${exportConfig.format}`);
      }
    } catch (error) {
      console.error("Export failed:", error);
      throw new Error(
        `Export failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
