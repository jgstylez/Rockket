import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Rocket, Sparkles } from 'lucide-react'

export function CTA() {
  return (
    <section className="section bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>Ready to launch your vision?</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Start building your next big idea today
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and businesses who are already building the future with Rockket. 
            No credit card required to get started.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                Schedule Demo
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold">14-day</div>
              <div className="text-sm text-white/80">Free trial</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">No setup</div>
              <div className="text-sm text-white/80">Required</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-white/80">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
