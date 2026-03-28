import { Link } from "wouter";
import { ShieldCheck, Video, Smartphone, Cloud, ArrowRight, Star } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { motion } from "framer-motion";

const features = [
  {
    icon: Video,
    title: "4K Ultra HD Bildqualität",
    description: "Erfassen Sie jedes Detail mit gestochen scharfen 4K-Auflösungskameras und überlegener Nachtsichtfunktion."
  },
  {
    icon: Smartphone,
    title: "Fernzugriff von überall",
    description: "Überwachen Sie Ihr Eigentum von Ihrem Smartphone, Tablet oder Computer – von überall auf der Welt."
  },
  {
    icon: Cloud,
    title: "Sicherer Cloud-Speicher",
    description: "Verschlüsselte Cloud-Backups sorgen dafür, dass Ihre Aufnahmen sicher sind, selbst wenn die Kamera manipuliert wird."
  },
  {
    icon: ShieldCheck,
    title: "KI-Bewegungserkennung",
    description: "Intelligente Algorithmen unterscheiden zwischen Menschen, Fahrzeugen und Tieren, um Fehlalarme zu reduzieren."
  }
];

const testimonials = [
  {
    name: "Sarah Müller",
    role: "Kleinunternehmerin",
    text: "SwissCam Security hat verändert, wie ich mein Geschäft überwache. Die Bildqualität und die einfache Bedienung der App sind unübertroffen. Sehr empfehlenswert!"
  },
  {
    name: "Michael Baumann",
    role: "Hauseigentümer",
    text: "Das Installationsteam war professionell und schnell. Endlich kann ich ruhig schlafen, weil ich weiss, dass mein Eigentum rund um die Uhr mit bester Technologie geschützt ist."
  },
  {
    name: "David Keller",
    role: "Lagerleiter",
    text: "Wir haben unser gesamtes Unternehmen auf das SwissCam Security 4K-System umgerüstet. Die KI-Bewegungserkennung hat uns unzählige Stunden bei der Videoauswertung gespart."
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
            alt="Hero Hintergrund" 
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
              <span className="text-sm font-medium tracking-wide uppercase">Modernste Sicherheit</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6 leading-tight"
            >
              Schützen Sie, was <br />
              <span className="text-gradient">am wichtigsten ist.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl"
            >
              Professionelle Sicherheitskameras und intelligente Überwachungslösungen für Ihr Zuhause und Ihr Unternehmen. Erleben Sie unvergleichliche Bildklarheit und Kontrolle.
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
                Produkte ansehen <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/contact"
                className="px-8 py-4 rounded-xl glass-panel text-foreground font-semibold flex items-center justify-center hover:bg-white/10 transition-all duration-300"
              >
                Kostenlose Offerte anfordern
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Warum SwissCam Security?</h2>
            <p className="text-muted-foreground text-lg">Wir verbinden modernste Technologie mit zuverlässiger Leistung, um Ihnen Sicherheitslösungen zu bieten, denen Sie vertrauen können.</p>
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
              <div className="text-4xl font-display font-bold text-primary mb-2">5'000+</div>
              <div className="text-muted-foreground font-medium">Installationen</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground font-medium">Verfügbarkeit</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground font-medium">Überwachung</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">10 Jahre</div>
              <div className="text-muted-foreground font-medium">Erfahrung</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[150px] -z-10 rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Von Tausenden geschätzt</h2>
            <p className="text-muted-foreground text-lg">Überzeugen Sie sich selbst. Hier ist, was unsere Kunden über ihre Erfahrung mit SwissCam Security sagen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-card border border-white/5 p-8 rounded-2xl">
                <div className="flex text-primary mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-lg text-foreground/90 italic mb-6 leading-relaxed">„{t.text}"</p>
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
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Bereit, Ihr Eigentum zu sichern?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Kontaktieren Sie unsere Experten noch heute für eine kostenlose Beratung und individuelle Systemplanung.</p>
            <Link 
              href="/contact"
              className="inline-flex px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:scale-105 transition-transform duration-300"
            >
              Jetzt starten
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
