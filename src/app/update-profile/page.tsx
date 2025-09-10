"use client";

import { updateProfileSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import z from "zod";
import { IUser } from "../types/User";
import {
  User,
  Phone,
  Calendar,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Users,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export default function UpdateProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState<UpdateProfileData>({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/users/profile", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        const userData = data.user;
        setUser(userData);
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          phone: userData.phone || "",
          dateOfBirth: userData.dateOfBirth
            ? userData.dateOfBirth.split("T")[0]
            : "",
          gender: userData.gender || undefined,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    try {
      updateProfileSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setSuccessMessage("");
    try {
      const dataToSend = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          if (value !== "" && value !== undefined) {
            if (key === "gender") {
              acc[key] = value as "male" | "female" | "other";
            } else {
              acc[key as Exclude<keyof UpdateProfileData, "gender">] =
                value as UpdateProfileData[Exclude<
                  keyof UpdateProfileData,
                  "gender"
                >];
            }
          }
          return acc;
        },
        {} as UpdateProfileData
      );
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message || "Profile updated successfully");
        setUser(data.user);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setErrors({ submit: data.error || "Failed to update profile" });
      }
    } catch (error) {
      console.error("update failed", error);
      setErrors({ submit: "Network error. Please try again" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
              <User className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-4">
              Update Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Keep your information up to date
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-4" />
          </div>

          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/30 shadow-2xl">
            <CardContent className="p-8">
              {/* Success Message */}
              {successMessage && (
                <Alert className="mb-8 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/30 backdrop-blur-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Message */}
              {errors.submit && (
                <Alert className="mb-8 bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 border-red-200/50 dark:border-red-700/30 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-800 dark:text-red-200 font-medium">
                    {errors.submit}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name & Last Name Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      <User className="h-4 w-4 mr-2" />
                      First Name
                    </Label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName || ""}
                      onChange={handleInputChange}
                      className={`text-gray-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border rounded-xl shadow-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-300 ${
                        errors.firstName
                          ? "border-red-300 dark:border-red-600"
                          : "border-white/20 dark:border-gray-700/30"
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                        <X className="h-3 w-3 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName || ""}
                      onChange={handleInputChange}
                      className={`text-gray-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border rounded-xl shadow-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-300 ${
                        errors.lastName
                          ? "border-red-300 dark:border-red-600"
                          : "border-white/20 dark:border-gray-700/30"
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                        <X className="h-3 w-3 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className={`text-gray-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border rounded-xl shadow-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-300 ${
                      errors.phone
                        ? "border-red-300 dark:border-red-600"
                        : "border-white/20 dark:border-gray-700/30"
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                      <X className="h-3 w-3 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Date of Birth & Gender Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="dateOfBirth"
                      className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Date of Birth
                    </Label>
                    <Input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth || ""}
                      onChange={handleInputChange}
                      className={`text-gray-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border rounded-xl shadow-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-300 ${
                        errors.dateOfBirth
                          ? "border-red-300 dark:border-red-600"
                          : "border-white/20 dark:border-gray-700/30"
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                        <X className="h-3 w-3 mr-1" />
                        {errors.dateOfBirth}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="gender"
                      className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Gender
                    </Label>
                    <Select
                      value={formData.gender || ""}
                      onValueChange={(value) =>
                        handleSelectChange("gender", value)
                      }
                    >
                      <SelectTrigger
                        className={`text-gray-500 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border rounded-xl shadow-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-300 ${
                          errors.gender
                            ? "border-red-300 dark:border-red-600"
                            : "border-white/20 dark:border-gray-700/30"
                        }`}
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/90 text-gray-400 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-xl">
                        <SelectItem
                          value="male"
                          className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        >
                          Male
                        </SelectItem>
                        <SelectItem
                          value="female"
                          className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        >
                          Female
                        </SelectItem>
                        <SelectItem
                          value="other"
                          className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        >
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                        <X className="h-3 w-3 mr-1" />
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-4 px-8 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed text-gray-200"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        <Save className="h-5 w-5 mr-2" />
                        Updating Profile...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Save className="h-5 w-5 mr-2" />
                        Update Profile
                      </span>
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => router.back()}
                    variant="outline"
                    className="flex-1 py-4 px-8 text-base font-semibold bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 border-white/30 dark:border-gray-600/30 hover:border-purple-300 dark:hover:border-purple-500 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                  >
                    <span className="flex items-center justify-center">
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Cancel
                    </span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info Section */}
          <div className="mt-8 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-3">
                Keep Your Profile Updated
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                Maintaining accurate profile information helps us provide you
                with personalized recommendations and ensures smooth order
                processing for all your purchases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
