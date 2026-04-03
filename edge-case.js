const state = {
  mode: 'ai',
  confidence: 56,
  sources: 3,
  witness: 52,
  media: 38,
  forensics: 44,
  claim: '',
  evidence: [
    { id: 1, title: 'Local reporter posted on-site visuals', reliability: 58, votesUp: 3, votesDown: 1 },
    { id: 2, title: 'Regional alert channel mentioned event', reliability: 49, votesUp: 2, votesDown: 2 },
    { id: 3, title: 'One national outlet carried update', reliability: 64, votesUp: 4, votesDown: 1 }
  ],
  timeline: []
};

const els = {
  claimInput: document.getElementById('claimInput'),
  sourcesRange: document.getElementById('sourcesRange'),
  witnessRange: document.getElementById('witnessRange'),
  mediaRange: document.getElementById('mediaRange'),
  forensicsRange: document.getElementById('forensicsRange'),
  sourcesValue: document.getElementById('sourcesValue'),
  witnessValue: document.getElementById('witnessValue'),
  mediaValue: document.getElementById('mediaValue'),
  forensicsValue: document.getElementById('forensicsValue'),
  aiModeBtn: document.getElementById('aiModeBtn'),
  hybridModeBtn: document.getElementById('hybridModeBtn'),
  simulateBtn: document.getElementById('simulateBtn'),
  addEvidenceBtn: document.getElementById('addEvidenceBtn'),
  resetLabBtn: document.getElementById('resetLabBtn'),
  copySummaryBtn: document.getElementById('copySummaryBtn'),
  publishReportBtn: document.getElementById('publishReportBtn'),
  meterFill: document.getElementById('meterFill'),
  confidenceText: document.getElementById('confidenceText'),
  stateText: document.getElementById('stateText'),
  recommendationText: document.getElementById('recommendationText'),
  evidenceBoard: document.getElementById('evidenceBoard'),
  timeline: document.getElementById('timeline'),
  modal: document.getElementById('modal'),
  modalTitle: document.getElementById('modalTitle'),
  modalBody: document.getElementById('modalBody'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  toast: document.getElementById('toast')
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    els.toast.classList.remove('show');
  }, 2200);
}

function pushTimeline(text) {
  state.timeline.unshift(`${nowLabel()} · ${text}`);
  state.timeline = state.timeline.slice(0, 8);
  renderTimeline();
}

function confidenceFromInputs() {
  const evidenceScore = state.evidence.reduce((acc, item) => {
    const voteImpact = (item.votesUp - item.votesDown) * 2;
    return acc + item.reliability + voteImpact;
  }, 0) / state.evidence.length;

  const sourceFactor = clamp(state.sources * 4, 0, 40);
  const modeBias = state.mode === 'ai' ? -4 : 6;

  const score =
    (state.witness * 0.22) +
    (state.media * 0.28) +
    (state.forensics * 0.22) +
    (evidenceScore * 0.2) +
    sourceFactor +
    modeBias;

  return clamp(Math.round(score), 1, 99);
}

function recommendationFor(score) {
  if (score >= 75) {
    return {
      state: 'Likely True',
      recommendation: 'Share with context and cite corroborated sources.'
    };
  }
  if (score <= 44) {
    return {
      state: 'Likely False',
      recommendation: 'Do not share yet. Flag for fact-checking.'
    };
  }
  return {
    state: 'Uncertain',
    recommendation: 'Wait for stronger corroboration and updates.'
  };
}

function renderEvidence() {
  els.evidenceBoard.innerHTML = '';
  state.evidence.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'evidence-card';
    card.innerHTML = `
      <div class="evidence-title">${item.title}</div>
      <div class="evidence-meta">Reliability: <strong>${item.reliability}%</strong></div>
      <div class="vote-row">
        <button class="vote-btn" data-id="${item.id}" data-action="up" type="button">Trust +</button>
        <button class="vote-btn" data-id="${item.id}" data-action="down" type="button">Doubt -</button>
      </div>
      <div class="vote-count">Votes: 👍 ${item.votesUp} · 👎 ${item.votesDown}</div>
    `;
    els.evidenceBoard.appendChild(card);
  });

  els.evidenceBoard.querySelectorAll('.vote-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      const item = state.evidence.find((entry) => entry.id === id);
      if (!item) return;

      if (action === 'up') {
        item.votesUp += 1;
      } else {
        item.votesDown += 1;
      }

      state.confidence = confidenceFromInputs();
      renderAll();
      pushTimeline(`Evidence reaction captured for: ${item.title}`);
    });
  });
}

function renderTimeline() {
  els.timeline.innerHTML = '';
  state.timeline.forEach((line) => {
    const li = document.createElement('li');
    li.textContent = line;
    els.timeline.appendChild(li);
  });
}

function renderVerdict() {
  const score = state.confidence;
  const verdict = recommendationFor(score);

  els.meterFill.style.width = `${score}%`;
  els.confidenceText.textContent = `${score}%`;
  els.stateText.textContent = verdict.state;
  els.recommendationText.textContent = verdict.recommendation;
}

function renderRanges() {
  els.sourcesValue.textContent = String(state.sources);
  els.witnessValue.textContent = `${state.witness}%`;
  els.mediaValue.textContent = `${state.media}%`;
  els.forensicsValue.textContent = `${state.forensics}%`;
}

function renderAll() {
  renderRanges();
  renderVerdict();
  renderEvidence();
  renderTimeline();
}

function setMode(mode) {
  state.mode = mode;
  els.aiModeBtn.classList.toggle('active', mode === 'ai');
  els.hybridModeBtn.classList.toggle('active', mode === 'hybrid');
  state.confidence = confidenceFromInputs();
  renderVerdict();
  pushTimeline(mode === 'ai' ? 'Switched to AI Cautious Mode' : 'Switched to Hybrid Community Mode');
}

