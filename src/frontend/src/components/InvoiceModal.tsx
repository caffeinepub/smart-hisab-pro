import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Printer, X } from "lucide-react";

interface Transaction {
  date: string;
  type: string;
  customer: number;
  amount: number;
}

interface CustomerReport {
  income: number;
  expense: number;
  due: number;
  paid: number;
  profit: number;
}

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  customer: { name: string; phone: string; address: string } | null;
  customerIndex: number;
  transactions: Transaction[];
  report: CustomerReport | null;
}

const typeBadgeStyle: Record<string, string> = {
  Income: "background:#d1fae5;color:#065f46;",
  Expense: "background:#fee2e2;color:#991b1b;",
  Due: "background:#fef3c7;color:#92400e;",
  Paid: "background:#dbeafe;color:#1e40af;",
};

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    Income: "আয় / Income",
    Expense: "ব্যয় / Expense",
    Due: "বাকি / Due",
    Paid: "পরিশোধ / Paid",
  };
  return labels[type] ?? type;
}

export default function InvoiceModal({
  open,
  onClose,
  customer,
  customerIndex,
  transactions,
  report,
}: InvoiceModalProps) {
  if (!customer || !report) return null;

  const today = new Date();
  const dateStr = today.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dateStrEn = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const yyyymmdd = today.toISOString().slice(0, 10).replace(/-/g, "");
  const invoiceNum = `INV-${yyyymmdd}-${String(customerIndex).padStart(4, "0")}`;

  const netBalance = report.income - report.expense;

  // Customer-specific transactions only
  const custTxns = transactions.filter((t) => t.customer === customerIndex);

  const handlePrint = () => {
    const printArea = document.getElementById("invoice-print-area");
    if (!printArea) return;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invoice - ${customer?.name ?? ""}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            background: #fff;
            color: #111827;
            padding: 20px;
          }
          @media print {
            body { padding: 0; }
            @page { margin: 15mm; size: A4; }
          }
        </style>
      </head>
      <body>
        ${printArea.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold">
              ইনভয়েজ / Invoice — {customer.name}
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handlePrint}
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white border-0"
              >
                <Printer className="h-4 w-4" />
                প্রিন্ট / Print
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                className="gap-1.5"
              >
                <X className="h-3.5 w-3.5" />
                বন্ধ
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            নিচের ইনভয়েজটি প্রিন্ট করুন — সকল ডিভাইসে কাজ করবে / Print the invoice
            below — works on all devices
          </p>
        </DialogHeader>

        {/* Invoice Preview */}
        <div className="px-4 pb-6 pt-4">
          <div
            id="invoice-print-area"
            style={{
              background: "#ffffff",
              color: "#111827",
              fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: "13px",
              lineHeight: "1.6",
              padding: "40px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
            }}
          >
            {/* ── Invoice Header ── */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "28px",
                paddingBottom: "20px",
                borderBottom: "2px solid #1d4ed8",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <img
                  src="/assets/uploads/logo-1.jpg"
                  alt="ভূমি সেবা"
                  style={{
                    height: "60px",
                    width: "60px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
                <div>
                  <h1
                    style={{
                      margin: "0 0 2px",
                      fontSize: "22px",
                      fontWeight: "800",
                      color: "#1d4ed8",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Smart Hisab Pro
                  </h1>
                  <p
                    style={{
                      margin: "0 0 2px",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    ভূমি সেবা
                  </p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#6b7280" }}>
                    Financial Management System
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    display: "inline-block",
                    background: "#1d4ed8",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    marginBottom: "8px",
                  }}
                >
                  INVOICE
                </div>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  {invoiceNum}
                </p>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "11px",
                    color: "#6b7280",
                  }}
                >
                  {dateStr}
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "#6b7280" }}>
                  {dateStrEn}
                </p>
              </div>
            </div>

            {/* ── Bill To ── */}
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                প্রেরক / Bill To
              </p>
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "14px 16px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  {customer.name}
                </p>
                {customer.phone && (
                  <p
                    style={{
                      margin: "0 0 3px",
                      fontSize: "12px",
                      color: "#374151",
                    }}
                  >
                    📞 {customer.phone}
                  </p>
                )}
                {customer.address && (
                  <p style={{ margin: 0, fontSize: "12px", color: "#374151" }}>
                    📍 {customer.address}
                  </p>
                )}
              </div>
            </div>

            {/* ── Transaction Table ── */}
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                লেনদেন বিবরণ / Transaction Details
              </p>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <thead>
                  <tr style={{ background: "#1e40af" }}>
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        color: "#ffffff",
                        fontWeight: "600",
                        fontSize: "11px",
                        borderRadius: "0",
                      }}
                    >
                      #
                    </th>
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        color: "#ffffff",
                        fontWeight: "600",
                        fontSize: "11px",
                      }}
                    >
                      তারিখ / Date
                    </th>
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        color: "#ffffff",
                        fontWeight: "600",
                        fontSize: "11px",
                      }}
                    >
                      ধরন / Type
                    </th>
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        color: "#ffffff",
                        fontWeight: "600",
                        fontSize: "11px",
                      }}
                    >
                      পরিমাণ / Amount (৳)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {custTxns.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          padding: "16px",
                          textAlign: "center",
                          color: "#6b7280",
                          fontSize: "12px",
                        }}
                      >
                        কোনো লেনদেন নেই / No transactions
                      </td>
                    </tr>
                  ) : (
                    custTxns.map((t, idx) => (
                      <tr
                        key={`${t.date}-${t.type}-${t.amount}-${idx}`}
                        style={{
                          background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                          borderBottom: "1px solid #f3f4f6",
                        }}
                      >
                        <td
                          style={{
                            padding: "9px 12px",
                            color: "#6b7280",
                            fontSize: "11px",
                          }}
                        >
                          {idx + 1}
                        </td>
                        <td
                          style={{
                            padding: "9px 12px",
                            color: "#374151",
                            fontFamily: "monospace",
                          }}
                        >
                          {t.date}
                        </td>
                        <td style={{ padding: "9px 12px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "10px",
                              fontWeight: "700",
                              ...(typeBadgeStyle[t.type]
                                ? Object.fromEntries(
                                    typeBadgeStyle[t.type]
                                      .split(";")
                                      .filter(Boolean)
                                      .map((s) =>
                                        s.split(":").map((v) => v.trim()),
                                      ),
                                  )
                                : {}),
                            }}
                          >
                            {getTypeLabel(t.type)}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "9px 12px",
                            textAlign: "right",
                            fontWeight: "600",
                            color: "#111827",
                            fontFamily: "monospace",
                            fontSize: "13px",
                          }}
                        >
                          {t.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Summary Box ── */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "280px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <div style={{ background: "#1e3a8a", padding: "10px 16px" }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#ffffff",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                    }}
                  >
                    সারসংক্ষেপ / Summary
                  </p>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  <SummaryRow
                    label="মোট আয় / Income"
                    value={report.income}
                    color="#065f46"
                  />
                  <SummaryRow
                    label="মোট ব্যয় / Expense"
                    value={report.expense}
                    color="#991b1b"
                  />
                  <SummaryRow
                    label="বাকি / Due"
                    value={report.due}
                    color="#92400e"
                  />
                  <SummaryRow
                    label="পরিশোধ / Paid"
                    value={report.paid}
                    color="#1e40af"
                  />
                  <div
                    style={{
                      height: "1px",
                      background: "#cbd5e1",
                      margin: "8px 0",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                      background: netBalance >= 0 ? "#d1fae5" : "#fee2e2",
                      margin: "-4px -0px",
                      borderRadius: "4px",
                      paddingLeft: "8px",
                      paddingRight: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: netBalance >= 0 ? "#065f46" : "#991b1b",
                      }}
                    >
                      নেট ব্যালেন্স / Net Balance
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "800",
                        color: netBalance >= 0 ? "#065f46" : "#991b1b",
                        fontFamily: "monospace",
                      }}
                    >
                      {netBalance >= 0 ? "+" : ""}
                      {netBalance.toLocaleString()} ৳
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <div
              style={{
                borderTop: "1px solid #e5e7eb",
                paddingTop: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  ধন্যবাদ! / Thank you for your business
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>
                  Smart Hisab Pro · ভূমি সেবা Financial Tracker
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "10px",
                    color: "#9ca3af",
                  }}
                >
                  মুদ্রণের তারিখ / Printed
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "10px",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  {dateStrEn}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-muted/30">
          <p className="text-xs text-muted-foreground">
            <Download className="h-3 w-3 inline mr-1" />
            প্রিন্ট করলে PDF হিসেবে সেভ করা যাবে / Use "Save as PDF" in print dialog
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onClose}>
              বন্ধ করুন / Close
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              <Printer className="h-4 w-4" />
              প্রিন্ট / Print PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper row for summary table
function SummaryRow({
  label,
  value,
  color,
}: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 0",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <span style={{ fontSize: "12px", color: "#374151" }}>{label}</span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: "700",
          color,
          fontFamily: "monospace",
        }}
      >
        {value.toLocaleString()} ৳
      </span>
    </div>
  );
}
