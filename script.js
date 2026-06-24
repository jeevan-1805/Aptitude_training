const roadmapData = [
  {
    stage: 1,
    title: "Numbers and arithmetic foundations",
    short: "Build calculation fluency, number sense, and formula comfort.",
    topics: [
      "Place value, divisibility rules, factors and multiples, primes, HCF/LCM",
      "Fractions, decimals, and percentage conversion",
      "Approximation, simplification, BODMAS, square roots, and cubes"
    ],
    practice: "Start with clean number operations before moving to story problems."
  },
  {
    stage: 2,
    title: "Percentages, ratio, proportion, and averages",
    short: "These are the base tools for most placement questions.",
    topics: [
      "Percent change, comparison, and successive change",
      "Ratio division, direct proportion, and inverse proportion",
      "Weighted average and average speed ideas"
    ],
    practice: "Revisit the same pattern in multiple forms until the calculation becomes automatic."
  },
  {
    stage: 3,
    title: "Profit-loss, discount, SI/CI, mixtures",
    short: "Applications of percentage and ratio in story problems.",
    topics: [
      "Marked price, selling price, margin, and successive discount",
      "Simple interest and compound interest formula patterns",
      "Mixtures, alligation, replacement, and concentration"
    ],
    practice: "Train translation from word problem to equation or ratio model."
  },
  {
    stage: 4,
    title: "Time-work, pipes-cisterns, speed-distance",
    short: "Core word-problem models with direct formulas and logic.",
    topics: [
      "Unitary method, efficiency, and work equivalence",
      "Relative speed, trains, boats, and streams",
      "Time, distance, average speed, race, and meeting-point problems"
    ],
    practice: "Use unit conversions carefully and track what is relative versus absolute."
  },
  {
    stage: 5,
    title: "Algebra and equations",
    short: "Turn word problems into structured solving steps.",
    topics: [
      "Linear equations, quadratic basics, identities, and factorization",
      "Inequalities, algebraic fractions, exponents, and surds",
      "Translating word problems into equations"
    ],
    practice: "Focus on pattern recognition, manipulation, and clean substitution."
  },
  {
    stage: 6,
    title: "Geometry, mensuration, and basic trigonometry",
    short: "Needed for area, volume, angle, and shape-based questions.",
    topics: [
      "Lines and angles, triangles, circles, and quadrilaterals",
      "Perimeter, area, surface area, and volume",
      "Basic trigonometric ratios and angle use in problem solving"
    ],
    practice: "Draw diagrams early and annotate every known length, angle, and relation."
  },
  {
    stage: 7,
    title: "Data interpretation and data sufficiency",
    short: "Uses arithmetic under time pressure with charts and tables.",
    topics: [
      "Tables, bar graphs, line graphs, pie charts, and caselets",
      "Percentage-based comparison and ratio-based inference",
      "Question scanning, estimation, and short calculations under time pressure"
    ],
    practice: "Read the question first, estimate smartly, then calculate only what matters."
  },
  {
    stage: 8,
    title: "Logical reasoning",
    short: "Series, coding, arrangements, puzzles, syllogism, directions, blood relations.",
    topics: [
      "Number and alphabet series, coding-decoding",
      "Ranking, direction sense, blood relations, odd one out",
      "Seating arrangement, puzzles, syllogism, statements, and conclusions"
    ],
    practice: "Practice both logic and elimination strategy to reduce time."
  },
  {
    stage: 9,
    title: "Verbal aptitude",
    short: "Grammar, sentence correction, vocabulary, and reading comprehension.",
    topics: [
      "Parts of speech, tenses, subject-verb agreement, articles, prepositions",
      "Synonyms, antonyms, word usage, and error spotting",
      "Reading comprehension, sentence rearrangement, and cloze tests"
    ],
    practice: "Read actively, spot grammar patterns, and revise vocabulary in context."
  },
  {
    stage: 10,
    title: "Mixed practice, mocks, and revision",
    short: "Consolidates speed, accuracy, and test strategy.",
    topics: [
      "Topic-wise timed sets",
      "Mixed sets with no topic hints",
      "Full mocks, error log review, and formula revision sheets"
    ],
    practice: "Treat this stage like an exam simulator: timed, mixed, and reviewed."
  }
];

const masteryChecklistData = [
  "Can you identify the topic within 10–15 seconds?",
  "Can you solve standard questions without looking at formulas?",
  "Can you complete medium questions accurately under time pressure?",
  "Can you avoid repeating the same mistake?",
  "Can you score well in mixed and full-length tests?"
];

const storageKey = "aptitudeRoadmapJeevan_v1";

const state = {
  selectedStage: 1,
  openStages: new Set([1])
};

const els = {
  selector: document.getElementById("stageSelector"),
  roadmap: document.getElementById("roadmap"),
  currentStageLabel: document.getElementById("currentStageLabel"),
  topicCountLabel: document.getElementById("topicCountLabel"),
  progressLabel: document.getElementById("progressLabel"),
  progressFill: document.getElementById("progressFill"),
  progressTicks: document.getElementById("progressTicks"),
  checklist: document.getElementById("masteryChecklist")
};

function clampStage(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 1;
  return Math.min(Math.max(Math.round(num), 1), roadmapData.length);
}

