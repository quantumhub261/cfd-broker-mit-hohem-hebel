const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOMAIN = 'https://cfd-hebel-guide.de';
const LIBERTEX = 'https://libertex.com/de/';
const UPDATED = 'August 2026';

/* ---------------------------------------------------------------------- */
/* Shared partials                                                        */
/* ---------------------------------------------------------------------- */

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
      <a href="/index.html#regulierung">Regulierung</a>
      <a href="/index.html#rechner">Margin-Rechner</a>
      <a href="/index.html#faq">FAQ</a>
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
      <a href="/index.html#rechner" class="btn btn-secondary btn-sm hide-mobile"><i class="fas fa-calculator"></i> <span class="hide-mobile">Rechner</span></a>
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
          <li><a href="/index.html#risiko">Risikohinweis</a></li>
          <li><a href="/index.html#ueber">Über uns</a></li>
          <li><a href="/index.html#kontakt">Kontakt</a></li>
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

function faqSection(faqs) {
  const items = faqs.map(f => `<details class="faq-item">
        <summary>${f.q}</summary>
        <div class="faq-answer">${f.a}</div>
      </details>`).join('\n      ');
  return `<section id="faq" class="alt">
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

/* ---------------------------------------------------------------------- */
/* Page template                                                          */
/* ---------------------------------------------------------------------- */

function renderPage(p) {
  const breadcrumbItems = [
    { label: 'Startseite', href: `${DOMAIN}/index.html` },
    { label: 'CFD Broker mit hohem Hebel', href: `${DOMAIN}/index.html` },
    { label: p.breadcrumbLabel }
  ];
  const schema = [
    orgSchema(),
    webPageSchema(p),
    breadcrumbSchema(breadcrumbItems),
    faqSchema(p.faqs)
  ].join('\n');

  const relatedItems = p.related.map(slug => PAGE_INDEX[slug]);

  return `<!DOCTYPE html>
<html lang="de">
<head>
${headCommon({ metaTitle: p.metaTitle, metaDescription: p.metaDescription, slug: p.slug + '.html', schema })}
</head>
<body>
${header('/' + p.navHref)}
${breadcrumb([
    { label: 'Startseite', href: '/index.html' },
    { label: 'CFD Broker mit hohem Hebel', href: '/index.html' },
    { label: p.breadcrumbLabel }
  ])}
<main>
  <section class="page-hero">
    <div class="container">
      <span class="badge"><i class="fas fa-shield-halved"></i> ESMA-regulierter Bereich · Risikohinweis</span>
      <h1>${p.h1}</h1>
      <p class="lead" style="text-align:center;margin:0 auto;">${p.heroLead}</p>
      <p class="meta-line">Zuletzt aktualisiert: ${UPDATED} · Fact-checked</p>
    </div>
  </section>

  <section>
    <div class="container article-content">
      <div class="risk-box compact">
        <p><i class="fas fa-triangle-exclamation"></i> <strong>Risikohinweis:</strong> ${p.riskText}</p>
      </div>

      ${p.body}

      ${ctaBlock(p.ctaText, p.ctaButton)}
    </div>
  </section>

  ${faqSection(p.faqs)}

  ${relatedSection(relatedItems)}
</main>
${footer()}
</body>
</html>
`;
}

/* ---------------------------------------------------------------------- */
/* Reusable content fragments                                             */
/* ---------------------------------------------------------------------- */

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

function leverageBars() {
  const rows = [
    ['Hauptwährungspaare', 100, '1:30', '3,33 %'],
    ['Gold, Hauptindizes', 67, '1:20', '5 %'],
    ['Sonstige Rohstoffe', 33, '1:10', '10 %'],
    ['Aktien-CFDs', 17, '1:5', '20 %'],
    ['Kryptowährungen', 7, '1:2', '50 %']
  ];
  return `<div class="leverage-bars">
        ${rows.map(r => `<div class="leverage-bar-row">
          <div class="leverage-bar-label">${r[0]}</div>
          <div class="leverage-bar-track"><div class="leverage-bar-fill" style="width:${r[1]}%"></div></div>
          <div class="leverage-bar-value">${r[2]}</div>
        </div>`).join('\n        ')}
      </div>
      <p class="table-caption">Mindest-Margin je Asset-Klasse: 3,33 % (Forex) bis 50 % (Krypto)</p>`;
}

function libertexLink(label) {
  return `<a href="${LIBERTEX}" target="_blank" rel="noopener noreferrer">${label || 'libertex.com/de'}</a>`;
}

/* ---------------------------------------------------------------------- */
/* Page data                                                              */
/* ---------------------------------------------------------------------- */

const PAGES = [];

PAGES.push({
  slug: 'hebelwirkung-cfd-erklaert',
  navHref: 'hebelwirkung-cfd-erklaert.html',
  breadcrumbLabel: 'Hebelwirkung erklärt',
  h1: 'Hebelwirkung beim CFD-Handel erklärt: Leverage, Margin-Berechnung und Stop-Out-Level',
  metaTitle: 'Hebelwirkung beim CFD-Handel: Margin, Stop-Out & Tiered Leverage 2026',
  metaDescription: 'Wie die Hebelwirkung beim CFD-Handel funktioniert: Margin-Formel, Margin Call, Stop-Out-Level (BaFin: 50 %) und Tiered Leverage – mit Rechenbeispielen.',
  heroLead: 'Leverage vervielfacht den Positionswert im Verhältnis zur hinterlegten Margin – und wirkt symmetrisch auf Gewinne wie Verluste. Formeln, Stop-Out-Regeln und Praxisbeispiele im Überblick.',
  riskText: 'Der Handel mit gehebelten Finanzinstrumenten ist mit erheblichem Verlustrisiko verbunden. Es besteht das Risiko des Totalverlustes der Einlage. Dieser Artikel dient ausschließlich zu Informationszwecken.',
  ctaText: 'Margin-Berechnungen ohne Risiko testen',
  ctaButton: 'Zum Demokonto',
  related: ['esma-hebel-limits-deutschland', 'risiken-cfd-handel-hebel', 'cfd-konto-eroeffnen-anleitung'],
  body: `
      <h2>Was bedeutet Hebelwirkung beim CFD-Handel?</h2>
      <p>Die Hebelwirkung (Leverage) beim CFD-Handel bezeichnet das Verhältnis zwischen dem tatsächlichen Positionswert und der hinterlegten Margin (Sicherheitsleistung). Bei Hebel 1:30 kontrolliert ein Trader mit 1.000 EUR Margin eine Position von 30.000 EUR. Formel: Margin = Positionswert / Hebel. Unterschreitet das freie Kapital den Margin-Call-Level, wird der Trader zur Nacheinzahlung aufgefordert; bei Unterschreitung des Stop-Out-Levels schließt der Broker Positionen automatisch (BaFin-Mindest: 50 % des Margin-Bedarfs für EU-Retail-Broker).</p>

      <h2>Margin-Berechnung Schritt für Schritt</h2>
      <p>Formel: Margin = Positionswert / Hebel. Drei Beispiele: EUR/USD 1 Lot (110.000 EUR) / 30 = 3.667 EUR Margin; Gold 1 Lot (200.000 USD) / 20 = 10.000 USD Margin; Aktien-CFD 100 Stück (20.000 USD) / 5 = 4.000 USD Margin. Die Margin ist keine Gebühr; sie wird bei Schließung der Position (zuzüglich Gewinn oder abzüglich Verlust) freigegeben. Freie Margin = Eigenkapital minus genutzte Margin.</p>
      ${table(['Instrument', 'Positionswert', 'Hebel', 'Margin'], [
        ['EUR/USD (1 Lot)', '110.000 EUR', '1:30', '3.667 EUR'],
        ['Gold XAU/USD (1 Lot)', '200.000 USD', '1:20', '10.000 USD'],
        ['Aktien-CFD (100 St.)', '20.000 USD', '1:5', '4.000 USD']
      ])}
      <p class="table-caption">Möchten Sie eigene Werte durchrechnen? Nutzen Sie den <a href="/index.html#rechner">Margin-Rechner auf der Startseite</a>.</p>

      <h2>Freie Margin vs. genutzte Margin</h2>
      <p>Die genutzte Margin ist die Summe aller Sicherheitsleistungen für offene Positionen. Die freie Margin ist das verbleibende Kapital für neue Positionen oder als Puffer gegen Verluste. Freie Margin = Eigenkapital minus genutzte Margin. Der Margin-Level (Eigenkapital / genutzte Margin × 100 %) wird in der Handelsplattform in Echtzeit angezeigt. Ein Margin-Level von 100 % bedeutet: kein freies Kapital mehr vorhanden.</p>

      <h2>Margin Call und Stop-Out erklärt</h2>
      <p>Margin Call ist das Signal des Brokers, dass das freie Kapital unter den Mindest-Margin-Level gesunken ist. Typische Broker setzen den Margin Call bei 80–100 % des Margin-Levels. Stop-Out ist die automatische Positionsschließung durch den Broker. Gemäß BaFin-Allgemeinverfügung liegt der Stop-Out für Retail Clients bei EU-Brokern bei mindestens 50 % des Margin-Bedarfs.</p>
      ${stepList([
        'Eigenkapital sinkt durch Kursbewegungen gegen offene Positionen.',
        'Margin-Level fällt auf den Margin-Call-Threshold; der Broker informiert den Trader.',
        'Stop-Out-Level erreicht; der Broker schließt die verlustreichste offene Position automatisch.'
      ])}
      <p>Das Wochenend-Gap-Risiko erhöht die Stop-Out-Gefahr: Kurssprünge über Wochenenden führen zu schlechterer Stop-Loss-Ausführung.</p>

      <h2>Tiered Leverage</h2>
      <p>Tiered Leverage (gestaffelter Hebel) bezeichnet die Praxis, bei der viele EU-regulierte Broker den maximalen Hebel nach Positionsgröße staffeln. Größere Positionen erhalten einen niedrigeren Hebel. Konkrete Werte sind brokerabhängig und im jeweiligen Handelsregelwerk dokumentiert. Dieses Prinzip soll das Risiko bei sehr großen Positionen begrenzen.</p>

      <h2>Negativsaldoschutz in der EU</h2>
      <p>Der Negativsaldoschutz (Negative Balance Protection) schützt Retail Clients bei EU-regulierten Brokern davor, mehr als das eingezahlte Kapital zu verlieren. Die ESMA-Produktinterventionsmaßnahmen (August 2018) haben diesen Schutz eingeführt; die BaFin setzt ihn dauerhaft um. Entsteht durch einen Marktgap ein Verlust über das Kontoguthaben hinaus, trägt der Broker die Differenz. Der Schutz entfällt bei Professional Clients (MiFID II) und Kunden von Offshore-Brokern.</p>

      <h2>Hebelrechner nutzen</h2>
      <p>Der ${libertexLink()} Margin-Rechner unterstützt Trader bei der Berechnung von erforderlicher Margin und Positionswert. Der Rechner ist ein Planungswerkzeug; er gibt keine Auskunft über zukünftige Marktbewegungen. Das Demokonto ermöglicht das Testen von Margin-Berechnungen mit virtuellem Kapital ohne echtes Verlustrisiko.</p>
  `,
  faqs: [
    { q: 'Was ist der Unterschied zwischen Margin Call und Stop-Out?', a: 'Margin Call ist eine Warnung des Brokers, wenn die freie Margin unter den Mindestlevel fällt; der Trader wird zur Nacheinzahlung aufgefordert. Stop-Out ist eine automatische Maßnahme: Der Broker schließt Positionen, wenn das Eigenkapital den Stop-Out-Level unterschreitet, ohne Aufforderung des Traders.' },
    { q: 'Wie viel Margin brauche ich für einen Standard-Lot EUR/USD mit Hebel 1:30?', a: 'Ein Standard-Lot EUR/USD bei Kurs 1,10 hat einen Positionswert von 110.000 EUR. Margin: 110.000 / 30 = 3.667 EUR. Für einen Mini-Lot (0,1 Lot): 367 EUR.' },
    { q: 'Was passiert bei einem Wochenend-Gap mit meiner gehebelten Position?', a: 'Stop-Loss-Orders werden beim nächsten verfügbaren Kurs nach Markteröffnung ausgeführt. Bei starkem Gap kann dieser Kurs schlechter als der geplante Stop-Loss sein. Bei EU-regulierten Brokern mit Retail-Status verhindert der Negativsaldoschutz ein negatives Kontoguthaben.' }
  ]
});

PAGES.push({
  slug: 'esma-hebel-limits-deutschland',
  navHref: 'esma-hebel-limits-deutschland.html',
  breadcrumbLabel: 'ESMA-Hebellimits',
  h1: 'Welchen maximalen Hebel dürfen CFD Broker in Deutschland anbieten? ESMA-Limits erklärt',
  metaTitle: 'ESMA-Hebellimits in Deutschland 2026: 1:30 bis 1:2 im Überblick',
  metaDescription: 'ESMA-Hebellimits für Privatanleger: 1:30 Forex, 1:20 Gold & Indizes, 1:10 Rohstoffe, 1:5 Aktien, 1:2 Krypto. BaFin-Umsetzung, Pflichtangaben und Profistatus erklärt.',
  heroLead: 'Seit 2018 begrenzt die ESMA den maximalen Hebel für Privatanleger je nach Asset-Klasse. Alle Limits, die BaFin-Umsetzung und Ausnahmen für Professional Clients im Überblick.',
  riskText: 'Der Handel mit CFDs ist mit erheblichem Verlustrisiko verbunden.',
  ctaText: 'Handelsplattform mit ESMA-konformem Hebel testen',
  ctaButton: 'Zum Demokonto',
  related: ['hebelwirkung-cfd-erklaert', 'cfd-broker-regulierung-deutschland', 'cfd-broker-vergleich-hebel'],
  body: `
      <h2>ESMA-Hebellimits nach Asset-Klasse</h2>
      <p>Die ESMA unterscheidet Hebelgrenzen nach der Volatilität des jeweiligen Basiswerts. Volatilere Instrumente erhalten niedrigere maximale Hebel, um das Verlustrisiko für Retail Clients zu begrenzen. Diese Werte gelten für alle BaFin-, CySEC- und FCA-lizenzierten Broker für Retail-Client-Konten. Broker dürfen niedrigere, aber keine höheren Hebel als die ESMA-Limits anbieten.</p>
      ${leverageBars()}

      <h3>Warum unterschiedliche Limits je Asset-Klasse?</h3>
      <p>Die ESMA differenziert Hebelgrenzen nach der historischen Volatilität des jeweiligen Instruments. Hauptwährungspaare gelten als vergleichsweise stabil; sie erhalten den höchsten Hebel (1:30). Kryptowährungen zeigen deutlich höhere Kursausschläge und erhalten daher den niedrigsten Hebel (1:2). Gold wird trotz seiner Eigenschaft als Rohstoff gemeinsam mit Hauptindizes bei 1:20 eingestuft, da es als Absicherungsinstrument häufig weniger volatil ist als andere Rohstoffe. Die Staffelung soll sicherstellen, dass eine typische Kursbewegung nicht sofort zum Totalverlust der Margin führt.</p>

      <h2>BaFin und nationale Umsetzung</h2>
      <p>Die BaFin (Bundesanstalt für Finanzdienstleistungsaufsicht) setzt die ESMA-Produktinterventionsmaßnahmen in Deutschland auf Basis von §4b WpHG (Wertpapierhandelsgesetz) dauerhaft um. Die BaFin lizenziert CFD Broker, die in Deutschland tätig sind, und führt ein öffentlich zugängliches Register aller zugelassenen Finanzdienstleister. Trader können dort den Regulierungsstatus eines Brokers vor der Kontoeröffnung überprüfen.</p>
      <p>EU-Passporting ermöglicht es CySEC-lizenzierten Brokern, ihr Angebot nach MiFID II grenzüberschreitend in Deutschland anzubieten, ohne eine separate BaFin-Zulassung zu benötigen. Diese Broker unterliegen denselben ESMA-Hebellimits wie direkt BaFin-lizenzierte Anbieter.</p>

      <h2>Pflichtangaben EU-regulierter CFD Broker</h2>
      ${ul([
        '<strong>Negativsaldoschutz:</strong> Verluste können das eingezahlte Kapital nicht übersteigen; der Broker trägt Verluste aus Marktgaps über das Kontoguthaben hinaus',
        '<strong>Standardized Risk Warning:</strong> Jeder Broker muss den prozentualen Anteil verlierender Privatanlegerkonten in seinen Marketingmaterialien angeben; laut ESMA-Daten liegt dieser Anteil typischerweise zwischen 74 und 89 %',
        '<strong>Marginschließungsregel:</strong> EU-regulierte Broker müssen Positionen automatisch schließen, wenn der Margin-Level auf 50 % des erforderlichen Margins fällt (per Position oder auf Kontobasis, je nach Broker)',
        '<strong>Bonus-Verbot:</strong> EU-regulierte Broker dürfen Retail Clients keine Handelsboni anbieten, die als Anreiz für den Handel dienen'
      ])}
      <p>Diese Pflichten gelten nicht für Offshore-Broker und nicht für Professional-Client-Konten bei EU-regulierten Brokern.</p>

      <h2>Retail Client vs. Professional Client</h2>
      <p>Die ESMA unterscheidet zwei Kundenkategorien für den CFD-Handel:</p>
      <p><strong>Retail Client:</strong> Der Standardstatus für Privatanleger. Es gelten alle ESMA-Hebellimits, Negativsaldoschutz ist Pflicht, Boni sind verboten. Keine besonderen Voraussetzungen für die Einstufung.</p>
      <p><strong>Professional Client</strong> (nach MiFID II, Anhang II): Höhere Hebel möglich; Negativsaldoschutz entfällt; Nachschusspflicht möglich. Voraussetzung: Zwei von drei Kriterien müssen erfüllt sein (10 Trades pro Quartal, Portfolio über 500.000 EUR, ein Jahr Berufserfahrung im Finanzsektor). Details zum Antragsprozess finden Sie im <a href="/professioneller-trader-status-beantragen.html">Leitfaden zum Professional Client Status</a>.</p>

      <h3>Gilt die ESMA-Regel auch für britische Broker nach dem Brexit?</h3>
      <p>Die FCA (Financial Conduct Authority) hat nach dem Brexit eigene, den ESMA-Regeln sehr ähnliche CFD-Beschränkungen eingeführt: 1:30 für Forex-Majors, 1:20 für Neben-FX und Indizes, 1:10 für Rohstoffe, 1:5 für Aktien, 1:2 für Krypto. FCA-lizenzierte Broker dürfen ihr Angebot seit dem Brexit nicht mehr über EU-Passporting in Deutschland anbieten; sie benötigen eine separate Lizenz einer EU-Behörde (BaFin oder CySEC) für den deutschen Markt.</p>
  `,
  faqs: [
    { q: 'Was bedeutet ESMA-Produktintervention für CFD-Trader?', a: 'Die ESMA-Produktintervention von 2018 hat Hebellimits, Negativsaldoschutz und das Bonus-Verbot für Retail-CFD-Kunden in der EU eingeführt. Alle EU-regulierten Broker müssen diese Maßnahmen für Retail-Client-Konten umsetzen. Die Maßnahmen wurden 2019 durch nationale Aufseher wie die BaFin dauerhaft übernommen.' },
    { q: 'Welchen Hebel kann ich als Retail Client auf Gold traden?', a: 'Gold (XAU/USD) fällt laut ESMA in die Kategorie „Neben-FX, Gold und Hauptindizes". Der maximale Hebel für Retail Clients beträgt 1:20 bei einer Mindest-Margin von 5 % des Positionswerts.' },
    { q: 'Gibt es ESMA-Limits auch für Krypto-CFDs?', a: 'Ja. Kryptowährungs-CFDs unterliegen dem strengsten ESMA-Hebellimit von 1:2 bei einer Mindest-Margin von 50 %. Der niedrige Hebel spiegelt die hohe Volatilität von Kryptowährungen wider.' },
    { q: 'Kann ein in Deutschland ansässiger Trader bei einem Offshore-Broker höhere Hebel nutzen?', a: 'Die Nutzung von Offshore-Brokern durch deutsche Trader ist legal, unterliegt jedoch nicht den ESMA-Schutzstandards. Negativsaldoschutz und EU-Einlagensicherung entfallen. Steuerliche Pflichten bleiben für deutsche Trader bestehen, auch bei Offshore-Brokern.' }
  ]
});

PAGES.push({
  slug: 'cfd-broker-regulierung-deutschland',
  navHref: 'cfd-broker-regulierung-deutschland.html',
  breadcrumbLabel: 'Regulierung in Deutschland',
  h1: 'CFD Broker Regulierung in Deutschland: BaFin, CySEC und ASIC im Vergleich',
  metaTitle: 'CFD Broker Regulierung Deutschland 2026: BaFin, CySEC, ASIC',
  metaDescription: 'Wie CFD Broker in Deutschland reguliert werden: BaFin-Zulassung prüfen, CySEC-Passporting, Einlagensicherung (EdW/ICF) und was bei Offshore-Brokern fehlt.',
  heroLead: 'BaFin, CySEC und FCA regulieren CFD Broker für den deutschen Markt nach denselben ESMA-Vorgaben. Wie Trader die Zulassung prüfen – und was Offshore-Anbieter unterscheidet.',
  riskText: 'Der Handel mit CFDs ist mit erheblichem Verlustrisiko verbunden.',
  ctaText: 'Bei einem regulierten Broker risikofrei starten',
  ctaButton: 'Zum Demokonto',
  related: ['esma-hebel-limits-deutschland', 'offshore-cfd-broker-ohne-esma', 'cfd-konto-eroeffnen-anleitung'],
  body: `
      <h2>BaFin: Regulierung in Deutschland</h2>
      <p>Die BaFin (Bundesanstalt für Finanzdienstleistungsaufsicht) ist die zuständige Aufsichtsbehörde für CFD Broker in Deutschland. BaFin-lizenzierte Broker unterliegen dem Wertpapierhandelsgesetz (WpHG), das die ESMA-Hebellimits und den Negativsaldoschutz für Retail Clients vorschreibt. Die BaFin führt ein öffentlich zugängliches Register aller zugelassenen Finanzdienstleister.</p>
      <p>Trader können die Zulassung eines Brokers in drei Schritten prüfen:</p>
      ${stepList([
        'Das öffentliche Unternehmensdatenbank-Register der BaFin aufrufen.',
        'Den Broker-Namen oder die Firma suchen.',
        'Zulassungsstatus, erlaubte Dienstleistungen und eventuelle Warnhinweise prüfen.'
      ])}
      <p>BaFin-lizenzierte Broker unterliegen regelmäßigen Prüfungen und müssen Kapitalanforderungen sowie Meldepflichten erfüllen. Die BaFin kann bei Verstößen Lizenzen entziehen und öffentliche Warnungen herausgeben.</p>

      <h2>EU-Regulierungsbehörden im Vergleich</h2>
      <p>Mehrere EU-Regulierungsbehörden lizenzieren CFD Broker für den deutschen Markt. Alle unterliegen MiFID II und den ESMA-Hebellimits für Retail Clients.</p>
      ${table(['Behörde', 'Land', 'Einlagensicherung', 'EU-Passporting'], [
        ['BaFin', 'Deutschland', 'Bis 100.000 EUR (EdW)', 'Nicht erforderlich'],
        ['CySEC', 'Zypern', 'Bis 20.000 EUR (ICF)', 'Ja, EU-weit'],
        ['FCA', 'UK (post-Brexit)', 'Bis 85.000 GBP (FSCS)', 'Kein EU-Passporting']
      ])}
      <p>CySEC-lizenzierte Broker können via EU-Passporting ihr Angebot in Deutschland anbieten und unterliegen denselben Hebellimits wie BaFin-Broker. FCA-Broker benötigen nach dem Brexit eine separate EU-Lizenz für den deutschen Markt.</p>

      <h2>Segregierte Kundengelder und Einlagensicherung</h2>
      <p>Segregierte Kundengelder (Segregated Client Funds) sind bei EU-regulierten Brokern gesetzlich vorgeschrieben. Der Broker muss Kundengelder strikt von seinem eigenen Betriebskapital trennen und auf separaten Konten bei Kreditinstituten verwahren. Im Insolvenzfall sind Kundengelder dadurch vor dem Zugriff von Broker-Gläubigern geschützt.</p>
      <p>Die Einlagensicherung ergänzt den Schutz durch segregierte Gelder: BaFin-Broker sind über die Entschädigungseinrichtung der Wertpapierhandelsunternehmen (EdW) bis 100.000 EUR pro Anleger abgesichert. CySEC-Broker sind über den Investor Compensation Fund (ICF) bis 20.000 EUR pro Anleger abgesichert. Die Einlagensicherung greift ausschließlich bei Insolvenz des Brokers, nicht bei Handelsverlusten.</p>

      <h2>Offshore-Broker: Was fehlt</h2>
      <p>Offshore-Broker mit FSA-, FSC-, VFSC- oder FSCA-Lizenzen bieten höhere Hebel als EU-regulierte Broker, ohne die EU-Schutzstandards einhalten zu müssen:</p>
      ${ul([
        'Kein Negativsaldoschutz: Verluste können das eingezahlte Kapital übersteigen',
        'Keine EU-Einlagensicherung: Bei Insolvenz des Offshore-Brokers ist kein standardisierter Rückerstattungsanspruch garantiert',
        'Keine Pflicht zur Segregation von Kundengeldern nach EU-Standard',
        'Mögliche Nachschusspflicht: Trader können zu Zahlungen verpflichtet werden, die das Kontoguthaben übersteigen',
        'Kein EU-Bonus-Verbot: Offshore-Broker dürfen Handelsboni anbieten, die als Anreiz dienen'
      ])}

      <h3>ASIC-Broker für deutsche Trader</h3>
      <p>ASIC (Australian Securities and Investments Commission) hat seit März 2021 eigene CFD-Hebellimits eingeführt, die den ESMA-Werten sehr ähnlich sind: 1:30 für Forex-Majors, 1:20 für Neben-FX und Hauptindizes, 1:10 für Rohstoffe, 1:2 für Krypto. Ausschließlich australisch regulierte ASIC-Broker können in Deutschland ohne EU-Passporting nicht regulär tätig sein; deutsche Trader nutzen diese Broker direkt als ausländische Anbieter, ohne den EU-Rechtsschutz zu genießen. Für ASIC-Professional-Clients sind Hebel bis 1:500 möglich.</p>

      <h2>Wie prüfe ich die Regulierung eines Brokers?</h2>
      ${stepList([
        'Das öffentliche BaFin-Register prüfen. Dort sind alle in Deutschland zugelassenen oder notifizierten Finanzdienstleister aufgeführt.',
        'Das ESMA-Register aufrufen. Die ESMA führt eine europaweite Datenbank aller lizenzierten Finanzinstitute.',
        'Den Regulierungshinweis auf der Broker-Website prüfen: Seriöse EU-regulierte Broker zeigen ihre Lizenznummer, die Regulierungsbehörde und die Registrierungsnummer prominent an.'
      ])}
      <p>${libertexLink('Libertex')} bietet seinen Service als regulierter Broker an; die Regulierungsangaben sind auf der Website einsehbar.</p>
  `,
  faqs: [
    { q: 'Was ist der Unterschied zwischen BaFin und CySEC?', a: 'BaFin ist die deutsche Bundesbehörde für Finanzdienstleistungsaufsicht; CySEC ist die zyprische Wertpapieraufsichtsbehörde. Beide regulieren CFD Broker nach MiFID II mit denselben ESMA-Hebellimits. BaFin-Broker bieten Einlagensicherung bis 100.000 EUR (EdW); CySEC-Broker bis 20.000 EUR (ICF).' },
    { q: 'Bedeutet reguliert automatisch sicher?', a: 'Eine Regulierung durch BaFin, CySEC oder eine andere anerkannte Behörde schützt Trader vor bestimmten Broker-Risiken und gewährt Retail Clients Negativsaldoschutz. Sie schützt nicht vor Handelsverlusten; laut ESMA verlieren zwischen 74 und 89 % der Retail-CFD-Konten Geld.' },
    { q: 'Wie prüfe ich, ob ein CFD Broker BaFin-lizenziert ist?', a: 'Das öffentliche Unternehmensregister der BaFin ist kostenlos zugänglich. Eine Suche nach dem Broker-Namen zeigt Zulassungsstatus, erlaubte Dienstleistungen und eventuelle BaFin-Warnungen an.' }
  ]
});

PAGES.push({
  slug: 'offshore-cfd-broker-ohne-esma',
  navHref: 'offshore-cfd-broker-ohne-esma.html',
  breadcrumbLabel: 'Offshore-Broker ohne ESMA',
  h1: 'CFD Broker ohne ESMA-Regulierung (Offshore): Hebel, Risiken und was Trader in Deutschland beachten müssen',
  metaTitle: 'Offshore CFD Broker ohne ESMA 2026: Hebel & Risiken erklärt',
  metaDescription: 'Offshore-CFD-Broker (FSA, FSC, VFSC) bieten Hebel bis 1:3000 – ohne Negativsaldoschutz und EU-Einlagensicherung. Rechtslage, Risiken und EU-Alternative im Überblick.',
  heroLead: 'Offshore-Broker bieten Hebel jenseits der ESMA-Grenzen – ohne die EU-Schutzstandards. Lizenzen, Risiken und die rechtliche Lage für deutsche Trader im Überblick.',
  riskText: 'Der Handel mit CFDs ist mit erheblichem Verlustrisiko verbunden.',
  ctaText: 'EU-regulierte Alternative mit Demokonto testen',
  ctaButton: 'Zum Demokonto',
  related: ['cfd-broker-regulierung-deutschland', 'risiken-cfd-handel-hebel', 'cfd-steuer-deutschland'],
  body: `
      <h2>Welche Regulierungsbehörden haben Offshore-Broker?</h2>
      <p>Offshore-Broker operieren unter verschiedenen Jurisdiktionen mit unterschiedlichen Regulierungsstandards. Die bekanntesten Offshore-Regulierungsbehörden für CFD Broker sind:</p>
      ${ul(['FSA (Seychellen)', 'FSC (Mauritius)', 'VFSC (Vanuatu)', 'FSCA (Südafrika)'])}
      <p>Diese Behörden stellen Lizenzen aus, unterliegen jedoch nicht dem MiFID-II-Rahmen. Ihre Schutzstandards für Retail Clients unterscheiden sich grundlegend von EU-Regulierungsbehörden wie BaFin oder CySEC.</p>

      <h2>Welche Hebel bieten Offshore-Broker?</h2>
      <p>Offshore-Broker bieten Retail-Kunden Hebel zwischen 1:500 und 1:3000, je nach Broker und Asset-Klasse. Konkrete Beispiele aus aktuellen Broker-Angeboten (Stand: 2026):</p>
      ${ul([
        '<strong>1:500</strong> für Forex-Hauptpaare bei FSA- und FSCA-regulierten Brokern',
        '<strong>1:1000</strong> für Forex bei bestimmten ASIC-notifizierten oder FSA-Brokern',
        '<strong>1:3000</strong> als Maximalwert bei einzelnen Brokern unter VFSC-Lizenz',
        '<strong>1:200–1:500</strong> für Aktien-CFDs und Rohstoff-CFDs, brokerabhängig'
      ])}
      <p>Im Vergleich dazu: ESMA erlaubt EU-regulierten Brokern maximal 1:30 für Forex-Majors bei Retail Clients und maximal 1:500 für Professional Clients.</p>

      <h2>Was fehlt im Vergleich zu EU-Brokern?</h2>
      <p>Der Unterschied zwischen EU-regulierten und Offshore-Brokern betrifft vier zentrale Schutzebenen:</p>
      <p><strong>Negativsaldoschutz:</strong> EU-regulierte Broker sind für Retail Clients gesetzlich verpflichtet, sicherzustellen, dass Verluste das eingezahlte Kapital nicht übersteigen. Bei Offshore-Brokern gilt diese Pflicht nicht.</p>
      <p><strong>Einlagensicherung:</strong> BaFin-Broker bieten Einlagensicherung bis 100.000 EUR (EdW); CySEC-Broker bis 20.000 EUR (ICF). Offshore-Broker bieten keine vergleichbare, staatlich garantierte Einlagensicherung.</p>
      <p><strong>Segregierte Kundengelder:</strong> EU-regulierte Broker müssen Kundengelder auf separaten Bankkonten halten, getrennt vom Broker-Betriebskapital. Diese Pflicht gilt nicht einheitlich für Offshore-Broker.</p>
      <p><strong>Rechtsdurchsetzung:</strong> Im Streitfall mit einem Offshore-Broker haben deutsche Trader eingeschränkte Rechtsschutzmöglichkeiten. Gerichtliche Urteile aus deutschen Gerichten sind in Jurisdiktionen wie Seychellen oder Vanuatu nur schwer durchsetzbar.</p>

      <h3>Nachschusspflicht bei Offshore-Brokern</h3>
      <p>Die Nachschusspflicht bezeichnet die Pflicht eines Traders, Verluste zu erstatten, die das eingezahlte Kapital übersteigen. In der EU wurde die Nachschusspflicht für Retail Clients durch die ESMA-Produktinterventionsmaßnahmen 2018 abgeschafft. Für Professional Clients und Kunden von Offshore-Brokern ohne EU-Regulierung kann die Nachschusspflicht weiterhin bestehen.</p>

      <h2>Rechtliche Lage für deutsche Trader</h2>
      <p>Für deutsche Trader ist die Nutzung von Offshore-Brokern ohne EU-Regulierung nicht explizit verboten. Die BaFin kann jedoch keine Aufsicht über Offshore-Broker ausüben und ist bei Beschwerden gegen diese Anbieter nicht zuständig. Im Streitfall haben deutsche Trader keinen Anspruch auf Ombudsmann-Verfahren oder EU-Verbraucherschutzmechanismen. Steuerliche Pflichten bleiben vollständig bestehen: CFD-Gewinne aus Offshore-Broker-Konten müssen in der deutschen Steuererklärung angegeben werden, da das Welteinkommensprinzip gilt.</p>

      <h2>EU-regulierte Alternative mit Demo-Einstieg</h2>
      <p>EU-regulierte CFD Broker wie ${libertexLink('Libertex')} bieten Retail Clients Negativsaldoschutz, ESMA-konforme Hebellimits und segregierte Kundengelder. Ein Demokonto ermöglicht das Testen der Handelsplattform mit virtuellem Kapital ohne echtes Verlustrisiko – der empfohlene erste Schritt, bevor echtes Kapital eingesetzt wird.</p>
  `,
  faqs: [
    { q: 'Ist es legal, als Deutscher bei einem Offshore-Broker zu handeln?', a: 'Ja, für deutsche Trader ist die Nutzung von Offshore-Brokern ohne EU-Regulierung nicht verboten. Jedoch entfallen EU-Schutzstandards wie Negativsaldoschutz und EU-Einlagensicherung. Steuerliche Pflichten bleiben vollständig bestehen.' },
    { q: 'Was passiert mit meinem Geld, wenn ein Offshore-Broker insolvent wird?', a: 'Bei der Insolvenz eines Offshore-Brokers ohne EU-Regulierung haben deutsche Trader keinen standardisierten Rückerstattungsanspruch. Es gibt keine staatlich garantierte Einlagensicherung nach EU-Standard.' },
    { q: 'Kann ein Offshore-Broker Verluste über meine Einzahlung hinaus einfordern?', a: 'Ja, bei Offshore-Brokern ohne Negativsaldoschutz ist dies möglich. EU-regulierte Broker mit Retail-Status dürfen seit 2018 keine Nachschusspflicht mehr erheben.' },
    { q: 'Was ist der Unterschied zwischen FSA (Seychellen) und CySEC?', a: 'FSA (Seychellen) ist eine Offshore-Regulierungsbehörde ohne EU-Anbindung; CySEC ist die zyprische EU-Aufsichtsbehörde unter MiFID II. FSA-lizenzierte Broker unterliegen nicht den ESMA-Hebellimits und bieten keinen Negativsaldoschutz für Retail Clients.' }
  ]
});

PAGES.push({
  slug: 'cfd-broker-vergleich-hebel',
  navHref: 'cfd-broker-vergleich-hebel.html',
  breadcrumbLabel: 'Broker-Vergleich',
  h1: 'CFD Broker mit hohem Hebel im Vergleich: Regulierung, Spreads, Kosten und Kontotypen',
  metaTitle: 'CFD Broker Vergleich 2026: Hebel, Spreads, Kontotypen',
  metaDescription: 'CFD Broker im Vergleich: Regulierung als wichtigstes Kriterium, Spreads & Kommissionen, maximaler Hebel nach Trader-Status und die gängigen Handelsplattformen.',
  heroLead: 'Regulierung, Handelskosten und Kontotyp entscheiden über die Eignung eines CFD Brokers. Ein neutraler Überblick über die wichtigsten Vergleichskriterien.',
  riskText: 'Der Handel mit CFDs ist mit erheblichem Verlustrisiko verbunden. Zwischen 74 und 89 % der Retail-CFD-Konten verlieren Geld. Dieser Artikel dient ausschließlich zu Informationszwecken.',
  ctaText: 'Konditionen im Demokonto unverbindlich prüfen',
  ctaButton: 'Zum Demokonto',
  related: ['cfd-broker-regulierung-deutschland', 'cfd-konto-eroeffnen-anleitung', 'cfd-handelsstrategien-hebel'],
  body: `
      <h2>Regulierung als Vergleichskriterium</h2>
      <p>Die Regulierung ist das wichtigste Auswahlkriterium beim CFD-Broker-Vergleich, da sie bestimmt, welche Schutzstandards für Retail Clients gelten. BaFin-lizenzierte Broker unterliegen dem deutschen WpHG und ESMA-Hebellimits; CySEC-Broker unterliegen denselben ESMA-Limits via EU-Passporting. Offshore-Broker mit FSA- oder FSC-Lizenz bieten höhere Hebel, aber ohne EU-Kundenschutz.</p>
      <p>EU-regulierte Broker bieten: Negativsaldoschutz (Retail), segregierte Kundengelder, Einlagensicherung bis 20.000–100.000 EUR, ESMA-konforme Hebellimits und standardisierte Risikowarnungen. Offshore-Broker bieten: Hebel bis 1:1000 oder höher, aber ohne die genannten Schutzstandards.</p>

      <h2>Spreads und Kommissionen im Vergleich</h2>
      <p>Handelskosten bei CFD Brokern setzen sich aus drei Komponenten zusammen: Spread (Differenz zwischen Kauf- und Verkaufskurs), Kommission (separate Gebühr pro Trade bei bestimmten Kontotypen) und Swap-Gebühren (Übernachtkosten für offene Positionen). Alle Werte sind brokerabhängig und können sich je nach Marktbedingungen, Handelsvolumen und Kontostand ändern.</p>
      <h3>Raw Spread vs. Standard-Konto: Gesamtkostenvergleich</h3>
      <p>Raw-Spread-Konten bieten engere Spreads (ab 0,0 Pip), erheben jedoch eine Kommission pro Lot. Bei EUR/USD und 3 USD Kommission pro Standard-Lot entspricht dies ca. 0,3 Pip Zusatzkosten. Standard-Konten inkludieren die Brokergebühr im Spread (typisch 1,0–1,5 Pip EUR/USD bei regulierten EU-Brokern). Für Scalper mit vielen Trades ist das Raw-Spread-Konto oft kostengünstiger; für weniger aktive Trader kann das Standard-Konto einfacher sein.</p>

      <h2>Maximaler Hebel nach Trader-Status</h2>
      <p>Der maximale verfügbare Hebel hängt vom Trader-Status und der Broker-Regulierung ab:</p>
      ${table(['Status', 'Max. Hebel Forex-Majors'], [
        ['Retail Client (EU-reguliert)', '1:30'],
        ['Professional Client (EU-reguliert)', '1:100 bis 1:500'],
        ['Retail Client (Offshore)', '1:500 bis 1:3000']
      ])}

      <h2>Handelsplattformen neutral erklärt</h2>
      <p>CFD Broker bieten verschiedene Handelsplattformen an. Die verbreitetsten sind MetaTrader 4 (MT4), MetaTrader 5 (MT5), cTrader und TradingView. MT4 ist auf Forex-Handel ausgerichtet und unterstützt automatisierte Strategien via Expert Advisors (MQL4). MT5 bietet zusätzliche Asset-Klassen, 21 Chart-Zeitrahmen und 38 integrierte Indikatoren. cTrader richtet sich an ECN-Trader mit Level-II-Pricing. TradingView kombiniert Chartanalyse mit direktem Broker-Zugang. Die Plattformauswahl hängt vom Broker ab; nicht alle Broker bieten alle Plattformen an.</p>

      <h3>Demokonto testen</h3>
      <p>${libertexLink('Libertex')} bietet ein Demokonto an, das den vollen Plattformumfang mit virtuellem Kapital zugänglich macht. Spread- und Kostenstrukturen im Demokonto entsprechen den Live-Konditionen. Das Demokonto ist der empfohlene erste Schritt vor dem Einsatz echten Kapitals.</p>
  `,
  faqs: [
    { q: 'Was ist der Unterschied zwischen Spread und Kommission?', a: 'Der Spread ist die Differenz zwischen Kauf- und Verkaufskurs und fällt bei jedem Trade an. Die Kommission ist eine separate, feste Gebühr pro Lot, die bei Raw-Spread- und ECN-Konten erhoben wird.' },
    { q: 'Was ist ein Raw Spread Account und für wen lohnt er sich?', a: 'Ein Raw Spread Account bietet den Rohspread ab 0,0 Pip zuzüglich Kommission pro Lot. Er lohnt sich für aktive Trader und Scalper, die viele Trades täglich abwickeln und von engen Spreads profitieren.' },
    { q: 'Was ist der Unterschied zwischen ECN-Broker und Market Maker?', a: 'Ein ECN-Broker leitet Orders direkt an Liquiditätsanbieter weiter und nimmt keine eigene Gegenposition ein. Ein Market Maker stellt selbst Kauf- und Verkaufskurse und nimmt die Gegenposition zum Trader ein.' }
  ]
});

PAGES.push({
  slug: 'risiken-cfd-handel-hebel',
  navHref: 'risiken-cfd-handel-hebel.html',
  breadcrumbLabel: 'Risiken beim Hebel-Handel',
  h1: 'Risiken beim CFD-Handel mit hohem Hebel: Margin Call, Stop-Out und Nachschusspflicht erklärt',
  metaTitle: 'Risiken beim CFD-Hebel-Handel 2026: Margin Call & Stop-Out',
  metaDescription: 'Die zentralen Risiken beim gehebelten CFD-Handel: Totalverlust, Margin Call, Stop-Out (BaFin: 50 %), Wochenend-Gaps und Nachschusspflicht – mit Schutzmechanismen.',
  heroLead: 'Der Hebel verstärkt Gewinne und Verluste gleichermaßen. Die zentralen Risiken beim CFD-Handel und die gesetzlichen Schutzmechanismen für Retail Clients im Überblick.',
  riskText: 'Laut ESMA-Pflichtangaben verlieren zwischen 74 und 89 % der Retail-CFD-Konten Geld. Es besteht das Risiko des Totalverlustes der gesamten Einlage. Dieser Artikel dient ausschließlich zu Informationszwecken.',
  ctaText: 'Risikomanagement im Demokonto üben',
  ctaButton: 'Zum Demokonto',
  related: ['hebelwirkung-cfd-erklaert', 'professioneller-trader-status-beantragen', 'offshore-cfd-broker-ohne-esma'],
  body: `
      <h2>Hebelwirkung und Verlustrisiko</h2>
      <p>Die Hebelwirkung verstärkt Verluste proportional zum Hebelfaktor. Bei Hebel 1:30 und einer Margin von 1.000 EUR führt eine Gegenbewegung von 3,33 % zum Totalverlust der eingesetzten Margin. Bei Hebel 1:5 (Aktien-CFDs) führt eine Gegenbewegung von 20 % zum Totalverlust.</p>
      <p>Der Hebel amplifiziert sowohl Gewinne als auch Verluste im gleichen Verhältnis. Ein höherer Hebel bedeutet nicht nur höhere potenzielle Gewinne, sondern auch eine geringere Kurstoleranz vor dem Totalverlust der Margin.</p>

      <h2>Margin Call und Stop-Out erklärt</h2>
      <p>Margin Call ist das Signal des Brokers, dass das freie Kapital unter den Mindest-Margin-Level gesunken ist. Typische Broker setzen den Margin Call bei 80–100 % des Margin-Levels; konkrete Werte sind brokerabhängig und im Handelsregelwerk festgelegt.</p>
      <p>Stop-Out ist die automatische Positionsschließung durch den Broker. Die BaFin-Allgemeinverfügung auf Basis der ESMA-Regulierung schreibt für Retail Clients bei EU-regulierten Brokern einen Stop-Out-Level von mindestens 50 % des Margin-Bedarfs vor. Dieser Wert ist das gesetzliche Minimum; individuelle Broker können höhere Schwellen setzen.</p>
      ${stepList([
        'Eigenkapital sinkt durch Kursbewegungen gegen offene Positionen.',
        'Margin-Level fällt auf den Margin-Call-Threshold; der Broker informiert den Trader.',
        'Eigenkapital erreicht den Stop-Out-Level; der Broker schließt die verlustreichste offene Position automatisch.'
      ])}

      <h2>Negativsaldoschutz vs. Nachschusspflicht</h2>
      <p>Negativsaldoschutz schützt Retail Clients bei EU-regulierten Brokern davor, mehr als das eingezahlte Kapital zu verlieren. Die ESMA-Produktinterventionsmaßnahmen (August 2018) haben diesen Schutz für alle EU-regulierten Broker verpflichtend eingeführt. Entsteht durch einen Marktgap ein Verlust über das Kontoguthaben hinaus, trägt der Broker die Differenz.</p>
      <p>Nachschusspflicht bezeichnet die Pflicht, Verluste über das Kontoguthaben hinaus zu erstatten. Diese gilt für Professional Clients bei EU-regulierten Brokern (Negativsaldoschutz entfällt mit dem Profistatus) und für Kunden von Offshore-Brokern ohne EU-Regulierung.</p>

      <h2>Wochenend-Gap-Risiko</h2>
      <p>Ein Opening Gap (Wochenend-Gap) entsteht, wenn der Markt am Montag zu einem Kurs öffnet, der erheblich vom Schlusskurs am Freitag abweicht. Stop-Loss-Orders werden beim nächsten verfügbaren Kurs ausgeführt: Bei Long-Positionen kann dieser deutlich unter dem geplanten Stop-Loss liegen; bei Short-Positionen kann er darüber liegen.</p>
      <p>Das Gap-Risiko ist beim Hebel-Trading besonders ausgeprägt, da kleine Kurssprünge relativ zum Positionswert zu überproportionalen Verlusten führen. Bei EU-regulierten Brokern mit Retail-Status greift der Negativsaldoschutz: Verluste übersteigen das Kontoguthaben auch bei extremen Gaps nicht.</p>

      <h3>Stop-Loss und Risikomanagement</h3>
      <p>Stop-Loss-Orders reduzieren das maximale Verlustrisiko pro Position, garantieren jedoch keine Ausführung zum gewünschten Kurs bei schnellen Marktbewegungen oder Gaps. Garantierte Stop-Loss-Orders werden von manchen Brokern gegen eine Zusatzgebühr angeboten und sichern die Ausführung zum angegebenen Kurs auch bei Gaps.</p>

      <h3>Positionsgröße als Risikokontrolle</h3>
      <p>Die Positionsgröße (Lot-Größe) bestimmt, wie viel Kapital pro Trade riskiert wird. Kleinere Positionen bedeuten geringere absolute Verluste bei ungünstiger Kursentwicklung. Eine verbreitete Faustregel lautet, maximal 1–2 % des Kontoguthabens pro Trade zu riskieren — dies ist eine allgemeine Orientierung, keine Anlageberatung, und schützt nicht vor Totalverlust.</p>
  `,
  faqs: [
    { q: 'Was ist der Unterschied zwischen Margin Call und Stop-Out?', a: 'Der Margin Call ist eine Warnung des Brokers, wenn das freie Kapital unter den Mindest-Margin-Level fällt. Der Stop-Out ist eine automatische Maßnahme: Der Broker schließt Positionen ohne vorherige Aufforderung, wenn das Eigenkapital den Stop-Out-Level unterschreitet.' },
    { q: 'Kann ich bei einem EU-regulierten Broker mit Retail-Status mehr verlieren als eingezahlt?', a: 'Nein. EU-regulierte Broker müssen für Retail Clients Negativsaldoschutz gewähren. Verluste können das eingezahlte Kapital nicht übersteigen, auch bei extremen Marktbewegungen oder Gaps.' },
    { q: 'Was passiert bei einem Wochenend-Gap mit meiner Position?', a: 'Stop-Loss-Orders werden beim nächsten verfügbaren Kurs nach Marktöffnung ausgeführt. Bei einem starken Gap kann dieser Kurs schlechter als der geplante Stop-Loss sein.' },
    { q: 'Was ist eine garantierte Stop-Loss-Order?', a: 'Eine garantierte Stop-Loss-Order sichert die Ausführung zum angegebenen Kurs auch bei Gaps und schnellen Marktbewegungen. Manche Broker bieten diese gegen einen Aufpreis an.' }
  ]
});

PAGES.push({
  slug: 'professioneller-trader-status-beantragen',
  navHref: 'professioneller-trader-status-beantragen.html',
  breadcrumbLabel: 'Profistatus beantragen',
  h1: 'Professioneller Trader Status beantragen: Höheren Hebel als Retail-Klient erhalten (MiFID II)',
  metaTitle: 'Professional Client Status beantragen 2026: MiFID-II-Kriterien',
  metaDescription: 'Professional Client Status nach MiFID II: die drei Kriterien, der Antragsprozess beim Broker, mögliche Hebel und die Konsequenzen für den Negativsaldoschutz.',
  heroLead: 'Wer zwei von drei MiFID-II-Kriterien erfüllt, kann bei EU-regulierten Brokern höhere Hebel beantragen – verliert dabei aber den Negativsaldoschutz. Ablauf und Voraussetzungen im Überblick.',
  riskText: 'Der Handel mit höheren Hebeln erhöht das Verlustrisiko erheblich. Mit dem Professional Client Status entfällt der Negativsaldoschutz. Dieser Artikel stellt keine Rechts- oder Anlageberatung dar.',
  ctaText: 'Höhere Hebel zunächst im Demokonto kennenlernen',
  ctaButton: 'Zum Demokonto',
  related: ['esma-hebel-limits-deutschland', 'risiken-cfd-handel-hebel', 'cfd-broker-vergleich-hebel'],
  body: `
      <h2>Die drei MiFID-II-Kriterien im Detail</h2>
      <p>Der Professional Client Status nach MiFID II erfordert die Erfüllung von mindestens zwei der folgenden drei Kriterien (Rechtsgrundlage: MiFID II, Richtlinie 2014/65/EU, Anhang II, Abschnitt II):</p>

      <h3>Kriterium 1 — Handelsfrequenz</h3>
      <p>Der Anleger hat in den letzten vier Quartalen mindestens 10 Transaktionen pro Quartal in beträchtlichem Umfang auf Kapitalmärkten durchgeführt. Nachweise: Kontoauszüge oder Handelsberichte des Brokers, die Transaktionsanzahl und -volumen belegen.</p>

      <h3>Kriterium 2 — Portfoliogröße</h3>
      <p>Das Finanzinstrumenten-Portfolio des Anlegers (Kassainstrumente und Derivate) übersteigt 500.000 EUR. Immobilien, Bankguthaben und Sachvermögen zählen nicht dazu. Nachweise: Depotauszüge, keine älter als drei Monate.</p>

      <h3>Kriterium 3 — Berufserfahrung</h3>
      <p>Der Anleger hat mindestens ein Jahr lang eine berufliche Position im Finanzsektor ausgeübt, die Kenntnisse über Hebelprodukte und CFDs voraussetzt. Geeignete Positionen: Portfoliomanager, Wertpapierhändler, Analyst, Compliance-Beauftragter. Nachweise: Arbeitsvertrag, Arbeitgeberbestätigung, Lebenslauf.</p>

      <h2>Antragsprozess beim Broker</h2>
      ${stepList([
        'Beim Broker ein Formular zur Beantragung des Professional Client Status anfordern.',
        'Nachweise für mindestens zwei der drei Kriterien zusammenstellen (Handelsberichte, Depotauszüge, Berufsnachweise).',
        'Ausgefülltes Formular mit Nachweisen beim Broker einreichen. Bearbeitungszeit: typischerweise 3–10 Werktage, brokerabhängig.',
        'Broker prüft die Nachweise und bestätigt den Status schriftlich. Ab Bestätigung gelten die höheren Hebellimits und die veränderten Schutzbedingungen.'
      ])}

      <h2>Welche Hebel sind als Professional Client möglich?</h2>
      <p>EU-regulierte Broker legen die Hebel für Professional Clients eigenständig fest. Typische Spannen (Stand: 2026):</p>
      ${ul([
        'Forex-Hauptpaare: 1:100 bis 1:500 (brokerabhängig)',
        'Aktienindizes: 1:50 bis 1:200 (brokerabhängig)',
        'Gold (XAU/USD): 1:100 bis 1:200 (brokerabhängig)',
        'Aktien-CFDs: 1:20 bis 1:100 (brokerabhängig)',
        'Kryptowährungs-CFDs: 1:5 bis 1:20 (brokerabhängig)'
      ])}
      <p>Im Vergleich dazu: Offshore-Broker bieten Retail-Kunden Hebel bis 1:1000 oder höher, ohne EU-Schutzstandards. ${libertexLink('Libertex')} bietet Informationen zu verfügbaren Hebeln für verschiedene Trader-Statusgruppen.</p>

      <h2>Konsequenzen des Statuswechsels</h2>
      ${ul([
        '<strong>Negativsaldoschutz entfällt:</strong> Verluste können das eingezahlte Kapital übersteigen; eine Nachschusspflicht wird möglich',
        '<strong>Einlagensicherung kann entfallen:</strong> Manche Broker schließen Professional Clients von der Einlagensicherung aus',
        '<strong>Bonus-Verbot entfällt:</strong> Broker dürfen Professional Clients Handelsboni anbieten',
        '<strong>Risikowarnung:</strong> Broker sind nicht mehr verpflichtet, die standardisierte ESMA-Risikowarnung anzuzeigen'
      ])}

      <h3>Kann man den Profistatus wieder aufgeben?</h3>
      <p>Ja. Der Professional Client Status kann jederzeit beim Broker zurückgesetzt werden. Der Trader beantragt schriftlich die Rückstufung zum Retail Client. Danach gelten wieder alle ESMA-Schutzmaßnahmen: ESMA-Hebellimits, Negativsaldoschutz und das Bonus-Verbot.</p>

      <h2>Demokonto als Alternative</h2>
      <p>Trader, die höhere Hebel testen möchten, ohne den Profistatus zu beantragen, können ein Demokonto mit angepassten virtuellen Hebeleinstellungen nutzen. ${libertexLink('Libertex')} bietet ein Demokonto an, das das Kennenlernen der Plattform ohne echtes Kapitalrisiko ermöglicht.</p>
  `,
  faqs: [
    { q: 'Welche zwei von drei MiFID-II-Kriterien muss ich erfüllen?', a: 'Zwei von drei Kriterien genügen: mindestens 10 signifikante Trades pro Quartal, ein Finanzportfolio über 500.000 EUR oder mindestens ein Jahr Berufserfahrung im Finanzsektor mit Hebelprodukt-Kenntnissen.' },
    { q: 'Welchen Hebel kann ich als Professional Client bei einem EU-Broker erhalten?', a: 'EU-regulierte Broker legen die Hebel für Professional Clients eigenständig fest. Typische Werte für Forex-Hauptpaare liegen zwischen 1:100 und 1:500, brokerabhängig.' },
    { q: 'Verliere ich den Negativsaldoschutz beim Profistatus?', a: 'Ja. Mit dem Professional Client Status entfällt der Negativsaldoschutz vollständig. Verluste können das eingezahlte Kapital übersteigen; eine Nachschusspflicht ist möglich.' },
    { q: 'Kann ich den Profistatus jederzeit rückgängig machen?', a: 'Ja. Eine Rückstufung zum Retail Client ist jederzeit möglich. Der Trader beantragt die Rückstufung schriftlich beim Broker; danach gelten sofort wieder alle ESMA-Schutzmaßnahmen.' }
  ]
});

PAGES.push({
  slug: 'cfd-konto-eroeffnen-anleitung',
  navHref: 'cfd-konto-eroeffnen-anleitung.html',
  breadcrumbLabel: 'Konto eröffnen: Anleitung',
  h1: 'CFD Konto bei einem Broker mit hohem Hebel eröffnen: Schritt-für-Schritt-Anleitung',
  metaTitle: 'CFD Konto eröffnen 2026: Schritt-für-Schritt-Anleitung',
  metaDescription: 'CFD Konto in 4 Schritten eröffnen: Broker auswählen, KYC-Verifizierung, Kontotyp wählen, Einzahlung – inklusive Checkliste vor dem ersten Trade.',
  heroLead: 'Von der Broker-Auswahl bis zum ersten Trade: die vier Schritte zur Eröffnung eines CFD-Kontos, inklusive KYC-Anforderungen und Checkliste.',
  riskText: 'Der Handel mit gehebelten CFDs ist mit erheblichem Verlustrisiko verbunden. Es besteht das Risiko des Totalverlustes der Einlage. Dieser Artikel dient ausschließlich zu Informationszwecken.',
  ctaText: 'Jetzt kostenloses Demokonto eröffnen',
  ctaButton: 'Demokonto öffnen',
  related: ['cfd-broker-vergleich-hebel', 'hebelwirkung-cfd-erklaert', 'cfd-handelsstrategien-hebel'],
  body: `
      <h2>Schritt 1: Broker auswählen</h2>
      <p>Die Broker-Auswahl richtet sich nach folgenden Kriterien:</p>
      ${ul([
        '<strong>Regulierung:</strong> BaFin, CySEC oder FCA für EU-Schutzstandards; Offshore-Lizenz für höhere Hebel ohne EU-Schutz',
        '<strong>Verfügbare Hebel:</strong> Retail-Limit (1:30 Forex bei EU-Brokern) oder Professional Client / Offshore-Konditionen',
        '<strong>Kontotypen:</strong> Standard, Raw Spread, Demokonto, Islamisches Konto (Swap-Free)',
        '<strong>Mindesteinzahlung:</strong> Brokerabhängig, von 0 EUR bis mehrere hundert EUR',
        '<strong>Handelsplattform:</strong> MT4, MT5, cTrader, TradingView oder proprietäre Plattform',
        '<strong>Handelskosten:</strong> Spread und Kommission (brokerabhängig, als variable Werte zu betrachten)'
      ])}
      <p>${libertexLink('Libertex')} ist als EU-regulierter Broker mit Demokonto-Option erreichbar.</p>

      <h2>Schritt 2: Registrierung und KYC-Verifizierung</h2>
      <p>Die KYC-Verifizierung (Know Your Customer) ist bei regulierten Brokern nach Anti-Geldwäsche-Richtlinien (AML) gesetzlich vorgeschrieben. Erforderliche Dokumente:</p>
      ${ul([
        '<strong>Identitätsnachweis:</strong> Personalausweis (Vorder- und Rückseite) oder Reisepass',
        '<strong>Adressnachweis:</strong> Kontoauszug oder Versorgerrechnung, nicht älter als drei Monate, mit vollständiger Adresse'
      ])}
      <p>Ablauf: Online-Formular ausfüllen, Dokumente hochladen, Verifizierungsprüfung durch den Broker. Bearbeitungszeit: typischerweise wenige Minuten bis 48 Stunden, brokerabhängig.</p>

      <h2>Schritt 3: Kontotyp wählen</h2>
      <p><strong>Demokonto:</strong> Virtuelles Kapital, reale Marktdaten, kein echtes Verlustrisiko. Empfohlen als erster Schritt vor dem Live-Handel. ${libertexLink('Libertex')} bietet ein Demokonto an, das den vollen Plattformumfang zugänglich macht.</p>
      <p><strong>Live-Konto (Standard):</strong> Echtes Kapital, Spread im Kurs eingerechnet, keine separate Kommission. Geeignet für Einsteiger und mittelfristige Trader.</p>
      <p><strong>Live-Konto (Raw Spread / ECN):</strong> Echtes Kapital, enger Rohspread ab 0,0 Pip plus Kommission pro Lot. Geeignet für aktive Trader und Scalper.</p>
      <p><strong>Islamisches Konto (Swap-Free):</strong> Kein Overnight-Zins (Swap-Gebühr); geeignet für Trader, die keine zinsbasierten Gebühren zahlen möchten. Verfügbarkeit und Konditionen sind brokerabhängig.</p>

      <h2>Schritt 4: Einzahlung und Plattform verbinden</h2>
      <p>Akzeptierte Zahlungsmethoden variieren brokerabhängig. Typische Optionen:</p>
      ${ul([
        'Banküberweisung (SEPA): kostenlos, 1–3 Werktage',
        'Kreditkarte / Debitkarte (Visa, Mastercard): sofort oder innerhalb weniger Stunden',
        'E-Wallet (PayPal, Skrill, Neteller): sofort oder innerhalb weniger Stunden, brokerabhängig',
        'Kryptowährungs-Einzahlung: brokerabhängig, nicht bei allen EU-regulierten Brokern verfügbar'
      ])}
      <p>Nach Einzahlung wird die Handelsplattform (MT4, MT5, cTrader) mit den Kontodaten verbunden. Der Broker stellt Serverdaten und Zugangsdaten bereit.</p>

      <h2>Was vor dem ersten Trade prüfen?</h2>
      ${ul([
        'Risikohinweise und AGBs des Brokers vollständig lesen',
        'Stop-Out-Level und Margin-Call-Level des Brokers im Handelsregelwerk prüfen',
        'Spread-Typ und Kommissionsstruktur für das gewählte Instrument verstehen',
        'Swap-Gebühren für Overnight-Positionen kennen',
        'Demokonto zum Testen der Plattform und Margin-Berechnung nutzen, bevor echtes Kapital eingesetzt wird',
        'Positionsgröße und Margin-Anforderung mit dem Margin-Rechner berechnen'
      ])}
  `,
  faqs: [
    { q: 'Welche Dokumente brauche ich zur Kontoeröffnung bei einem CFD Broker?', a: 'Regulierte Broker verlangen Identitätsnachweis (Personalausweis oder Reisepass) und Adressnachweis (Kontoauszug oder Versorgerrechnung, nicht älter als drei Monate).' },
    { q: 'Wie lange dauert die KYC-Verifizierung bei einem regulierten CFD Broker?', a: 'Die Bearbeitungszeit variiert: automatische Verifizierungssysteme können Dokumente in wenigen Minuten prüfen; manuelle Prüfungen dauern typischerweise bis zu 48 Stunden.' },
    { q: 'Kann ich einen CFD Broker mit hohem Hebel zuerst mit Demokonto testen?', a: 'Ja. Die meisten regulierten Broker bieten Demokonten mit virtuellem Kapital an. Das Demokonto bildet reale Marktbedingungen und Plattformfunktionen ab.' },
    { q: 'Welche Zahlungsmethoden akzeptieren CFD Broker für die erste Einzahlung?', a: 'Verbreitet sind Banküberweisung (SEPA), Kreditkarte (Visa, Mastercard) und E-Wallets (PayPal, Skrill). Kryptowährungs-Einzahlungen sind bei manchen Brokern möglich.' }
  ]
});

PAGES.push({
  slug: 'cfd-handelsstrategien-hebel',
  navHref: 'cfd-handelsstrategien-hebel.html',
  breadcrumbLabel: 'Handelsstrategien',
  h1: 'CFD Handelsstrategien mit hohem Hebel: Scalping, Daytrading und Hedging erklärt',
  metaTitle: 'CFD Handelsstrategien 2026: Scalping, Daytrading, Hedging',
  metaDescription: 'Scalping, Daytrading und Hedging mit gehebelten CFDs: Anforderungen an Spread und Ausführung, Swap-Vermeidung und Risikomanagement-Werkzeuge im Überblick.',
  heroLead: 'Von Scalping bis Hedging: Wie gängige CFD-Handelsstrategien mit Hebel funktionieren – und welche Anforderungen sie an Broker und Risikomanagement stellen.',
  riskText: 'Der Handel mit CFDs und hohem Hebel ist mit erheblichem Verlustrisiko verbunden. Es besteht das Risiko des Totalverlustes. Dieser Artikel dient ausschließlich zu Informationszwecken.',
  ctaText: 'Strategien im Demokonto ohne Risiko testen',
  ctaButton: 'Zum Demokonto',
  related: ['risiken-cfd-handel-hebel', 'cfd-konto-eroeffnen-anleitung', 'cfd-broker-vergleich-hebel'],
  body: `
      <h2>Scalping mit hohem Hebel</h2>
      <p>Scalping bezeichnet das Eröffnen und Schließen von CFD-Positionen innerhalb von Sekunden bis Minuten, um kleine Kursbewegungen zu nutzen. Scalping mit hohem Hebel stellt spezifische Anforderungen an den Broker:</p>
      ${ul([
        '<strong>Spread:</strong> Unter 0,5 Pip für Forex-Hauptpaare; Raw-Spread-Konten ab 0,0 Pip plus Kommission sind typisch',
        '<strong>Ausführungsgeschwindigkeit:</strong> ECN-Ausführung im Millisekunden-Bereich; Market-Maker-Slippage kann Scalping unrentabel machen',
        '<strong>Scalping-Richtlinien:</strong> Nicht alle Broker erlauben Scalping ausdrücklich; AGBs prüfen',
        '<strong>Kommissionsstruktur:</strong> Viele Trades täglich erhöhen Gesamtkosten; niedrige Kommissionen pro Lot entscheidend'
      ])}
      <p>Scalping mit hohem Hebel erhöht das Risiko proportional: Kleine Kursbewegungen gegen die Position führen bei hohem Hebel zu überproportionalen Verlusten.</p>

      <h2>Daytrading mit Hebel</h2>
      <p>Daytrading bezeichnet das Öffnen und Schließen aller Positionen innerhalb eines Handelstages. Positionen werden vor Marktschluss geschlossen, um Swap-Gebühren (Overnight-Kosten) zu vermeiden. Daytrading mit Hebel reduziert das Gap-Risiko, das bei über das Wochenende gehaltenen Positionen entsteht.</p>
      <p>Daytrading-Anforderungen an den Broker: ausreichende Liquidität in den gehandelten Instrumenten, niedrige Spreads während der Haupthandelszeiten (Londoner und New Yorker Session für Forex), zuverlässige Plattform-Ausführung.</p>
      <p>Daytrading mit Hebel ist mit erhöhtem Risiko verbunden: Kursbewegungen während des Handelstages können schnell zum Margin Call führen. Eine sorgfältige Positionsgrößen-Kalkulation vor jedem Trade ist notwendig.</p>

      <h2>Hedging-Strategien mit CFDs</h2>
      <p>Hedging bezeichnet das Eröffnen einer Gegenposition zu einer bestehenden Position, um das Marktrisiko zu begrenzen. Ein Trader mit einer Long-Position in EUR/USD kann eine Short-CFD-Position auf EUR/USD eröffnen, um Kursverluste in der Long-Position abzusichern.</p>
      <p>Nicht alle Broker erlauben Gegengeschäfte auf demselben Konto (Lock-Positionen). Bei Brokern, die FIFO-Regeln (First In, First Out) anwenden, werden gegenläufige Positionen automatisch gegeneinander aufgerechnet. Vor dem Einsatz von Hedging-Strategien sollten die Broker-AGBs auf zulässige Handelsstrategien geprüft werden. Hedging reduziert das Marktrisiko, eliminiert es aber nicht vollständig – Kosten entstehen durch doppelte Spreads und Swap-Gebühren.</p>

      <h2>Automatisierter Handel (Expert Advisor)</h2>
      <p>Expert Advisors (EAs) sind automatisierte Handelsprogramme, die auf Basis vordefinierter Regeln und Algorithmen CFD-Positionen öffnen und schließen. EAs werden in MQL4 (MetaTrader 4) oder MQL5 (MetaTrader 5) programmiert.</p>
      <p>Der Strategietester in MT4 und MT5 ermöglicht das Backtesting von EA-Strategien anhand historischer Kursdaten. Backtests zeigen, wie eine Strategie in der Vergangenheit performt hätte; sie sind keine Garantie für künftige Ergebnisse.</p>

      <h3>Risikomanagement als integraler Bestandteil</h3>
      <p>Risikomanagement-Instrumente beim Hebel-Trading umfassen: Stop-Loss-Orders (begrenzen Verlust pro Position, garantieren aber keine Ausführung zum gewünschten Kurs), Take-Profit-Orders (schließen Position bei definiertem Gewinn) und Positionsgrößen-Kalkulation. Risikomanagement reduziert das Verlustrisiko, schützt aber nicht vor Totalverlust bei extremen Marktbewegungen.</p>

      <h2>Demokonto zum Strategie-Test</h2>
      <p>${libertexLink('Libertex')} bietet ein Demokonto an, mit dem Scalping-, Daytrading- und Hedging-Strategien mit virtuellem Kapital getestet werden können. Plattformfunktionen, Ausführungsgeschwindigkeit und Spread-Strukturen im Demokonto entsprechen den Live-Konditionen.</p>
  `,
  faqs: [
    { q: 'Welchen minimalen Spread brauche ich für Scalping mit hohem Hebel?', a: 'Scalping auf Forex-Hauptpaare erfordert typischerweise Spreads unter 0,5 Pip. Raw-Spread-Konten mit ECN-Ausführung bieten Spreads ab 0,0 Pip plus Kommission.' },
    { q: 'Warum fallen beim Daytrading keine Swap-Gebühren an?', a: 'Swap-Gebühren entstehen, wenn CFD-Positionen über Nacht offen gehalten werden. Beim Daytrading werden alle Positionen vor Marktschluss geschlossen; es findet keine Übernacht-Finanzierung statt.' },
    { q: 'Erlauben alle CFD Broker Gegengeschäfte (Hedging) auf demselben Konto?', a: 'Nein. Manche Broker wenden FIFO-Regeln an, bei denen gegenläufige Positionen automatisch gegeneinander aufgerechnet werden. Andere Broker erlauben Lock-Positionen.' },
    { q: 'Sind Backtests eines Expert Advisors eine Garantie für künftige Gewinne?', a: 'Nein. Backtests zeigen, wie eine Strategie anhand historischer Kursdaten performt hätte. Sie sind keine Garantie für zukünftige Ergebnisse.' }
  ]
});

PAGES.push({
  slug: 'cfd-steuer-deutschland',
  navHref: 'cfd-steuer-deutschland.html',
  breadcrumbLabel: 'CFD-Steuer Deutschland',
  h1: 'CFD-Steuer in Deutschland: Abgeltungssteuer, Verlustverrechnung und Swap-Gebühren erklärt',
  metaTitle: 'CFD-Steuer Deutschland 2026: Abgeltungssteuer & JStG 2024',
  metaDescription: 'CFD-Gewinne versteuern: Abgeltungssteuer 25 %, aufgehobene 20.000-EUR-Verlustgrenze durch das JStG 2024, Sparerpauschbetrag und die Steuerpflicht bei Offshore-Brokern.',
  heroLead: 'CFD-Gewinne unterliegen der Abgeltungssteuer. Seit dem Jahressteuergesetz 2024 ist die Verlustverrechnung bei Termingeschäften unbegrenzt möglich. Die wichtigsten Regeln für 2026.',
  riskText: 'Steuerberater-Disclaimer: Dieser Artikel stellt keine Steuer- oder Rechtsberatung dar. Die steuerliche Behandlung im Einzelfall kann von der allgemeinen Darstellung abweichen. Ein Steuerberater sollte für die individuelle Steuersituation konsultiert werden.',
  ctaText: 'Steuerneutrale Strategie zuerst im Demokonto planen',
  ctaButton: 'Zum Demokonto',
  related: ['offshore-cfd-broker-ohne-esma', 'cfd-konto-eroeffnen-anleitung', 'cfd-broker-regulierung-deutschland'],
  body: `
      <h2>Abgeltungssteuer auf CFD-Gewinne</h2>
      <p>CFD-Gewinne sind Einkünfte aus Kapitalvermögen nach §20 Abs. 2 Satz 1 Nr. 3 EStG und unterliegen der Abgeltungssteuer von 25 %. Hinzu kommen Solidaritätszuschlag (5,5 % der Steuerschuld) und gegebenenfalls Kirchensteuer (8 oder 9 % der Steuerschuld, je nach Bundesland).</p>
      <p>Beispiel: CFD-Gewinn 10.000 EUR, kein Freistellungsauftrag ausgeschöpft: Abgeltungssteuer 2.500 EUR, Solidaritätszuschlag 137,50 EUR, Gesamtsteuerlast 2.637,50 EUR, Netto-Gewinn 7.362,50 EUR.</p>

      <h2>Verlustverrechnungstopf Termingeschäfte nach dem Jahressteuergesetz 2024</h2>
      <p><strong>Vor dem Jahressteuergesetz 2024 (bis 5.12.2024):</strong> Verluste aus CFD-Termingeschäften durften nach §20 Abs. 6 Satz 5 EStG nur bis zu 20.000 EUR pro Kalenderjahr mit Gewinnen aus Termingeschäften oder Stillhalterprämien verrechnet werden. Nicht verrechnete Verluste konnten vorgetragen, aber in Folgejahren ebenfalls nur bis 20.000 EUR verrechnet werden.</p>
      <p><strong>Nach dem Jahressteuergesetz 2024 (ab 6.12.2024):</strong> §20 Abs. 6 Satz 5 EStG wurde ersatzlos gestrichen. Verluste aus CFD-Termingeschäften sind seither unbegrenzt mit sämtlichen Kapitalerträgen verrechenbar. Die Neuregelung gilt rückwirkend für alle am 6.12.2024 offenen Fälle (§52 Abs. 28 EStG). Banken und Broker müssen ihre IT-Systeme bis 1.1.2026 an die neue Gesetzeslage anpassen.</p>

      <h3>Praktisches Beispiel Verlustverrechnung</h3>
      <p>Trader A hat im Jahr 2025 CFD-Gewinne von 15.000 EUR und CFD-Verluste von 12.000 EUR. Nettogewinn: 3.000 EUR. Abgeltungssteuer auf 3.000 EUR: 750 EUR zuzüglich Solidaritätszuschlag 41,25 EUR; Gesamtsteuerlast 791,25 EUR. Da die 20.000-EUR-Grenze aufgehoben wurde, ist die vollständige Verlustverrechnung möglich.</p>

      <h2>Sparerpauschbetrag und Freistellungsauftrag</h2>
      <p>Der Sparerpauschbetrag beträgt ab 2023 1.000 EUR pro Person (2.000 EUR bei gemeinsamer Veranlagung). Er gilt für alle Kapitalerträge, einschließlich CFD-Gewinne. Bis zur Ausschöpfung des Sparerpauschbetrags fallen keine Kapitalertragsteuern an. Ein Freistellungsauftrag beim Broker stellt sicher, dass die Abgeltungssteuer erst nach Ausschöpfung des Freibetrags abgeführt wird.</p>

      <h2>Swap-Gebühren und Kommissionen steuerlich</h2>
      <p>Swap-Gebühren (Overnight-Kosten für gehebelte CFD-Positionen) können grundsätzlich als Werbungskosten bei den Einkünften aus Kapitalvermögen geltend gemacht werden, soweit sie mit steuerpflichtigen Kapitalerträgen zusammenhängen. Seit der Einführung der Abgeltungssteuer ist der Abzug tatsächlicher Werbungskosten über den Sparerpauschbetrag hinaus jedoch pauschaliert und in vielen Fällen eingeschränkt.</p>
      <p>Kommissionen (Transaktionsgebühren bei ECN-/Raw-Spread-Konten) können ebenfalls als Anschaffungsnebenkosten die steuerliche Bemessungsgrundlage der Gewinne mindern. Auch hier gilt: Einzelfallprüfung durch einen Steuerberater empfohlen.</p>

      <h2>CFD-Gewinne im Ausland und Steuerpflicht</h2>
      <p>Das deutsche Welteinkommensprinzip gilt für alle in Deutschland unbeschränkt steuerpflichtigen Personen. CFD-Gewinne bei Offshore-Brokern müssen in der deutschen Einkommensteuererklärung unter den Einkünften aus Kapitalvermögen angegeben werden, auch wenn der Broker keine deutsche Abgeltungssteuer einbehält. Offshore-Broker stellen in der Regel keine deutschen Steuerbescheinigungen aus; Trader müssen Gewinne und Verluste selbst dokumentieren.</p>
  `,
  faqs: [
    { q: 'Mit welchem Steuersatz werden CFD-Gewinne in Deutschland besteuert?', a: 'CFD-Gewinne unterliegen der Abgeltungssteuer von 25 % zuzüglich Solidaritätszuschlag (effektiv ca. 26,375 % ohne Kirchensteuer). Der Sparerpauschbetrag von 1.000 EUR pro Person reduziert die steuerliche Bemessungsgrundlage.' },
    { q: 'Was bedeutete die 20.000-EUR-Grenze im Verlustverrechnungstopf für Termingeschäfte?', a: 'Die frühere Regelung nach §20 Abs. 6 Satz 5 EStG beschränkte die Verrechnung von Verlusten aus Termingeschäften auf maximal 20.000 EUR pro Jahr. Diese Beschränkung wurde durch das Jahressteuergesetz 2024 aufgehoben; Verluste sind seither unbegrenzt verrechenbar.' },
    { q: 'Kann ich Swap-Gebühren und Kommissionen von der Steuer absetzen?', a: 'Swap-Gebühren und Kommissionen können grundsätzlich steuerlich berücksichtigt werden, da sie die Gewinne aus CFD-Termingeschäften mindern. Die genaue steuerliche Behandlung ist einzelfallabhängig.' },
    { q: 'Müssen CFD-Gewinne bei einem Offshore-Broker in der deutschen Steuererklärung angegeben werden?', a: 'Ja. Das Welteinkommensprinzip verpflichtet unbeschränkt steuerpflichtige Personen, alle weltweiten Kapitalerträge anzugeben, unabhängig davon, wo der Broker seinen Sitz hat.' }
  ]
});

/* ---------------------------------------------------------------------- */
/* Build                                                                  */
/* ---------------------------------------------------------------------- */

const PAGE_INDEX = {};
PAGES.forEach(p => {
  PAGE_INDEX[p.slug] = { slug: p.slug, title: p.breadcrumbLabel, icon: iconFor(p.slug) };
});

function iconFor(slug) {
  const map = {
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
  return map[slug] || 'fa-circle-info';
}

PAGES.forEach(p => {
  const html = renderPage(p);
  fs.writeFileSync(path.join(ROOT, p.slug + '.html'), html, 'utf8');
  console.log('written:', p.slug + '.html');
});

module.exports = { PAGES, PAGE_INDEX };
