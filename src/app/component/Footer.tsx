"use client";

import { useRouter } from "next/navigation";
import { Mail, Phone, Instagram, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const companyLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about-us" },
    { label: "Contact", path: "/contact-us" },
    { label: "Customer Support", path: "/support" },
    { label: "Privacy Policy", path: "/privacy-policy" },
  ];

  const contactInfo = [
    { label: "+1-000-000-000", type: "phone", icon: Phone },
    { label: "noireOfficial@gmail.com", type: "email", icon: Mail },
    { label: "Instagram", type: "social", icon: Instagram },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-400/20 to-blue-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Main Footer Content */}
      <div className="relative border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl mr-3">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  NOIRE&apos;
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto md:mx-0 mb-6">
                Discover premium quality products with exceptional service.
                We&apos;re committed to delivering excellence in every
                interaction and creating memorable shopping experiences for our
                valued customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/products")}
                  className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 text-gray-200 cursor-pointer"
                >
                  Shop Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/about-us")}
                  className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 text-gray-200 cursor-pointer"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Company Links */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white relative">
                COMPANY
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 md:mx-0 mx-auto" />
              </h3>
              <div className="space-y-3">
                {companyLinks.map((link, index) => (
                  <div key={index}>
                    <button
                      className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer block mx-auto md:mx-0 hover:translate-x-1 transform"
                      onClick={() => handleNavigation(link.path)}
                    >
                      {link.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white relative">
                GET IN TOUCH
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-pink-600 to-orange-600 md:mx-0 mx-auto" />
              </h3>
              <div className="space-y-4">
                {contactInfo.map((contact, index) => {
                  const Icon = contact.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-center md:justify-start gap-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      {contact.type === "email" ? (
                        <Link
                          href={`mailto:${contact.label}`}
                          className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          {contact.label}
                        </Link>
                      ) : contact.type === "phone" ? (
                        <Link
                          href={`tel:${contact.label}`}
                          className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          {contact.label}
                        </Link>
                      ) : contact.type === "social" ? (
                        <Link
                          href="https://www.instagram.com/rakshak_phogat/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                        >
                          {contact.label}
                        </Link>
                      ) : (
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                          {contact.label}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center max-w-md mx-auto">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Stay Updated
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Subscribe to our newsletter for the latest updates and exclusive
                offers.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md cursor-pointer"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium text-center sm:text-left">
              Copyright 2025 © Noire - All Rights Reserved.
            </p>

            {/* Back to top button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="cursor-pointer flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
            >
              <ArrowUp className="h-4 w-4" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
