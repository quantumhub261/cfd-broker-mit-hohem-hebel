const DOMAIN = 'https://cfd-hebel-guide.de';
const LIBERTEX = 'https://libertex.com/de/';
const UPDATED = 'August 2026';

function headCommon(opts) {
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${opts.metaTitle}</title>
<meta name="description" content="${opts.metaDescription}">
<link rel="canonical" href="${DOMAIN}/${opts.slug}"/>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<link rel="stylesheet" href="/style.css">
${opts.schema}`;
}

function orgSchema() {
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CFD-Hebel-Guide",
  "url": "${DOMAIN}/",
  "description": "Unabhängige Informationsplattform zu CFD Brokern mit hohem Hebel, ESMA-Regulierung und Risiken für deutsche Trader.",
  "inLanguage": "de",
  "foundingDate": "2026",
  "areaServed": "DE"
}
</script>`;
}

function webPageSchema(opts) {
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${opts.h1.replace(/"/g, '\\"')}",
  "url": "${DOMAIN}/${opts.slug}",
  "description": "${opts.metaDescription}",
  "inLanguage": "de",
  "datePublished": "2026-01-01",
  "dateModified": "2026-08-28",
  "author": { "@type": "Organization", "name": "CFD-Hebel-Guide" },
  "publisher": { "@type": "Organization", "name": "CFD-Hebel-Guide" }
}
</script>`;
}

function breadcrumbSchema(items) {
  const list = items.map((it, i) => `{ "@type": "ListItem", "position": ${i + 1}, "name": "${it.label.replace(/"/g, '\\"')}", "item": "${it.href}" }`).join(',\n    ');
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    ${list}
  ]
}
</script>`;
}

function faqSchema(faqs) {
  const items = faqs.map(f => `{
      "@type": "Question",
      "name": "${f.q.replace(/"/g, '\\"')}",
      "acceptedAnswer": { "@type": "Answer", "text": "${f.a.replace(/"/g, '\\"')}" }
    }`).join(',\n    ');
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    ${items}
  ]
}
</script>`;
}

const NAV_ITEMS = [
  { label: 'Übersicht', href: '/index.html' },
  { label: 'Hebelwirkung', href: '/hebelwirkung-cfd-erklaert.html' },
  { label: 'ESMA-Limits', href: '/esma-hebel-limits-deutschland.html' },
  { label: 'Regulierung', href: '/cfd-broker-regulierung-deutschland.html' },
  { label: 'Risiken', href: '/risiken-cfd-handel-hebel.html' },
  { label: 'FAQ', href: '/index.html#faq' }
];

function header(activeHref) {
  const links = NAV_ITEMS.map(n => `<a href="${n.href}"${n.href === activeHref ? ' class="active"' : ''}>${n.label}</a>`).join('\n        ');
  return `<div class="top-bar">
  <div class="container">
    <div class="top-bar-msg"><i class="fas fa-triangle-exclamation"></i> Risikohinweis: 74–89 % der Retail-CFD-Konten verlieren Geld</div>
    <div class="top-bar-links">
      <a href="#regulierung">Regulierung</a>
      <a href="#rechner">Margin-Rechner</a>
      <a href="#faq">FAQ</a>
    </div>
  </div>
</div>
<header class="site-header">
  <div class="container nav-row">
    <a href="/index.html" class="logo">
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="14" fill="#0B1120"/><path d="M14 42 L26 30 L34 38 L50 18" stroke="#E3A542" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M40 18 H50 V28" stroke="#E3A542" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
      <span>CFD Hebel <span class="logo-accent">Guide</span></span>
    </a>
    <button class="nav-toggle" aria-label="Menü öffnen" aria-expanded="false"><i class="fas fa-bars"></i></button>
    <nav class="main-nav">
      ${links}
    </nav>
    <div class="header-actions">
      <a href="#rechner" class="btn btn-secondary btn-sm hide-mobile"><i class="fas fa-calculator"></i> <span class="hide-mobile">Rechner</span></a>
      <a href="${LIBERTEX}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm"><i class="fas fa-rocket"></i> Demokonto öffnen</a>
    </div>
  </div>
</header>`;
}

