"use client";

import { useState } from "react";
import {
  Send,
  User,
  Mail,
  MessageCircle,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface QueryFormData {
  query: string;
  customerName: string;
  customerEmail: string;
  category: string;
}

interface QueryResponse {
  id: string;
  query: string;
  response: string;
  category: string;
  timestamp: string;
  status: string;
}

const QUERY_CATEGORIES = [
  { value: "general", Label: "General Inquiry" },
  { value: "product", Label: "Product Information" },
  { value: "order", Label: "Order Status" },
  { value: "shipping", Label: "Shipping & Delivery" },
  { value: "returns", Label: "Returns & Exchanges" },
  { value: "technical", Label: "Technical Support" },
  { value: "billing", Label: "Billing & Payment" },
  { value: "complaint", Label: "Complaint" },
];

export default function CustomerQueryForm() {
  const [formData, setFormData] = useState<QueryFormData>({
    query: "",
    customerName: "",
    customerEmail: "",
    category: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleInputChange = (field: keyof QueryFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.query.trim()) {
      setError("Please enter your query");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setError("");
    setResponse(null);
    try {
      const res = await fetch("/api/customer-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit query");
      }
      setResponse(data);
      // Clear form after successful submission
      setFormData({
        query: "",
        customerName: "",
        customerEmail: "",
        category: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewQuery = () => {
    setResponse(null);
    setError("");
  };

  if (response) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-green-100 dark:bg-green-900/30 w-fit">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-green-700 dark:text-green-400">
            Query Resolved!
          </CardTitle>
          <CardDescription>
            Here&apos;s the response to your query
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Original Query */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Your Query:
            </h3>
            <p className="text-gray-700 dark:text-gray-300 italic">
              &quot;{response.query}&quot;
            </p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Category:{" "}
              {
                QUERY_CATEGORIES.find((cat) => cat.value === response.category)
                  ?.Label
              }
            </div>
          </div>

          {/* AI Response */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Our Response:
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <div className="text-blue-800 dark:text-blue-200 whitespace-pre-wrap leading-relaxed">
                {response.response}
              </div>
            </div>
          </div>

          {/* Query Info */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Query ID: {response.id}</p>
            <p>Processed on: {new Date(response.timestamp).toLocaleString()}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleNewQuery}
              className="flex-1 cursor-pointer"
              variant="outline"
            >
              Ask Another Question
            </Button>
            <Button
              onClick={() => router.push("/contact-us")}
              className="flex-1 cursor-pointer"
            >
              Contact Human Support
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          Customer Support
        </CardTitle>
        <CardDescription>
          Ask us anything about our products, orders, or services. Our AI
          assistant will help you instantly!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 dark:text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white">
                Name (Optional)
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Your name"
                  value={formData.customerName}
                  onChange={(e) =>
                    handleInputChange("customerName", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-white">
                Email (Optional)
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    handleInputChange("customerEmail", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className="w-full cursor-pointer text-gray-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 focus:ring-2 focus:border-white rounded-xl transition-all duration-300 shadow-lg focus:ring-white">
                <SelectValue placeholder="Select the type of inquiry" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl rounded-xl z-50">
                {QUERY_CATEGORIES.map((category) => (
                  <SelectItem
                    key={category.value}
                    value={category.value}
                    className="cursor-pointer text-white"
                  >
                    {category.Label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Query Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white">
              Your Question <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Please describe your question or issue in detail..."
              value={formData.query}
              onChange={(e) => handleInputChange("query", e.target.value)}
              className="min-h-[120px]"
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.query.length}/1000 characters
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Submit Query
              </>
            )}
          </Button>

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Need immediate assistance? Call us at{" "}
              <a
                href="tel:+1234567890"
                className="text-blue-600 hover:underline"
              >
                +1-000-000-000{" "}
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
