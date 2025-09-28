import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with basic features",
      features: [
        "1 AI generation per day",
        "Basic visual builder",
        "1 project",
        "Community support",
        "Basic analytics",
      ],
      limitations: [
        "Limited AI generations",
        "Basic components only",
        "No custom domains",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      description: "Ideal for small teams and individual developers",
      features: [
        "100 AI generations per month",
        "Full visual builder",
        "5 projects",
        "Email support",
        "Advanced analytics",
        "Custom components",
        "Basic integrations",
      ],
      limitations: ["Limited team members", "Basic compliance features"],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Professional",
      price: "$99",
      period: "per month",
      description: "Perfect for growing businesses and development teams",
      features: [
        "Unlimited AI generations",
        "Advanced visual builder",
        "Unlimited projects",
        "Priority support",
        "Full analytics suite",
        "All integrations",
        "Advanced compliance",
        "Team collaboration",
        "Custom domains",
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "Tailored solutions for large organizations",
      features: [
        "Everything in Professional",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security",
        "Compliance certifications",
        "Custom training",
        "On-premise deployment",
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
    },
    {
      question: "What happens to my data if I cancel?",
      answer:
        "Your data is safe with us. You can export all your projects and data before canceling, and we'll keep your account active for 30 days after cancellation.",
    },
    {
      question: "Do you offer discounts for annual billing?",
      answer:
        "Yes! Save 20% when you pay annually. This applies to all paid plans and is automatically applied at checkout.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and for Enterprise customers, we can arrange invoicing and other payment methods.",
    },
    {
      question: "Can I get a custom plan?",
      answer:
        "Absolutely! Contact our sales team to discuss custom pricing for high-volume usage or special requirements.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Choose the perfect plan for your needs. Start free and scale as
              you grow.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`p-8 rounded-lg border ${
                    plan.popular
                      ? "border-primary bg-primary/5 relative"
                      : "bg-card"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">
                        /{plan.period}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-center">
                        <X className="h-4 w-4 text-red-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link
                      href={
                        plan.name === "Enterprise"
                          ? "/contact"
                          : "/auth/register"
                      }
                    >
                      {plan.cta}
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about our pricing and plans.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 bg-card rounded-lg border">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers and businesses building amazing
              applications with Rockket.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