function breadcrumb(items) {
  const lis = items.map((it, i) => i === items.length - 1
    ? `<li aria-current="page">${it.label}</li>`
    : `<li><a href="${it.href}">${it.label}</a></li>`).join('\n      ');
  return `<nav class="breadcrumb-bar" aria-label="Breadcrumb">
  <div class="container">
    <ol>
      ${lis}
    </ol>
  </div>
</nav>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a href="/index.html" class="logo">
          <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:28px;height:28px;"><rect width="64" height="64" rx="14" fill="#0B1120"/><path d="M14 42 L26 30 L34 38 L50 18" stroke="#E3A542" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M40 18 H50 V28" stroke="#E3A542" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
          <span>CFD Hebel <span class="logo-accent">Guide</span></span>
        </a>
        <p>Unabhängige Informationsplattform zu CFD Brokern mit hohem Hebel, ESMA-Regulierung und Risikomanagement für deutsche Trader.</p>
        <p>© 2026 CFD Hebel Guide. Alle Rechte vorbehalten.</p>
      </div>
      <div>
        <h4>Grundlagen</h4>
        <ul>
          <li><a href="/index.html">Übersicht</a></li>
          <li><a href="/hebelwirkung-cfd-erklaert.html">Hebelwirkung erklärt</a></li>
          <li><a href="/esma-hebel-limits-deutschland.html">ESMA-Hebellimits</a></li>
          <li><a href="/cfd-broker-regulierung-deutschland.html">Regulierung in Deutschland</a></li>
          <li><a href="/offshore-cfd-broker-ohne-esma.html">Offshore-Broker ohne ESMA</a></li>
        </ul>
      </div>
      <div>
        <h4>Praxis</h4>
        <ul>
          <li><a href="/cfd-broker-vergleich-hebel.html">Broker-Vergleich</a></li>
          <li><a href="/risiken-cfd-handel-hebel.html">Risiken beim Hebel-Handel</a></li>
          <li><a href="/professioneller-trader-status-beantragen.html">Profistatus beantragen</a></li>
          <li><a href="/cfd-konto-eroeffnen-anleitung.html">Konto eröffnen: Anleitung</a></li>
          <li><a href="/cfd-handelsstrategien-hebel.html">Handelsstrategien</a></li>
          <li><a href="/cfd-steuer-deutschland.html">CFD-Steuer Deutschland</a></li>
        </ul>
      </div>
      <div>
        <h4>Rechtliches</h4>
        <ul>
          <li><a href="#risiko">Risikohinweis</a></li>
          <li><a href="#ueber">Über uns</a></li>
          <li><a href="#kontakt">Kontakt</a></li>
          <li><a href="#">Datenschutz</a></li>
          <li><a href="#">Impressum</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-legal">
      <p><strong>Risikohinweis:</strong> Der Handel mit CFDs ist mit erheblichem Verlustrisiko verbunden. Zwischen 74 und 89 % der Retail-CFD-Konten verlieren Geld. Dieser Inhalt dient ausschließlich zu Informationszwecken und stellt keine Anlageberatung dar. Vergangene Wertentwicklungen sind kein zuverlässiger Indikator für zukünftige Ergebnisse.</p>
      <p><strong>Affiliate Disclosure:</strong> Diese Seite kann Affiliate-Links enthalten. Wenn Sie über unsere Links ein Konto eröffnen, erhalten wir möglicherweise eine Vergütung. Dies beeinflusst unsere redaktionellen Bewertungen nicht.</p>
    </div>
    <div class="footer-bottom">Stand: ${UPDATED} · Letzte Aktualisierung: ${UPDATED}</div>
  </div>
</footer>
<script src="/script.js"></script>`;
}

function ctaBlock(text, buttonText) {
  return `<div class="cta-block">
  <h3><i class="fas fa-flask"></i> ${text}</h3>
  <p>Ein Demokonto ermöglicht das Testen der Handelsplattform mit virtuellem Kapital – ohne echtes Verlustrisiko.</p>
  <a href="${LIBERTEX}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">${buttonText} →</a>
</div>`;
}

