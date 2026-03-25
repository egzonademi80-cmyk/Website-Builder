import { Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      <motion.a
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        href="tel:+15551234567"
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_20px_rgba(0,182,212,0.4)] hover:scale-110 transition-transform"
        aria-label="Call us"
      >
        <Phone className="w-6 h-6" />
      </motion.a>
      
      <motion.a
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        href="https://wa.me/15551234567"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform"
        aria-label="WhatsApp us"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.a>
    </div>
  );
}
