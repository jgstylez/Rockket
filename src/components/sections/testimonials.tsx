import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder',
    company: 'TechStart',
    avatar: '/avatars/sarah.jpg',
    content: 'Rockket transformed our development process. We went from idea to MVP in just 2 weeks instead of 6 months.',
    rating: 5
  },
  {
    name: 'Michael Rodriguez',
    role: 'CTO',
    company: 'ScaleCorp',
    avatar: '/avatars/michael.jpg',
    content: 'The AI-powered generation is incredible. It understands our requirements and generates production-ready code.',
    rating: 5
  },
  {
    name: 'Emily Johnson',
    role: 'Product Manager',
    company: 'InnovateLab',
    avatar: '/avatars/emily.jpg',
    content: 'The multi-tenant architecture and feature flags give us the confidence to scale without worrying about infrastructure.',
    rating: 5
  },
  {
    name: 'David Kim',
    role: 'Developer',
    company: 'CodeCraft',
    avatar: '/avatars/david.jpg',
    content: 'The developer experience is outstanding. Great documentation, helpful tools, and excellent support.',
    rating: 5
  },
  {
    name: 'Lisa Wang',
    role: 'CEO',
    company: 'GrowthCo',
    avatar: '/avatars/lisa.jpg',
    content: 'We saved months of development time and thousands of dollars. Rockket is a game-changer for startups.',
    rating: 5
  },
  {
    name: 'Alex Thompson',
    role: 'Lead Developer',
    company: 'DevStudio',
    avatar: '/avatars/alex.jpg',
    content: 'The visual builder and AI integration make it easy to prototype and iterate quickly. Highly recommended.',
    rating: 5
  }
]

export function Testimonials() {
  return (
    <section className="section bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by developers and businesses
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our customers are saying about their experience with Rockket.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="relative p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />
              
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
            <div className="text-sm text-muted-foreground">Apps Generated</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-sm text-muted-foreground">Customer Rating</div>
          </div>
        </div>
      </div>
    </section>
  )
}
