export type InvoiceRow = {
  id: string;
  publicToken: string;
  gatewayType: string;
  gatewayLabel: string;
  amount: number;
  currency: string;
  description: string | null;
  customerEmail: string;
  customerName: string | null;
  status: string;
  paidAt: string | null;
  paymentDetails: unknown;
  confirmationEmailSentAt: string | null;
  createdAt: string;
  shareUrl: string;
  checkoutUrl: string | null;
  zelleTransactionId: string | null;
  zelleProofUrl: string | null;
  zelleSubmittedAt: string | null;
};

export function invoiceStatusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "paid") return "badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2";
  if (s === "pending") return "badge rounded-pill bg-warning bg-opacity-10 text-warning-emphasis border border-warning border-opacity-25 px-3 py-2";
  return "badge rounded-pill bg-secondary bg-opacity-10 text-secondary px-3 py-2";
}
