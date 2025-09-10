import { useState } from "react";
import { toast } from "sonner";

interface UseStripePaymentOptions {
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

export function useStripePayment(options: UseStripePaymentOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  const createPaymentIntent = async (
    amount: number,
    metadata: Record<string, string> = {}
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "usd",
          metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment intent");
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      return data;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to initialize payment";
      toast.error(errorMessage);
      options.onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setClientSecret(null);
    setPaymentIntentId(null);
    setLoading(false);
  };

  return {
    loading,
    clientSecret,
    paymentIntentId,
    createPaymentIntent,
    reset,
  };
}