function openModal(title, html) {
  els.modalTitle.textContent = title;
  els.modalBody.innerHTML = html;
  els.modal.classList.add('open');
  els.modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  els.modal.classList.remove('open');
  els.modal.setAttribute('aria-hidden', 'true');
}

function resetLab() {
  state.mode = 'ai';
  state.sources = 3;
  state.witness = 52;
  state.media = 38;
  state.forensics = 44;
  state.claim = '';
  state.evidence = [
    { id: 1, title: 'Local reporter posted on-site visuals', reliability: 58, votesUp: 3, votesDown: 1 },
    { id: 2, title: 'Regional alert channel mentioned event', reliability: 49, votesUp: 2, votesDown: 2 },
    { id: 3, title: 'One national outlet carried update', reliability: 64, votesUp: 4, votesDown: 1 }
  ];
  state.timeline = [];

  els.claimInput.value = '';
  els.sourcesRange.value = String(state.sources);
  els.witnessRange.value = String(state.witness);
  els.mediaRange.value = String(state.media);
  els.forensicsRange.value = String(state.forensics);

  setMode('ai');
  state.confidence = confidenceFromInputs();
  renderAll();
  pushTimeline('Lab reset to default baseline.');
  toast('Lab reset complete.');
}

els.sourcesRange.addEventListener('input', () => {
  state.sources = Number(els.sourcesRange.value);
  state.confidence = confidenceFromInputs();
  renderVerdict();
  renderRanges();
});

els.witnessRange.addEventListener('input', () => {
  state.witness = Number(els.witnessRange.value);
  state.confidence = confidenceFromInputs();
  renderVerdict();
  renderRanges();
});

els.mediaRange.addEventListener('input', () => {
  state.media = Number(els.mediaRange.value);
  state.confidence = confidenceFromInputs();
  renderVerdict();
  renderRanges();
});

els.forensicsRange.addEventListener('input', () => {
  state.forensics = Number(els.forensicsRange.value);
  state.confidence = confidenceFromInputs();
  renderVerdict();
  renderRanges();
});

els.aiModeBtn.addEventListener('click', () => setMode('ai'));
els.hybridModeBtn.addEventListener('click', () => setMode('hybrid'));

els.simulateBtn.addEventListener('click', () => {
  state.claim = els.claimInput.value.trim() || 'Untitled claim';
  state.confidence = confidenceFromInputs();
  renderVerdict();
  pushTimeline(`Simulation run for: ${state.claim}`);
  toast('Simulation updated. Verdict recalculated.');
});

els.addEvidenceBtn.addEventListener('click', () => {
  const id = Math.max(...state.evidence.map((e) => e.id)) + 1;
  const reliability = clamp(Math.round((state.witness + state.media + state.forensics) / 3 + (Math.random() * 14 - 7)), 20, 92);
  const titleOptions = [
    'Citizen uploaded timestamped footage',
    'District authority issued short advisory',
    'Independent journalist cross-verified location',
    'Satellite snapshot shared by local analyst',
    'Hospital intake data aligned with incident reports'
  ];
  const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];

  state.evidence.unshift({
    id,
    title,
    reliability,
    votesUp: 1,
    votesDown: 0
  });
  state.evidence = state.evidence.slice(0, 8);

  state.confidence = confidenceFromInputs();
  renderAll();
  pushTimeline(`New evidence added: ${title}`);
  toast('Evidence added to board.');
});

els.copySummaryBtn.addEventListener('click', async () => {
  const verdict = recommendationFor(state.confidence);
  const claim = els.claimInput.value.trim() || 'Untitled claim';
  const summary = `Edge Case Lab Summary\nClaim: ${claim}\nConfidence: ${state.confidence}%\nState: ${verdict.state}\nRecommendation: ${verdict.recommendation}`;

  try {
    await navigator.clipboard.writeText(summary);
    toast('Summary copied to clipboard.');
  } catch {
    openModal('Copy Summary', `<pre>${summary}</pre>`);
  }
});

els.publishReportBtn.addEventListener('click', () => {
  const verdict = recommendationFor(state.confidence);
  const claim = els.claimInput.value.trim() || 'Untitled claim';
  const evidenceList = state.evidence
    .map((e) => `<li>${e.title} · Reliability ${e.reliability}% · 👍 ${e.votesUp} / 👎 ${e.votesDown}</li>`)
    .join('');

  openModal(
    'Edge Case Full Report',
    `
      <p><strong>Claim:</strong> ${claim}</p>
      <p><strong>Mode:</strong> ${state.mode === 'ai' ? 'AI Cautious Mode' : 'Hybrid Community Mode'}</p>
      <p><strong>Confidence:</strong> ${state.confidence}%</p>
      <p><strong>State:</strong> ${verdict.state}</p>
      <p><strong>Recommendation:</strong> ${verdict.recommendation}</p>
      <h4>Signals</h4>
      <ul>
        <li>Independent Sources: ${state.sources}</li>
        <li>Eyewitness Reliability: ${state.witness}%</li>
        <li>Media Corroboration: ${state.media}%</li>
        <li>Image/Video Evidence: ${state.forensics}%</li>
      </ul>
      <h4>Evidence Board</h4>
      <ul>${evidenceList}</ul>
    `
  );
});

els.resetLabBtn.addEventListener('click', resetLab);
els.closeModalBtn.addEventListener('click', closeModal);
els.modal.addEventListener('click', (event) => {
  if (event.target === els.modal) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

state.confidence = confidenceFromInputs();
pushTimeline('Lab initialized. Ready for investigation.');
renderAll();
