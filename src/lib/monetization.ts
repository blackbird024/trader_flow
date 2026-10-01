/**
 * Support / affiliate links shown in the footer. Replace the placeholder
 * URLs below with your real ones — nothing here calls out to any service
 * or collects data, it's just links.
 */
export const SUPPORT_LINKS = {
  // Buy Me a Coffee / Ko-fi / GitHub Sponsors — your donation page.
  coffee: "https://www.buymeacoffee.com/TU_USUARIO",
};

export interface AffiliateLink {
  label: string;
  description: string;
  url: string;
}

// One row per partner. Only add a link once you have an approved
// affiliate/referral program — most prop firms and brokers require
// applying first.
export const AFFILIATE_LINKS: AffiliateLink[] = [
  {
    label: "Apex Trader Funding",
    description: "Cuentas de evaluación y fondeo para futuros",
    url: "https://TU_LINK_DE_AFILIADO_APEX",
  },
];
