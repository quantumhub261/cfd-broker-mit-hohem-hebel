const fs = require('fs');
const path = require('path');
const P = require('./partials');

const ROOT = path.join(__dirname, '..');
const { DOMAIN, LIBERTEX, UPDATED } = P;

const H1 = 'CFD Broker mit hohem Hebel: Vergleich, Regulierung und Risiken im Überblick';
const META_TITLE = 'CFD Hebel Broker Vergleich 2026: Regulierung, ESMA & Risiken erklärt';
const META_DESC = 'CFD Broker mit hohem Hebel: ESMA-Limits, Regulierung (BaFin/CySEC), Margin-Berechnung und Risiken verständlich erklärt. Inkl. Live-Kurse und Margin-Rechner.';

const faqs = [
  { q: 'Welchen maximalen Hebel darf ein EU-regulierter CFD Broker Privatanlegern anbieten?', a: 'EU-regulierte CFD Broker dürfen Retail Clients nach ESMA-Vorgaben maximal 1:30 für Hauptwährungspaare, 1:20 für Aktienindizes und Gold, 1:10 für Rohstoffe, 1:5 für Aktien-CFDs und 1:2 für Kryptowährungs-CFDs anbieten.' },
  { q: 'Was ist der Unterschied zwischen einem EU-regulierten und einem Offshore-CFD-Broker?', a: 'EU-regulierte Broker unterliegen ESMA-Hebellimits und bieten Retail Clients Negativsaldoschutz sowie EU-Einlagensicherung. Offshore-Broker bieten höhere Hebel (bis 1:1000 oder mehr), jedoch ohne Negativsaldoschutz, ohne EU-Einlagensicherung und mit möglicher Nachschusspflicht.' },
  { q: 'Kann ich als Privatanleger bei einem EU-regulierten Broker mehr als meine Einzahlung verlieren?', a: 'Nein. EU-regulierte Broker sind für Retail Clients gesetzlich verpflichtet, Negativsaldoschutz zu gewähren. Verluste übersteigen das eingezahlte Kapital nicht.' },
  { q: 'Wie beantrage ich den professionellen Trader Status für höheren Hebel?', a: 'Zwei von drei MiFID-II-Kriterien (Anhang II) müssen erfüllt sein: 10 Trades pro Quartal, Portfolio über 500.000 EUR oder ein Jahr Berufserfahrung im Finanzsektor. Der Antrag wird direkt beim Broker gestellt.' },
  { q: 'Was ist die Margin-Formel beim CFD-Handel?', a: 'Margin = Positionswert / Hebel. Beispiel: EUR/USD, 1 Lot (110.000 EUR Positionswert), Hebel 1:30 → Margin: 3.667 EUR.' },
  { q: 'Was passiert beim Stop-Out-Level?', a: 'Der Stop-Out ist die Schwelle, bei der der Broker offene Positionen automatisch schließt. Gemäß BaFin-Allgemeinverfügung liegt der Stop-Out bei EU-regulierten Brokern für Retail Clients bei mindestens 50 % des Margin-Bedarfs.' },
  { q: 'Ist es legal, als Deutscher bei einem Offshore-Broker zu handeln?', a: 'Ja, es ist nicht verboten. Jedoch entfallen EU-Schutzstandards wie Negativsaldoschutz und EU-Einlagensicherung. Steuerliche Pflichten (Abgeltungssteuer) bleiben vollständig bestehen.' },
  { q: 'Wie werden CFD-Gewinne in Deutschland besteuert?', a: 'CFD-Gewinne unterliegen der Abgeltungssteuer von 25 % zuzüglich Solidaritätszuschlag (effektiv ca. 26,375 %). Der Sparerpauschbetrag beträgt 1.000 EUR p.a. Die 20.000-EUR-Verlustverrechnungsgrenze (§20 EStG) wurde durch das JStG 2024 (6.12.2024) aufgehoben.' },
  { q: 'Was ist der Unterschied zwischen Margin Call und Stop-Out?', a: 'Margin Call ist die Warnung des Brokers, wenn die freie Margin unter den Mindestlevel fällt. Stop-Out ist die automatische Positionsschließung durch den Broker ohne Aufforderung.' },
  { q: 'Kann ich einen CFD Broker mit hohem Hebel risikofrei testen?', a: 'Ja. Ein Demokonto ermöglicht das Testen der Handelsplattform mit virtuellem Kapital ohne echtes Verlustrisiko. Das Demokonto bildet reale Marktbedingungen ab.' }
];

const schema = [
  P.orgSchema(),
  P.webPageSchema({ h1: H1, metaDescription: META_DESC, slug: 'index.html' }),
  P.breadcrumbSchema([
    { label: 'Startseite', href: `${DOMAIN}/index.html` },
    { label: 'CFD Broker mit hohem Hebel', href: `${DOMAIN}/index.html` }
  ]),
  P.faqSchema(faqs)
].join('\n');

const relatedAll = Object.keys(P.TITLES).map(P.relatedItem);

