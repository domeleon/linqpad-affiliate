export interface Impression { Date: string; Country: string; Impressions: number }
export interface Sale { Date: string; Country: string; Product: string; SaleValue: number; Commission: number; PaymentNumber: number | null }
export interface Payout { Date: string; PaymentNumber: number; Amount: number; SuccessfullyProcessed: boolean; PaymentMessage: string }

export interface AffiliateData {
  AffiliateMessage: string
  Impressions: Impression[]
  Sales: Sale[]
  Payouts: Payout[]
} 