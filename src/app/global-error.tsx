"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-4 rounded-full bg-red-100 dark:bg-red-900/30 w-fit">
            <AlertTriangle className="h-16 w-16 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Application Error
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            A critical error occurred that crashed the application. Our team has
            been automatically notified.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Summary */}
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center">
              <Bug className="mr-2 h-5 w-5" />
              Error Summary
            </h3>
            <p className="text-red-800 dark:text-red-200 text-sm mb-2">
              <strong>Message:</strong>{" "}
              {error.message || "An unexpected error occurred"}
            </p>
            {error.digest && (
              <p className="text-red-700 dark:text-red-300 text-xs font-mono">
                <strong>Error ID:</strong> {error.digest}
              </p>
            )}
            <p className="text-red-700 dark:text-red-300 text-xs">
              <strong>Timestamp:</strong> {new Date().toISOString()}
            </p>
          </div>

          {/* Development Stack Trace */}
          {isDevelopment && error.stack && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 max-h-64 overflow-auto">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Stack Trace (Development Only)
              </h3>
              <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {error.stack}
              </pre>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={reset}
              className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              size="lg"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Try to Recover
            </Button>

            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-600"
              size="lg"
            >
              <Home className="mr-2 h-5 w-5" />
              Go to Homepage
            </Button>
          </div>

          {/* Recovery Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Recovery Steps
            </h4>
            <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-200 list-decimal list-inside">
              <li>
                Try refreshing the page or clicking &quot;Try to Recover&quot;
              </li>
              <li>Clear your browser cache and cookies</li>
              <li>Restart your browser</li>
              <li>
                Check if the issue persists in an incognito/private window
              </li>
              <li>Contact support if the problem continues</li>
            </ol>
          </div>

          {/* Contact Support */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              If this error keeps happening, please report it to our technical
              team.
            </p>
            <Button
              onClick={() => {
                const subject = encodeURIComponent(
                  "Critical Application Error"
                );
                const body = encodeURIComponent(`
                      Critical Error Report:
                      - Message: ${error.message}
                      - Error ID: ${error.digest || "N/A"}
                      - Timestamp: ${new Date().toISOString()}
                      - User Agent: ${navigator.userAgent}
                      - URL: ${window.location.href}
                      ${
                        isDevelopment && error.stack
                          ? `\n- Stack Trace:\n${error.stack}`
                          : ""
                      }
                    `);
                window.location.href = `mailto:dev-team@yourstore.com?subject=${subject}&body=${body}`;
              }}
              variant="ghost"
              size="sm"
            >
              Report This Error
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
