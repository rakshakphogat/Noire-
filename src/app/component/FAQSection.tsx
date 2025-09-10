import { headingPageFaqs } from "@/data/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  return (
    <div className="mt-20 sm:mt-24 lg:mt-32 px-4 sm:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto" />
        </div>

        <div className="space-y-4">
          {headingPageFaqs.map((faq) => (
            <Accordion key={faq._id.toString()} type="single" collapsible>
              <AccordionItem
                value={`faq-${faq._id}`}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <AccordionTrigger className="cursor-pointer text-sm sm:text-base font-semibold hover:no-underline py-5 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600 dark:text-gray-300 pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
