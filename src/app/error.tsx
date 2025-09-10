"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleReportIssue = () => {
    const subject = encodeURIComponent("Error Report - E-commerce Site");
    const body = encodeURIComponent(`
      Error Details:
      - Message: ${error.message}
      - Stack: ${error.stack}
      - Digest: ${error.digest || "N/A"}
      - Timestamp: ${new Date().toISOString()}
      - User Agent: ${navigator.userAgent}
      - URL: ${window.location.href}
    `);
    window.location.href = `mailto:support@yourstore.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-6 p-4 rounded-full bg-red-100 dark:bg-red-900/30 w-fit">
            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            We encountered an unexpected error. Don&apos;t worry, our team has
            been notified.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Details */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Error Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex flex-col sm:flex-row">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-20">
                  Message:
                </span>
                <span className="text-red-600 dark:text-red-400 break-all">
                  {error.message || "An unexpected error occurred"}
                </span>
              </div>
              {error.digest && (
                <div className="flex flex-col sm:flex-row">
                  <span className="font-medium text-gray-700 dark:text-gray-300 w-20">
                    ID:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                    {error.digest}
                  </span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-20">
                  Time:
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={reset}
              className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              size="lg"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Try Again
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-600"
              size="lg"
            >
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Button>
          </div>

          {/* Additional Help */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              If this problem persists, please let us know so we can fix it
              quickly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleReportIssue}
                variant="ghost"
                className="flex-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                size="sm"
              >
                <Mail className="mr-2 h-4 w-4" />
                Report Issue
              </Button>

              <Button
                onClick={() => window.location.reload()}
                variant="ghost"
                className="flex-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                size="sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              What you can try:
            </h4>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>• Refresh the page or try again</li>
              <li>• Check your internet connection</li>
              <li>• Clear your browser cache and cookies</li>
              <li>• Try using a different browser</li>
              <li>• Contact our support team if the issue persists</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
