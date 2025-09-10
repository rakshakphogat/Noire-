export interface StripePaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}
