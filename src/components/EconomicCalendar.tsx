import { useEffect, useRef } from "react";
import type { ResolvedTheme } from "../hooks/useTheme";

interface EconomicCalendarProps {
  theme: ResolvedTheme;
}

// Free embeddable widget, no API key or backend required.
// Docs: https://www.tradingview.com/widget-docs/widgets/calendars/economic-calendar/
export function EconomicCalendar({ theme }: EconomicCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";

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
    container.appendChild(script);
  }, [theme]);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4">
      <h2 className="text-sm font-semibold">Calendario económico</h2>
      <p className="text-xs text-[var(--text-muted)]">
        Próximos eventos que mueven el mercado. Datos de TradingView.
      </p>
      <div ref={containerRef} className="tradingview-widget-container mt-3 h-[650px] w-full" />
    </div>
  );
}
