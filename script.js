/* ===========================
   MIRCH MASALA — script.js
   =========================== */

// ─── Register GSAP Plugins ───────────────────────────
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ─── LOADER ──────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');

  gsap.to(loader, {
    opacity: 0,
    duration: 0.6,
    delay: 2.4,
    ease: 'power2.inOut',
    onComplete: () => {
      loader.style.display = 'none';
      initHero();
    }
  });
});

// ─── CURSOR GLOW ─────────────────────────────────────
const cursorGlow = document.getElementById('cursor-glow');
const cursorDot = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  gsap.to(cursorGlow, {
    x: mouseX,
    y: mouseY,
    duration: 0.6,
    ease: 'power2.out'
  });

  gsap.to(cursorDot, {
    x: mouseX,
    y: mouseY,
    duration: 0.12,
    ease: 'power3.out'
  });
});

// Hover states
document.querySelectorAll('a, button, input, .feature-card, .step-card, .mode-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// ─── NAVBAR SCROLL ───────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ─── HAMBURGER MENU ──────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const spans = hamburger.querySelectorAll('span');
  if (menuOpen) {
    gsap.to(spans[0], { rotate: 45, y: 7, duration: 0.3 });
    gsap.to(spans[1], { opacity: 0, duration: 0.3 });
    gsap.to(spans[2], { rotate: -45, y: -7, duration: 0.3 });
  } else {
    gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
    gsap.to(spans[1], { opacity: 1, duration: 0.3 });
    gsap.to(spans[2], { rotate: 0, y: 0, duration: 0.3 });
  }
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
  });
});

