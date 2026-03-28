import { PageTransition } from "@/components/layout/PageTransition";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name ist erforderlich"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().optional(),
  message: z.string().min(10, "Nachricht muss mindestens 10 Zeichen enthalten")
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const { mutate: submitForm, isPending } = useSubmitContact({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Nachricht gesendet!",
          description: "Wir melden uns so schnell wie möglich bei Ihnen.",
        });
        reset();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Fehler",
          description: "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.",
        });
      }
    }
  });

  const onSubmit = (data: ContactFormData) => {
    submitForm({ data });
  };

  return (
    <PageTransition>
      <div className="pt-32 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Nehmen Sie <span className="text-gradient">Kontakt auf</span></h1>
            <p className="text-xl text-muted-foreground">Haben Sie Fragen zu unseren Produkten oder benötigen Sie eine individuelle Installationsofferte? Unsere Sicherheitsexperten helfen Ihnen gerne weiter.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
            
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-panel p-8 rounded-3xl">
                <h3 className="text-2xl font-bold mb-8">Kontaktinformationen</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Unser Standort</h4>
                      <p className="text-muted-foreground leading-relaxed">Wohlen AG &amp; Umgebung</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Telefon</h4>
                      <p className="text-muted-foreground">+41 76 227 46 57</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">E-Mail</h4>
                      <p className="text-muted-foreground">sales@swisscamsecurity.com<br/>support@swisscamsecurity.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Öffnungszeiten</h4>
                      <p className="text-muted-foreground">Mo–Fr: 08:00–18:00 Uhr<br/>24/7 Support für Bestandskunden</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
                
                <h3 className="text-2xl font-bold mb-8 relative z-10">Nachricht senden</h3>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Vollständiger Name *</label>
                      <input 
                        {...register("name")}
                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                        placeholder="Max Mustermann"
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Telefonnummer</label>
                      <input 
                        {...register("phone")}
                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                        placeholder="+41 76 000 00 00"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">E-Mail-Adresse *</label>
                    <input 
                      {...register("email")}
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="max@beispiel.ch"
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nachricht *</label>
                    <textarea 
                      {...register("message")}
                      rows={5}
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Wie können wir Ihnen helfen?"
                    />
                    {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                  </div>

                  <button 
                    type="submit"
                    disabled={isPending}
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 glow-shadow-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> Nachricht senden</>}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
