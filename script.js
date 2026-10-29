/* ==========================================================================
   CFD Hebel Guide 2026 — script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('nav.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* ---------- Live-Kurs-Widget (Startseite) ---------- */
  var widget = document.getElementById('live-rates-widget');
  if (widget) {
    initLiveRates(widget);
  }

  /* ---------- Margin-Rechner ---------- */
  var calc = document.getElementById('rechner');
  if (calc) {
    initCalculator();
  }
});

/* ==========================================================================
   Live-Kurs-Widget
   ========================================================================== */
var FALLBACK_RATES = [
  { symbol: 'EUR/USD', rate: '1,08420', changeVal: 0.12, spread: '0,6' },
  { symbol: 'GBP/USD', rate: '1,26980', changeVal: -0.08, spread: '0,8' },
  { symbol: 'USD/JPY', rate: '151.230', changeVal: 0.24, spread: '0,7' },
  { symbol: 'EUR/GBP', rate: '0,85390', changeVal: -0.05, spread: '1,0' }
];

function initLiveRates(widget) {
  fetchLiveCurrencies(widget);
  setInterval(function () { fetchLiveCurrencies(widget); }, 60000);
}

function fetchLiveCurrencies(widget) {
  fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY')
    .then(function (response) {
      if (!response.ok) throw new Error('API-Fehler');
      return response.json();
    })
    .then(function (data) {
      var r = data.rates || {};
      if (!r.EUR || !r.GBP || !r.JPY) throw new Error('Unvollständige Daten');
      var eurUsd = 1 / r.EUR;
      var gbpUsd = 1 / r.GBP;
      var usdJpy = r.JPY;
      var eurGbp = r.EUR / r.GBP;

      var prevRaw = window.__lastRates || {};
      var pairs = [
        { symbol: 'EUR/USD', rate: eurUsd.toFixed(5), prev: prevRaw.eurUsd, spread: '0,6' },
        { symbol: 'GBP/USD', rate: gbpUsd.toFixed(5), prev: prevRaw.gbpUsd, spread: '0,8' },
        { symbol: 'USD/JPY', rate: usdJpy.toFixed(3), prev: prevRaw.usdJpy, spread: '0,7' },
        { symbol: 'EUR/GBP', rate: eurGbp.toFixed(5), prev: prevRaw.eurGbp, spread: '1,0' }
      ];
      window.__lastRates = { eurUsd: eurUsd, gbpUsd: gbpUsd, usdJpy: usdJpy, eurGbp: eurGbp };

      renderRates(widget, pairs, true);
      updateMarginCalculatorRates({ 'EUR/USD': eurUsd, 'USD/JPY': usdJpy });
    })
    .catch(function () {
      renderRates(widget, FALLBACK_RATES, false);
    });
}

function renderRates(widget, pairs, isLive) {
  var rowsHtml = pairs.map(function (p) {
    var changeHtml = '';
    if (typeof p.changeVal === 'number') {
      var up = p.changeVal >= 0;
      changeHtml = '<div class="rate-change ' + (up ? 'up' : 'down') + '">' +
        (up ? '▲ +' : '▼ ') + Math.abs(p.changeVal).toFixed(2) + ' %</div>';
    } else if (p.prev) {
      var cur = parseFloat(p.rate);
      var diff = cur - p.prev;
      var pct = (diff / p.prev) * 100;
      var up2 = diff >= 0;
      changeHtml = '<div class="rate-change ' + (up2 ? 'up' : 'down') + '">' +
        (up2 ? '▲ +' : '▼ ') + Math.abs(pct).toFixed(2) + ' %</div>';
    } else {
      changeHtml = '<div class="rate-change" style="color:rgba(255,255,255,0.4)">—</div>';
    }
    return '<div class="rate-row">' +
      '<div class="rate-pair"><span class="live-dot" style="' + (isLive ? '' : 'animation:none;background:#9CA3AF;') + '"></span>' + p.symbol + '</div>' +
      '<div class="rate-value"><div class="rate-price">' + p.rate + '</div>' + changeHtml +
      '<div class="rate-spread">Spread ab ' + p.spread + ' Pip</div></div>' +
      '</div>';
  }).join('');

  var titleEl = widget.querySelector('.live-widget-title');
  var rowsContainer = widget.querySelector('.rate-rows');
  var footnote = widget.querySelector('.live-widget-footnote');
  if (rowsContainer) rowsContainer.innerHTML = rowsHtml;
  if (footnote) {
    footnote.textContent = isLive
      ? 'Kurse von frankfurter.app · 60s Refresh · Kein Handelssignal'
      : 'Kurse offline · statische Referenzwerte · Kein Handelssignal';
  }
  if (titleEl) {
    var label = titleEl.querySelector('.live-status-label');
    if (label) label.textContent = isLive ? 'Live-Kurse 2026' : 'Live-Kurse 2026 (offline)';
  }
}

