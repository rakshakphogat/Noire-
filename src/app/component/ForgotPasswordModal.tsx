"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Mail, CheckCircle, Lock } from "lucide-react";

interface ForgotPasswordModalProps {
  children: React.ReactNode;
}

export default function ForgotPasswordModal({
  children,
}: ForgotPasswordModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsSuccess(true);
        toast.success("Password reset email sent! Check your inbox.");
      } else {
        toast.error(data.error || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setEmail("");
    setIsSuccess(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 shadow-2xl rounded-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            {isSuccess ? (
              <CheckCircle className="w-6 h-6 text-white" />
            ) : (
              <Lock className="w-6 h-6 text-white" />
            )}
          </div>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {isSuccess ? "Email Sent!" : "Forgot Password"}
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              We&apos;ve sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions to reset your
              password.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Didn&apos;t receive the email? Check your spam folder or try
              again.
            </p>
            <Button
              onClick={handleClose}
              className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
            <div className="space-y-2">
              <Label
                htmlFor="forgot-email"
                className="text-gray-700 dark:text-gray-300"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 rounded-xl border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 rounded-xl cursor-pointer text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
