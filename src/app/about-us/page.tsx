import Image from "next/image";
import MainBanner from "../assets/MainBanner.jpg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Award,
  Globe,
  RefreshCw,
  Mail,
  Users,
  Target,
  Heart,
} from "lucide-react";

export default function AboutUs() {
  const features = [
    {
      icon: Award,
      title: "Premium Quality Fabrics",
      description:
        "Carefully sourced materials for comfort, durability, and elegance that stands the test of time.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Globe,
      title: "Worldwide Shipping",
      description:
        "Bringing Noiré's style to your doorstep, wherever you are in the world with reliable delivery.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: RefreshCw,
      title: "Hassle-Free Returns",
      description:
        "Easy and transparent return policy for complete peace of mind with every purchase.",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const stats = [
    { icon: Users, number: "50K+", label: "Happy Customers" },
    { icon: Target, number: "95%", label: "Satisfaction Rate" },
    { icon: Globe, number: "120+", label: "Countries Served" },
    { icon: Heart, number: "10K+", label: "5-Star Reviews" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-6">
            ABOUT US
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto" />
        </div>

        {/* Main Content Section */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-16 mb-20">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 flex justify-center order-1">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-4 shadow-2xl">
                  <Image
                    className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px] object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
                    src={MainBanner}
                    width={480}
                    height={480}
                    alt="About us - Noiré fashion"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2 order-2">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    At Noiré, we believe that fashion is more than just
                    clothing—it&apos;s a form of self-expression, a way to tell
                    your unique story to the world. Founded with a passion for
                    timeless elegance and contemporary innovation, we curate
                    collections that empower individuals to embrace their
                    authentic selves.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    Our journey began with a simple vision: to create premium
                    fashion pieces that seamlessly blend classic sophistication
                    with modern trends. Every garment in our collection is
                    carefully selected and crafted to meet the highest standards
                    of quality, comfort, and style.
                  </p>

                  <div className="pt-4">
                    <h3 className="font-bold text-xl sm:text-2xl mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Our Mission
                    </h3>
                    <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                      To democratize luxury fashion by making premium,
                      sustainable clothing accessible to fashion enthusiasts
                      worldwide. We&apos;re committed to ethical practices,
                      exceptional craftsmanship, and creating pieces that
                      inspire confidence and celebrate individuality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-6 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-4">
                WHY CHOOSE US
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto" />
            </div>

            <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/30 dark:border-gray-700/40 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
                    >
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="pb-16">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-orange-600/10 dark:from-purple-600/20 dark:via-pink-600/20 dark:to-orange-600/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-4">
                Subscribe and get an Exciting Offer
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join our fashion community and get exclusive access to new
                collections, styling tips, and special promotions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
                <Input
                  className="text-white w-full sm:flex-1 p-4 text-base bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/30 rounded-xl shadow-lg focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Enter your email address"
                  type="email"
                />
                <Button className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto whitespace-nowrap">
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