// ─── PARTICLE CANVAS ─────────────────────────────────
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 20;
    this.size = Math.random() * 3 + 0.5;
    this.speedY = -(Math.random() * 0.6 + 0.2);
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.6 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 300 + 200;

    // Color: mix of red/saffron/gold
    const colors = [
      [232, 39, 42],
      [255, 107, 0],
      [255, 186, 0],
      [255, 220, 80]
    ];
    const c = colors[Math.floor(Math.random() * colors.length)];
    this.r = c[0]; this.g = c[1]; this.b = c[2];

    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.02 + 0.005;
    this.wobbleAmp = Math.random() * 0.8 + 0.2;
  }

  update() {
    this.life++;
    this.wobble += this.wobbleSpeed;
    this.x += this.speedX + Math.sin(this.wobble) * this.wobbleAmp;
    this.y += this.speedY;

    const progress = this.life / this.maxLife;
    if (progress < 0.1) {
      this.opacity = (progress / 0.1) * 0.5;
    } else if (progress > 0.7) {
      this.opacity = ((1 - progress) / 0.3) * 0.5;
    } else {
      this.opacity = 0.4 + Math.sin(this.life * 0.05) * 0.1;
    }

    if (this.life >= this.maxLife || this.y < -20) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;

    // Glow
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
    gradient.addColorStop(0, `rgba(${this.r},${this.g},${this.b},0.8)`);
    gradient.addColorStop(1, `rgba(${this.r},${this.g},${this.b},0)`);

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${this.r},${this.g},${this.b})`;
    ctx.fill();

    ctx.restore();
  }
}

// Init particles
for (let i = 0; i < 80; i++) {
  const p = new Particle();
  p.y = Math.random() * canvas.height; // Spread initial y
  p.life = Math.floor(Math.random() * p.maxLife);
  particles.push(p);
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animateParticles);
}

animateParticles();

// ─── HERO INIT ANIMATION ─────────────────────────────
function initHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-badge', { opacity: 0, y: 20, duration: 0.7 })
    .from('.hero-line', {
      opacity: 0,
      y: 60,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power4.out'
    }, '-=0.3')
    .from('.hero-chili', { opacity: 0, scale: 0.3, rotation: -30, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.3')
    .from('.hero-sub', { opacity: 0, y: 24, duration: 0.7 }, '-=0.4')
    .from('.hero-input-wrap', { opacity: 0, y: 30, duration: 0.7 }, '-=0.4')
    .from('.stat', { opacity: 0, y: 20, duration: 0.6, stagger: 0.12 }, '-=0.3')
    .from('.hero-scroll-hint', { opacity: 0, y: 10, duration: 0.5 }, '-=0.2');

  // Counter animation
  setTimeout(() => {
    animateCounters();
  }, 1500);
}

// ─── COUNTER ANIMATION ───────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const isDecimal = target % 1 !== 0;

    gsap.to({ val: 0 }, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: function () {
        const v = this.targets()[0].val;
        el.textContent = isDecimal ? v.toFixed(1) : Math.floor(v);
      }
    });
  });
}

// ─── SCROLL ANIMATIONS: HOW IT WORKS ─────────────────
ScrollTrigger.batch('.step-card', {
  onEnter: (els) => {
    gsap.to(els, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });
    els.forEach(el => el.classList.add('visible'));
  },
  start: 'top 85%',
  once: true
});

// Section titles
document.querySelectorAll('.section-title').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      el.classList.add('visible');
    }
  });
});

// Section labels fade
gsap.utils.toArray('.section-label').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    opacity: 0,
    x: -20,
    duration: 0.7,
    ease: 'power3.out'
  });
});

gsap.utils.toArray('.section-sub').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    opacity: 0,
    y: 20,
    duration: 0.7,
    ease: 'power3.out',
    delay: 0.2
  });
});

// ─── DEMO SECTION ANIMATIONS ─────────────────────────
ScrollTrigger.create({
  trigger: '#demo',
  start: 'top 70%',
  once: true,
  onEnter: () => {
    // Animate bars
    document.querySelectorAll('.bar-fill').forEach(bar => {
      const width = bar.dataset.width;
      gsap.to(bar, { width: width + '%', duration: 1.2, ease: 'power3.out', delay: 0.3 });
    });

    // Animate ring
    const ringEl = document.getElementById('scoreRing');
    const numEl = document.getElementById('truthNumber');
    const targetScore = 82;
    const circumference = 314;
    const offset = circumference - (targetScore / 100) * circumference;

    // Insert gradient
    const svgEl = ringEl.closest('svg');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.id = 'ringGradient';
    gradient.setAttribute('x1', '0%'); gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%'); gradient.setAttribute('y2', '0%');
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%'); stop1.setAttribute('stop-color', '#E8272A');
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%'); stop2.setAttribute('stop-color', '#FF9A3C');
    gradient.appendChild(stop1); gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svgEl.prepend(defs);

    gsap.to(ringEl, {
      strokeDashoffset: offset,
      duration: 1.5,
      ease: 'power3.out',
      delay: 0.2,
      onStart: () => {
        gsap.to({ val: 0 }, {
          val: targetScore,
          duration: 1.5,
          ease: 'power3.out',
          onUpdate: function () {
            numEl.textContent = Math.floor(this.targets()[0].val);
          }
        });
      }
    });

    // Animate cards
    gsap.from('.demo-url-card', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' });
    gsap.from('.result-card', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', delay: 0.2 });

    // Animate tags
    gsap.from('.rtag', {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      stagger: 0.1,
      ease: 'back.out(1.5)',
      delay: 0.8
    });
  }
});

// ─── EDGE CASE SECTION ───────────────────────────────
const modeAI = document.getElementById('modeAI');
const modeUser = document.getElementById('modeUser');
const cardAI = document.getElementById('cardAI');
const cardUser = document.getElementById('cardUser');

function switchMode(mode) {
  if (mode === 'ai') {
    modeAI.classList.add('active');
    modeUser.classList.remove('active');
    cardAI.classList.add('active');
    cardUser.classList.remove('active');
  } else {
    modeUser.classList.add('active');
    modeAI.classList.remove('active');
    cardUser.classList.add('active');
    cardAI.classList.remove('active');

    // Animate vote bars on switch
    setTimeout(() => {
      const realBar = document.querySelector('.real-vote');
      const fakeBar = document.querySelector('.fake-vote');
      if (realBar) gsap.to(realBar, { width: '72%', duration: 1, ease: 'power3.out' });
      if (fakeBar) gsap.to(fakeBar, { width: '28%', duration: 1, ease: 'power3.out' });
    }, 100);
  }
}

modeAI.addEventListener('click', () => switchMode('ai'));
modeUser.addEventListener('click', () => switchMode('user'));

// Init edge section
ScrollTrigger.create({
  trigger: '#edge-case',
  start: 'top 70%',
  once: true,
  onEnter: () => {
    gsap.from('.edge-description > *', {
      opacity: 0,
      x: -30,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out'
    });
    gsap.from('.edge-display', {
      opacity: 0,
      x: 30,
      duration: 0.7,
      ease: 'power3.out',
      delay: 0.3
    });
  }
});

// ─── FEATURES SECTION ────────────────────────────────
ScrollTrigger.batch('.feature-card', {
  onEnter: (els) => {
    gsap.to(els, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out'
    });
    els.forEach(el => el.classList.add('visible'));
  },
  start: 'top 88%',
  once: true
});

// ─── DETECT BUTTON INTERACTION ───────────────────────
const detectBtn = document.getElementById('detectBtn');
const newsInput = document.getElementById('newsInput');
const analysisPulse = document.getElementById('analysisPulse');

const demoProtocol = document.getElementById('demoProtocol');
const demoDomain = document.getElementById('demoDomain');
const demoPath = document.getElementById('demoPath');
const metaPrimary = document.getElementById('metaPrimary');
const metaSecondary = document.getElementById('metaSecondary');
const metaTertiary = document.getElementById('metaTertiary');
const resultBadgeText = document.getElementById('resultBadgeText');
const resultTime = document.getElementById('resultTime');
const scanStory = document.getElementById('scanStory');
const evidenceList = document.getElementById('evidenceList');

const trustworthyDomains = [
  'reuters.com', 'apnews.com', 'bbc.com', 'bbc.co.uk', 'nytimes.com',
  'theguardian.com', 'wsj.com', 'npr.org', 'aljazeera.com', 'indianexpress.com',
  'thehindu.com', 'livemint.com', 'economictimes.indiatimes.com', 'ptinews.com'
];

const suspiciousTlds = ['.xyz', '.top', '.buzz', '.gq', '.tk', '.click', '.work'];
const sensationalWords = ['shocking', 'exposed', 'viral', 'unbelievable', 'secret', 'must-see', 'breaks internet'];

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function isValidHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeDomain(hostname) {
  return hostname.replace(/^www\./i, '').toLowerCase();
}

function tokenizeFromUrl(urlObj) {
  const raw = decodeURIComponent((urlObj.pathname || '').replace(/[\/_-]+/g, ' ')).toLowerCase();
  return raw
    .split(/\s+/)
    .map(t => t.replace(/[^a-z0-9]/g, ''))
    .filter(t => t.length > 3)
    .slice(0, 8);
}

function extractHeadlineHint(urlObj) {
  const tokens = tokenizeFromUrl(urlObj);
  if (!tokens.length) return normalizeDomain(urlObj.hostname);
  return tokens.join(' ');
}

function setProgressMessage(text) {
  if (analysisPulse) analysisPulse.textContent = text;
}

function setStory(text) {
  if (scanStory) scanStory.textContent = text;
}

function clearEvidence() {
  if (!evidenceList) return;
  evidenceList.innerHTML = '';
}

function addEvidenceItem(icon, text, href) {
  if (!evidenceList) return;
  const item = document.createElement('div');
  item.className = 'evidence-item';

  const iconEl = document.createElement('span');
  iconEl.className = 'evidence-icon';
  iconEl.textContent = icon;

  const textEl = document.createElement('div');
  if (href) {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = text;
    textEl.appendChild(a);
  } else {
    textEl.textContent = text;
  }

  item.appendChild(iconEl);
  item.appendChild(textEl);
  evidenceList.appendChild(item);
}

async function fetchGoogleNewsMentions(query) {
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}`;
  const proxied = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
  const response = await fetch(proxied);
  if (!response.ok) throw new Error('Google News fetch failed');

  const xmlText = await response.text();
  const xml = new DOMParser().parseFromString(xmlText, 'text/xml');
  const items = Array.from(xml.querySelectorAll('item')).slice(0, 10);

  return items.map(item => ({
    title: item.querySelector('title')?.textContent?.trim() || 'Untitled mention',
    link: item.querySelector('link')?.textContent?.trim() || '#',
    source: item.querySelector('source')?.textContent?.trim() || 'Unknown source',
    pubDate: item.querySelector('pubDate')?.textContent?.trim() || ''
  }));
}

