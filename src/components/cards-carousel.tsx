"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "@/lib/api-client";
import { CardItem } from "@/components/card-item";
import { useSounds } from "@/hooks/use-sounds";
import { useRef, useState } from "react";

function CardSkeleton() {
  return <div className="h-52 w-[88%] shrink-0 animate-pulse rounded-3xl bg-slate-200" />;
}

export function CardsCarousel() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cards"],
    queryFn: api.cards,
  });
  const { playSwipe } = useSounds();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        <CardSkeleton />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <p className="bg-destructive/10 text-destructive rounded-xl px-4 py-3 text-sm">
        No pudimos cargar tus tarjetas.
      </p>
    );
  }
  if (data.length === 0) {
    return (
      <p className="bg-surface text-ink-muted rounded-xl px-4 py-6 text-center text-sm">
        Aún no tenés tarjetas asociadas.
      </p>
    );
  }

  const handleScroll = () => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const cardWidth = track.scrollWidth / data.length;
    const next = Math.round(track.scrollLeft / cardWidth);
    if (next !== activeIndex) {
      setActiveIndex(next);
      playSwipe();
    }
  };

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2"
      >
        {data.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: idx * 0.08, ease: "easeOut" }}
            className="w-[88%] shrink-0 snap-center"
          >
            <CardItem card={card} index={idx} />
          </motion.div>
        ))}
      </div>
      {data.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {data.map((_, idx) => (
            <span
              key={idx}
              aria-hidden
              className={`h-1.5 rounded-full transition-all ${
                idx === activeIndex ? "bg-brand w-5" : "bg-ink-muted/30 w-1.5"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
