"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import GoogleLogin from "@/app/component/GoogleLogin";
import ForgotPasswordModal from "@/app/component/ForgotPasswordModal";
import { useAuth } from "@/app/context/UserContext";

export default function LoginSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { transferGuestCart } = useCart();
  const { setUser } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    match: false,
  });

  // Validate password requirements
  useEffect(() => {
    setPasswordErrors({
      length: signupData.password.length > 0 && signupData.password.length < 5,
      match:
        signupData.confirmPassword.length > 0 &&
        signupData.password !== signupData.confirmPassword,
    });
  }, [signupData.password, signupData.confirmPassword]);

  // Handle Google OAuth callback
  useEffect(() => {
    const handleGoogleCallback = async () => {
      if (searchParams.get("login") === "success") {
        try {
          const tempAuthCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("temp-auth-data="));

          if (tempAuthCookie) {
            const tempAuthData = JSON.parse(
              decodeURIComponent(tempAuthCookie.split("=")[1])
            );
            setUser(tempAuthData.user);

            document.cookie =
              "temp-auth-data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            await transferGuestCart();
            toast.success("Google login successful!");
            router.replace("/");
          }
        } catch (error) {
          console.error("Error handling Google callback:", error);
          toast.error("Error completing Google login");
        }
      }

      // Handle OAuth errors
      const error = searchParams.get("error");
      if (error) {
        let errorMessage = "Google login failed";
        switch (error) {
          case "access_denied":
            errorMessage = "Google login was cancelled";
            break;
          case "no_code":
            errorMessage = "No authorization code received";
            break;
          case "token_exchange_failed":
            errorMessage = "Failed to exchange authorization code";
            break;
          case "user_info_failed":
            errorMessage = "Failed to get user information from Google";
            break;
          case "callback_error":
            errorMessage = "An error occurred during Google login";
            break;
        }
        toast.error(errorMessage);
        router.replace("/auth/login");
      }
    };

    handleGoogleCallback();
  }, [searchParams, router, transferGuestCart, setUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data before sending
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!loginData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email.trim(),
          password: loginData.password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        await transferGuestCart();
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password requirements
    if (signupData.password.length < 5) {
      toast.error("Password must be at least 5 characters long");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          email: signupData.email,
          password: signupData.password,
          phone: signupData.phone,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);

        await transferGuestCart();

        toast.success("Account created successfully!");
        router.push("/");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSuccess = () => {
    // This will be handled by the useEffect hook above
  };

  const togglePasswordVisibility = (field: "login" | "signup" | "confirm") => {
    switch (field) {
      case "login":
        setShowLoginPassword(!showLoginPassword);
        break;
      case "signup":
        setShowPassword(!showPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-400/20 to-blue-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-4 py-8">
        <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl border-0">
          <CardHeader className="text-center space-y-2">
            {/* Brand Logo */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-xl">N</span>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Welcome to NOIRE&apos;
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Sign in to your account or create a new one to continue
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 dark:bg-gray-700/50 p-1 rounded-xl">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all duration-300 text-gray-300 cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all duration-300 text-gray-300 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-6 mt-6">
                {/* Google Login Button */}
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  disabled={isLoading}
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-gray-200/50 dark:bg-gray-700/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-800 px-4 text-gray-500 dark:text-gray-400 font-medium">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="login-email"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={loginData.email}
                        onChange={handleLoginInputChange}
                        required
                        className="pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-gray-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="login-password"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Password
                      </Label>
                      <ForgotPasswordModal>
                        <Button
                          type="button"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium transition-colors duration-300 cursor-pointer"
                        >
                          Forgot Password?
                        </Button>
                      </ForgotPasswordModal>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        name="password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={handleLoginInputChange}
                        required
                        className="pl-10 pr-12 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-gray-300"
                      />
                      <Button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300 cursor-pointer"
                        onClick={() => togglePasswordVisibility("login")}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 rounded-xl py-3 cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-6 mt-6">
                {/* Google Login Button for Signup */}
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  disabled={isLoading}
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-gray-200/50 dark:bg-gray-700/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-800 px-4 text-gray-500 dark:text-gray-400 font-medium">
                      Or create account with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="John"
                          value={signupData.firstName}
                          onChange={handleSignupInputChange}
                          required
                          className="pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-gray-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Last Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Doe"
                          value={signupData.lastName}
                          onChange={handleSignupInputChange}
                          required
                          className="pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-gray-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-email"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={signupData.email}
                        onChange={handleSignupInputChange}
                        required
                        className="pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Phone Number (Optional)
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={signupData.phone}
                        onChange={handleSignupInputChange}
                        className="pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-password"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={signupData.password}
                        onChange={handleSignupInputChange}
                        required
                        className={`pl-10 pr-12 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl text-gray-300 transition-all duration-300 ${
                          passwordErrors.length
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                      />
                      <Button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer duration-300"
                        onClick={() => togglePasswordVisibility("signup")}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {passwordErrors.length && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Password must be at least 5 characters long
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={signupData.confirmPassword}
                        onChange={handleSignupInputChange}
                        required
                        className={`pl-10 pr-12 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 text-gray-300 rounded-xl transition-all duration-300 ${
                          passwordErrors.match
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        } ${
                          signupData.confirmPassword &&
                          !passwordErrors.match &&
                          signupData.password === signupData.confirmPassword
                            ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                            : ""
                        }`}
                      />
                      <Button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer duration-300"
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {passwordErrors.match && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Passwords do not match
                      </p>
                    )}
                    {signupData.confirmPassword &&
                      !passwordErrors.match &&
                      signupData.password === signupData.confirmPassword && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Passwords match ✓
                        </p>
                      )}
                  </div>

                  {/* Password Requirements */}
                  {signupData.password && (
                    <div className="space-y-3 p-4 bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-2 text-blue-600" />
                        Password Requirements
                      </p>

                      <div className="grid grid-cols-1 gap-2">
                        {/* Length requirement */}
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                              signupData.password.length >= 5
                                ? "bg-gradient-to-r from-green-400 to-green-500 shadow-md"
                                : "bg-gradient-to-r from-red-400 to-red-500"
                            }`}
                          />
                          <span
                            className={`text-xs transition-colors duration-300 ${
                              signupData.password.length >= 5
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            At least 5 characters
                          </span>
                        </div>

                        {/* Lowercase requirement */}
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                              /[a-z]/.test(signupData.password)
                                ? "bg-gradient-to-r from-green-400 to-green-500 shadow-md"
                                : "bg-gradient-to-r from-red-400 to-red-500"
                            }`}
                          />
                          <span
                            className={`text-xs transition-colors duration-300 ${
                              /[a-z]/.test(signupData.password)
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            At least one lowercase letter
                          </span>
                        </div>

                        {/* Uppercase requirement */}
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                              /[A-Z]/.test(signupData.password)
                                ? "bg-gradient-to-r from-green-400 to-green-500 shadow-md"
                                : "bg-gradient-to-r from-red-400 to-red-500"
                            }`}
                          />
                          <span
                            className={`text-xs transition-colors duration-300 ${
                              /[A-Z]/.test(signupData.password)
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            At least one uppercase letter
                          </span>
                        </div>

                        {/* Password match */}
                        {signupData.confirmPassword && (
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                                signupData.password ===
                                signupData.confirmPassword
                                  ? "bg-gradient-to-r from-green-400 to-green-500 shadow-md"
                                  : "bg-gradient-to-r from-red-400 to-red-500"
                              }`}
                            />
                            <span
                              className={`text-xs transition-colors duration-300 ${
                                signupData.password ===
                                signupData.confirmPassword
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              Passwords match
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 rounded-xl py-3 cursor-pointer"
                    disabled={
                      isLoading || passwordErrors.length || passwordErrors.match
                    }
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
