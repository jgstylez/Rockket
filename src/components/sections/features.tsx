import { 
  Bot, 
  Palette, 
  ShoppingCart, 
  FileText, 
  BarChart3, 
  Zap,
  Shield,
  Users,
  Globe,
  Settings
} from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Generation',
    description: 'Generate complete applications with natural language prompts. Our AI understands your requirements and builds production-ready code.',
    benefits: ['Natural language input', 'Code generation', 'Smart suggestions', 'Automated testing']
  },
  {
    icon: Palette,
    title: 'Visual Builder',
    description: 'Drag-and-drop interface for building beautiful, responsive applications without writing code.',
    benefits: ['Drag & drop', 'Real-time preview', 'Responsive design', 'Component library']
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Platform',
    description: 'Complete e-commerce solution with payment processing, inventory management, and order fulfillment.',
    benefits: ['Payment processing', 'Inventory management', 'Order tracking', 'Customer management']
  },
  {
    icon: FileText,
    title: 'Content Management',
    description: 'Powerful CMS for managing content, pages, and digital assets with SEO optimization.',
    benefits: ['Content editor', 'SEO tools', 'Media management', 'Publishing workflow']
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Comprehensive analytics dashboard with real-time metrics and business intelligence.',
    benefits: ['Real-time metrics', 'Custom dashboards', 'Business intelligence', 'Performance tracking']
  },
  {
    icon: Zap,
    title: 'Feature Management',
    description: 'Enterprise-grade feature flags and A/B testing to control feature rollouts safely.',
    benefits: ['Feature flags', 'A/B testing', 'Gradual rollouts', 'Risk mitigation']
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    description: 'Enterprise-grade security with SOC 2, GDPR, and HIPAA compliance built-in.',
    benefits: ['Data encryption', 'Access controls', 'Audit logs', 'Compliance reporting']
  },
  {
    icon: Users,
    title: 'Multi-Tenant Architecture',
    description: 'Built for scale with complete tenant isolation and resource management.',
    benefits: ['Tenant isolation', 'Resource management', 'Custom branding', 'Scalable infrastructure']
  },
  {
    icon: Globe,
    title: 'Global Deployment',
    description: 'Deploy to Cloudflare\'s edge network for global performance and reliability.',
    benefits: ['Edge computing', 'Global CDN', 'Auto-scaling', '99.9% uptime']
  },
  {
    icon: Settings,
    title: 'Developer Experience',
    description: 'Comprehensive tooling, documentation, and automation for development teams.',
    benefits: ['API documentation', 'SDK libraries', 'CLI tools', 'Development workflows']
  }
]

export function Features() {
  return (
    <section className="section bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to build and scale
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From AI-powered generation to enterprise-grade security, we provide all the tools 
            you need to launch and grow your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-lg bg-card border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              
              <p className="text-muted-foreground mb-4">
                {feature.description}
              </p>

              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center space-x-2 text-sm">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            <span>And much more...</span>
          </div>
          <h3 className="text-2xl font-bold mb-4">
            Ready to launch your vision?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of developers and businesses who are already building the future with Rockket.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/auth/register" 
              className="btn-primary px-8 py-3 text-lg"
            >
              Start Building Free
            </a>
            <a 
              href="/demo" 
              className="btn-secondary px-8 py-3 text-lg"
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