async function fetchGdeltMentions(query) {
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=10&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('GDELT fetch failed');

  const data = await response.json();
  const articles = Array.isArray(data.articles) ? data.articles : [];

  return articles.slice(0, 10).map(item => ({
    title: (item.title || 'Untitled mention').trim(),
    link: item.url || '#',
    source: (item.domain || 'Unknown source').trim(),
    pubDate: item.seendate || ''
  }));
}

function computeHeuristicSignals(urlObj) {
  const domain = normalizeDomain(urlObj.hostname);
  const fullPath = `${urlObj.pathname}${urlObj.search}`.toLowerCase();

  let sourceCredibility = 50;
  let riskFlags = [];

  if (urlObj.protocol === 'https:') sourceCredibility += 6;
  if (trustworthyDomains.some(d => domain.endsWith(d))) sourceCredibility += 30;

  if (suspiciousTlds.some(tld => domain.endsWith(tld))) {
    sourceCredibility -= 24;
    riskFlags.push('Suspicious domain extension detected');
  }

  const domainNoise = (domain.match(/[0-9-]/g) || []).length;
  if (domainNoise >= 4) {
    sourceCredibility -= 10;
    riskFlags.push('Domain pattern resembles clickbait network');
  }

  const matchedSensational = sensationalWords.filter(w => fullPath.includes(w));
  if (matchedSensational.length) {
    sourceCredibility -= 6 * matchedSensational.length;
    riskFlags.push(`Sensational language found: ${matchedSensational.join(', ')}`);
  }

  return {
    sourceCredibility: clamp(Math.round(sourceCredibility), 8, 98),
    riskFlags
  };
}

