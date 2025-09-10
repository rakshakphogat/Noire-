import { Metadata } from "next";
import {
  MessageCircle,
  Clock,
  Phone,
  Mail,
  HelpCircle,
  Zap,
  Shield,
  Headphones,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CustomerQueryForm from "../component/CustomerQueryForm";

export const metadata: Metadata = {
  title: "Customer Support | Noiré",
  description:
    "Get instant help with our AI-powered customer support. Ask questions about products, orders, shipping, and more.",
};

const FAQ_ITEMS = [
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for all items in original condition. Returns are free for orders over $50.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 3-5 business days, express shipping takes 1-2 business days. Free shipping on orders over $50.",
  },
  {
    question: "How can I track my order?",
    answer:
      "You'll receive a tracking number via email once your order ships. You can also track your order in the 'My Orders' section of your account.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship internationally to most countries. Shipping costs and delivery times vary by location.",
  },
];

const SUPPORT_FEATURES = [
  {
    icon: Zap,
    title: "Instant AI Responses",
    description: "Get immediate answers to your questions 24/7",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: MessageCircle,
    title: "Smart Understanding",
    description: "Our AI understands context and provides relevant solutions",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: HelpCircle,
    title: "Comprehensive Help",
    description: "Support for products, orders, shipping, returns, and more",
    color: "from-green-500 to-emerald-500",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-tl from-pink-400/20 to-blue-400/20 rounded-full blur-3xl translate-x-1/2" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-cyan-400/20 rounded-full blur-3xl translate-y-1/2" />
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Hero background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/30 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-2xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl backdrop-blur-sm border border-white/20 shadow-xl mb-6">
                <Headphones className="h-10 w-10 text-white" />
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              How can we help you today?
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Our AI-powered support system is here to assist you instantly. Ask
              anything about our products, orders, or services.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 px-4 py-2 text-sm transition-all duration-300">
                <Clock className="mr-2 h-4 w-4" />
                Available 24/7
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 px-4 py-2 text-sm transition-all duration-300">
                <Zap className="mr-2 h-4 w-4" />
                Instant Responses
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 px-4 py-2 text-sm transition-all duration-300">
                <MessageCircle className="mr-2 h-4 w-4" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Query Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-xl p-8">
              <CustomerQueryForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Support Features */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Why Choose AI Support?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {SUPPORT_FEATURES.map((feature, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-700/30 dark:to-gray-600/30 hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600/50 dark:hover:to-gray-500/50 transition-all duration-300 border border-gray-200/50 dark:border-gray-600/30">
                      <div
                        className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg`}
                      >
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Other Ways to Reach Us
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Prefer human support? We&apos;re here for you too!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="group p-4 rounded-2xl bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/30 dark:hover:to-emerald-800/30 transition-all duration-300 border border-green-200/50 dark:border-green-700/30">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Phone Support
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        +1-000-000-000
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Mon-Fri, 9 AM - 6 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30 transition-all duration-300 border border-blue-200/50 dark:border-blue-700/30">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Email Support
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        noireOfficial@gmail.com
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Response within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 sm:mt-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-xl mb-6">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Quick answers to common questions. For more detailed help, use our
              AI assistant above.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {FAQ_ITEMS.map((faq, index) => (
              <Card
                key={index}
                className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-20 sm:mt-24">
          <Card className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white border-0 shadow-2xl overflow-hidden">
            {/* Card background decorations */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/30 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-2xl" />
            </div>

            <CardContent className="relative py-12 px-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>

              <h3 className="text-3xl sm:text-4xl font-bold mb-6">
                Still need help?
              </h3>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Our AI assistant can handle most queries instantly, but if you
                need human assistance or have a complex issue, don&apos;t
                hesitate to contact our support team directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+1234567890"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Phone className="mr-3 h-5 w-5 group-hover:animate-pulse" />
                  Call Us Now
                </a>
                <a
                  href="mailto:support@noire-store.com"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Mail className="mr-3 h-5 w-5 group-hover:animate-pulse" />
                  Email Support
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