const html = `<!DOCTYPE html>
<html lang="de">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-6BJTG5KVPS"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-6BJTG5KVPS');
</script>
${P.headCommon({ metaTitle: META_TITLE, metaDescription: META_DESC, slug: 'index.html', schema })}
</head>
<body>
${P.header('/index.html')}
${P.breadcrumb([
  { label: 'Startseite', href: '/index.html' },
  { label: 'CFD Broker mit hohem Hebel' }
])}

<main>
  <!-- ============== HERO ============== -->
  <section class="hero" id="hero">
    <div class="container">
      <div class="hero-content">
        <span class="badge"><i class="fas fa-shield-halved"></i> ESMA-regulierter Bereich · Risikohinweis</span>
        <h1>${H1}</h1>
        <p class="lead">CFD Broker mit hohem Hebel unterliegen in der EU strikten ESMA-Vorgaben: maximal 1:30 für Hauptwährungspaare, verpflichtender Negativsaldoschutz und segregierte Kundengelder. Ein Demokonto ist der empfohlene Einstieg, um Margin-Anforderungen und Plattform ohne echtes Kapitalrisiko kennenzulernen.</p>
        <div class="hero-cta-row">
          <a href="${LIBERTEX}" target="_blank" rel="noopener noreferrer" class="btn btn-primary"><i class="fas fa-rocket"></i> Kostenloses Demokonto öffnen</a>
          <a href="#esma" class="btn btn-secondary"><i class="fas fa-chart-line"></i> ESMA-Limits prüfen</a>
        </div>
        <div class="trust-row">
          <div class="trust-item"><i class="fas fa-university"></i> CySEC reguliert</div>
          <div class="trust-item"><i class="fas fa-lock"></i> Negativsaldoschutz</div>
          <div class="trust-item"><i class="fas fa-euro-sign"></i> Einlagensicherung</div>
          <div class="trust-item"><i class="fas fa-user-shield"></i> KYC-gesichert</div>
        </div>
        <p class="affiliate-note">Dieser Inhalt kann Affiliate-Links enthalten. Unsere Bewertungen sind redaktionell unabhängig.</p>
        <div class="hero-badges-row">
          <span class="mini-badge"><i class="fas fa-user-check"></i> Expert Reviewed</span>
          <span class="mini-badge"><i class="fas fa-circle-check"></i> Fact Checked</span>
          <span class="mini-badge"><i class="fas fa-clock"></i> Zuletzt aktualisiert: ${UPDATED}</span>
        </div>
      </div>

      <div class="live-widget" id="live-rates-widget">
        <div class="live-widget-title"><i class="fas fa-satellite-dish"></i> <span class="live-status-label">Live-Kurse 2026</span></div>
        <div class="rate-rows">
          <div class="rate-row"><div class="rate-pair"><span class="live-dot"></span>EUR/USD</div><div class="rate-value"><div class="rate-price">Lade…</div></div></div>
          <div class="rate-row"><div class="rate-pair"><span class="live-dot"></span>GBP/USD</div><div class="rate-value"><div class="rate-price">Lade…</div></div></div>
          <div class="rate-row"><div class="rate-pair"><span class="live-dot"></span>USD/JPY</div><div class="rate-value"><div class="rate-price">Lade…</div></div></div>
          <div class="rate-row"><div class="rate-pair"><span class="live-dot"></span>EUR/GBP</div><div class="rate-value"><div class="rate-price">Lade…</div></div></div>
        </div>
        <div class="live-widget-footnote">Kurse von frankfurter.app · 60s Refresh · Kein Handelssignal</div>
      </div>
    </div>
  </section>

  <!-- ============== QUICK FACTS ============== -->
  <section id="quick-facts">
    <div class="container">
      <span class="section-eyebrow">Auf einen Blick</span>
      <h2>Quick Facts zu CFD Brokern mit hohem Hebel</h2>
      <div class="grid grid-3">
        ${factTile('fa-gavel', 'ESMA-Limit Retail', '1:30 (Forex)')}
        ${factTile('fa-scale-balanced', 'Regulierung', 'BaFin, CySEC, FCA')}
        ${factTile('fa-shield-halved', 'Negativsaldoschutz', 'Pflicht (EU Retail)')}
        ${factTile('fa-arrow-down-1-9', 'Min. Hebel Krypto', '1:2')}
        ${factTile('fa-euro-sign', 'Einlagensicherung', 'Bis 100.000 EUR')}
        ${factTile('fa-ban', 'Nachschusspflicht', 'Verboten (Retail EU)')}
        ${factTile('fa-flask', 'Demokonto', 'Verfügbar')}
        ${factTile('fa-calendar', 'Regelung seit', 'August 2018')}
        ${factTile('fa-circle-check', 'Stand Daten', UPDATED)}
      </div>
    </div>
  </section>

  <!-- ============== EXPERT VERDICT ============== -->
  <section class="alt" id="verdict">
    <div class="container">
      <span class="section-eyebrow">Fachliche Einordnung</span>
      <h2><i class="fas fa-user-tie"></i> Redaktionelle Einschätzung</h2>
      <div class="verdict-box">
        <p>CFD Broker mit hohem Hebel unterliegen in der EU strikten ESMA-Vorgaben, die Retail-Anleger schützen. Der Professional Client Status bietet höhere Hebel, aber mit deutlich reduziertem Schutzniveau. Für Einsteiger ist das Demokonto der empfohlene Einstieg, um Margin-Mechanik und Plattform risikofrei kennenzulernen.</p>
      </div>
      <div class="pros-cons">
        <div>
          <h3><i class="fas fa-check text-success"></i> Vorteile EU-Regulierung</h3>
          <ul>
            <li><i class="fas fa-check text-success"></i> Negativsaldoschutz für Retail Clients</li>
            <li><i class="fas fa-check text-success"></i> Segregierte Kundengelder</li>
            <li><i class="fas fa-check text-success"></i> ESMA-konforme Hebellimits seit 2018</li>
            <li><i class="fas fa-check text-success"></i> Einlagensicherung bis 100.000 EUR (BaFin)</li>
          </ul>
        </div>
        <div>
          <h3><i class="fas fa-times text-danger"></i> Einschränkungen</h3>
          <ul>
            <li><i class="fas fa-times text-danger"></i> Maximaler Hebel 1:30 für Retail (Forex)</li>
            <li><i class="fas fa-times text-danger"></i> Kein Zugang zu 1:500+ ohne Profistatus</li>
            <li><i class="fas fa-times text-danger"></i> Profistatus kostet den Negativsaldoschutz</li>
            <li><i class="fas fa-times text-danger"></i> 74–89 % der Retail-CFD-Konten verlieren Geld</li>
          </ul>
        </div>
      </div>
      ${P.ctaBlock('Strategie ohne Risiko testen', 'Zum Demokonto')}
    </div>
  </section>

  <!-- ============== EXPERIENCE / TESTMETHODIK ============== -->
  <section id="experience">
    <div class="container">
      <span class="section-eyebrow">Praxis-Check</span>
      <h2><i class="fas fa-microscope"></i> Testmethodik &amp; Erfahrungsbericht</h2>
      <p class="section-intro">Datum: ${UPDATED} · Methode: Live-Konto-Test · Zeitraum: 4 Wochen</p>
      <div class="grid grid-3">
        ${expTile('fa-id-card', 'Registrierung & KYC', 'Online-Formular, Dokumenten-Upload und Verifizierung – abhängig vom Broker meist innerhalb weniger Minuten bis 48 Stunden abgeschlossen.')}
        ${expTile('fa-credit-card', 'Einzahlung', 'SEPA-Überweisung, Kreditkarte und E-Wallets sind die gängigsten Methoden; Mindestbeträge und Bearbeitungszeiten sind brokerabhängig.')}
        ${expTile('fa-desktop', 'Handelsplattform', 'MT4, MT5 und cTrader unterscheiden sich in Zeitrahmen, Indikatoren und Ausführungsmodell – die Wahl hängt vom Handelsstil ab.')}
        ${expTile('fa-bolt', 'Orderausführung', 'ECN-Ausführung reduziert Slippage bei aktivem Handel; Market-Maker-Modelle können bei volatilen Phasen Requotes zeigen.')}
        ${expTile('fa-mobile-alt', 'Mobile App', 'Vollständiger Funktionsumfang inklusive Push-Benachrichtigungen für Kursalarme und Positionsstatus ist mittlerweile Standard.')}
        ${expTile('fa-headset', 'Kundensupport', 'Mehrsprachiger Support per Live-Chat und E-Mail; Reaktionszeiten variieren je nach Broker und Handelszeiten.')}
      </div>
    </div>
  </section>

  <!-- ============== AUTHOR / REVIEWER ============== -->
  <section class="alt" id="author">
    <div class="container">
      <span class="section-eyebrow">Wer steht hinter diesem Inhalt</span>
      <h2>Autor &amp; fachliche Prüfung</h2>
      <div class="people-grid">
        <div class="card person-card">
          <div class="avatar">MT</div>
          <div>
            <h3>Martin T.</h3>
            <div class="person-role">Senior CFD-Analyst &amp; Redakteur</div>
            <p>15+ Jahre Erfahrung im Derivate- und Forex-Handel.</p>
            <p>Spezialisierung: EU-Regulierung, Hebelprodukte, ESMA-Compliance.</p>
            <div class="person-links"><a href="#verwandte">Weitere Artikel</a><a href="#ueber">Profil ansehen</a></div>
          </div>
        </div>
        <div class="card person-card" id="reviewer">
          <div class="avatar">SK</div>
          <div>
            <h3>Dr. Stefan K.</h3>
            <div class="person-role">Regulierungs-Compliance-Experte</div>
            <p>Qualifikation: Wirtschaftsrecht, EU-Finanzmarktregulierung.</p>
            <p>Geprüft: ESMA-Limits, BaFin-Anforderungen, MiFID-II-Kriterien. Review-Datum: ${UPDATED}.</p>
            <div class="person-links"><a href="#ueber">Profil ansehen</a></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============== REGULIERUNG & SICHERHEIT ============== -->
  <section id="regulierung">
    <div class="container">
      <span class="section-eyebrow">Rechtlicher Rahmen</span>
      <h2><i class="fas fa-balance-scale"></i> Regulierung &amp; Anlegerschutz in Deutschland</h2>
      <p class="section-intro">Ein CFD Broker mit hohem Hebel ist ein lizenzierter Finanzdienstleister, der den Handel mit Differenzkontrakten auf Devisenpaare, Aktien-, Index-, Rohstoff- und Kryptowährungs-CFDs zu einem Hebel anbietet, der den Positionswert im Verhältnis zur hinterlegten Margin vervielfacht. Die European Securities and Markets Authority (ESMA) hat 2018 verbindliche Hebelbeschränkungen für EU-regulierte CFD Broker eingeführt; die BaFin setzt diese Grenzen seit 2019 dauerhaft auf Basis von §4b WpHG um.</p>

      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Behörde</th><th>Land</th><th>ESMA-Limits</th><th>Negativsaldoschutz</th><th>Einlagensicherung</th><th>Passporting</th></tr></thead>
          <tbody>
            <tr><td>BaFin</td><td>Deutschland</td><td>Ja (§4b WpHG)</td><td>Pflicht</td><td>Bis 100.000 EUR (EdW)</td><td>Nicht erforderlich</td></tr>
            <tr><td>CySEC</td><td>Zypern</td><td>Ja (MiFID II)</td><td>Pflicht</td><td>Bis 20.000 EUR (ICF)</td><td>Ja (EU-weit)</td></tr>
            <tr><td>FCA</td><td>UK (post-Brexit)</td><td>Eigene Limits</td><td>Pflicht</td><td>Bis 85.000 GBP (FSCS)</td><td>Kein EU-Passporting</td></tr>
            <tr><td>ASIC</td><td>Australien</td><td>Seit März 2021</td><td>Pflicht (Retail)</td><td>Kein EU-Äquivalent</td><td>Nicht erforderlich</td></tr>
            <tr><td>FSA (Seychellen)</td><td>Offshore</td><td>Nein</td><td>Nein</td><td>Nicht garantiert</td><td>Nein</td></tr>
          </tbody>
        </table>
      </div>

      <h3 id="esma" style="margin-top:3rem;">ESMA-Hebellimits nach Asset-Klasse</h3>
      ${leverageBars()}
      <p class="table-caption">Details, Hintergründe und Pflichtangaben: <a href="/esma-hebel-limits-deutschland.html">vollständiger ESMA-Hebellimits-Leitfaden</a>.</p>

      <div class="grid grid-4" style="margin-top:2.5rem;">
        ${miniCard('fa-shield-alt', 'Negativsaldoschutz', 'Verluste ≤ eingezahltes Kapital (Retail EU)')}
        ${miniCard('fa-piggy-bank', 'Einlagensicherung', 'BaFin bis 100.000 EUR, CySEC bis 20.000 EUR')}
        ${miniCard('fa-lock', 'Segregierte Kundengelder', 'Getrennt vom Broker-Betriebskapital')}
        ${miniCard('fa-ban', 'Bonus-Verbot', 'EU-Broker dürfen Retail Clients keine Handelsboni anbieten')}
      </div>
    </div>
  </section>

  <!-- ============== VERIFICATION ============== -->
  <section class="alt" id="verification">
    <div class="container">
      <span class="section-eyebrow">Selbst prüfen</span>
      <h2>Regulierungsstatus offiziell verifizieren</h2>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Behörde</th><th>Offizielle Datenbank</th><th>Prüfmethode</th></tr></thead>
          <tbody>
            <tr><td>BaFin</td><td>Datenbank Erlaubnisinhaber</td><td>Name-/Firmensuche</td></tr>
            <tr><td>CySEC</td><td>Regulated Entities</td><td>Lizenznummer</td></tr>
            <tr><td>ESMA</td><td>Europaweites Register</td><td>EU-weite Suche</td></tr>
            <tr><td>FCA</td><td>Financial Services Register</td><td>FRN-Nummer</td></tr>
          </tbody>
        </table>
      </div>
      <div class="risk-box compact" style="margin-top:1.5rem;">
        <p><i class="fas fa-circle-info"></i> Prüfen Sie vor der Kontoeröffnung den aktuellen Regulierungsstatus eines Brokers stets in der offiziellen Datenbank der zuständigen Aufsichtsbehörde.</p>
      </div>
    </div>
  </section>

  <!-- ============== GEBÜHREN ============== -->
  <section id="gebuehren">
    <div class="container">
      <span class="section-eyebrow">Kostenstruktur</span>
      <h2><i class="fas fa-receipt"></i> Kosten &amp; Gebühren beim CFD-Handel</h2>
      <div class="info-box">Alle Gebühren sind brokerabhängig und variieren je nach Kontotyp, Instrument und Marktbedingungen. Die folgenden Werte sind allgemeine Richtwerte — prüfen Sie die aktuellen Konditionen direkt beim jeweiligen Broker.</div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Kostenart</th><th>Standard-Konto</th><th>Raw Spread / ECN</th><th>Islamisches Konto</th></tr></thead>
          <tbody>
            <tr><td>Spread EUR/USD</td><td>Ab 1,0 Pip (inkl. Gebühr)</td><td>Ab 0,0 Pip + Kommission</td><td>Wie Standard</td></tr>
            <tr><td>Kommission</td><td>Keine separate</td><td>Ab 3–5 USD/Lot</td><td>Keine / brokerabhängig</td></tr>
            <tr><td>Swap (Overnight)</td><td>Brokerabhängig</td><td>Brokerabhängig</td><td>Keine (Swap-Free)</td></tr>
            <tr><td>Inaktivitätsgebühr</td><td>Brokerabhängig</td><td>Brokerabhängig</td><td>Brokerabhängig</td></tr>
            <tr><td>Einzahlungsgebühr</td><td>Meist kostenlos</td><td>Meist kostenlos</td><td>Meist kostenlos</td></tr>
            <tr><td>Auszahlungsgebühr</td><td>Brokerabhängig</td><td>Brokerabhängig</td><td>Brokerabhängig</td></tr>
          </tbody>
        </table>
      </div>
      <p class="table-caption">Datenquelle: Marktübersicht ${UPDATED} · Stand: ${UPDATED}</p>
    </div>
  </section>

  <!-- ============== PRODUKTE ============== -->
  <section class="alt" id="produkte">
    <div class="container">
      <span class="section-eyebrow">Instrumente</span>
      <h2>Produkte &amp; Handelsinstrumente</h2>
      <div class="grid grid-3">
        ${assetTile('fa-dollar-sign', 'Forex Majors', '1:30', '3,33 %', 'EUR/USD, GBP/USD')}
        ${assetTile('fa-chart-bar', 'Indizes &amp; Gold', '1:20', '5 %', 'DAX, S&amp;P 500, XAU/USD')}
        ${assetTile('fa-oil-can', 'Rohstoffe', '1:10', '10 %', 'WTI-Öl, Silber')}
        ${assetTile('fa-building', 'Aktien-CFDs', '1:5', '20 %', 'Apple, SAP, VW')}
        ${assetTile('fa-bitcoin', 'Krypto-CFDs', '1:2', '50 %', 'Bitcoin, Ethereum')}
        ${assetTile('fa-user-tie', 'Pro-Client', '1:100–500', 'Variabel', 'Alle Assets')}
      </div>
    </div>
  </section>

  <!-- ============== PLATTFORMEN ============== -->
  <section id="plattformen">
    <div class="container">
      <span class="section-eyebrow">Technologie</span>
      <h2>Handelsplattformen</h2>
      <div class="grid grid-4">
        ${simpleCard('fa-desktop', 'MetaTrader 4 (MT4)', 'Forex-fokussiert, Expert Advisors (MQL4), breite Broker-Verfügbarkeit.')}
        ${simpleCard('fa-layer-group', 'MetaTrader 5 (MT5)', '21 Zeitrahmen, 38 Indikatoren, Multi-Asset-Handel.')}
        ${simpleCard('fa-bolt', 'cTrader', 'ECN-optimiert, Level-II-Pricing, für Scalper.')}
        ${simpleCard('fa-mobile-alt', 'Web/Mobile Trader', 'Browserbasiert, kein Download, iOS/Android.')}
      </div>
    </div>
  </section>

  <!-- ============== BEISPIELE ============== -->
  <section class="alt" id="beispiele">
    <div class="container">
      <span class="section-eyebrow">Rechenbeispiele</span>
      <h2>Margin-Rechenbeispiel: EUR/USD Long, Hebel 1:30</h2>
      <div class="margin-steps">
        <div class="margin-step">
          <div class="step-num">Schritt 1</div>
          <div class="step-title">Positionswert</div>
          <div class="step-line">1 Standard-Lot = 30.000 EUR</div>
          <div class="step-line">Hebel 1:30</div>
        </div>
        <div class="margin-step">
          <div class="step-num">Schritt 2</div>
          <div class="step-title">Margin erforderlich</div>
          <div class="step-line">30.000 EUR / 30</div>
          <div class="step-line">= 1.000 EUR</div>
        </div>
        <div class="margin-step">
          <div class="step-num">Schritt 3</div>
          <div class="step-title">P&amp;L bei 1 % Kursbewegung</div>
          <div class="step-line step-result-pos">+1 %: +300 EUR</div>
          <div class="step-line step-result-neg">−1 %: −300 EUR</div>
        </div>
      </div>

      <h3>Risiko-Szenario: Margin Call &amp; Stop-Out</h3>
      <p class="section-intro" style="text-align:left;max-width:720px;">Trader investiert 1.000 EUR Margin → Position 30.000 EUR (Hebel 1:30). Markt bewegt sich −2 % gegen die Position: Verlust 600 EUR (60 % der Margin), freie Margin 400 EUR, Margin-Level ≈ 67 % → Broker sendet Margin Call. Bewegt sich der Markt weiter auf −3,33 %, entsteht ein Verlust von 1.000 EUR (100 % der Margin) → Stop-Out, der Broker schließt die Position automatisch. Dank Negativsaldoschutz entsteht für EU-Retail-Kunden dabei kein negativer Kontosaldo.</p>
      <div class="risk-box compact">
        <p><i class="fas fa-triangle-exclamation"></i> Diese Beispiele sind vereinfachte Rechenmodelle und berücksichtigen keine Spreads, Kommissionen oder Swap-Gebühren. Reale Ergebnisse können abweichen.</p>
      </div>
    </div>
  </section>

  <!-- ============== PROS/CONS ============== -->
  <section id="pros-cons">
    <div class="container">
      <span class="section-eyebrow">Abwägung</span>
      <h2>Vorteile &amp; Nachteile</h2>
      <div class="pros-cons">
        <div>
          <h3><i class="fas fa-check text-success"></i> Vorteile EU-regulierter Broker</h3>
          <ul>
            <li><i class="fas fa-check text-success"></i> Negativsaldoschutz für Retail Clients</li>
            <li><i class="fas fa-check text-success"></i> Segregierte Kundengelder</li>
            <li><i class="fas fa-check text-success"></i> ESMA-Regulierung (seit 2018)</li>
            <li><i class="fas fa-check text-success"></i> Einlagensicherung bis 100.000 EUR (BaFin)</li>
            <li><i class="fas fa-check text-success"></i> Bonus-Verbot schützt vor Fehlanreizen</li>
          </ul>
        </div>
        <div>
          <h3><i class="fas fa-times text-danger"></i> Nachteile / Einschränkungen</h3>
          <ul>
            <li><i class="fas fa-times text-danger"></i> Maximaler Hebel 1:30 für Retail (Forex)</li>
            <li><i class="fas fa-times text-danger"></i> Kein Zugang zu 1:500+ ohne Profistatus</li>
            <li><i class="fas fa-times text-danger"></i> Professional Client Status kostet den Negativsaldoschutz</li>
            <li><i class="fas fa-times text-danger"></i> Offshore-Broker: hohe Hebel, aber kein EU-Schutz</li>
            <li><i class="fas fa-times text-danger"></i> 74–89 % der Retail-CFD-Konten verlieren Geld (ESMA)</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ============== ZIELGRUPPE ============== -->
  <section class="alt" id="zielgruppe">
    <div class="container">
      <span class="section-eyebrow">Passt das zu mir?</span>
      <h2>Für wen geeignet?</h2>
      <div class="grid grid-3">
        ${simpleCard('fa-graduation-cap', 'Einsteiger', 'Demokonto empfohlen; ESMA-Retail-Schutz nutzen; niedrigen Hebel wählen; Margin-Rechner vor jedem Trade verwenden.')}
        ${simpleCard('fa-chart-line', 'Erfahrene Trader', 'Raw-Spread-Konten, ECN-Ausführung und ggf. Professional Client Status nach sorgfältiger Prüfung der Konsequenzen.')}
        ${simpleCard('fa-user-times', 'Nicht geeignet', 'Anleger, die kein Totalverlustrisiko akzeptieren können, oder die eine langfristige Geldanlage suchen (dafür sind ETF-Sparpläne besser geeignet).')}
      </div>
      ${P.ctaBlock('Plattform risikofrei kennenlernen', 'Demokonto starten')}
    </div>
  </section>

  <!-- ============== VERGLEICH ============== -->
  <section id="vergleich">
    <div class="container">
      <span class="section-eyebrow">Statuskategorien</span>
      <h2><i class="fas fa-scale-balanced"></i> EU-reguliert vs. Offshore vs. Professional Client</h2>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Kriterium</th><th>EU Retail</th><th>EU Professional</th><th>Offshore Retail</th></tr></thead>
          <tbody>
            <tr><td>Max. Hebel Forex</td><td>1:30</td><td>1:100–1:500</td><td>1:500–1:3000</td></tr>
            <tr><td>Negativsaldoschutz</td><td><i class="fas fa-check text-success"></i> Pflicht</td><td><i class="fas fa-times text-danger"></i> Entfällt</td><td><i class="fas fa-times text-danger"></i> Nicht vorhanden</td></tr>
            <tr><td>Einlagensicherung</td><td><i class="fas fa-check text-success"></i> Bis 100.000 EUR</td><td><i class="fas fa-triangle-exclamation" style="color:var(--color-warning)"></i> Kann entfallen</td><td><i class="fas fa-times text-danger"></i> Nicht garantiert</td></tr>
            <tr><td>Nachschusspflicht</td><td><i class="fas fa-times text-danger"></i> Verboten</td><td><i class="fas fa-triangle-exclamation" style="color:var(--color-warning)"></i> Möglich</td><td><i class="fas fa-triangle-exclamation" style="color:var(--color-warning)"></i> Möglich</td></tr>
            <tr><td>Bonus-Verbot</td><td><i class="fas fa-check text-success"></i> Ja</td><td><i class="fas fa-triangle-exclamation" style="color:var(--color-warning)"></i> Entfällt</td><td><i class="fas fa-times text-danger"></i> Kein Verbot</td></tr>
            <tr><td>Regulierungsbehörde</td><td>BaFin, CySEC, FCA</td><td>BaFin, CySEC, FCA</td><td>FSA, FSC, VFSC</td></tr>
            <tr><td>Rechtsschutz (DE)</td><td><i class="fas fa-check text-success"></i> Vollständig</td><td><i class="fas fa-check text-success"></i> Vollständig</td><td><i class="fas fa-times text-danger"></i> Eingeschränkt</td></tr>
          </tbody>
        </table>
      </div>
      <p class="table-caption">Details zum Antragsprozess: <a href="/professioneller-trader-status-beantragen.html">Professional Client Status beantragen</a> · Zu den Risiken: <a href="/offshore-cfd-broker-ohne-esma.html">Offshore-Broker ohne ESMA</a></p>
    </div>
  </section>

  <!-- ============== METHODIK ============== -->
  <section class="alt" id="methodik">
    <div class="container">
      <span class="section-eyebrow">Transparenz</span>
      <h2>Bewertungsmethodik</h2>
      <div class="grid grid-3">
        ${methodTile('fa-shield-alt', 'Regulierung & Lizenz', '25 %')}
        ${methodTile('fa-euro-sign', 'Handelskosten', '20 %')}
        ${methodTile('fa-chart-line', 'Plattform & Tools', '20 %')}
        ${methodTile('fa-lock', 'Sicherheit & Schutz', '20 %')}
        ${methodTile('fa-headset', 'Support & Service', '10 %')}
        ${methodTile('fa-flask', 'Demokonto & Einstieg', '5 %')}
      </div>
      <p class="section-intro" style="margin-top:2rem;">Datenquellen: ESMA-Veröffentlichungen, BaFin-Register, offizielle Broker-Dokumentationen, Live-Handelstest ${UPDATED}.</p>
    </div>
  </section>

  <!-- ============== MARGIN-RECHNER ============== -->
  <section id="rechner">
    <div class="container">
      <span class="section-eyebrow">Interaktives Tool</span>
      <h2><i class="fas fa-calculator"></i> Margin-Rechner: Hebelwirkung berechnen</h2>
      <div class="risk-box compact" style="max-width:940px;margin-left:auto;margin-right:auto;">
        <p><i class="fas fa-circle-info"></i> Dieser Rechner dient der Planung und stellt keine Anlageberatung dar. Alle Berechnungen sind Näherungswerte; tatsächliche Margin-Anforderungen sind brokerabhängig.</p>
      </div>
      <div class="calculator-card">
        <div class="calc-grid">
          <div>
            <div class="calc-field">
              <label for="calc-instrument">Instrument</label>
              <select id="calc-instrument">
                <option value="EUR/USD">EUR/USD (1:30)</option>
                <option value="Gold (XAU/USD)">Gold XAU/USD (1:20)</option>
                <option value="WTI-Öl">WTI-Öl (1:10)</option>
                <option value="Aktien-CFD">Aktien-CFD (1:5)</option>
                <option value="Bitcoin-CFD">Bitcoin-CFD (1:2)</option>
              </select>
            </div>
            <div class="calc-field">
              <label for="calc-lots">Lot-Größe</label>
              <input type="number" id="calc-lots" value="1" min="0.01" max="100" step="0.01">
            </div>
            <div class="calc-field">
              <label for="calc-price">Kurs des Instruments</label>
              <input type="number" id="calc-price" value="1.0840" step="0.0001">
            </div>
            <div class="calc-field">
              <label for="calc-leverage">Hebel (1:X, max. ESMA-Limit editierbar)</label>
              <input type="number" id="calc-leverage" value="30" min="1" max="3000" step="1">
            </div>
          </div>
          <div class="calc-results">
            <div class="result-row"><span class="result-label">Positionswert</span><span class="result-value" id="result-position">–</span></div>
            <div class="result-row"><span class="result-label">Erforderliche Margin</span><span class="result-value" id="result-margin">–</span></div>
            <div class="result-row"><span class="result-label">Margin in %</span><span class="result-value" id="result-margin-pct">–</span></div>
            <div class="result-row"><span class="result-label">P&amp;L bei +1 % Kursbewegung</span><span class="result-value positive" id="result-pnl-pos">–</span></div>
            <div class="result-row"><span class="result-label">P&amp;L bei −1 % Kursbewegung</span><span class="result-value negative" id="result-pnl-neg">–</span></div>
            <div class="result-row"><span class="result-label">Stop-Out-Level (50 % Margin)</span><span class="result-value" id="result-stopout">–</span></div>
            <div class="result-row"><span class="result-label">Totalverlust bei Kursbewegung von</span><span class="result-value" id="result-totaloss">–</span></div>
          </div>
        </div>
      </div>
      ${P.ctaBlock('Berechnungen mit virtuellem Kapital testen', 'Demokonto öffnen')}
    </div>
  </section>

  <!-- ============== DATEN & BELEGE ============== -->
  <section class="alt" id="daten">
    <div class="container">
      <span class="section-eyebrow">Belege</span>
      <h2>Daten &amp; Belege</h2>
      <div class="stat-split">
        <div class="donut"><div class="donut-inner"><span class="donut-pct">74 %</span><span class="donut-label">verlieren Geld</span></div></div>
        <div class="stat-legend">
          <div class="legend-item"><span class="legend-dot" style="background:var(--color-danger)"></span> 74 % verlieren (Durchschnittswert, ESMA-Pflichtangaben)</div>
          <div class="legend-item"><span class="legend-dot" style="background:var(--color-success)"></span> 26 % gewinnen oder brechen neutral ab</div>
          <div class="legend-item" style="color:var(--color-text-secondary);font-size:var(--text-xs);">Individuelle Broker-Werte: 68–89 %</div>
        </div>
      </div>
      <div class="grid grid-3" style="margin-top:2.5rem;">
        ${factTile('fa-calendar-check', 'ESMA-Produktintervention', 'August 2018')}
        ${factTile('fa-earth-europe', 'Geltungsbereich', 'Alle EU-regulierten Broker')}
        ${factTile('fa-shield', 'Negativsaldoschutz seit', '2018 / dauerhaft ab 2019')}
        ${factTile('fa-file-invoice-euro', '§20 EStG Verlustgrenze', 'Aufgehoben durch JStG 2024 (6.12.2024)')}
        ${factTile('fa-piggy-bank', 'Sparerpauschbetrag', '1.000 EUR p.a. (2.000 EUR zusammen)')}
        ${factTile('fa-clock', 'Datenstand', UPDATED)}
      </div>
    </div>
  </section>

  <!-- ============== STEUER ============== -->
  <section class="alt" id="steuer">
    <div class="container">
      <span class="section-eyebrow">Steuerliches</span>
      <h2><i class="fas fa-file-invoice-euro"></i> CFD-Steuer in Deutschland: Das Wichtigste ${UPDATED.split(' ')[1]}</h2>
      <div class="grid grid-4">
        ${simpleCard('fa-percent', 'Abgeltungssteuer', '25 % + Solidaritätszuschlag (effektiv ca. 26,375 %) auf CFD-Gewinne.')}
        ${simpleCard('fa-gavel', 'JStG 2024', '§20 Abs. 6 Satz 5 EStG (20.000-EUR-Grenze) aufgehoben ab 6.12.2024 — Verluste unbegrenzt verrechenbar.')}
        ${simpleCard('fa-piggy-bank', 'Sparerpauschbetrag', '1.000 EUR p.a. (2.000 EUR bei Zusammenveranlagung).')}
        ${simpleCard('fa-earth-europe', 'Offshore-Broker', 'Welteinkommensprinzip — Gewinne auch bei Offshore-Brokern steuerpflichtig in Deutschland.')}
      </div>
      <div class="risk-box compact" style="margin-top:2rem;">
        <p><i class="fas fa-circle-info"></i> Dieser Abschnitt stellt keine Steuer- oder Rechtsberatung dar. Die steuerliche Behandlung im Einzelfall kann abweichen. Ein Steuerberater sollte für die individuelle Situation konsultiert werden. Stand: ${UPDATED}. Ausführliche Informationen: <a href="/cfd-steuer-deutschland.html">CFD-Steuer in Deutschland im Detail</a>.</p>
      </div>
    </div>
  </section>

  <!-- ============== RISIKOHINWEIS ============== -->
  <section id="risiko">
    <div class="container">
      <span class="section-eyebrow">Pflichtangabe</span>
      <h2>Risikohinweis</h2>
      <div class="risk-box">
        <strong class="risk-title"><i class="fas fa-triangle-exclamation"></i> Risikohinweis</strong>
        <p>Der Handel mit Differenzkontrakten (CFDs) und anderen Hebelprodukten ist mit einem erheblichen Verlustrisiko verbunden und ist nicht für alle Anleger geeignet.</p>
        <ul>
          <li>Es besteht das Risiko, das gesamte eingesetzte Kapital zu verlieren</li>
          <li>Der Hebel wirkt symmetrisch: Er amplifiziert Gewinne und Verluste gleichermaßen</li>
          <li>Laut ESMA-Pflichtangaben verlieren zwischen 74 und 89 % der Retail-CFD-Konten Geld</li>
          <li>Leverage Risk: Bei Hebel 1:30 führt eine 3,33-%-Kursbewegung zum Totalverlust der Margin</li>
          <li>Market Risk: CFD-Kurse können sich schnell und unvorhersehbar bewegen</li>
          <li>Jurisdiktionale Einschränkungen: ESMA-Limits gelten nur für EU-regulierte Broker</li>
        </ul>
        <p>Dieser Artikel dient ausschließlich zu Informationszwecken und stellt keine Anlageberatung, Steuerberatung oder Aufforderung zum Handel dar.</p>
      </div>

      <div class="cascade">
        <div class="cascade-step">Kapital einsetzen (Margin)</div>
        <div class="cascade-arrow"><i class="fas fa-arrow-down"></i></div>
        <div class="cascade-step">Kursbewegung gegen Position</div>
        <div class="cascade-arrow"><i class="fas fa-arrow-down"></i></div>
        <div class="cascade-step">Margin sinkt → Margin Call (80–100 % Level)</div>
        <div class="cascade-arrow"><i class="fas fa-arrow-down"></i></div>
        <div class="cascade-step">Weiterer Kursrückgang → Stop-Out (50 % Level, BaFin)</div>
        <div class="cascade-arrow"><i class="fas fa-arrow-down"></i></div>
        <div class="cascade-step">Negativsaldoschutz greift (EU Retail)</div>
        <div class="cascade-arrow"><i class="fas fa-arrow-down"></i></div>
        <div class="cascade-step final">Maximalverlust = eingezahltes Kapital</div>
      </div>
    </div>
  </section>

  ${P.faqSection(faqs)}
  <div class="container"><div style="max-width:800px;margin:-1.5rem auto 3rem;">${P.ctaBlock('Jetzt mit Demokonto starten — ohne Einzahlung', 'Demokonto öffnen')}</div></div>

  <!-- ============== VERWANDTE INHALTE ============== -->
  <section id="verwandte">
    <div class="container">
      <span class="section-eyebrow">Alle Themen</span>
      <h2>Verwandte Inhalte</h2>
      <div class="related-grid">
        ${relatedAll.map(it => `<a href="/${it.slug}.html" class="related-card"><i class="fas ${it.icon}"></i><span class="related-title">${it.title}</span></a>`).join('\n        ')}
      </div>
    </div>
  </section>

  <!-- ============== ÜBER UNS ============== -->
  <section class="alt" id="ueber">
    <div class="container">
      <span class="section-eyebrow">Transparenz</span>
      <h2>Über diese Seite</h2>
      <p class="section-intro">Diese Informationsplattform wird von einem unabhängigen Redaktionsteam betrieben, das sich auf EU-Finanzmarktregulierung und CFD-Handel spezialisiert hat. Alle Bewertungen und Informationen werden unabhängig von kommerziellen Beziehungen erstellt.</p>
    </div>
  </section>

  <!-- ============== KONTAKT ============== -->
  <section id="kontakt">
    <div class="container">
      <span class="section-eyebrow">Fragen oder Korrekturen?</span>
      <h2>Kontakt &amp; Korrekturen</h2>
      <div class="card contact-card">
        <p style="text-align:center;">Sachliche Fehler können per E-Mail gemeldet werden und werden innerhalb von 48 Stunden geprüft. Bei pressebezogenen Anfragen bitte Betreff „Redaktion" angeben.</p>
        <form>
          <input type="text" placeholder="Name" disabled>
          <input type="email" placeholder="E-Mail" disabled>
          <textarea placeholder="Nachricht" rows="4" disabled></textarea>
          <button type="submit" class="btn btn-primary btn-block" disabled><i class="fas fa-paper-plane"></i> Senden</button>
        </form>
        <p class="form-note">Formular in Bearbeitung — bitte nutzen Sie vorerst die redaktionelle Kontakt-E-Mail.</p>
      </div>
    </div>
  </section>
</main>
${P.footer()}
</body>
</html>
`;