function computeFinalAssessment(signals, mentions) {
  const totalMentions = mentions.length;
  const mentionDomains = mentions
    .map(m => {
      try {
        return normalizeDomain(new URL(m.link).hostname);
      } catch {
        return normalizeDomain((m.source || '').replace(/^https?:\/\//, '').split('/')[0]);
      }
    })
    .filter(Boolean);

  const uniqueDomains = new Set(mentionDomains);
  const trustedMentions = mentionDomains.filter(d => trustworthyDomains.some(td => d.endsWith(td))).length;

  let corroboration = 20;
  if (totalMentions >= 10) corroboration += 45;
  else if (totalMentions >= 6) corroboration += 32;
  else if (totalMentions >= 3) corroboration += 18;
  else corroboration -= 8;

  if (uniqueDomains.size >= 6) corroboration += 16;
  else if (uniqueDomains.size >= 3) corroboration += 8;

  corroboration += trustedMentions * 2;
  corroboration = clamp(Math.round(corroboration), 6, 98);

  const integrity = clamp(Math.round(100 - (signals.riskFlags.length * 12) + (trustedMentions * 3)), 12, 96);
  const finalScore = clamp(Math.round((signals.sourceCredibility * 0.38) + (corroboration * 0.44) + (integrity * 0.18)), 1, 99);

  let verdict = 'Unverified';
  let verdictText = '⚠️ Partially Verified';
  let verdictClass = 'partial';
  let label = 'Mixed';

  if (finalScore >= 74) {
    verdict = 'Likely True';
    verdictText = '✅ Likely True';
    verdictClass = 'partial';
    label = 'Trust';
  } else if (finalScore <= 44) {
    verdict = 'Likely False';
    verdictText = '🚨 Likely False';
    verdictClass = 'partial';
    label = 'Risk';
  }

  return {
    finalScore,
    corroboration,
    integrity,
    verdict,
    verdictText,
    verdictClass,
    label,
    totalMentions,
    uniqueDomains: uniqueDomains.size,
    trustedMentions
  };
}

function applyScoreBars(sourceCredibility, corroboration, integrity, socialRisk) {
  const fills = document.querySelectorAll('.detail-bar-item .bar-fill');
  const values = document.querySelectorAll('.detail-bar-item .bar-value');
  const metrics = [sourceCredibility, corroboration, integrity, socialRisk];

  metrics.forEach((metric, idx) => {
    if (values[idx]) values[idx].textContent = `${metric}%`;
    if (fills[idx]) {
      fills[idx].dataset.width = String(metric);
      gsap.to(fills[idx], { width: `${metric}%`, duration: 0.9, ease: 'power2.out' });
    }
  });
}

function setScoreRing(score) {
  const ringEl = document.getElementById('scoreRing');
  const numEl = document.getElementById('truthNumber');
  const circumference = 314;
  const offset = circumference - (score / 100) * circumference;

  gsap.to(ringEl, {
    strokeDashoffset: offset,
    duration: 1,
    ease: 'power2.out'
  });

  gsap.to({ val: Number(numEl.textContent) || 0 }, {
    val: score,
    duration: 1,
    ease: 'power2.out',
    onUpdate: function () {
      numEl.textContent = Math.round(this.targets()[0].val);
    }
  });
}

function updateTags(assessment) {
  const tags = document.querySelectorAll('.result-tags .rtag');
  if (tags.length < 4) return;

  tags[0].textContent = assessment.finalScore <= 44 ? '🚨 High Misinformation Risk' : '🛡 Source Risk Lowered';
  tags[1].textContent = assessment.verdict === 'Likely True' ? '✅ Broadly Corroborated' : '⚠️ Verification in Progress';
  tags[2].textContent = `🔍 ${assessment.uniqueDomains} Distinct Sources Checked`;
  tags[3].textContent = `📣 ${assessment.totalMentions} Live Mentions Found`;
}

let latestAnalysis = null;

function updatePrimaryBlocks(urlObj, assessment, elapsedMs) {
  const domain = normalizeDomain(urlObj.hostname);
  const path = urlObj.pathname || '/';

  demoProtocol.textContent = `${urlObj.protocol}//`;
  demoDomain.textContent = domain;
  demoPath.textContent = path.length > 38 ? `${path.slice(0, 38)}...` : path;

  metaPrimary.textContent = assessment.finalScore <= 44 ? '🔴 Elevated Risk Signal' : '🟢 Structure Looks Legit';
  metaSecondary.textContent = `🧭 ${assessment.uniqueDomains} independent domains`;
  metaTertiary.textContent = `🌐 ${assessment.totalMentions} web mentions`;

  resultBadgeText.textContent = assessment.verdict === 'Likely True'
    ? 'Signal Green: Story Holding Up'
    : assessment.verdict === 'Likely False'
      ? 'Heat Alert: Story Breaking Down'
      : 'Gray Zone: Keep Watching This Story';

  resultTime.textContent = `Processed in ${(elapsedMs / 1000).toFixed(1)}s`;

  const verdictEl = document.querySelector('.verdict-badge');
  if (verdictEl) verdictEl.textContent = assessment.verdictText;

  const truthLabel = document.querySelector('.truth-label');
  if (truthLabel) truthLabel.textContent = assessment.label;
}

async function runAnalysis(rawUrl) {
  const urlObj = new URL(rawUrl);
  const headlineHint = extractHeadlineHint(urlObj);
  const domain = normalizeDomain(urlObj.hostname);

  setProgressMessage('Scanning source footprint...');
  setStory('Tracking where this story appears across the web right now.');
  clearEvidence();

  const startedAt = performance.now();

  const [googleRes, gdeltRes] = await Promise.allSettled([
    fetchGoogleNewsMentions(`${headlineHint} ${domain}`),
    fetchGdeltMentions(`"${headlineHint}" OR ${domain}`)
  ]);

  setProgressMessage('Cross-checking corroboration and source quality...');

  const mentions = [];
  if (googleRes.status === 'fulfilled') mentions.push(...googleRes.value);
  if (gdeltRes.status === 'fulfilled') mentions.push(...gdeltRes.value);

  // De-duplicate by URL/title pair
  const seen = new Set();
  const deduped = mentions.filter(m => {
    const key = `${m.link}::${m.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 12);

  const heuristics = computeHeuristicSignals(urlObj);
  const assessment = computeFinalAssessment(heuristics, deduped);
  const elapsed = performance.now() - startedAt;

  const socialRisk = clamp(100 - assessment.corroboration + heuristics.riskFlags.length * 6, 8, 96);
  latestAnalysis = {
    inputUrl: rawUrl,
    domain,
    startedAt,
    elapsed,
    heuristics,
    assessment,
    mentions: deduped
  };

  updatePrimaryBlocks(urlObj, assessment, elapsed);
  setScoreRing(assessment.finalScore);
  applyScoreBars(heuristics.sourceCredibility, assessment.corroboration, assessment.integrity, socialRisk);
  updateTags(assessment);

  if (deduped.length) {
    addEvidenceItem('🧠', `Corroboration confidence built from ${deduped.length} indexed mentions.`);
    deduped.slice(0, 5).forEach(item => {
      addEvidenceItem('🔎', `${item.title} (${item.source})`, item.link);
    });
  } else {
    addEvidenceItem('⚠️', 'Live web corroboration was limited. Score relies more on URL and source-pattern heuristics.');
  }

  if (heuristics.riskFlags.length) {
    heuristics.riskFlags.slice(0, 3).forEach(flag => addEvidenceItem('🚩', flag));
  } else {
    addEvidenceItem('✅', 'No major URL-pattern red flags were detected for this source.');
  }

  if (googleRes.status === 'rejected' || gdeltRes.status === 'rejected') {
    addEvidenceItem('ℹ️', 'Some live sources were unavailable in-browser. For production-grade verification, add a backend news aggregator API.');
  }

  setStory(
    assessment.verdict === 'Likely True'
      ? 'Momentum check: this claim is being corroborated across multiple independent sources.'
      : assessment.verdict === 'Likely False'
        ? 'Red flag sweep: corroboration is weak and source signals suggest misinformation risk.'
        : 'Story in motion: mixed signals found, so treat this claim as unverified for now.'
  );

  setProgressMessage(
    assessment.verdict === 'Likely True'
      ? 'Verdict: likely true. Keep reading critically.'
      : assessment.verdict === 'Likely False'
        ? 'Verdict: likely false. Do not share without confirmation.'
        : 'Verdict: uncertain. Wait for stronger corroboration.'
  );

  document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
}

detectBtn.addEventListener('click', () => {
  const val = newsInput.value.trim();

  gsap.to(detectBtn, {
    keyframes: [
      { x: -5, rotation: -2, duration: 0.06 },
      { x: 5, rotation: 2, duration: 0.06 },
      { x: -4, rotation: -1, duration: 0.06 },
      { x: 4, rotation: 1, duration: 0.06 },
      { x: 0, rotation: 0, duration: 0.06 }
    ]
  });

  const ripple = detectBtn.querySelector('.btn-ripple');
  gsap.fromTo(ripple,
    { opacity: 0.6, scale: 0 },
    { opacity: 0, scale: 2, duration: 0.5, ease: 'power2.out' }
  );

  const btnText = detectBtn.querySelector('.btn-text');
  const original = btnText.textContent;

  if (!val) {
    setProgressMessage('Paste a valid news URL to begin the scan.');
    newsInput.focus();
    gsap.to(newsInput, {
      keyframes: [
        { x: -8, duration: 0.05 },
        { x: 8, duration: 0.05 },
        { x: -6, duration: 0.05 },
        { x: 6, duration: 0.05 },
        { x: 0, duration: 0.05 }
      ]
    });
    return;
  }

  if (!isValidHttpUrl(val)) {
    setProgressMessage('That does not look like a valid http/https URL.');
    newsInput.focus();
    return;
  }

  btnText.textContent = 'Scanning web...';
  detectBtn.disabled = true;
  gsap.to(detectBtn, { opacity: 0.7, duration: 0.2 });

  runAnalysis(val)
    .catch((error) => {
      console.error('Analysis failed:', error);
      setStory('Scan interrupted. Try another link or retry in a moment.');
      setProgressMessage('Could not complete this scan due to network/API limits.');
      clearEvidence();
      addEvidenceItem('⚠️', 'No live data could be fetched right now.');
      addEvidenceItem('🛠', 'Tip: connect this UI to a backend search API for stronger, stable verification.');
    })
    .finally(() => {
      btnText.textContent = original;
      detectBtn.disabled = false;
      gsap.to(detectBtn, { opacity: 1, duration: 0.2 });
    });
});

newsInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    detectBtn.click();
  }
});

// ─── INPUT FOCUS EFFECTS ─────────────────────────────
newsInput.addEventListener('focus', () => {
  gsap.to('.input-container', {
    boxShadow: '0 0 0 3px rgba(232,39,42,0.08), 0 0 20px rgba(232,39,42,0.4), 0 0 60px rgba(232,39,42,0.15)',
    duration: 0.3
  });
});

newsInput.addEventListener('blur', () => {
  gsap.to('.input-container', {
    boxShadow: 'none',
    duration: 0.3
  });
});

// ─── PARALLAX HERO ───────────────────────────────────
gsap.to('#particle-canvas', {
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  },
  y: 100,
  ease: 'none'
});

gsap.to('.hero-title', {
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  },
  y: 60,
  opacity: 0,
  ease: 'none'
});

// ─── CTA SECTION ─────────────────────────────────────
ScrollTrigger.create({
  trigger: '#cta-section',
  start: 'top 80%',
  once: true,
  onEnter: () => {
    gsap.from('.cta-box', {
      opacity: 0,
      y: 40,
      scale: 0.97,
      duration: 0.8,
      ease: 'power3.out'
    });
  }
});

// ─── FOOTER ANIMATION ────────────────────────────────
ScrollTrigger.create({
  trigger: '#footer',
  start: 'top 90%',
  once: true,
  onEnter: () => {
    gsap.from('.footer-brand, .footer-col', {
      opacity: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }
});

// ─── SMOOTH ANCHOR SCROLL ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      if (gsap.plugins.scrollTo) {
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 68 },
          duration: 1.2,
          ease: 'power3.inOut'
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ─── HOVER MICROINTERACTIONS ─────────────────────────
document.querySelectorAll('.step-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card.querySelector('.step-icon'), {
      y: -4,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card.querySelector('.step-icon'), {
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
});

document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { borderColor: 'rgba(232,39,42,0.25)', duration: 0.3 });
  });
  card.addEventListener('mouseleave', () => {
    if (!card.classList.contains('crowd-card')) {
      gsap.to(card, { borderColor: 'rgba(255,255,255,0.08)', duration: 0.3 });
    }
  });
});

// ─── ACTION BUTTONS ──────────────────────────────────
document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    gsap.to(btn, {
      keyframes: [
        { scale: 0.95, duration: 0.1 },
        { scale: 1.03, duration: 0.1 },
        { scale: 1, duration: 0.15 }
      ]
    });
  });
});

// ─── SPICE BUTTON HOVER ──────────────────────────────
document.querySelectorAll('.detect-btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const icon = btn.querySelector('.btn-icon');
    if (!icon) return;
    gsap.to(icon, {
      rotation: 15,
      scale: 1.3,
      duration: 0.3,
      ease: 'back.out(1.5)'
    });
  });
  btn.addEventListener('mouseleave', () => {
    const icon = btn.querySelector('.btn-icon');
    if (!icon) return;
    gsap.to(icon, {
      rotation: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
});

// ─── RESULT TAGS HOVER ───────────────────────────────
document.querySelectorAll('.rtag').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    gsap.to(tag, { scale: 1.06, y: -2, duration: 0.2, ease: 'power2.out' });
  });
  tag.addEventListener('mouseleave', () => {
    gsap.to(tag, { scale: 1, y: 0, duration: 0.2, ease: 'power2.out' });
  });
});

// ─── LOGO HOVER ──────────────────────────────────────
const logoIcon = document.querySelector('.logo-icon');
if (logoIcon) {
  document.querySelector('.nav-logo').addEventListener('mouseenter', () => {
    gsap.to(logoIcon, { rotation: 20, scale: 1.2, duration: 0.3, ease: 'back.out(1.5)' });
  });
  document.querySelector('.nav-logo').addEventListener('mouseleave', () => {
    gsap.to(logoIcon, { rotation: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
  });
}

// ─── MODE TOGGLE ANIMATION ───────────────────────────
[modeAI, modeUser].forEach(btn => {
  btn.addEventListener('click', () => {
    gsap.to(btn, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });
  });
});

// ─── GLOBAL INTERACTIVE UX LAYER ─────────────────────
const fullReportBtn = document.getElementById('fullReportBtn');
const shareWarningBtn = document.getElementById('shareWarningBtn');
const ctaEmail = document.getElementById('ctaEmail');
const ctaSubmitBtn = document.getElementById('ctaSubmitBtn');

function ensureOverlay() {
  let overlay = document.getElementById('uxOverlay');
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = 'uxOverlay';
  overlay.className = 'ux-overlay';
  overlay.innerHTML = `
    <div class="ux-modal" role="dialog" aria-modal="true" aria-labelledby="uxModalTitle">
      <div class="ux-modal-head">
        <div class="ux-modal-title" id="uxModalTitle">Details</div>
        <button class="ux-close" id="uxCloseBtn" aria-label="Close dialog">Close ✕</button>
      </div>
      <div class="ux-body" id="uxModalBody"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      overlay.classList.remove('open');
    }
  });

  overlay.querySelector('#uxCloseBtn').addEventListener('click', () => {
    overlay.classList.remove('open');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      overlay.classList.remove('open');
    }
  });

  return overlay;
}

