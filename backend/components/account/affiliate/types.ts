export type AffiliateMe = {
  affiliateCode: string;
  shareUrlPath: string;
  balance: number;
  availableAfterPending: number;
  pendingPayoutHold: number;
  commissionPercentGlobal: number;
  analytics: { totalEarned: number; referralOrderCount: number; thisMonthEarned: number };
  earnings: {
    id: string;
    orderId: string;
    amount: number;
    commissionPercent: number;
    orderSubtotal: number;
    createdAt: string;
    orderEmail: string;
  }[];
  payoutRequests: {
    id: string;
    amount: number;
    status: string;
    note: string | null;
    cryptoNetwork: string;
    cryptoAddress: string;
    rejectionReason: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
};