function faqSection(faqs, idOverride) {
  const items = faqs.map(f => `<details class="faq-item">
        <summary>${f.q}</summary>
        <div class="faq-answer">${f.a}</div>
      </details>`).join('\n      ');
  return `<section id="${idOverride || 'faq'}" class="alt">
  <div class="container">
    <span class="section-eyebrow">Häufige Fragen</span>
    <h2>FAQ</h2>
    <div class="faq-list">
      ${items}
    </div>
  </div>
</section>`;
}

function relatedSection(items) {
  const cards = items.map(it => `<a href="/${it.slug}.html" class="related-card"><i class="fas ${it.icon}"></i><span class="related-title">${it.title}</span></a>`).join('\n      ');
  return `<section>
  <div class="container">
    <span class="section-eyebrow">Weiterlesen</span>
    <h2>Verwandte Inhalte</h2>
    <div class="related-grid">
      ${cards}
    </div>
  </div>
</section>`;
}

function table(headers, rows) {
  const thead = headers.map(h => `<th>${h}</th>`).join('');
  const tbody = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('\n          ');
  return `<div class="table-responsive">
        <table class="data-table">
          <thead><tr>${thead}</tr></thead>
          <tbody>
          ${tbody}
          </tbody>
        </table>
      </div>`;
}

function stepList(steps) {
  return `<ol class="step-list">
        ${steps.map(s => `<li>${s}</li>`).join('\n        ')}
      </ol>`;
}

function ul(items) {
  return `<ul>
        ${items.map(i => `<li>${i}</li>`).join('\n        ')}
      </ul>`;
}

function libertexLink(label) {
  return `<a href="${LIBERTEX}" target="_blank" rel="noopener noreferrer">${label || 'libertex.com/de'}</a>`;
}

const ICONS = {
  'hebelwirkung-cfd-erklaert': 'fa-chart-line',
  'esma-hebel-limits-deutschland': 'fa-gavel',
  'cfd-broker-regulierung-deutschland': 'fa-building-columns',
  'offshore-cfd-broker-ohne-esma': 'fa-globe',
  'cfd-broker-vergleich-hebel': 'fa-scale-balanced',
  'risiken-cfd-handel-hebel': 'fa-triangle-exclamation',
  'professioneller-trader-status-beantragen': 'fa-user-tie',
  'cfd-konto-eroeffnen-anleitung': 'fa-id-card',
  'cfd-handelsstrategien-hebel': 'fa-chess',
  'cfd-steuer-deutschland': 'fa-file-invoice-euro'
};

const TITLES = {
  'hebelwirkung-cfd-erklaert': 'Hebelwirkung erklärt',
  'esma-hebel-limits-deutschland': 'ESMA-Hebellimits',
  'cfd-broker-regulierung-deutschland': 'Regulierung in Deutschland',
  'offshore-cfd-broker-ohne-esma': 'Offshore-Broker ohne ESMA',
  'cfd-broker-vergleich-hebel': 'Broker-Vergleich',
  'risiken-cfd-handel-hebel': 'Risiken beim Hebel-Handel',
  'professioneller-trader-status-beantragen': 'Profistatus beantragen',
  'cfd-konto-eroeffnen-anleitung': 'Konto eröffnen: Anleitung',
  'cfd-handelsstrategien-hebel': 'Handelsstrategien',
  'cfd-steuer-deutschland': 'CFD-Steuer Deutschland'
};

function relatedItem(slug) {
  return { slug: slug, title: TITLES[slug], icon: ICONS[slug] };
}

module.exports = {
  DOMAIN, LIBERTEX, UPDATED,
  headCommon, orgSchema, webPageSchema, breadcrumbSchema, faqSchema,
  header, breadcrumb, footer, ctaBlock, faqSection, relatedSection,
  table, stepList, ul, libertexLink, relatedItem, ICONS, TITLES
};
