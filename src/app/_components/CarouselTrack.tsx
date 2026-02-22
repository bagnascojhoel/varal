'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useState } from 'react';
const DOT_LABELS = ['Hoje', 'Amanhã', 'Depois de amanhã', 'Em 3 dias'];

interface CarouselTrackProps {
  children: ReactNode;
  dayEnded: boolean;
}

export function CarouselTrack({ children, dayEnded }: CarouselTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(dayEnded ? 1 : 0);
  const dotCount = dayEnded ? 4 : 3;

  // Auto-scroll to card 1 when day has ended
  useEffect(() => {
    if (!dayEnded) return;
    if (window.innerWidth >= 1024) return;

    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>('[data-card-index="1"]');
    if (card) {
      setTimeout(() => {
        track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
      }, 80);
    }
  }, [dayEnded]);

  // Track scroll to update active dot
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onScroll() {
      if (!track || window.innerWidth >= 1024) return;
      const midX = track.scrollLeft + track.clientWidth / 2;
      const cards = Array.from(
        track.querySelectorAll<HTMLElement>('.card[data-card-index]'),
      ).filter((c) => c.offsetParent !== null);

      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card) => {
        const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - midX);
        if (dist < minDist) {
          minDist = dist;
          closest = Number(card.dataset.cardIndex ?? 0);
        }
      });
      setActiveDot(closest);
    }

    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToCard(index: number) {
    const track = trackRef.current;
    if (!track || window.innerWidth >= 1024) return;
    const card = track.querySelector<HTMLElement>(
      `[data-card-index="${index}"]`,
    );
    if (card && card.offsetParent !== null) {
      track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <div
        ref={trackRef}
        className="cards-track"
        role="region"
        aria-label="Previsão para os próximos dias"
        aria-roledescription="carrossel"
      >
        {children}
      </div>

      <div
        className="carousel-dots"
        role="tablist"
        aria-label="Navegar entre dias"
      >
        {Array.from({ length: dotCount }, (_, i) => (
          <button
            key={i}
            className={`dot${i === 3 ? ' dot-day3' : ''}${activeDot === i ? ' active' : ''}`}
            role="tab"
            aria-selected={activeDot === i}
            aria-label={DOT_LABELS[i]}
            onClick={() => scrollToCard(i)}
          />
        ))}
      </div>
    </div>
  );
}
