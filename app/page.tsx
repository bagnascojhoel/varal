import { headers } from "next/headers";
import { DayCard } from "@/components/WashResult";
import { LocationDetector } from "@/components/LocationDetector";
import { LiveClock } from "@/components/LiveClock";
import { CarouselTrack } from "@/components/CarouselTrack";
import type { ForecastPageResponse } from "@/types/api";

const DAY_LABELS = ["Hoje", "Amanhã", "Depois de amanhã", "Em 3 dias"] as const;

interface PageProps {
  searchParams: Promise<{ lat?: string; lon?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const lat = params.lat ? parseFloat(params.lat) : null;
  const lon = params.lon ? parseFloat(params.lon) : null;

  const hasLocation = lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon);

  return (
    <>
      {/* Background — siblings of content so z-index layering works correctly */}
      <div className="weather-bg" aria-hidden="true" />
      <div className="weather-scrim" aria-hidden="true" />

    <div
      style={{
        position: "relative",
        zIndex: 10,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        padding: "1.25rem 1.25rem 0.75rem",
        maxWidth: "64rem",
        margin: "0 auto",
      }}
    >

      {/* Header */}
      <header className="app-header">
        <div>
          <h1 className="header-app-title">Devo Lavar Roupas?</h1>
        </div>
        <LiveClock />
      </header>

      {hasLocation ? (
        <ForecastContent lat={lat!} lon={lon!} />
      ) : (
        <LocationPrompt />
      )}

      <footer
        style={{
          marginTop: "0.65rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p className="footer-text">
          Precipitação via{" "}
          <a href="https://open-meteo.com" className="footer-link">
            Open-Meteo
          </a>
        </p>
        <p className="footer-text">Atualizado agora</p>
      </footer>
    </div>
    </>
  );
}

async function ForecastContent({ lat, lon }: { lat: number; lon: number }) {
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const url = `${protocol}://${host}/api/forecast?latitude=${lat}&longitude=${lon}`;

  let data: ForecastPageResponse;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status}`);
    data = (await res.json()) as ForecastPageResponse;
  } catch {
    return <ErrorState />;
  }

  const { forecasts, cityName, timeState, dayEnded, currentHour, currentMinutes } = data;

  return (
    <>
      {cityName && <p className="header-subtitle">{cityName}</p>}
      <CarouselTrack dayEnded={dayEnded}>
        {forecasts.map((forecast, i) => (
          <DayCard
            key={forecast.date}
            forecast={forecast}
            label={DAY_LABELS[i] ?? `Em ${i} dias`}
            cardIndex={i}
            isToday={i === 0}
            timeState={timeState}
            dayEnded={dayEnded}
            currentHour={currentHour}
            currentMinutes={currentMinutes}
          />
        ))}
      </CarouselTrack>
    </>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3">
      <span className="text-5xl">⚠️</span>
      <p
        className="text-lg font-light text-center"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        Serviço de previsão indisponível
      </p>
      <p
        className="text-sm text-center"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        Tente novamente mais tarde.
      </p>
    </div>
  );
}

function LocationPrompt() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6">
      <div className="text-center">
        <p
          className="text-2xl font-light mb-2"
          style={{ color: "rgba(255,255,255,0.88)" }}
        >
          Onde você está?
        </p>
        <p
          className="text-sm font-light"
          style={{ color: "rgba(255,255,255,0.42)" }}
        >
          Precisamos da sua localização para verificar a previsão.
        </p>
      </div>
      <LocationDetector />
    </div>
  );
}
