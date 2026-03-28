import { PageTransition } from "@/components/layout/PageTransition";
import { Link } from "wouter";
import { Home, Building2, Wrench, Headphones, Check } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Privatsysteme",
    desc: "Komplette Smart-Home-Sicherheitsinstallation mit Türklingelkameras, Innenraumüberwachung und Perimeterüberwachung."
  },
  {
    icon: Building2,
    title: "Gewerbe & Unternehmen",
    desc: "Skalierbares Zutrittskontrollsystem, Multi-Standort-Überwachung und kameragestützte Hochdichte-Absicherung für Betriebe."
  },
  {
    icon: Headphones,
    title: "24/7 Cloud-Überwachung",
    desc: "Sicherer Cloud-Speicher mit KI-gestütztem Alarmsystem und professionellem Überwachungsteam auf Abruf."
  },
  {
    icon: Wrench,
    title: "Wartung & Support",
    desc: "Regelmässige Systemprüfungen, Firmware-Updates und schnelle Reparaturdienste vor Ort."
  }
];

const tiers = [
  {
    name: "Basis Zuhause",
    price: "CHF 299",
    desc: "Ideal für Wohnungen und kleinere Häuser.",
    features: ["2 Aussenkameras", "1 Video-Türklingel", "Mobile App Zugriff", "1 Woche Cloud-Speicher", "Standardinstallation"],
    popular: false
  },
  {
    name: "Pro Gewerbe",
    price: "CHF 899",
    desc: "Optimal für Ladengeschäfte und Büros.",
    features: ["8 x 4K Ultra HD Kameras", "NVR mit 2TB Speicher", "KI-Bewegungserkennung", "1 Monat Cloud-Backup", "Prioritäts-Support", "Professionelle Installation"],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Auf Anfrage",
    desc: "Für grosse Anlagen und mehrere Standorte.",
    features: ["Unbegrenzte Skalierbarkeit", "PTZ & Kennzeichenkameras", "Zutrittskontrollintegration", "24/7 Profi-Überwachung", "Dedizierter Ansprechpartner"],
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
              alt="Dienstleistungen Hintergrund" 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Unsere <span className="text-gradient">Dienstleistungen</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Komplettlösungen für Sicherheit – von der Planung über die Installation bis zur 24/7-Überwachung und Wartung.</p>
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
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Installationspakete</h2>
            <p className="text-xl text-muted-foreground">Transparente Preise für Standardinstallationen. Kontaktieren Sie uns für individuelle Offerten.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, i) => (
              <div 
                key={i} 
                className={`relative flex flex-col p-8 rounded-3xl ${tier.popular ? 'bg-primary/5 border-primary shadow-[0_0_30px_rgba(0,182,212,0.15)]' : 'bg-card border-white/10'} border`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
                    Beliebteste Wahl
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground text-sm min-h-[40px]">{tier.desc}</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-display font-bold">{tier.price}</span>
                  {tier.price !== "Auf Anfrage" && <span className="text-muted-foreground"> /ab</span>}
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
                  Offerte anfordern
                </Link>
              </div>
            ))}
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
