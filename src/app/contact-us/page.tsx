import Image from "next/image";
import MainBanner from "../assets/MainBanner.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";

export default function ContactUs() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our friendly team",
      value: "(415) 555-0132",
      action: "tel:+14155550132",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      value: "noireOfficial@gmail.com",
      action: "mailto:noireOfficial@gmail.com",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team",
      value: "Start Live Chat",
      action: "#",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-blue-200/30 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-purple-200/30 to-cyan-200/40 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-cyan-800 dark:from-white dark:via-blue-200 dark:to-cyan-200 bg-clip-text text-transparent mb-6">
            CONTACT US
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-4" />
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We&apos;re here to help! Reach out to us through any of the channels
            below and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {method.description}
                  </p>
                  <a
                    href={method.action}
                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    {method.value}
                  </a>
                </div>
              );
            })}
          </div>

          {/* Main Content Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16 mb-20">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 flex justify-center order-1">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-4 shadow-2xl">
                  <Image
                    className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px] object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
                    src={MainBanner}
                    width={480}
                    height={480}
                    alt="Contact us - Noiré fashion store"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="w-full lg:w-1/2 order-2">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-8">
                  {/* Store Information */}
                  <div>
                    <h2 className="font-bold mb-6 text-xl sm:text-2xl flex items-center text-gray-900 dark:text-white">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      OUR STORE
                    </h2>
                    <div className="bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/20 backdrop-blur-sm border border-red-200/30 dark:border-red-700/30 rounded-xl p-6 shadow-lg">
                      <div className="space-y-1 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        <p className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                          Noiré Headquarters
                        </p>
                        <p>127 Rue de la Mode, Suite 5B</p>
                        <p>Paris, Île-de-France 75002</p>
                        <p>France</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div>
                    <h3 className="font-bold mb-6 text-xl sm:text-2xl flex items-center text-gray-900 dark:text-white">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      BUSINESS HOURS
                    </h3>
                    <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30 rounded-xl p-6 shadow-lg">
                      <div className="space-y-3">
                        {businessHours.map((schedule, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-200/50 dark:border-gray-600/50 last:border-b-0"
                          >
                            <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                              {schedule.day}:
                            </span>
                            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                              {schedule.hours}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="pb-16">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-teal-600/10 dark:from-blue-600/20 dark:via-cyan-600/20 dark:to-teal-600/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-4">
                Subscribe and get an Exciting Offer
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Stay connected with Noiré! Get the latest updates, exclusive
                offers, and fashion insights delivered to your inbox.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
                <Input
                  className="text-white w-full sm:flex-1 p-4 text-base bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/30 rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter your email address"
                  type="email"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto whitespace-nowrap">
                  Subscribe Now
                </Button>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4">
                * Join 50,000+ fashion enthusiasts. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