function openModal(title, htmlBody) {
  const overlay = ensureOverlay();
  const titleEl = overlay.querySelector('#uxModalTitle');
  const bodyEl = overlay.querySelector('#uxModalBody');
  titleEl.textContent = title;
  bodyEl.innerHTML = htmlBody;
  overlay.classList.add('open');
}

function ensureToastWrap() {
  let wrap = document.getElementById('uxToastWrap');
  if (wrap) return wrap;
  wrap = document.createElement('div');
  wrap.id = 'uxToastWrap';
  wrap.className = 'ux-toast-wrap';
  document.body.appendChild(wrap);
  return wrap;
}

function showToast(message, duration = 2600) {
  const wrap = ensureToastWrap();
  const el = document.createElement('div');
  el.className = 'ux-toast';
  el.textContent = message;
  wrap.appendChild(el);
  gsap.fromTo(el, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' });

  setTimeout(() => {
    gsap.to(el, {
      y: 12,
      opacity: 0,
      duration: 0.22,
      onComplete: () => el.remove()
    });
  }, duration);
}

function buildReportHtml() {
  if (!latestAnalysis) {
    return `
      <p>No scan result yet. Paste a link and hit Detect Now to unlock your full verification report.</p>
      <div class="ux-chip-row">
        <span class="ux-chip">Live Corroboration</span>
        <span class="ux-chip">Source Integrity</span>
        <span class="ux-chip">Risk Mapping</span>
      </div>
    `;
  }

  const { inputUrl, domain, elapsed, heuristics, assessment, mentions } = latestAnalysis;
  const topMentions = mentions.slice(0, 4).map((m) => `<li><a href="${m.link}" target="_blank" rel="noopener noreferrer">${m.title}</a></li>`).join('');
  const riskFlags = heuristics.riskFlags.length
    ? heuristics.riskFlags.map(flag => `<li>${flag}</li>`).join('')
    : '<li>No major source-pattern risk flags were detected.</li>';

  return `
    <p><strong>URL:</strong> ${inputUrl}</p>
    <p><strong>Domain:</strong> ${domain}</p>
    <div class="ux-chip-row">
      <span class="ux-chip">Final Score: ${assessment.finalScore}%</span>
      <span class="ux-chip">Verdict: ${assessment.verdict}</span>
      <span class="ux-chip">Processed: ${(elapsed / 1000).toFixed(2)}s</span>
    </div>
    <p><strong>Corroboration:</strong> ${assessment.totalMentions} mentions across ${assessment.uniqueDomains} domains (${assessment.trustedMentions} trusted-source hits).</p>
    <p><strong>Risk Signals:</strong></p>
    <ul>${riskFlags}</ul>
    <p><strong>Top Supporting Mentions:</strong></p>
    <ul>${topMentions || '<li>No mention links found for this scan.</li>'}</ul>
  `;
}

if (fullReportBtn) {
  fullReportBtn.addEventListener('click', () => {
    openModal('Verification Report', buildReportHtml());
  });
}

if (shareWarningBtn) {
  shareWarningBtn.addEventListener('click', async () => {
    const shareText = latestAnalysis
      ? `Mirch Masala scan: ${latestAnalysis.assessment.verdict} (${latestAnalysis.assessment.finalScore}%). URL: ${latestAnalysis.inputUrl}`
      : 'Mirch Masala: verify news links before sharing. Paste a URL and get a trust verdict.';

    try {
      await navigator.clipboard.writeText(shareText);
      showToast('Warning summary copied to clipboard.');
    } catch {
      openModal('Copy This Warning', `<p>${shareText}</p>`);
    }
  });
}

if (ctaSubmitBtn && ctaEmail) {
  ctaSubmitBtn.addEventListener('click', () => {
    const email = ctaEmail.value.trim().toLowerCase();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      showToast('Enter a valid email to join early access.');
      ctaEmail.focus();
      return;
    }

    const key = 'mm_early_access_emails';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    if (!existing.includes(email)) {
      existing.push(email);
      localStorage.setItem(key, JSON.stringify(existing));
    }

    showToast('You are in. Early access invite queued.');
    openModal('Early Access Confirmed', `
      <p><strong>${email}</strong> has been added to the priority list.</p>
      <p>Next: weekly intel drops, beta feature unlocks, and deep misinformation trend reports.</p>
      <div class="ux-chip-row">
        <span class="ux-chip">Priority Queue</span>
        <span class="ux-chip">Beta Alerts</span>
        <span class="ux-chip">Insider Reports</span>
      </div>
    `);
    ctaEmail.value = '';
  });

  ctaEmail.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      ctaSubmitBtn.click();
    }
  });
}

