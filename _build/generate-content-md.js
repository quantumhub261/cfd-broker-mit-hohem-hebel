const fs = require('fs');
const path = require('path');
const { PAGES } = require('./generate-pages');

const ROOT = path.join(__dirname, '..');
const DOMAIN = 'https://cfd-hebel-guide.de';

function stripHtml(html) {
  let out = html;
  out = out.replace(/<div class="table-responsive">/g, '');
  // Convert tables
  out = out.replace(/<table class="data-table">([\s\S]*?)<\/table>/g, (m, inner) => tableToMarkdown(inner));
  out = out.replace(/<\/div>\s*$/gm, '');
  out = out.replace(/<h2[^>]*>(.*?)<\/h2>/g, '\n## $1\n');
  out = out.replace(/<h3[^>]*>(.*?)<\/h3>/g, '\n### $1\n');
  out = out.replace(/<ol class="step-list">([\s\S]*?)<\/ol>/g, (m, inner) => {
    const items = [...inner.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((mm, i) => `${i + 1}. ${cleanInline(mm[1])}`);
    return '\n' + items.join('\n') + '\n';
  });
  out = out.replace(/<ul>([\s\S]*?)<\/ul>/g, (m, inner) => {
    const items = [...inner.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(mm => `- ${cleanInline(mm[1])}`);
    return '\n' + items.join('\n') + '\n';
  });
  out = out.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (m, inner) => '\n' + cleanInline(inner) + '\n');
  out = out.replace(/<[^>]+>/g, '');
  out = out.replace(/[ \t]+\n/g, '\n');
  out = out.replace(/\n{3,}/g, '\n\n');
  return out.trim();
}

function tableToMarkdown(inner) {
  const headers = [...inner.matchAll(/<th>(.*?)<\/th>/g)].map(m => cleanInline(m[1]));
  const rows = [...inner.matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
    .map(r => [...r[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(c => cleanInline(c[1])))
    .filter(r => r.length);
  let md = '\n| ' + headers.join(' | ') + ' |\n';
  md += '|' + headers.map(() => '---').join('|') + '|\n';
  rows.forEach(r => { md += '| ' + r.join(' | ') + ' |\n'; });
  return md + '\n';
}

function cleanInline(s) {
  return s
    .replace(/<a [^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, '$2 ($1)')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<i [^>]*><\/i>\s*/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .trim();
}

let md = `# CFD Broker mit hohem Hebel — Vollständiger Seiteninhalt (Markdown)

Quelle: ${DOMAIN} | Sprache: Deutsch (DE) | Stand: August 2026

---

## Startseite: CFD Broker mit hohem Hebel — Vergleich, Regulierung und Risiken im Überblick

URL: ${DOMAIN}/index.html

**Risikohinweis:** Der Handel mit Differenzkontrakten (CFDs) und anderen Hebelprodukten ist mit einem erheblichen Verlustrisiko verbunden. Es besteht das Risiko, das eingesetzte Kapital vollständig zu verlieren. Zwischen 74 und 89 % der Retail-CFD-Konten verlieren Geld (laut ESMA-Pflichtangaben). Dieser Artikel dient ausschließlich zu Informationszwecken und stellt keine Anlageberatung dar.

CFD Broker mit hohem Hebel unterliegen in der EU strikten ESMA-Vorgaben: maximal 1:30 für Hauptwährungspaare, verpflichtender Negativsaldoschutz und segregierte Kundengelder. Ein Demokonto ist der empfohlene Einstieg, um Margin-Anforderungen und Plattform ohne echtes Kapitalrisiko kennenzulernen.

### ESMA-Hebellimits nach Asset-Klasse

| Asset-Klasse | Max. Hebel Retail | Mindest-Margin |
|---|---|---|
| Hauptwährungspaare (EUR/USD, GBP/USD) | 1:30 | 3,33 % |
| Neben-FX, Gold (XAU/USD), Hauptindizes (DAX, S&P 500) | 1:20 | 5 % |
| Sonstige Rohstoffe, Neben-Indizes | 1:10 | 10 % |
| Aktien-CFDs (Einzelaktien) | 1:5 | 20 % |
| Kryptowährungs-CFDs (Bitcoin, Ethereum) | 1:2 | 50 % |

### Regulierungsbehörden im Vergleich

| Behörde | Land | ESMA-Limits | Negativsaldoschutz | Einlagensicherung | Passporting |
|---|---|---|---|---|---|
| BaFin | Deutschland | Ja (§4b WpHG) | Pflicht | Bis 100.000 EUR (EdW) | Nicht erforderlich |
| CySEC | Zypern | Ja (MiFID II) | Pflicht | Bis 20.000 EUR (ICF) | Ja (EU-weit) |
| FCA | UK (post-Brexit) | Eigene Limits | Pflicht | Bis 85.000 GBP (FSCS) | Kein EU-Passporting |
| ASIC | Australien | Seit März 2021 | Pflicht (Retail) | Kein EU-Äquivalent | Nicht erforderlich |
| FSA (Seychellen) | Offshore | Nein | Nein | Nicht garantiert | Nein |

### EU-reguliert vs. Offshore vs. Professional Client

| Kriterium | EU Retail | EU Professional | Offshore Retail |
|---|---|---|---|
| Max. Hebel Forex | 1:30 | 1:100–1:500 | 1:500–1:3000 |
| Negativsaldoschutz | Pflicht | Entfällt | Nicht vorhanden |
| Einlagensicherung | Bis 100.000 EUR | Kann entfallen | Nicht garantiert |
| Nachschusspflicht | Verboten | Möglich | Möglich |
| Bonus-Verbot | Ja | Entfällt | Kein Verbot |
| Regulierungsbehörde | BaFin, CySEC, FCA | BaFin, CySEC, FCA | FSA, FSC, VFSC |
| Rechtsschutz (DE) | Vollständig | Vollständig | Eingeschränkt |

### Margin-Rechenbeispiel: EUR/USD Long, Hebel 1:30

1 Standard-Lot = 30.000 EUR Positionswert, Hebel 1:30 → Margin = 30.000 / 30 = 1.000 EUR. Bei +1 % Kursbewegung: +300 EUR Gewinn. Bei −1 % Kursbewegung: −300 EUR Verlust.

Risiko-Szenario: Trader investiert 1.000 EUR Margin → Position 30.000 EUR (Hebel 1:30). Markt bewegt sich −2 % gegen die Position: Verlust 600 EUR (60 % der Margin), freie Margin 400 EUR, Margin-Level ≈ 67 % → Margin Call. Bei weiterer Bewegung auf −3,33 %: Verlust 1.000 EUR (100 % der Margin) → Stop-Out, automatische Schließung. Negativsaldoschutz (EU Retail): kein negativer Saldo.

### Kosten & Gebühren (Richtwerte)

| Kostenart | Standard-Konto | Raw Spread / ECN | Islamisches Konto |
|---|---|---|---|
| Spread EUR/USD | Ab 1,0 Pip (inkl. Gebühr) | Ab 0,0 Pip + Kommission | Wie Standard |
| Kommission | Keine separate | Ab 3–5 USD/Lot | Keine / brokerabhängig |
| Swap (Overnight) | Brokerabhängig | Brokerabhängig | Keine (Swap-Free) |

### Daten & Belege

74 % der Retail-CFD-Konten verlieren Geld (Durchschnittswert; individuelle Broker: 68–89 %, ESMA-Pflichtangaben). ESMA-Produktinterventionsmaßnahmen: August 2018. Negativsaldoschutz eingeführt 2018, dauerhaft seit 2019. §20 EStG Verlustverrechnungsbeschränkung: aufgehoben durch JStG 2024 (6.12.2024). Sparerpauschbetrag: 1.000 EUR p.a. (2.000 EUR bei Zusammenveranlagung).

### Risikohinweis

Der Handel mit Differenzkontrakten (CFDs) und anderen Hebelprodukten ist mit einem erheblichen Verlustrisiko verbunden und ist nicht für alle Anleger geeignet.
- Es besteht das Risiko, das gesamte eingesetzte Kapital zu verlieren
- Der Hebel wirkt symmetrisch: Er amplifiziert Gewinne und Verluste gleichermaßen
- Laut ESMA-Pflichtangaben verlieren zwischen 74 und 89 % der Retail-CFD-Konten Geld
- Leverage Risk: Bei Hebel 1:30 führt eine 3,33-%-Kursbewegung zum Totalverlust der Margin
- Market Risk: CFD-Kurse können sich schnell und unvorhersehbar bewegen
- Jurisdiktionale Einschränkungen: ESMA-Limits gelten nur für EU-regulierte Broker

Dieser Artikel dient ausschließlich zu Informationszwecken und stellt keine Anlageberatung, Steuerberatung oder Aufforderung zum Handel dar.

### FAQ (Startseite)

**Welchen maximalen Hebel darf ein EU-regulierter CFD Broker Privatanlegern anbieten?**
EU-regulierte CFD Broker dürfen Retail Clients nach ESMA-Vorgaben maximal 1:30 für Hauptwährungspaare, 1:20 für Aktienindizes und Gold, 1:10 für Rohstoffe, 1:5 für Aktien-CFDs und 1:2 für Kryptowährungs-CFDs anbieten.

**Was ist der Unterschied zwischen einem EU-regulierten und einem Offshore-CFD-Broker?**
EU-regulierte Broker unterliegen ESMA-Hebellimits und bieten Retail Clients Negativsaldoschutz sowie EU-Einlagensicherung. Offshore-Broker bieten höhere Hebel (bis 1:1000 oder mehr), jedoch ohne diese Schutzstandards.

**Kann ich als Privatanleger bei einem EU-regulierten Broker mehr als meine Einzahlung verlieren?**
Nein. EU-regulierte Broker sind für Retail Clients gesetzlich verpflichtet, Negativsaldoschutz zu gewähren.

**Wie beantrage ich den professionellen Trader Status für höheren Hebel?**
Zwei von drei MiFID-II-Kriterien (Anhang II) müssen erfüllt sein: 10 Trades pro Quartal, Portfolio über 500.000 EUR oder ein Jahr Berufserfahrung im Finanzsektor.

**Was ist die Margin-Formel beim CFD-Handel?**
Margin = Positionswert / Hebel. Beispiel: EUR/USD, 1 Lot (110.000 EUR Positionswert), Hebel 1:30 → Margin: 3.667 EUR.

**Was passiert beim Stop-Out-Level?**
Der Stop-Out ist die Schwelle, bei der der Broker offene Positionen automatisch schließt — mindestens 50 % des Margin-Bedarfs (BaFin-Allgemeinverfügung).

**Ist es legal, als Deutscher bei einem Offshore-Broker zu handeln?**
Ja, es ist nicht verboten. Jedoch entfallen EU-Schutzstandards. Steuerliche Pflichten bleiben vollständig bestehen.

**Wie werden CFD-Gewinne in Deutschland besteuert?**
Abgeltungssteuer 25 % zzgl. Solidaritätszuschlag (effektiv ca. 26,375 %). Sparerpauschbetrag 1.000 EUR p.a. Die 20.000-EUR-Verlustverrechnungsgrenze wurde durch das JStG 2024 aufgehoben.

**Was ist der Unterschied zwischen Margin Call und Stop-Out?**
Margin Call ist eine Warnung; Stop-Out ist die automatische Positionsschließung ohne Aufforderung.

**Kann ich einen CFD Broker mit hohem Hebel risikofrei testen?**
Ja. Ein Demokonto ermöglicht das Testen mit virtuellem Kapital ohne echtes Verlustrisiko.

**CTA:** Jetzt mit Demokonto starten — ohne Einzahlung → https://libertex.com/de/

---
`;

PAGES.forEach(p => {
  md += `\n## ${p.h1}\n\nURL: ${DOMAIN}/${p.slug}.html | Letzte Aktualisierung: August 2026\n\n**Risikohinweis:** ${p.riskText}\n\n${stripHtml(p.body)}\n\n### FAQ\n\n`;
  p.faqs.forEach(f => {
    md += `**${f.q}**\n${cleanInline(f.a)}\n\n`;
  });
  md += `**CTA:** ${p.ctaText} → https://libertex.com/de/\n\n---\n`;
});

fs.writeFileSync(path.join(ROOT, 'content.md'), md, 'utf8');
console.log('written: content.md, length:', md.length);