function saveState() {
  const payload = {
    selectedStage: state.selectedStage,
    openStages: Array.from(state.openStages)
  };
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

function loadState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    state.selectedStage = clampStage(parsed.selectedStage ?? 1);
    const open = Array.isArray(parsed.openStages) ? parsed.openStages.map(clampStage) : [state.selectedStage];
    state.openStages = new Set(open.filter((s) => s >= 1 && s <= roadmapData.length));
    for (let i = 1; i <= state.selectedStage; i += 1) state.openStages.add(i);
  } catch {
    state.selectedStage = 1;
    state.openStages = new Set([1]);
  }
}

function renderSelector() {
  els.selector.innerHTML = roadmapData.map((item) => {
    const id = `stage-${item.stage}`;
    return `
      <label class="radio-item" for="${id}">
        <input type="radio" name="roadmap-stage" id="${id}" value="${item.stage}" ${item.stage === state.selectedStage ? "checked" : ""} />
        <div class="radio-card">
          <div class="radio-card__top">
            <div class="radio-card__stage">${item.stage}</div>
            <div class="radio-card__check" aria-hidden="true"></div>
          </div>
          <strong>${item.title}</strong>
          <span>${item.short}</span>
        </div>
      </label>
    `;
  }).join("");

  els.selector.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", (event) => {
      const stage = clampStage(event.target.value);
      setSelectedStage(stage, true);
    });
  });
}

function cardTemplate(item) {
  const isOpen = state.openStages.has(item.stage);
  const isActive = item.stage <= state.selectedStage;
  const isLocked = item.stage > state.selectedStage;

  return `
    <article class="roadmap-card ${isActive ? "is-active" : ""} ${isOpen ? "is-open" : ""} ${isLocked ? "is-locked" : ""}" data-stage="${item.stage}">
      <button class="roadmap-card__header" type="button" aria-expanded="${isOpen ? "true" : "false"}">
        <div class="roadmap-card__title">
          <div class="roadmap-card__badge">${item.stage}</div>
          <div class="roadmap-card__meta">
            <strong>${item.title}</strong>
            <span>${item.short}</span>
          </div>
        </div>
        <div class="roadmap-card__state">${isActive ? "Selected / unlocked" : "Locked until earlier stages finish"}</div>
      </button>
      <div class="roadmap-card__body">
        <div class="roadmap-card__body-inner">
          <ul class="topic-list">
            ${item.topics.map((topic) => `<li>${topic}</li>`).join("")}
          </ul>
          <div class="card-footer">${item.practice}</div>
        </div>
      </div>
    </article>
  `;
}

function renderRoadmap() {
  els.roadmap.innerHTML = roadmapData.map(cardTemplate).join("");

  els.roadmap.querySelectorAll(".roadmap-card").forEach((card) => {
    const stage = clampStage(card.dataset.stage);
    const button = card.querySelector(".roadmap-card__header");

    button.addEventListener("click", () => {
      if (stage > state.selectedStage) {
        setSelectedStage(stage, false);
        return;
      }
      toggleStage(stage);
    });

    button.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        const next = Math.min(stage + 1, roadmapData.length);
        focusStage(next);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        const prev = Math.max(stage - 1, 1);
        focusStage(prev);
      }
    });
  });
}

function renderChecklist() {
  els.checklist.innerHTML = masteryChecklistData.map((text, index) => {
    const id = `mastery-${index + 1}`;
    return `
      <div class="check-item">
        <input type="checkbox" id="${id}" />
        <label for="${id}">${text}</label>
      </div>
    `;
  }).join("");
}

function renderProgress() {
  const pct = (state.selectedStage / roadmapData.length) * 100;
  els.currentStageLabel.textContent = `Stage ${state.selectedStage}`;
  els.topicCountLabel.textContent = `${state.selectedStage} of ${roadmapData.length}`;
  els.progressLabel.textContent = `${Math.round(pct)}%`;
  els.progressFill.style.width = `${pct}%`;

  if (!els.progressTicks.children.length) {
    els.progressTicks.innerHTML = roadmapData.map((_, index) => `<span class="progress-shell__tick ${index < state.selectedStage ? "is-active" : ""}"></span>`).join("");
  } else {
    [...els.progressTicks.children].forEach((tick, index) => {
      tick.classList.toggle("is-active", index < state.selectedStage);
    });
  }
}

function setSelectedStage(stage, syncOpenState) {
  state.selectedStage = clampStage(stage);
  for (let i = 1; i <= state.selectedStage; i += 1) {
    state.openStages.add(i);
  }
  if (syncOpenState) {
    state.openStages.add(state.selectedStage);
  }
  saveState();
  rerender();
  scrollToStage(state.selectedStage);
}

function toggleStage(stage) {
  if (stage > state.selectedStage) return;
  if (state.openStages.has(stage)) {
    state.openStages.delete(stage);
  } else {
    state.openStages.add(stage);
  }
  saveState();
  rerender();
}

function scrollToStage(stage) {
  const card = els.roadmap.querySelector(`[data-stage="${stage}"]`);
  if (!card) return;
  card.scrollIntoView({ behavior: "smooth", block: "center" });
}

function focusStage(stage) {
  const radio = document.getElementById(`stage-${stage}`);
  if (radio) radio.focus();
}

function rerender() {
  renderSelector();
  renderRoadmap();
  renderProgress();
}

function init() {
  loadState();
  renderChecklist();
  rerender();

  // Keep progress ticks always in sync with selected stage
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey) return;
    loadState();
    rerender();
  });
}

init();
