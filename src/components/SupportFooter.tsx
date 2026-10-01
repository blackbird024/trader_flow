import { AFFILIATE_LINKS, SUPPORT_LINKS } from "../lib/monetization";

export function SupportFooter() {
  return (
    <footer className="mt-10 border-t border-[var(--border)] pt-4 text-xs text-[var(--text-muted)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span>¿Te sirve TraderFlow?</span>
          <a
            href={SUPPORT_LINKS.coffee}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded border border-[var(--border)] px-2.5 py-1 font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-1)]"
          >
            ☕ Invitame un café
          </a>
        </div>
        {AFFILIATE_LINKS.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {AFFILIATE_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener sponsored"
                title={link.description}
                className="text-[var(--series-1)] hover:underline"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
