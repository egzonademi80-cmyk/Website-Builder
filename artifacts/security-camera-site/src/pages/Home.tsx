import { Link } from "wouter";
import { ShieldCheck, Video, Smartphone, Cloud, ArrowRight, CheckCircle2, Star } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { motion } from "framer-motion";

const features = [
  {
    icon: Video,
    title: "4K Ultra HD Clarity",
    description: "Capture every detail with crystal clear 4K resolution cameras with superior night vision capabilities."
  },
  {
    icon: Smartphone,
    title: "Remote Access Anywhere",
    description: "Monitor your property from your smartphone, tablet, or computer anywhere in the world."
  },
  {
    icon: Cloud,
    title: "Secure Cloud Storage",
    description: "Encrypted cloud backups ensure your footage is safe even if the physical camera is tampered with."
  },
  {
    icon: ShieldCheck,
    title: "AI Motion Detection",
    description: "Smart algorithms distinguish between humans, vehicles, and pets to reduce false alarms."
  }
];

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Small Business Owner",
    text: "SecureVision transformed how I manage my retail store. The clarity of the cameras and the ease of the mobile app are unmatched. Highly recommended!"
  },
  {
    name: "Michael Chen",
    role: "Homeowner",
    text: "The installation team was professional and fast. I finally have peace of mind knowing my property is protected 24/7 with the best tech available."
  },
  {
    name: "David Rodriguez",
    role: "Warehouse Manager",
    text: "We upgraded our entire facility to SecureVision's 4K system. The AI motion detection has saved us countless hours reviewing footage."
  }
];

export default function Home() {
  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-primary mb-6"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide uppercase">Next-Gen Security</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6 leading-tight"
            >
              Protect What <br />
              <span className="text-gradient">Matters Most.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl"
            >
              Enterprise-grade security cameras and smart monitoring solutions for your home and business. Experience unparalleled clarity and control.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                href="/products"
                className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 glow-shadow-hover transition-all duration-300 hover:-translate-y-1"
              >
                View Products <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/contact"
                className="px-8 py-4 rounded-xl glass-panel text-foreground font-semibold flex items-center justify-center hover:bg-white/10 transition-all duration-300"
              >
                Request Free Quote
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why Choose SecureVision?</h2>
            <p className="text-muted-foreground text-lg">We combine cutting-edge technology with reliable performance to deliver security solutions you can trust.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="glass-panel p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">5,000+</div>
              <div className="text-muted-foreground font-medium">Installations</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground font-medium">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground font-medium">Monitoring</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">10 Yrs</div>
              <div className="text-muted-foreground font-medium">Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[150px] -z-10 rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-muted-foreground text-lg">Don't just take our word for it. Here's what our customers have to say about their SecureVision experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-card border border-white/5 p-8 rounded-2xl">
                <div className="flex text-primary mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-lg text-foreground/90 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div>
                  <div className="font-bold text-foreground">{t.name}</div>
                  <div className="text-sm text-primary">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden glass-panel p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Ready to secure your property?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Contact our experts today for a free consultation and custom security system design.</p>
            <Link 
              href="/contact"
              className="inline-flex px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:scale-105 transition-transform duration-300"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