const infoPages = {
  Pricing: {
    title: 'Pricing',
    body: '<p>Starter is free for personal verification. Pro unlocks bulk URL scans, alerts, and API access for teams.</p><div class="ux-chip-row"><span class="ux-chip">Free</span><span class="ux-chip">Pro</span><span class="ux-chip">Enterprise</span></div>'
  },
  API: {
    title: 'API Access',
    body: '<p>Use scan endpoints, domain-risk intelligence, and report exports. API keys are currently in rollout.</p><p>Contact: api@mirchmasala.example</p>'
  },
  About: {
    title: 'About Mirch Masala',
    body: '<p>Mirch Masala helps users pause misinformation before it spreads by combining web corroboration, source intelligence, and transparent verdict signals.</p>'
  },
  Blog: {
    title: 'Research Blog',
    body: '<p>Latest posts cover election misinformation patterns, deepfake trend maps, and social amplification behavior.</p>'
  },
  Careers: {
    title: 'Careers',
    body: '<p>Hiring for ML, trust and safety, product design, and investigative research roles.</p>'
  },
  Press: {
    title: 'Press Kit',
    body: '<p>Download brand assets, product screenshots, and verification methodology briefs for media coverage.</p>'
  },
  Privacy: {
    title: 'Privacy',
    body: '<p>Scanned URLs are used for analysis quality and abuse prevention. User-identifying data is minimized.</p>'
  },
  Terms: {
    title: 'Terms',
    body: '<p>Mirch Masala provides decision support, not legal truth guarantees. Always verify high-impact claims independently.</p>'
  },
  'Cookie Policy': {
    title: 'Cookie Policy',
    body: '<p>Cookies are used for session continuity, analytics, and personalization controls.</p>'
  }
};

