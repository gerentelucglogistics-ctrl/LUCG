"use client";

import { motion } from "motion/react";
import { defaultQuoteMessage, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/brand-icons";

export function WhatsAppFloat() {
  return (
    <motion.a
      data-menu-inert
      href={whatsappUrl(defaultQuoteMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 [animation-duration:2.5s]" />
      <WhatsAppIcon className="relative size-7" />
    </motion.a>
  );
}
