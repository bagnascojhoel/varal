'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

interface CarouselTrackProps {
  children: ReactNode;
  dayEnded: boolean;
}

export function DaysCarousel({ children, dayEnded }: CarouselTrackProps) {
  const t = useTranslations('DaysCarousel');
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const dotCount = 4;

  const dotLabelKeys = dayEnded
    ? (['tomorrow', 'dayAfterTomorrow', 'in3Days', 'in4Days'] as const)
    : (['today', 'tomorrow', 'dayAfterTomorrow', 'in3Days'] as const);

  // Track scroll to update active dot
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onScroll() {
      if (!track || window.innerWidth >= 1024) return;
      const midX = track.scrollLeft + track.clientWidth / 2;
      const cards = Array.from(
        track.querySelectorAll<HTMLElement>('[data-card-index]'),
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
    <div className="flex-1 flex flex-col gap-2">
      <div
        ref={trackRef}
        className={`flex flex-1 min-h-0 items-stretch overflow-x-auto snap-x snap-mandatory scroll-smooth [-webkit-overflow-scrolling:touch] gap-3 pr-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:gap-4 lg:overflow-x-visible lg:[scroll-snap-type:none] lg:pr-0 ${dayEnded ? 'lg:grid-cols-[1fr_1fr_1fr_1fr]' : 'lg:grid-cols-[1.15fr_1fr_1fr_1fr]'}`}
        role="region"
        aria-label={t('regionLabel')}
        aria-roledescription={t('carouselDescription')}
      >
        {children}
      </div>

      <div
        className="flex justify-center items-center gap-[0.35rem] pt-[0.85rem] lg:hidden"
        role="tablist"
        aria-label={t('navigationLabel')}
      >
        {Array.from({ length: dotCount }, (_, i) => (
          <button
            key={i}
            className={`flex items-center justify-center min-w-[44px] min-h-[44px] bg-transparent border-none cursor-pointer p-0 after:content-[''] after:block after:h-[6px] after:rounded-full after:transition-[width,background] after:duration-[250ms] ${activeDot === i ? 'after:w-[20px] after:bg-[rgba(255,255,255,0.85)] day:after:bg-[rgba(18,48,100,0.75)]' : 'after:w-[6px] after:bg-[rgba(255,255,255,0.28)] day:after:bg-[rgba(18,48,100,0.28)]'}`}
            role="tab"
            aria-selected={activeDot === i}
            aria-label={t(`dotLabels.${dotLabelKeys[i]}`)}
            onClick={() => scrollToCard(i)}
          />
        ))}
      </div>
    </div>
  );
}