document.querySelectorAll('#footer .footer-col a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const label = link.textContent.trim();

    if (label === 'How It Works') {
      document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (label === 'Features') {
      document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const page = infoPages[label];
    if (page) {
      openModal(page.title, page.body);
    }
  });
});

const socialTargets = [
  { name: 'X', url: 'https://twitter.com', note: 'Opening X' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com', note: 'Opening LinkedIn' },
  { name: 'YouTube', url: 'https://www.youtube.com', note: 'Opening YouTube' }
];

document.querySelectorAll('.footer-socials .social-link').forEach((link, idx) => {
  const target = socialTargets[idx];
  if (!target) return;
  link.href = target.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', target.name);
  link.addEventListener('click', () => showToast(target.note));
});

const featureDetails = [
  {
    title: 'Real-time Analysis',
    body: '<p>Runs live source-signal scoring with corroboration checks and credibility weighting.</p><p>Best for breaking claims where speed matters.</p>'
  },
  {
    title: 'Social Media Verification',
    body: '<p>Parses social-linked news claims and checks them against indexed article networks.</p>'
  },
  {
    title: 'AI Context Understanding',
    body: '<p>Detects manipulation patterns like urgency bait, certainty without evidence, and framing tricks.</p>'
  },
  {
    title: 'Image Forensics',
    body: '<p>Supports reverse-search references and flags common synthetic-media fingerprints.</p>'
  },
  {
    title: 'Multilingual Support',
    body: '<p>Handles multilingual claims with cross-language corroboration signals and region-aware domain trust.</p>'
  },
  {
    title: 'Crowd Insight',
    body: '<p>Community evidence layer is in rollout. Join early access to test localized witness submissions.</p>'
  }
];

document.querySelectorAll('.feature-card').forEach((card, idx) => {
  card.classList.add('is-clickable');
  card.addEventListener('click', () => {
    const item = featureDetails[idx];
    if (!item) return;
    openModal(item.title, item.body);
  });
});

document.querySelectorAll('.step-card').forEach((card) => {
  card.addEventListener('click', () => {
    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
    newsInput.focus();
    showToast('Drop a link above and start the live verification scan.');
  });
});

// ─── PERIODIC CHILI BURST (Easter egg) ───────────────
setInterval(() => {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const burst = document.createElement('div');
  burst.textContent = '🌶️';
  burst.style.cssText = `
    position: absolute;
    font-size: ${12 + Math.random() * 20}px;
    left: ${Math.random() * 100}%;
    bottom: 0;
    pointer-events: none;
    z-index: 3;
    filter: drop-shadow(0 0 8px rgba(255,107,0,0.6));
  `;
  hero.appendChild(burst);

  gsap.to(burst, {
    y: -(100 + Math.random() * 200),
    x: (Math.random() - 0.5) * 100,
    opacity: 0,
    rotation: (Math.random() - 0.5) * 60,
    duration: 2 + Math.random() * 2,
    ease: 'power2.out',
    onComplete: () => burst.remove()
  });
}, 3000);

console.log(`
🌶️ MIRCH MASALA
━━━━━━━━━━━━━━━━━━━━━━━━
Adding Spice to Truth Detection
━━━━━━━━━━━━━━━━━━━━━━━━
Built with fire, GSap & zero tolerance for lies.
`);
