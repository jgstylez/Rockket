import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '1 project',
      'Basic AI generation',
      'Community support',
      '1GB storage',
      'Basic analytics'
    ],
    limitations: [
      'Limited AI requests',
      'No custom domain',
      'Basic templates only'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Starter',
    price: 29,
    period: 'month',
    description: 'For growing businesses',
    features: [
      '5 projects',
      'Advanced AI generation',
      'Priority support',
      '10GB storage',
      'Advanced analytics',
      'Custom domain',
      'API access',
      'Webhooks'
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Professional',
    price: 99,
    period: 'month',
    description: 'For established companies',
    features: [
      'Unlimited projects',
      'Premium AI generation',
      '24/7 support',
      '100GB storage',
      'Business intelligence',
      'Custom branding',
      'Advanced integrations',
      'Team collaboration',
      'SSO',
      'Audit logs'
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact',
    description: 'For large organizations',
    features: [
      'Everything in Professional',
      'Dedicated infrastructure',
      'Custom SLA',
      'Dedicated support',
      'Custom integrations',
      'Advanced security',
      'Compliance reporting',
      'Training & onboarding'
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false
  }
]

export function Pricing() {
  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core features 
            with no hidden fees or surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-6 rounded-lg border ${
                plan.popular 
                  ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                  : 'bg-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">
                    {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                  </span>
                  {typeof plan.price === 'number' && (
                    <span className="text-muted-foreground">/{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  What's included
                </h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.limitations.length > 0 && (
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Limitations
                  </h4>
                  <ul className="space-y-3">
                    {plan.limitations.map((limitation, limitationIndex) => (
                      <li key={limitationIndex} className="flex items-center space-x-3">
                        <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-primary hover:bg-primary/90' 
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
                variant={plan.popular ? 'default' : 'secondary'}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">
            Frequently asked questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-sm text-muted-foreground">
                All paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Do you offer refunds?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, we offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
