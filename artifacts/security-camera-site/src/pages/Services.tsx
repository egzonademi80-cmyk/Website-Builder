import { PageTransition } from "@/components/layout/PageTransition";
import { Link } from "wouter";
import { Shield, Home, Building2, Wrench, Headphones, Check } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Residential Systems",
    desc: "Complete smart home security setup including doorbell cameras, indoor monitoring, and perimeter defense."
  },
  {
    icon: Building2,
    title: "Commercial & Enterprise",
    desc: "Scalable access control, multi-site monitoring, and high-density camera deployments for businesses."
  },
  {
    icon: Headphones,
    title: "24/7 Cloud Monitoring",
    desc: "Secure cloud storage with AI-powered alert management and professional monitoring team dispatch."
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    desc: "Regular system health checks, firmware updates, and rapid-response repair services."
  }
];

const tiers = [
  {
    name: "Basic Home",
    price: "$299",
    desc: "Perfect for apartments and small homes.",
    features: ["2 Outdoor Cameras", "1 Video Doorbell", "Mobile App Access", "1 Week Cloud Storage", "Standard Installation"],
    popular: false
  },
  {
    name: "Pro Business",
    price: "$899",
    desc: "Ideal for retail stores and offices.",
    features: ["8 4K Ultra HD Cameras", "NVR with 2TB Storage", "AI Motion Detection", "1 Month Cloud Backup", "Priority Support", "Professional Installation"],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For large facilities and multi-site.",
    features: ["Unlimited Scalability", "PTZ & License Plate Cameras", "Access Control Integration", "24/7 Professional Monitoring", "Dedicated Account Manager"],
    popular: false
  }
];

export default function Services() {
  return (
    <PageTransition>
      <div className="pt-32 pb-24">
        {/* Header */}
        <div className="relative py-20 mb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={`${import.meta.env.BASE_URL}images/services-bg.png`} 
              alt="Services Background" 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Our <span className="text-gradient">Services</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">End-to-end security solutions from planning and installation to 24/7 monitoring and maintenance.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
            {services.map((s, i) => (
              <div key={i} className="flex gap-6 p-8 rounded-3xl bg-card border border-white/5 hover:border-primary/30 transition-colors group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <s.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Tiers */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Installation Packages</h2>
            <p className="text-xl text-muted-foreground">Transparent pricing for standard setups. Contact us for custom quotes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, i) => (
              <div 
                key={i} 
                className={`relative flex flex-col p-8 rounded-3xl ${tier.popular ? 'bg-primary/5 border-primary shadow-[0_0_30px_rgba(0,182,212,0.15)]' : 'bg-card border-white/10'} border`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground text-sm min-h-[40px]">{tier.desc}</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-display font-bold">{tier.price}</span>
                  {tier.price !== "Custom" && <span className="text-muted-foreground"> /starting</span>}
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {tier.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/contact"
                  className={`w-full py-4 rounded-xl font-semibold text-center transition-all ${
                    tier.popular 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 glow-shadow-hover' 
                      : 'bg-white/5 hover:bg-white/10 text-foreground'
                  }`}
                >
                  Request Quote
                </Link>
              </div>
            ))}
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
