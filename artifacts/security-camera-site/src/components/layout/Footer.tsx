import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/5 pt-16 pb-8 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <img
                src={`${import.meta.env.BASE_URL}logo.jpeg`}
                alt="SwissCam Security Logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-display font-bold text-2xl tracking-tight text-foreground">
                SwissCam<span className="text-primary"> Security</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Professionelle Sicherheitslösungen für Ihr Zuhause und Ihr Unternehmen. 24/7-Überwachung in hochauflösender Qualität.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6 text-foreground">Schnelllinks</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Startseite</Link></li>
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">Produkte</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">Dienstleistungen</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6 text-foreground">Unsere Leistungen</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>Privatinstallation</li>
              <li>Gewerbliche Sicherheit</li>
              <li>24/7 Cloud-Überwachung</li>
              <li>Systemwartung</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6 text-foreground">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Wohlen AG &amp; Umgebung</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+41 76 227 46 57</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>contact@swisscamsecurity.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SwissCam Security. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-primary transition-colors">Nutzungsbedingungen</a>
            <Link href="/admin/login" className="hover:text-primary transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