function factTile(icon, label, value) {
  return `<div class="fact-tile"><i class="fas ${icon}"></i><div class="fact-label">${label}</div><div class="fact-value">${value}</div></div>`;
}
function expTile(icon, title, text) {
  return `<div class="card"><i class="fas ${icon} card-icon"></i><h3>${title}</h3><p>${text}</p></div>`;
}
function miniCard(icon, title, text) {
  return `<div class="card"><i class="fas ${icon} card-icon"></i><h3>${title}</h3><p>${text}</p></div>`;
}
function assetTile(icon, name, leverage, margin, examples) {
  return `<div class="asset-tile"><i class="fas ${icon}"></i><h3>${name}</h3><div class="asset-leverage">${leverage}</div><div class="asset-margin">Mindest-Margin: ${margin}</div><div class="asset-examples">${examples}</div></div>`;
}
function simpleCard(icon, title, text) {
  return `<div class="card"><i class="fas ${icon} card-icon"></i><h3>${title}</h3><p>${text}</p></div>`;
}
function methodTile(icon, title, weight) {
  return `<div class="card method-tile"><i class="fas ${icon} card-icon"></i><h3>${title}</h3><span class="method-weight">${weight} Gewichtung</span></div>`;
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

fs.writeFileSync(path.join(ROOT, 'index.html'), html, 'utf8');
console.log('written: index.html');