function updateMarginCalculatorRates(rateMap) {
  var priceInput = document.getElementById('calc-price');
  var instrumentSelect = document.getElementById('calc-instrument');
  if (!priceInput || !instrumentSelect || priceInput.dataset.userEdited === 'true') return;
  var current = instrumentSelect.value;
  if (current === 'EUR/USD' && rateMap['EUR/USD']) {
    priceInput.value = rateMap['EUR/USD'].toFixed(4);
    calculateMargin();
  }
}

/* ==========================================================================
   Margin-Rechner
   ========================================================================== */
var INSTRUMENTS = {
  'EUR/USD':          { leverage: 30, contractSize: 100000, unit: 'EUR', defaultPrice: 1.0840, label: 'EUR/USD (Forex Major)' },
  'Gold (XAU/USD)':   { leverage: 20, contractSize: 100,    unit: 'USD', defaultPrice: 2380,   label: 'Gold XAU/USD' },
  'WTI-Öl':           { leverage: 10, contractSize: 1000,   unit: 'USD', defaultPrice: 78,     label: 'WTI-Rohöl' },
  'Aktien-CFD':       { leverage: 5,  contractSize: 1,      unit: 'EUR', defaultPrice: 180,    label: 'Aktien-CFD (Einzelaktie)' },
  'Bitcoin-CFD':      { leverage: 2,  contractSize: 1,      unit: 'EUR', defaultPrice: 58000,  label: 'Bitcoin-CFD' }
};

function initCalculator() {
  var instrumentSelect = document.getElementById('calc-instrument');
  var priceInput = document.getElementById('calc-price');
  var leverageInput = document.getElementById('calc-leverage');

  instrumentSelect.addEventListener('change', function () {
    var inst = INSTRUMENTS[instrumentSelect.value];
    leverageInput.value = inst.leverage;
    priceInput.value = inst.defaultPrice;
    priceInput.dataset.userEdited = 'false';
    calculateMargin();
  });

  priceInput.addEventListener('input', function () { priceInput.dataset.userEdited = 'true'; });

  document.querySelectorAll('#rechner input, #rechner select').forEach(function (el) {
    el.addEventListener('input', calculateMargin);
    el.addEventListener('change', calculateMargin);
  });

  calculateMargin();
}

function calculateMargin() {
  var instrumentSelect = document.getElementById('calc-instrument');
  var lotsInput = document.getElementById('calc-lots');
  var priceInput = document.getElementById('calc-price');
  var leverageInput = document.getElementById('calc-leverage');
  if (!instrumentSelect) return;

  var instrumentKey = instrumentSelect.value;
  var instrument = INSTRUMENTS[instrumentKey];
  var lots = parseFloat(lotsInput.value) || 0;
  var price = parseFloat(priceInput.value) || 0;
  var leverage = parseInt(leverageInput.value, 10) || instrument.leverage;
  if (leverage < 1) leverage = 1;

  var positionValue = lots * instrument.contractSize * price;
  var margin = leverage > 0 ? positionValue / leverage : 0;
  var marginPct = leverage > 0 ? (1 / leverage) * 100 : 0;
  var pnl1pct = positionValue * 0.01;
  var stopOutLevel = margin * 0.5;
  var totalLossAt = positionValue > 0 ? (margin / positionValue) * 100 : 0;

  setText('result-position', formatCurrency(positionValue, instrument.unit));
  setText('result-margin', formatCurrency(margin, instrument.unit));
  setText('result-margin-pct', marginPct.toFixed(2).replace('.', ',') + ' %');
  setText('result-pnl-pos', '+' + formatCurrency(pnl1pct, instrument.unit));
  setText('result-pnl-neg', '−' + formatCurrency(pnl1pct, instrument.unit));
  setText('result-stopout', formatCurrency(stopOutLevel, instrument.unit));
  setText('result-totaloss', totalLossAt.toFixed(2).replace('.', ',') + ' %');
}

function setText(id, value) {
  var el = document.getElementById(id);
  if (el) el.textContent = value;
}

function formatCurrency(value, unit) {
  var currency = unit === 'USD' ? 'USD' : 'EUR';
  try {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: currency, maximumFractionDigits: 2 }).format(value);
  } catch (e) {
    return value.toFixed(2) + ' ' + currency;
  }
}
