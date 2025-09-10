import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CreditCard,
  Lock,
  Shield,
  CheckCircle2,
} from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeCheckoutFormProps {
  clientSecret: string;
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
}

function CheckoutForm({
  amount,
  onPaymentSuccess,
  onPaymentError,
}: Omit<StripeCheckoutFormProps, "clientSecret">) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | "info">(
    "error"
  );

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) return;

      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          setMessageType("success");
          onPaymentSuccess(paymentIntent.id);
          break;
        case "processing":
          setMessage("Your payment is processing.");
          setMessageType("info");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          setMessageType("error");
          break;
        default:
          setMessage("Something went wrong.");
          setMessageType("error");
          break;
      }
    });
  }, [stripe, onPaymentSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "Payment failed");
        setMessageType("error");
        onPaymentError(error.message || "Payment failed");
      } else {
        setMessage("An unexpected error occurred.");
        setMessageType("error");
        onPaymentError("An unexpected error occurred.");
      }
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment successful!");
      setMessageType("success");
      onPaymentSuccess(paymentIntent.id);
    }
    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs" as const,
  };

  const getMessageStyles = () => {
    switch (messageType) {
      case "success":
        return "bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200/50 dark:border-green-700/50 text-green-700 dark:text-green-300";
      case "info":
        return "bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300";
      default:
        return "bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/30 dark:to-pink-900/30 border-red-200/50 dark:border-red-700/50 text-red-700 dark:text-red-300";
    }
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case "success":
        return CheckCircle2;
      case "info":
        return Shield;
      default:
        return AlertCircle;
    }
  };

  const MessageIcon = getMessageIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden py-8 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-4">
            Complete Payment
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6" />
          <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            ${(amount / 100).toFixed(2)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Details Card */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mr-4 group-hover:rotate-6 transition-transform duration-300">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Secure Payment Details
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your information is protected with SSL encryption
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/40 rounded-2xl p-6">
              <PaymentElement options={paymentElementOptions} />
            </div>
          </div>

          {/* Security Features */}
          <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-green-600 mr-2" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center">
                <Lock className="w-4 h-4 text-green-600 mr-2" />
                <span>256-bit Encryption</span>
              </div>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`backdrop-blur-sm border rounded-2xl p-4 shadow-lg ${getMessageStyles()}`}
            >
              <div className="flex items-start">
                <MessageIcon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{message}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            disabled={isLoading || !stripe || !elements}
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 rounded-2xl font-semibold text-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                <span>Processing Payment...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CreditCard className="w-6 h-6 mr-3" />
                <span>Pay ${(amount / 100).toFixed(2)}</span>
              </div>
            )}
          </Button>

          {/* Trust Indicators */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Powered by Stripe • Your payment information is secure
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
              <span>🔒 PCI DSS Compliant</span>
              <span>•</span>
              <span>🛡️ SOC 2 Certified</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StripeCheckoutForm(props: StripeCheckoutFormProps) {
  const options = {
    clientSecret: props.clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#8b5cf6",
        colorBackground: "rgba(255, 255, 255, 0.8)",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "Inter, system-ui, sans-serif",
        spacingUnit: "6px",
        borderRadius: "16px",
        focusBoxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
        colorInputBackground: "rgba(255, 255, 255, 0.9)",
        colorInputBorder: "rgba(139, 92, 246, 0.2)",
      },
      rules: {
        ".Input": {
          border: "1px solid rgba(139, 92, 246, 0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
        },
        ".Input:focus": {
          border: "1px solid rgba(139, 92, 246, 0.5)",
          boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
        },
        ".Tab": {
          border: "1px solid rgba(139, 92, 246, 0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
        },
        ".Tab--selected": {
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
        },
      },
    },
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm
        amount={props.amount}
        onPaymentSuccess={props.onPaymentSuccess}
        onPaymentError={props.onPaymentError}
      />
    </Elements>
  );
}
