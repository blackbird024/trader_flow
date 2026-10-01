import { useEffect, useRef, useState } from "react";
import type { ResolvedTheme } from "../hooks/useTheme";

interface EconomicCalendarProps {
  theme: ResolvedTheme;
}

const LOAD_TIMEOUT_MS = 6000;

// Free embeddable widget, no API key or backend required.
// Docs: https://www.tradingview.com/widget-docs/widgets/calendars/economic-calendar/
export function EconomicCalendar({ theme }: EconomicCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";
    setStatus("loading");

    const widgetSlot = document.createElement("div");
    widgetSlot.className = "tradingview-widget-container__widget";
    container.appendChild(widgetSlot);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-economic-calendar.js";
    script.async = true;
    script.text = JSON.stringify({
      colorTheme: theme,
      isTransparent: true,
      width: "100%",
      height: "100%",
      locale: "es",
      importanceFilter: "-1,0,1",
      countryFilter: "us,eu,gb,jp,cn,au,ca,ch,nz",
    });
    script.onload = () => setStatus("loaded");
    script.onerror = () => setStatus("failed");
    container.appendChild(script);

    // Some ad/privacy blockers silently strip the widget without firing
    // onerror, so fall back on a timeout too if nothing rendered.
    const timeout = setTimeout(() => {
      setStatus((prev) => (prev === "loading" ? "failed" : prev));
    }, LOAD_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [theme]);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4">
      <h2 className="text-sm font-semibold">Calendario económico</h2>
      <p className="text-xs text-[var(--text-muted)]">
        Próximos eventos que mueven el mercado. Datos de TradingView.
      </p>

      {status === "failed" && (
        <div className="mt-3 flex h-[200px] flex-col items-center justify-center gap-2 rounded border border-dashed border-[var(--border)] px-4 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            No se pudo cargar el calendario acá — probablemente un bloqueador de anuncios o rastreadores
            (uBlock, Brave Shield, etc.) está frenando el widget de TradingView.
          </p>
          <a
            href="https://www.tradingview.com/economic-calendar/"
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm font-medium text-[var(--series-1)] hover:underline"
          >
            Abrir el calendario en TradingView ↗
          </a>
        </div>
      )}

      <div
        ref={containerRef}
        className="tradingview-widget-container mt-3 w-full"
        style={{ height: status === "failed" ? 0 : 650, overflow: "hidden" }}
      />
    </div>
  );
}
