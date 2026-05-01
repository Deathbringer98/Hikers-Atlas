const ES_KEYS = {
  session: "np_proto_session",
  accounts: "np_proto_accounts",
  tools: "np_proto_tools",
  enterprise: "np_proto_enterprise_suite",
  enterpriseBackup: "np_proto_enterprise_suite_backup",
};

const ES_BACKUP_SNAPSHOT_LIMIT = 60;

function esLoadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function esSaveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function esSetStatus(el, text, tone = "muted") {
  if (!el) {
    return;
  }

  el.textContent = text;
  const map = {
    ok: "var(--ok)",
    warn: "var(--warn)",
    bad: "var(--bad)",
    muted: "var(--muted)",
  };
  el.style.color = map[tone] || map.muted;
}

function getEnterpriseState() {
  return esLoadJson(ES_KEYS.enterprise, {});
}

function setEnterpriseState(state) {
  esSaveJson(ES_KEYS.enterprise, state);
}

function getEnterpriseBackupState() {
  return esLoadJson(ES_KEYS.enterpriseBackup, {});
}

function setEnterpriseBackupState(state) {
  esSaveJson(ES_KEYS.enterpriseBackup, state);
}

function appendEnterpriseBackupSnapshot(accountId, payload, reason = "autosave") {
  if (!accountId || !payload || typeof payload !== "object") {
    return;
  }

  const backups = getEnterpriseBackupState();
  const existing = backups[accountId] && typeof backups[accountId] === "object"
    ? backups[accountId]
    : { snapshots: [] };

  const snapshot = {
    createdAt: new Date().toISOString(),
    reason,
    data: JSON.parse(JSON.stringify(payload)),
  };

  const prev = Array.isArray(existing.snapshots) ? existing.snapshots : [];
  backups[accountId] = {
    latest: snapshot,
    snapshots: [snapshot, ...prev].slice(0, ES_BACKUP_SNAPSHOT_LIMIT),
  };

  setEnterpriseBackupState(backups);
}

function restoreEnterpriseFromBackup(accountId) {
  if (!accountId) {
    return false;
  }

  const backups = getEnterpriseBackupState();
  const entry = backups[accountId];
  const latest = entry && typeof entry === "object" ? entry.latest : null;
  if (!latest || !latest.data || typeof latest.data !== "object") {
    return false;
  }

  const state = getEnterpriseState();
  state[accountId] = {
    ...latest.data,
    restoredAt: new Date().toISOString(),
  };
  setEnterpriseState(state);
  return true;
}

function forEnterpriseAccount(callback) {
  const session = esLoadJson(ES_KEYS.session, null);
  const accounts = esLoadJson(ES_KEYS.accounts, []);
  const account = session ? accounts.find((a) => a.id === session.id) : null;

  if (!account || account.plan !== "enterprise") {
    return null;
  }

  const state = getEnterpriseState();
  const current = state[account.id] || {};
  const next = callback(current) || current;
  state[account.id] = {
    ...current,
    ...next,
    updatedAt: new Date().toISOString(),
  };
  setEnterpriseState(state);
  appendEnterpriseBackupSnapshot(account.id, state[account.id], "account-write");
  return state[account.id];
}

function getEnterpriseAccountAndData() {
  const session = esLoadJson(ES_KEYS.session, null);
  const accounts = esLoadJson(ES_KEYS.accounts, []);
  const account = session ? accounts.find((a) => a.id === session.id) : null;
  let all = getEnterpriseState();
  let data = account ? (all[account.id] || {}) : {};

  if (account && (!data || typeof data !== "object" || !Object.keys(data).length)) {
    const restored = restoreEnterpriseFromBackup(account.id);
    if (restored) {
      all = getEnterpriseState();
      data = all[account.id] || {};
    }
  }

  return { session, account, data };
}

function gateEnterpriseTool() {
  const sessionStatusEl = document.getElementById("sessionStatus");
  const gateStatusEl = document.getElementById("toolsGateStatus");
  const lockedEl = document.getElementById("toolsLocked");
  const workspaceEl = document.getElementById("toolsWorkspace");

  if (!gateStatusEl || !lockedEl || !workspaceEl) {
    return null;
  }

  const { account } = getEnterpriseAccountAndData();
  if (!account) {
    if (sessionStatusEl) {
      sessionStatusEl.textContent = "No active account session.";
    }
    esSetStatus(gateStatusEl, "Unlock an account to access Enterprise Suite tools.", "warn");
    lockedEl.classList.remove("hidden");
    workspaceEl.classList.add("hidden");
    return null;
  }

  if (sessionStatusEl) {
    sessionStatusEl.textContent = `Active account: ${account.id} | Plan: ${account.plan} | Billing: ${account.paymentMethod || "none"}`;
    sessionStatusEl.style.color = "var(--ok)";
  }

  if (account.plan !== "enterprise") {
    esSetStatus(gateStatusEl, "This tool is Enterprise-only. Gold accounts are blocked.", "warn");
    lockedEl.classList.remove("hidden");
    workspaceEl.classList.add("hidden");
    return null;
  }

  esSetStatus(gateStatusEl, "Enterprise access granted.", "ok");
  lockedEl.classList.add("hidden");
  workspaceEl.classList.remove("hidden");
  return account;
}

function initSlidesTool(account, data) {
  const thumbsEl = document.getElementById("slidesThumbs");
  if (!thumbsEl) {
    return;
  }

  const titleEl = document.getElementById("slideTitle");
  const bodyEl = document.getElementById("slideBody");
  const bodyEditorEl = document.getElementById("slideBodyEditor");
  const fontEl = document.getElementById("slideFontFamily");
  const fontSizeEl = document.getElementById("slideFontSize");
  const imageUrlEl = document.getElementById("slideImageUrl");
  const imageUploadBtn = document.getElementById("slideImageUploadBtn");
  const imageFileEl = document.getElementById("slideImageFile");
  const imageApplyBtn = document.getElementById("slideImageApplyBtn");
  const imageResolveBtn = document.getElementById("slideImageResolveBtn");
  const imageClearBtn = document.getElementById("slideImageClearBtn");
  const imageAsBgEl = document.getElementById("slideImageAsBackground");
  const themeEl = document.getElementById("slidesThemeSelect");
  const templateEl = document.getElementById("slidesTemplateSelect");
  const applyTemplateBtn = document.getElementById("slidesApplyTemplateBtn");
  const addBtn = document.getElementById("slideAddBtn");
  const duplicateBtn = document.getElementById("slidesDuplicateBtn");
  const deleteBtn = document.getElementById("slidesDeleteBtn");
  const saveBtn = document.getElementById("slidesSaveBtn");
  const exportBtn = document.getElementById("slidesExportBtn");
  const importBtn = document.getElementById("slidesImportBtn");
  const importFileEl = document.getElementById("slidesImportFile");
  const presentBtn = document.getElementById("slidesPresentBtn");
  const presentHeaderBtn = document.getElementById("slidesPresentHeaderBtn");
  const statusEl = document.getElementById("slidesStatus");
  const searchEl = document.getElementById("slidesSearchInput");
  const sortEl = document.getElementById("slidesSortSelect");
  const outlineBtn = document.getElementById("slidesOutlineBtn");
  const sidebarCountEl = document.getElementById("slidesSidebarCount");
  const notesEl = document.getElementById("slidesPresenterNotes");
  const commentsListEl = document.getElementById("slidesCommentsList");
  const commentInputEl = document.getElementById("slidesCommentInput");
  const addCommentBtn = document.getElementById("slidesAddCommentBtn");
  const clearCommentsBtn = document.getElementById("slidesClearCommentsBtn");
  const versionSelectEl = document.getElementById("slidesVersionSelect");
  const restoreVersionBtn = document.getElementById("slidesRestoreVersionBtn");
  const shortcutsBtn = document.getElementById("slidesShortcutsBtn");
  const insightCountEl = document.getElementById("slidesInsightCount");
  const insightWordsEl = document.getElementById("slidesInsightWords");
  const insightTalkEl = document.getElementById("slidesInsightTalk");
  const insightReadabilityEl = document.getElementById("slidesInsightReadability");

  const canvasEl = document.getElementById("slideCanvas");
  const canvasTitleEl = document.getElementById("slideCanvasTitle");
  const canvasBodyEl = document.getElementById("slideCanvasBody");
  const canvasImageWrapEl = document.getElementById("slideCanvasImageWrap");
  const canvasImageEl = document.getElementById("slideCanvasImage");
  const canvasResizeHandleEl = document.getElementById("slideCanvasResizeHandle");
  let snapGuideVEl = null;
  let snapGuideHEl = null;

  if (canvasEl) {
    const v = document.createElement("div");
    v.className = "slide-snap-guide slide-snap-guide-v hidden";
    const h = document.createElement("div");
    h.className = "slide-snap-guide slide-snap-guide-h hidden";
    canvasEl.appendChild(v);
    canvasEl.appendChild(h);
    snapGuideVEl = v;
    snapGuideHEl = h;
  }

  function looksLikeDirectImageUrl(url) {
    const value = String(url || "").trim();
    const lower = value.toLowerCase();
    if (!value) {
      return false;
    }
    if (lower.startsWith("data:image/") || lower.startsWith("blob:")) {
      return true;
    }

    if (/\.(png|jpe?g|gif|webp|svg)(\?.*)?(#.*)?$/i.test(value)) {
      return true;
    }

    try {
      const parsed = new URL(value);
      const host = parsed.hostname.toLowerCase();
      const format = (parsed.searchParams.get("format") || "").toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(format)) {
        return true;
      }

      // Known CDN patterns that may not include extension in pathname.
      if ((host.endsWith("twimg.com") || host.endsWith("redditmedia.com") || host.endsWith("googleusercontent.com")) && format) {
        return true;
      }
    } catch {
      return false;
    }

    return false;
  }

  function verifyImageUrl(url) {
    return new Promise((resolve) => {
      if (!url) {
        resolve({ ok: false, reason: "Image URL is empty." });
        return;
      }

      if (!looksLikeDirectImageUrl(url)) {
        resolve({ ok: false, reason: "Use a direct image URL ending in .png, .jpg, .jpeg, .webp, .gif, or .svg." });
        return;
      }

      const probe = new Image();
      probe.onload = () => resolve({ ok: true });
      probe.onerror = () => resolve({ ok: false, reason: "Image failed to load. Verify URL is public and points directly to an image file." });
      probe.src = url;
    });
  }

  function decodeMaybe(value) {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  async function resolveGoogleImagesUrl(url) {
    const u = new URL(url);
    const imgurl = u.searchParams.get("imgurl") || u.searchParams.get("mediaurl") || "";
    if (!imgurl) {
      return { ok: false, reason: "Google Images URL does not contain direct imgurl/mediaurl parameter." };
    }
    return { ok: true, url: decodeMaybe(imgurl) };
  }

  async function resolveRedditUrl(url) {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host === "i.redd.it" || host === "preview.redd.it") {
      return { ok: true, url };
    }

    let jsonUrl = url;
    if (!jsonUrl.endsWith(".json")) {
      jsonUrl = jsonUrl.replace(/\/$/, "") + ".json";
    }

    try {
      const res = await fetch(jsonUrl, { method: "GET", headers: { Accept: "application/json" } });
      if (!res.ok) {
        return { ok: false, reason: "Could not fetch Reddit post metadata." };
      }
      const payload = await res.json();
      const post = payload?.[0]?.data?.children?.[0]?.data;
      const preview = post?.preview?.images?.[0]?.source?.url || "";
      if (preview) {
        return { ok: true, url: decodeMaybe(String(preview).replace(/&amp;/g, "&")) };
      }

      const media = post?.media_metadata;
      if (media && typeof media === "object") {
        const first = Object.values(media)[0];
        const candidate = first?.s?.u || first?.s?.gif || "";
        if (candidate) {
          return { ok: true, url: decodeMaybe(String(candidate).replace(/&amp;/g, "&")) };
        }
      }

      return { ok: false, reason: "No direct image found in Reddit metadata." };
    } catch {
      return { ok: false, reason: "Reddit URL could not be resolved in browser (CORS/network)." };
    }
  }

  async function resolveXUrl(url) {
    const match = url.match(/status\/(\d+)/i);
    if (!match) {
      return { ok: false, reason: "X link is missing a status id." };
    }
    const id = match[1];

    // Best effort: public syndication metadata sometimes exposes media details.
    try {
      const metaUrl = `https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=en`;
      const res = await fetch(metaUrl, { method: "GET", headers: { Accept: "application/json" } });
      if (res.ok) {
        const payload = await res.json();
        const media = Array.isArray(payload?.mediaDetails) ? payload.mediaDetails : [];
        const first = media.find((m) => /photo/i.test(String(m?.type || ""))) || media[0];
        const candidate = first?.media_url_https || first?.media_url || "";
        if (candidate) {
          return { ok: true, url: candidate };
        }
      }
    } catch {
      // Fall through to guidance message.
    }

    return {
      ok: false,
      reason: "X blocks many direct media lookups. Open the image in X, then copy the direct pbs.twimg.com image address.",
    };
  }

  async function resolveImagePageUrl(rawUrl) {
    const value = String(rawUrl || "").trim();
    if (!value) {
      return { ok: false, reason: "Image URL is empty." };
    }

    if (looksLikeDirectImageUrl(value)) {
      return { ok: true, url: value };
    }

    let parsed;
    try {
      parsed = new URL(value);
    } catch {
      return { ok: false, reason: "URL format is invalid." };
    }

    const host = parsed.hostname.toLowerCase();
    if (host.includes("google.") && (parsed.pathname.includes("/imgres") || parsed.pathname.includes("/search"))) {
      return resolveGoogleImagesUrl(value);
    }
    if (host.endsWith("reddit.com") || host.endsWith("redd.it") || host.endsWith("i.redd.it") || host.endsWith("preview.redd.it")) {
      return resolveRedditUrl(value);
    }
    if (host.endsWith("x.com") || host.endsWith("twitter.com")) {
      return resolveXUrl(value);
    }

    return { ok: false, reason: "This URL is not a direct image. Use Resolve URL for Google/Reddit/X links or paste a direct image file URL." };
  }

  function createInlineSlideGraphic(label, primary, accent) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${primary}" />
            <stop offset="100%" stop-color="#0A0F1E" />
          </linearGradient>
        </defs>
        <rect width="1280" height="720" fill="url(#bg)" rx="28" />
        <rect x="72" y="72" width="1136" height="576" rx="28" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.16)" />
        <circle cx="1028" cy="200" r="110" fill="${accent}" opacity="0.32" />
        <circle cx="928" cy="280" r="76" fill="#FFFFFF" opacity="0.12" />
        <text x="118" y="190" fill="#F5FAFF" font-size="82" font-family="Inter, Arial, sans-serif" font-weight="700">${label}</text>
        <rect x="118" y="248" width="440" height="18" rx="9" fill="rgba(255,255,255,0.16)" />
        <rect x="118" y="322" width="620" height="18" rx="9" fill="rgba(255,255,255,0.18)" />
        <rect x="118" y="368" width="570" height="18" rx="9" fill="rgba(255,255,255,0.13)" />
        <rect x="118" y="414" width="460" height="18" rx="9" fill="rgba(255,255,255,0.10)" />
      </svg>
    `)}`;
  }

  function linesToRichHtml(lines) {
    const items = lines
      .map((line) => String(line || "").trim())
      .filter(Boolean)
      .map((line) => `<li>${line}</li>`)
      .join("");
    return items ? `<ul>${items}</ul>` : "<p></p>";
  }

  function htmlToPlainText(html) {
    const scratch = document.createElement("div");
    scratch.innerHTML = String(html || "");
    return String(scratch.textContent || scratch.innerText || "").replace(/\s+/g, " ").trim();
  }

  function normalizeRichBody(slide) {
    if (String(slide?.bodyHtml || "").trim()) {
      return String(slide.bodyHtml);
    }
    const lines = String(slide?.body || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    return linesToRichHtml(lines);
  }

  const templateLibrary = {
    "startup-pitch": {
      theme: "dark",
      slides: [
        { title: "Startup Pitch", bodyHtml: linesToRichHtml(["Mission", "Market pain", "Why now"]), fontFamily: "Space Grotesk", fontSize: 20, imageUrl: createInlineSlideGraphic("Pitch", "#1E3A8A", "#00D4FF") },
        { title: "Solution", bodyHtml: linesToRichHtml(["Core product", "Differentiator", "Proof points"]), fontFamily: "Space Grotesk", fontSize: 20, imageUrl: createInlineSlideGraphic("Solution", "#0D4B74", "#4EF5D5") },
        { title: "Business Model", bodyHtml: linesToRichHtml(["Primary revenue streams", "Margins", "Pricing"]), fontFamily: "Space Grotesk", fontSize: 20, imageUrl: createInlineSlideGraphic("Model", "#1F2937", "#F0B35A") },
      ],
    },
    "investor-update": {
      theme: "ocean",
      slides: [
        { title: "Investor Update", bodyHtml: linesToRichHtml(["Highlights", "Current runway", "Top priorities"]), fontFamily: "Inter", fontSize: 18, imageUrl: createInlineSlideGraphic("Update", "#155E75", "#7DEBFF") },
        { title: "KPIs", bodyHtml: linesToRichHtml(["Revenue growth", "Retention", "CAC payback"]), fontFamily: "Inter", fontSize: 18, imageUrl: createInlineSlideGraphic("KPIs", "#164E63", "#9AF2FF") },
        { title: "Risks & Mitigations", bodyHtml: linesToRichHtml(["Execution risk", "Hiring plan", "Runway actions"]), fontFamily: "Inter", fontSize: 18, imageUrl: createInlineSlideGraphic("Risks", "#0F3460", "#BCE6FF") },
      ],
    },
    "product-roadmap": {
      theme: "light",
      slides: [
        { title: "Product Roadmap", bodyHtml: linesToRichHtml(["Q1 foundations", "Q2 scale", "Q3 expansion"]), fontFamily: "Montserrat", fontSize: 18, imageUrl: createInlineSlideGraphic("Roadmap", "#1D4ED8", "#7EE0FF") },
        { title: "Milestones", bodyHtml: linesToRichHtml(["Launch dates", "Owners", "Dependencies"]), fontFamily: "Montserrat", fontSize: 18, imageUrl: createInlineSlideGraphic("Milestones", "#2563EB", "#C2EEFF") },
        { title: "Success Metrics", bodyHtml: linesToRichHtml(["Activation", "Adoption", "NPS"]), fontFamily: "Montserrat", fontSize: 18, imageUrl: createInlineSlideGraphic("Metrics", "#1E40AF", "#95E8FF") },
      ],
    },
    "market-analysis": {
      theme: "sunrise",
      slides: [
        { title: "Market Analysis", bodyHtml: linesToRichHtml(["TAM / SAM / SOM", "Segment priorities", "Buy signals"]), fontFamily: "Merriweather", fontSize: 18, imageUrl: createInlineSlideGraphic("Market", "#9A3412", "#FFD57A") },
        { title: "Competitor Map", bodyHtml: linesToRichHtml(["Legacy incumbents", "Emerging challengers", "Whitespace"]), fontFamily: "Merriweather", fontSize: 18, imageUrl: createInlineSlideGraphic("Competition", "#7C2D12", "#FFC47E") },
        { title: "Go-To-Market Focus", bodyHtml: linesToRichHtml(["ICP", "Channels", "90-day experiments"]), fontFamily: "Merriweather", fontSize: 18, imageUrl: createInlineSlideGraphic("GTM", "#B45309", "#FFE0AA") },
      ],
    },
  };

  const defaultSlidesDeck = [
    {
      id: createSlideId(),
      title: "Welcome",
      bodyHtml: "<p><strong>Quarterly operating review</strong></p><ul><li>Revenue up 28% year over year</li><li>Pipeline coverage at 3.4x target</li><li>Priority theme: calm execution at scale</li></ul>",
      theme: "light",
      fontFamily: "Inter",
      fontSize: 18,
      imageUrl: createInlineSlideGraphic("Welcome", "#1763FF", "#00D4FF"),
      imageWidth: 280,
      imageHeight: 158,
      imageX: 520,
      imageY: 88,
      imageAsBackground: false,
      textAlign: "left",
    },
    {
      id: createSlideId(),
      title: "Market Momentum",
      bodyHtml: "<p><strong>Demand quality improved across enterprise segments.</strong></p><ul><li>Mid-market inbound grew 31%</li><li>Expansion ARR doubled in EMEA</li><li>Competitive win rate reached 63%</li></ul>",
      theme: "ocean",
      fontFamily: "Inter",
      fontSize: 18,
      imageUrl: createInlineSlideGraphic("Momentum", "#0A5272", "#75EFFF"),
      imageWidth: 280,
      imageHeight: 158,
      imageX: 505,
      imageY: 96,
      imageAsBackground: false,
      textAlign: "left",
    },
    {
      id: createSlideId(),
      title: "Security Architecture",
      bodyHtml: "<p><strong>Platform hardening remained ahead of plan.</strong></p><ul><li>All production secrets rotated</li><li>Zero critical findings in latest review</li><li>Incident drills completed across all teams</li></ul>",
      theme: "dark",
      fontFamily: "IBM Plex Mono",
      fontSize: 17,
      imageUrl: createInlineSlideGraphic("Security", "#111827", "#3ED7FF"),
      imageWidth: 292,
      imageHeight: 164,
      imageX: 498,
      imageY: 92,
      imageAsBackground: false,
      textAlign: "left",
    },
    {
      id: createSlideId(),
      title: "90-Day Plan",
      bodyHtml: "<p><strong>Focus stays on disciplined rollout and measurable adoption.</strong></p><ul><li>Launch executive dashboard to 40 accounts</li><li>Complete workflow migration for two global teams</li><li>Protect NRR with proactive success motions</li></ul>",
      theme: "lagoon",
      fontFamily: "Space Grotesk",
      fontSize: 18,
      imageUrl: createInlineSlideGraphic("Plan", "#0B4D67", "#57E8D9"),
      imageWidth: 280,
      imageHeight: 158,
      imageX: 512,
      imageY: 96,
      imageAsBackground: false,
      textAlign: "left",
    },
  ];

  function createSlideId() {
    return `sl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function normalizeSlide(slide, idx) {
    const bodyHtml = normalizeRichBody(slide);
    const body = htmlToPlainText(bodyHtml) || String(slide?.body || "");
    return {
      id: String(slide?.id || createSlideId()),
      title: String(slide?.title || `Slide ${idx + 1}`),
      body,
      bodyHtml,
      theme: String(slide?.theme || "light"),
      fontFamily: String(slide?.fontFamily || "Space Grotesk"),
      fontSize: Math.max(14, Number(slide?.fontSize || 18)),
      imageUrl: String(slide?.imageUrl || ""),
      imageWidth: Number(slide?.imageWidth || 420),
      imageHeight: Number(slide?.imageHeight || 240),
      imageX: Number.isFinite(Number(slide?.imageX)) ? Number(slide?.imageX) : null,
      imageY: Number.isFinite(Number(slide?.imageY)) ? Number(slide?.imageY) : null,
      imageAsBackground: Boolean(slide?.imageAsBackground),
      textAlign: String(slide?.textAlign || "left"),
    };
  }

  let slides = Array.isArray(data.slidesDeck) && data.slidesDeck.length
    ? data.slidesDeck.map(normalizeSlide)
    : defaultSlidesDeck.map(normalizeSlide);
  let activeIndex = 0;
  let draggingSlideId = "";
  let notesBySlideId = (data.slidesNotesById && typeof data.slidesNotesById === "object") ? { ...data.slidesNotesById } : {};
  let commentsBySlideId = (data.slidesCommentsById && typeof data.slidesCommentsById === "object") ? { ...data.slidesCommentsById } : {};
  let versionHistory = Array.isArray(data.slidesVersionHistory) ? data.slidesVersionHistory.slice(0, 25) : [];
  let slideSearchQuery = "";
  let slideSortMode = "manual";
  let autosaveTimerId = null;
  let snapshotTimerId = null;

  function getCanvasBounds(active) {
    const canvasRect = canvasEl?.getBoundingClientRect();
    const width = Math.max(100, Number(canvasRect?.width || 0));
    const height = Math.max(100, Number(canvasRect?.height || 0));
    const imageWidth = Math.max(80, Number(active?.imageWidth || 420));
    const imageHeight = Math.max(80, Number(active?.imageHeight || 240));
    return {
      width,
      height,
      maxX: Math.max(0, width - imageWidth),
      maxY: Math.max(0, height - imageHeight),
      imageWidth,
      imageHeight,
    };
  }

  function clampImagePosition(active) {
    if (!active) {
      return;
    }
    const bounds = getCanvasBounds(active);
    const centeredX = bounds.maxX / 2;
    const centeredY = bounds.maxY / 2;
    const nextX = Number.isFinite(Number(active.imageX)) ? Number(active.imageX) : centeredX;
    const nextY = Number.isFinite(Number(active.imageY)) ? Number(active.imageY) : centeredY;
    active.imageX = Math.max(0, Math.min(nextX, bounds.maxX));
    active.imageY = Math.max(0, Math.min(nextY, bounds.maxY));
  }

  function hideSnapGuides() {
    if (snapGuideVEl) {
      snapGuideVEl.classList.add("hidden");
    }
    if (snapGuideHEl) {
      snapGuideHEl.classList.add("hidden");
    }
  }

  function showSnapGuide(guideEl, axis, pos) {
    if (!guideEl || !Number.isFinite(pos)) {
      return;
    }
    guideEl.classList.remove("hidden");
    if (axis === "x") {
      guideEl.style.left = `${Math.round(pos)}px`;
    } else {
      guideEl.style.top = `${Math.round(pos)}px`;
    }
  }

  function applySnap(value, points, threshold) {
    let snappedValue = value;
    let snappedIndex = -1;
    let minDistance = Infinity;
    points.forEach((p, idx) => {
      const distance = Math.abs(value - p);
      if (distance < minDistance) {
        minDistance = distance;
        snappedValue = p;
        snappedIndex = idx;
      }
    });
    if (minDistance <= threshold) {
      return { value: snappedValue, index: snappedIndex };
    }
    return { value, index: -1 };
  }

  function getActiveSlide() {
    return slides[activeIndex] || null;
  }

  function getFilteredSortedIndices() {
    let pairs = slides.map((s, idx) => ({ slide: s, idx }));
    if (slideSearchQuery) {
      const q = slideSearchQuery.toLowerCase();
      pairs = pairs.filter(({ slide }) => `${slide.title}\n${slide.body}\n${notesBySlideId[slide.id] || ""}`.toLowerCase().includes(q));
    }
    if (slideSortMode === "title") {
      pairs.sort((a, b) => String(a.slide.title || "").localeCompare(String(b.slide.title || "")));
    }
    if (slideSortMode === "title-desc") {
      pairs.sort((a, b) => String(b.slide.title || "").localeCompare(String(a.slide.title || "")));
    }
    return pairs.map((p) => p.idx);
  }

  function scoreReadability(text) {
    const raw = String(text || "").trim();
    if (!raw) return "-";
    const words = raw.split(/\s+/).filter(Boolean);
    const longWords = words.filter((w) => w.length >= 12).length;
    const avg = words.length ? words.join("").length / words.length : 0;
    if (avg <= 5.2 && longWords <= words.length * 0.05) return "Easy";
    if (avg <= 6.2 && longWords <= words.length * 0.12) return "Medium";
    return "Dense";
  }

  function renderInsights() {
    const text = slides.map((s) => `${s.title} ${s.body}`).join(" ").trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const talkMinutes = Math.max(1, Math.ceil(words / 130));
    if (insightCountEl) insightCountEl.textContent = String(slides.length);
    if (insightWordsEl) insightWordsEl.textContent = String(words);
    if (insightTalkEl) insightTalkEl.textContent = `${talkMinutes}m`;
    if (insightReadabilityEl) insightReadabilityEl.textContent = scoreReadability(text);
  }

  function renderVersionOptions() {
    if (!versionSelectEl) return;
    if (!versionHistory.length) {
      versionSelectEl.innerHTML = '<option value="">No saved versions yet</option>';
      return;
    }
    versionSelectEl.innerHTML = versionHistory
      .map((v, idx) => {
        const when = new Date(v.createdAt || Date.now()).toLocaleString();
        const count = Array.isArray(v.slidesDeck) ? v.slidesDeck.length : 0;
        return `<option value="${idx}">${when} · ${count} slides</option>`;
      })
      .join("");
  }

  function buildSlidesSnapshot() {
    return {
      createdAt: new Date().toISOString(),
      slidesDeck: slides.map((s) => ({ ...s })),
      slidesNotesById: { ...notesBySlideId },
      slidesCommentsById: { ...commentsBySlideId },
    };
  }

  function persistSlidesState({ createVersion = false, statusText = "", statusTone = "ok" } = {}) {
    syncActiveFromInputs({ skipAutosave: true });
    if (createVersion) {
      const snapshot = buildSlidesSnapshot();
      versionHistory = [snapshot, ...versionHistory].slice(0, 25);
    }

    forEnterpriseAccount(() => ({
      slidesDeck: slides,
      slidesNotesById: notesBySlideId,
      slidesCommentsById: commentsBySlideId,
      slidesVersionHistory: versionHistory,
    }));

    renderVersionOptions();
    if (statusText) {
      esSetStatus(statusEl, statusText, statusTone);
    }
  }

  function scheduleSlidesAutosave(delayMs = 700) {
    if (autosaveTimerId) {
      clearTimeout(autosaveTimerId);
    }
    autosaveTimerId = window.setTimeout(() => {
      persistSlidesState({ createVersion: false, statusText: "Autosaved.", statusTone: "muted" });
      autosaveTimerId = null;
    }, delayMs);
  }

  function startSlidesSnapshotTimer() {
    if (snapshotTimerId) {
      clearInterval(snapshotTimerId);
    }
    snapshotTimerId = window.setInterval(() => {
      persistSlidesState({ createVersion: true, statusText: "Checkpoint created.", statusTone: "muted" });
    }, 60 * 1000);
  }

  function stopSlidesSnapshotTimer() {
    if (snapshotTimerId) {
      clearInterval(snapshotTimerId);
      snapshotTimerId = null;
    }
  }

  function buildSlidesBackupPayload() {
    return {
      schema: "npa.slides.backup.v1",
      exportedAt: new Date().toISOString(),
      origin: window.location.origin,
      accountId: account.id,
      payload: {
        slidesDeck: slides.map((s) => ({ ...s })),
        slidesNotesById: { ...notesBySlideId },
        slidesCommentsById: { ...commentsBySlideId },
        slidesVersionHistory: versionHistory.map((entry) => ({ ...entry })),
      },
    };
  }

  function downloadBackupJson() {
    const blob = new Blob([JSON.stringify(buildSlidesBackupPayload(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
    a.href = url;
    a.download = `slides-backup-${account.id}-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function renderComments() {
    if (!commentsListEl) return;
    const active = getActiveSlide();
    if (!active) {
      commentsListEl.innerHTML = '<p class="muted">No comments on this slide.</p>';
      return;
    }
    const comments = Array.isArray(commentsBySlideId[active.id]) ? commentsBySlideId[active.id] : [];
    if (!comments.length) {
      commentsListEl.innerHTML = '<p class="muted">No comments on this slide.</p>';
      return;
    }
    commentsListEl.innerHTML = comments
      .map((c) => `<div class="slides-collab-activity-item"><strong>${c.author || "reviewer"}</strong><span>${c.text}</span><small>${new Date(c.createdAt).toLocaleTimeString()}</small></div>`)
      .join("");
  }

  function syncSidebarCount() {
    if (sidebarCountEl) {
      sidebarCountEl.textContent = String(slides.length);
    }
  }

  function getSlideBodyHtml(active) {
    const html = String(active?.bodyHtml || "").trim();
    if (html) {
      return html;
    }
    return linesToRichHtml(String(active?.body || "").split("\n"));
  }

  function getThumbPreviewHtml(active) {
    const scratch = document.createElement("div");
    scratch.innerHTML = getSlideBodyHtml(active);
    const firstList = scratch.querySelector("ul");
    if (firstList) {
      const items = Array.from(firstList.querySelectorAll("li"))
        .slice(0, 3)
        .map((item) => `<li>${item.textContent || ""}</li>`)
        .join("");
      return `<ul>${items}</ul>`;
    }
    const firstParagraph = Array.from(scratch.querySelectorAll("p, div"))
      .map((node) => String(node.textContent || "").trim())
      .find(Boolean);
    return `<p>${firstParagraph || active.body || ""}</p>`;
  }

  function syncBodyTextarea(active) {
    if (!bodyEl || !active) {
      return;
    }
    bodyEl.value = String(active.body || "");
  }

  function renderPreview(active) {
    if (!active) {
      return;
    }

    const slideBodyHtml = getSlideBodyHtml(active);
    if (canvasTitleEl) {
      canvasTitleEl.textContent = active.title || "Untitled";
    }
    if (canvasBodyEl) {
      canvasBodyEl.innerHTML = slideBodyHtml;
      canvasBodyEl.style.fontSize = `${Math.max(14, Number(active.fontSize || 18))}px`;
      canvasBodyEl.style.textAlign = active.textAlign || "left";
    }

    if (canvasEl) {
      canvasEl.className = `slide-canvas slide-theme-${active.theme || "light"}`;
      canvasEl.style.fontFamily = active.fontFamily || "Inter";
      canvasEl.style.backgroundImage = active.imageAsBackground && active.imageUrl
        ? `linear-gradient(rgba(8,12,22,0.26), rgba(8,12,22,0.26)), url(${active.imageUrl})`
        : "";
      canvasEl.style.backgroundSize = active.imageAsBackground && active.imageUrl ? "cover" : "";
      canvasEl.style.backgroundPosition = active.imageAsBackground && active.imageUrl ? "center" : "";
    }
  }

  function renderEditor() {
    const active = slides[activeIndex];
    if (!active) {
      return;
    }

    if (titleEl) {
      titleEl.value = active.title;
    }
    if (bodyEditorEl) {
      bodyEditorEl.innerHTML = getSlideBodyHtml(active);
      bodyEditorEl.style.fontFamily = active.fontFamily || "Inter";
      bodyEditorEl.style.fontSize = `${Math.max(14, Number(active.fontSize || 18))}px`;
      bodyEditorEl.style.textAlign = active.textAlign || "left";
    }
    syncBodyTextarea(active);
    if (themeEl) {
      themeEl.value = active.theme || "light";
    }
    if (fontEl) {
      fontEl.value = active.fontFamily || "Inter";
    }
    if (fontSizeEl) {
      fontSizeEl.value = String(Math.max(14, Number(active.fontSize || 18)));
    }
    if (imageUrlEl) {
      imageUrlEl.value = active.imageUrl || "";
    }
    if (imageAsBgEl) {
      imageAsBgEl.checked = Boolean(active.imageAsBackground);
    }
    if (notesEl) {
      notesEl.value = String(notesBySlideId[active.id] || "");
    }

    renderPreview(active);

    if (canvasImageEl && canvasImageWrapEl) {
      if (active.imageUrl && !active.imageAsBackground) {
        clampImagePosition(active);
        canvasImageEl.src = active.imageUrl;
        canvasImageEl.style.width = `${Math.max(80, Number(active.imageWidth || 420))}px`;
        canvasImageEl.style.height = `${Math.max(80, Number(active.imageHeight || 240))}px`;
        canvasImageWrapEl.style.left = `${Math.round(Number(active.imageX || 0))}px`;
        canvasImageWrapEl.style.top = `${Math.round(Number(active.imageY || 0))}px`;
        canvasImageWrapEl.classList.remove("hidden");
      } else {
        canvasImageEl.removeAttribute("src");
        canvasImageWrapEl.style.left = "";
        canvasImageWrapEl.style.top = "";
        canvasImageWrapEl.classList.add("hidden");
        hideSnapGuides();
      }
    }

    renderComments();
    renderInsights();
  }

  function renderThumbs() {
    const visible = getFilteredSortedIndices();
    syncSidebarCount();
    thumbsEl.innerHTML = visible.length
      ? visible.map((realIdx, drawIdx) => {
        const s = slides[realIdx];
        const activeClass = realIdx === activeIndex ? " slide-thumb-active" : "";
        const canDrag = !slideSearchQuery && slideSortMode === "manual";
        return `<button type="button" draggable="${canDrag ? "true" : "false"}" class="slide-thumb${activeClass}" data-slide-idx="${realIdx}" data-slide-id="${s.id}">
          <div class="slide-thumb-mini slide-theme-${s.theme || "light"}" style="font-family:${s.fontFamily || "Inter"};text-align:${s.textAlign || "left"};font-size:${Math.max(11, Math.round(Number(s.fontSize || 18) * 0.38))}px;${s.imageAsBackground && s.imageUrl ? `background-image:linear-gradient(rgba(8,12,22,0.18), rgba(8,12,22,0.18)), url(${s.imageUrl});background-size:cover;background-position:center;` : ""}">
            <div class="slide-thumb-mini-title">${s.title || "Untitled"}</div>
            <div class="slide-thumb-mini-body">${getThumbPreviewHtml(s)}</div>
          </div>
          <div class="slide-thumb-meta">
            <strong>${s.title || "Untitled"}</strong>
            <small>${drawIdx + 1}</small>
          </div>
        </button>`;
      }).join("")
      : '<p class="muted">No slides match this search.</p>';
  }

  function renderAll() {
    if (activeIndex < 0) {
      activeIndex = 0;
    }
    if (activeIndex >= slides.length) {
      activeIndex = Math.max(0, slides.length - 1);
    }
    renderThumbs();
    renderEditor();
    renderVersionOptions();
  }

  function ensurePresenterOverlay() {
    let overlayEl = document.getElementById("slidesPresenterOverlay");
    if (overlayEl) {
      return overlayEl;
    }

    overlayEl = document.createElement("section");
    overlayEl.id = "slidesPresenterOverlay";
    overlayEl.className = "slides-presenter-overlay hidden";
    overlayEl.innerHTML = `
      <div class="slides-presenter-backdrop" data-presenter-close="1"></div>
      <div class="slides-presenter-shell" role="dialog" aria-modal="true" aria-label="Slide presenter mode">
        <div class="slides-presenter-topbar">
          <button type="button" class="btn btn-secondary" id="slidesPresenterPlayBtn">Play</button>
          <span id="slidesPresenterCounter" class="slides-presenter-counter">Slide 1 / 1</span>
          <button type="button" class="btn btn-secondary" id="slidesPresenterCloseBtn">Close</button>
        </div>
        <div id="slidesPresenterHint" class="slides-presenter-hint">Press Play, then click anywhere on the slide to move next.</div>
        <article id="slidesPresenterStage" class="slides-presenter-stage" tabindex="0"></article>
      </div>
    `;

    document.body.appendChild(overlayEl);
    return overlayEl;
  }

  function renderPresenterSlide(stageEl, counterEl, hintEl, playBtnEl, presenterIndex, isPlaying) {
    if (!stageEl || !counterEl || !hintEl || !playBtnEl) {
      return;
    }

    const safeIndex = Math.max(0, Math.min(presenterIndex, slides.length - 1));
    const slide = slides[safeIndex] || slides[0];
    if (!slide) {
      stageEl.innerHTML = "<p>No slides to present.</p>";
      return;
    }

    const font = slide.fontFamily || "Inter";
    const hasInlineImage = Boolean(slide.imageUrl && !slide.imageAsBackground);
    const rawImageW = Math.max(80, Number(slide.imageWidth || 420));
    const rawImageH = Math.max(80, Number(slide.imageHeight || 240));
    const imageRatio = rawImageW / Math.max(1, rawImageH);
    const stageW = Math.max(640, Number(stageEl.clientWidth || 960));
    const stageH = Math.max(360, Number(stageEl.clientHeight || 540));

    const imageSlotW = hasInlineImage ? Math.max(280, Math.floor(stageW * 0.44)) : rawImageW;
    const imageSlotH = hasInlineImage ? Math.max(220, Math.floor(stageH * 0.78)) : rawImageH;

    let fitImageW = imageSlotW;
    let fitImageH = Math.round(fitImageW / Math.max(0.1, imageRatio));
    if (fitImageH > imageSlotH) {
      fitImageH = imageSlotH;
      fitImageW = Math.round(fitImageH * Math.max(0.1, imageRatio));
    }

    const bodyMarkup = getSlideBodyHtml(slide);

    stageEl.className = `slides-presenter-stage slide-theme-${slide.theme || "light"}${hasInlineImage ? " slides-presenter-stage-has-inline-image" : ""}`;
    stageEl.style.fontFamily = font;
    stageEl.style.backgroundImage = slide.imageAsBackground && slide.imageUrl
      ? `linear-gradient(rgba(8,12,22,0.24), rgba(8,12,22,0.24)), url(${slide.imageUrl})`
      : "";
    stageEl.style.backgroundSize = slide.imageAsBackground && slide.imageUrl ? "cover" : "";
    stageEl.style.backgroundPosition = slide.imageAsBackground && slide.imageUrl ? "center" : "";

    const inlineImageHtml = hasInlineImage
      ? `<div class="slides-presenter-image-wrap"><img src="${slide.imageUrl}" alt="Slide image" style="max-width:${Math.round(fitImageW)}px;max-height:${Math.round(fitImageH)}px;" /></div>`
      : "";

    stageEl.innerHTML = `
      <div class="slides-presenter-content" style="text-align:${slide.textAlign || "left"};font-size:${Math.max(14, Number(slide.fontSize || 18))}px;">
        <h2>${slide.title || "Untitled"}</h2>
        <div>${bodyMarkup}</div>
      </div>
      ${inlineImageHtml}
    `;

    counterEl.textContent = `Slide ${safeIndex + 1} / ${slides.length}`;
    hintEl.textContent = isPlaying
      ? "Playing: click anywhere on the slide to move next."
      : "Press Play, then click anywhere on the slide to move next.";
    playBtnEl.textContent = isPlaying ? "Playing" : "Play";
  }

  thumbsEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const button = target.closest("[data-slide-idx]");
    if (!button) {
      return;
    }
    const idx = Number(button.getAttribute("data-slide-idx"));
    if (!Number.isFinite(idx)) {
      return;
    }
    activeIndex = idx;
    renderAll();
  });

  thumbsEl.addEventListener("dragstart", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const thumb = target.closest(".slide-thumb");
    if (!thumb) {
      return;
    }
    if (slideSortMode !== "manual" || slideSearchQuery) {
      event.preventDefault();
      esSetStatus(statusEl, "Drag reordering is available only in manual order with search cleared.", "warn");
      return;
    }
    draggingSlideId = String(thumb.getAttribute("data-slide-id") || "");
    thumb.classList.add("slide-thumb-dragging");
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
    }
  });

  thumbsEl.addEventListener("dragend", () => {
    draggingSlideId = "";
    const thumbs = thumbsEl.querySelectorAll(".slide-thumb");
    thumbs.forEach((t) => t.classList.remove("slide-thumb-dragging", "slide-thumb-drop-before", "slide-thumb-drop-after"));
  });

  thumbsEl.addEventListener("dragover", (event) => {
    if (!draggingSlideId) {
      return;
    }
    event.preventDefault();
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const thumb = target.closest(".slide-thumb");
    const thumbs = thumbsEl.querySelectorAll(".slide-thumb");
    thumbs.forEach((t) => t.classList.remove("slide-thumb-drop-before", "slide-thumb-drop-after"));

    if (!thumb) {
      return;
    }

    const rect = thumb.getBoundingClientRect();
    const before = event.clientY < rect.top + rect.height / 2;
    thumb.classList.add(before ? "slide-thumb-drop-before" : "slide-thumb-drop-after");
  });

  thumbsEl.addEventListener("drop", (event) => {
    if (!draggingSlideId) {
      return;
    }
    event.preventDefault();

    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const thumb = target.closest(".slide-thumb");
    if (!thumb) {
      return;
    }

    const fromIndex = slides.findIndex((s) => s.id === draggingSlideId);
    const targetId = String(thumb.getAttribute("data-slide-id") || "");
    let toIndex = slides.findIndex((s) => s.id === targetId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
      return;
    }

    const rect = thumb.getBoundingClientRect();
    const before = event.clientY < rect.top + rect.height / 2;
    const [moved] = slides.splice(fromIndex, 1);
    if (!before && fromIndex < toIndex) {
      toIndex -= 1;
    }
    if (before && fromIndex < toIndex) {
      toIndex -= 1;
    }
    if (!before) {
      toIndex += 1;
    }
    toIndex = Math.max(0, Math.min(toIndex, slides.length));
    slides.splice(toIndex, 0, moved);

    activeIndex = slides.findIndex((s) => s.id === moved.id);
    renderAll();
    esSetStatus(statusEl, "Slide reordered.", "ok");
  });

  function syncActiveFromInputs(options = {}) {
    const active = slides[activeIndex];
    if (!active) {
      return;
    }
    const richHtml = bodyEditorEl ? String(bodyEditorEl.innerHTML || "").trim() : normalizeRichBody(active);
    active.title = String(titleEl?.value || "").trim() || `Slide ${activeIndex + 1}`;
    active.bodyHtml = richHtml || "<p></p>";
    active.body = htmlToPlainText(active.bodyHtml);
    active.theme = String(themeEl?.value || active.theme || "light");
    active.fontFamily = String(fontEl?.value || active.fontFamily || "Inter");
    active.fontSize = Math.max(14, Number(fontSizeEl?.value || active.fontSize || 18));
    active.imageUrl = String(imageUrlEl?.value || active.imageUrl || "").trim();
    active.imageAsBackground = Boolean(imageAsBgEl?.checked);
    active.textAlign = bodyEditorEl?.style.textAlign || active.textAlign || "left";
    notesBySlideId[active.id] = String(notesEl?.value || notesBySlideId[active.id] || "");
    if (bodyEditorEl) {
      bodyEditorEl.style.fontFamily = active.fontFamily;
      bodyEditorEl.style.fontSize = `${active.fontSize}px`;
      bodyEditorEl.style.textAlign = active.textAlign;
    }
    syncBodyTextarea(active);
    renderThumbs();
    renderPreview(active);
    renderComments();
    renderInsights();
    if (options.statusText) {
      esSetStatus(statusEl, options.statusText, options.statusTone || "ok");
    }
    if (!options.skipAutosave) {
      scheduleSlidesAutosave();
    }
  }

  function applyEditorCommand(command) {
    if (!bodyEditorEl || typeof document.execCommand !== "function") {
      return;
    }
    bodyEditorEl.focus();
    document.execCommand(command, false);
    if (command === "justifyLeft") {
      bodyEditorEl.style.textAlign = "left";
    }
    if (command === "justifyCenter") {
      bodyEditorEl.style.textAlign = "center";
    }
    if (command === "justifyRight") {
      bodyEditorEl.style.textAlign = "right";
    }
    syncActiveFromInputs();
  }

  titleEl?.addEventListener("input", () => syncActiveFromInputs());
  bodyEditorEl?.addEventListener("input", () => syncActiveFromInputs());
  bodyEl?.addEventListener("input", () => {
    const active = getActiveSlide();
    if (!active || !bodyEditorEl) {
      return;
    }
    bodyEditorEl.innerHTML = linesToRichHtml(String(bodyEl.value || "").split("\n"));
    syncActiveFromInputs();
  });
  themeEl?.addEventListener("change", () => syncActiveFromInputs());
  fontEl?.addEventListener("change", () => syncActiveFromInputs());
  fontSizeEl?.addEventListener("change", () => syncActiveFromInputs());
  imageAsBgEl?.addEventListener("change", () => syncActiveFromInputs());
  notesEl?.addEventListener("input", () => syncActiveFromInputs());
  document.querySelectorAll("[data-slide-format]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const command = btn.getAttribute("data-slide-format") || "";
      if (command) {
        applyEditorCommand(command);
      }
    });
  });
  searchEl?.addEventListener("input", () => {
    slideSearchQuery = String(searchEl.value || "").trim();
    renderThumbs();
  });
  sortEl?.addEventListener("change", () => {
    slideSortMode = String(sortEl.value || "manual");
    renderThumbs();
  });

  outlineBtn?.addEventListener("click", async () => {
    const outline = slides
      .map((s, idx) => {
        const bullets = String(s.body || "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => `  - ${line}`)
          .join("\n");
        return `${idx + 1}. ${s.title || "Untitled"}${bullets ? `\n${bullets}` : ""}`;
      })
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(outline);
      esSetStatus(statusEl, "Deck outline copied to clipboard.", "ok");
    } catch {
      esSetStatus(statusEl, "Could not copy outline in this browser context.", "warn");
    }
  });

  addCommentBtn?.addEventListener("click", () => {
    const active = getActiveSlide();
    const text = String(commentInputEl?.value || "").trim();
    if (!active || !text) {
      esSetStatus(statusEl, "Write a comment first.", "warn");
      return;
    }
    const prev = Array.isArray(commentsBySlideId[active.id]) ? commentsBySlideId[active.id] : [];
    commentsBySlideId[active.id] = [...prev, { text, author: account.id, createdAt: new Date().toISOString() }];
    if (commentInputEl) {
      commentInputEl.value = "";
    }
    renderComments();
    esSetStatus(statusEl, "Comment added.", "ok");
  });

  clearCommentsBtn?.addEventListener("click", () => {
    const active = getActiveSlide();
    if (!active) {
      return;
    }
    commentsBySlideId[active.id] = [];
    renderComments();
    esSetStatus(statusEl, "Comments cleared for this slide.", "ok");
  });

  restoreVersionBtn?.addEventListener("click", () => {
    const idx = Number(versionSelectEl?.value);
    if (!Number.isFinite(idx) || idx < 0 || idx >= versionHistory.length) {
      esSetStatus(statusEl, "Choose a saved version first.", "warn");
      return;
    }
    const snapshot = versionHistory[idx];
    slides = Array.isArray(snapshot.slidesDeck) && snapshot.slidesDeck.length
      ? snapshot.slidesDeck.map(normalizeSlide)
      : slides;
    notesBySlideId = snapshot.slidesNotesById && typeof snapshot.slidesNotesById === "object" ? { ...snapshot.slidesNotesById } : {};
    commentsBySlideId = snapshot.slidesCommentsById && typeof snapshot.slidesCommentsById === "object" ? { ...snapshot.slidesCommentsById } : {};
    activeIndex = 0;
    renderAll();
    persistSlidesState({ createVersion: true, statusText: "Version restored.", statusTone: "ok" });
  });

  shortcutsBtn?.addEventListener("click", () => {
    const msg = [
      "Slides shortcuts:",
      "- Ctrl/Cmd + S: Save deck",
      "- Ctrl/Cmd + D: Duplicate slide",
      "- Ctrl/Cmd + Enter: Present",
      "- Arrow keys: Move through presenter",
      "- Esc: Exit presenter",
    ].join("\n");
    window.alert(msg);
  });

  window.addEventListener("keydown", (event) => {
    if (!(event.ctrlKey || event.metaKey)) {
      return;
    }
    const key = event.key.toLowerCase();
    if (key === "s") {
      event.preventDefault();
      saveBtn?.click();
    }
    if (key === "d") {
      event.preventDefault();
      duplicateBtn?.click();
    }
    if (key === "enter") {
      event.preventDefault();
      presentBtn?.click();
    }
  });

  presentHeaderBtn?.addEventListener("click", () => {
    presentBtn?.click();
  });

  imageResolveBtn?.addEventListener("click", async () => {
    const raw = String(imageUrlEl?.value || "").trim();
    if (!raw) {
      esSetStatus(statusEl, "Enter a URL to resolve.", "warn");
      return;
    }

    const resolved = await resolveImagePageUrl(raw);
    if (!resolved.ok || !resolved.url) {
      esSetStatus(statusEl, resolved.reason || "Could not resolve URL.", "warn");
      return;
    }

    if (imageUrlEl) {
      imageUrlEl.value = resolved.url;
    }
    syncActiveFromInputs();
    esSetStatus(statusEl, "Resolved to a direct image URL.", "ok");
  });

  imageUploadBtn?.addEventListener("click", () => {
    imageFileEl?.click();
  });

  imageFileEl?.addEventListener("change", () => {
    const file = imageFileEl.files?.[0];
    if (!file) {
      return;
    }

    if (!String(file.type || "").startsWith("image/")) {
      esSetStatus(statusEl, "Upload a valid image file.", "warn");
      imageFileEl.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      esSetStatus(statusEl, "Image must be 10MB or smaller.", "warn");
      imageFileEl.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      if (!dataUrl.startsWith("data:image/")) {
        esSetStatus(statusEl, "Could not read uploaded image.", "warn");
        imageFileEl.value = "";
        return;
      }

      if (imageUrlEl) {
        imageUrlEl.value = dataUrl;
      }
      syncActiveFromInputs();
      renderAll();
      esSetStatus(statusEl, `Image uploaded: ${file.name}`, "ok");
      imageFileEl.value = "";
    };

    reader.onerror = () => {
      esSetStatus(statusEl, "Failed to read image file.", "warn");
      imageFileEl.value = "";
    };

    reader.readAsDataURL(file);
  });

  imageApplyBtn?.addEventListener("click", async () => {
    const raw = String(imageUrlEl?.value || "").trim();
    let candidateUrl = raw;
    if (!looksLikeDirectImageUrl(candidateUrl)) {
      const resolved = await resolveImagePageUrl(candidateUrl);
      if (!resolved.ok || !resolved.url) {
        esSetStatus(statusEl, resolved.reason || "Use a direct image URL.", "warn");
        return;
      }
      candidateUrl = resolved.url;
      if (imageUrlEl) {
        imageUrlEl.value = candidateUrl;
      }
    }

    if (!candidateUrl) {
      esSetStatus(statusEl, "Enter an image URL first.", "warn");
      return;
    }

    const check = await verifyImageUrl(candidateUrl);
    if (!check.ok) {
      esSetStatus(statusEl, check.reason || "Image URL is invalid.", "warn");
      return;
    }

    const active = slides[activeIndex];
    if (!active) {
      return;
    }

    active.imageUrl = candidateUrl;
    active.imageAsBackground = Boolean(imageAsBgEl?.checked);
    syncActiveFromInputs();

    renderAll();
    esSetStatus(statusEl, "Image linked to this slide.", "ok");
  });

  imageClearBtn?.addEventListener("click", () => {
    const active = slides[activeIndex];
    if (!active) {
      return;
    }
    active.imageUrl = "";
    active.imageAsBackground = false;
    if (imageUrlEl) {
      imageUrlEl.value = "";
    }
    if (imageAsBgEl) {
      imageAsBgEl.checked = false;
    }
    if (imageFileEl) {
      imageFileEl.value = "";
    }
    renderAll();
    esSetStatus(statusEl, "Slide image cleared.", "ok");
  });

  canvasResizeHandleEl?.addEventListener("pointerdown", (event) => {
    const active = slides[activeIndex];
    if (!active || !active.imageUrl || active.imageAsBackground) {
      return;
    }

    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startW = Math.max(80, Number(active.imageWidth || 420));
    const startH = Math.max(80, Number(active.imageHeight || 240));

    const onMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      active.imageWidth = Math.max(80, startW + dx);
      active.imageHeight = Math.max(80, startH + dy);
      clampImagePosition(active);
      renderEditor();
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      esSetStatus(statusEl, "Image resized by drag.", "ok");
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });

  canvasImageWrapEl?.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (target.closest("#slideCanvasResizeHandle")) {
      return;
    }

    const active = slides[activeIndex];
    if (!active || !active.imageUrl || active.imageAsBackground || !canvasEl || !canvasImageWrapEl) {
      return;
    }

    clampImagePosition(active);
    event.preventDefault();
    canvasImageWrapEl.setPointerCapture?.(event.pointerId);
    canvasImageWrapEl.classList.add("slide-canvas-image-wrap-dragging");

    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = Number(active.imageX || 0);
    const startTop = Number(active.imageY || 0);

    const onMove = (moveEvent) => {
      const bounds = getCanvasBounds(active);
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let nextLeft = Math.max(0, Math.min(startLeft + dx, bounds.maxX));
      let nextTop = Math.max(0, Math.min(startTop + dy, bounds.maxY));

      const snapThreshold = 18;
      const xPoints = [0, bounds.maxX / 2, bounds.maxX];
      const yPoints = [0, bounds.maxY / 2, bounds.maxY];
      const xSnap = applySnap(nextLeft, xPoints, snapThreshold);
      const ySnap = applySnap(nextTop, yPoints, snapThreshold);
      nextLeft = xSnap.value;
      nextTop = ySnap.value;

      active.imageX = nextLeft;
      active.imageY = nextTop;
      canvasImageWrapEl.style.left = `${Math.round(nextLeft)}px`;
      canvasImageWrapEl.style.top = `${Math.round(nextTop)}px`;

      if (xSnap.index >= 0 && snapGuideVEl) {
        const guideX = xSnap.index === 0
          ? 0
          : xSnap.index === 1
            ? bounds.width / 2
            : bounds.width;
        showSnapGuide(snapGuideVEl, "x", guideX);
      } else if (snapGuideVEl) {
        snapGuideVEl.classList.add("hidden");
      }

      if (ySnap.index >= 0 && snapGuideHEl) {
        const guideY = ySnap.index === 0
          ? 0
          : ySnap.index === 1
            ? bounds.height / 2
            : bounds.height;
        showSnapGuide(snapGuideHEl, "y", guideY);
      } else if (snapGuideHEl) {
        snapGuideHEl.classList.add("hidden");
      }
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      canvasImageWrapEl.classList.remove("slide-canvas-image-wrap-dragging");
      hideSnapGuides();
      esSetStatus(statusEl, "Image moved with snap assist.", "ok");
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });

  canvasImageEl?.addEventListener("error", () => {
    esSetStatus(statusEl, "Visual failed to display. Use a direct image file URL, not a web article link.", "warn");
  });

  applyTemplateBtn?.addEventListener("click", () => {
    const key = String(templateEl?.value || "");
    if (!key || !templateLibrary[key]) {
      esSetStatus(statusEl, "Choose a free template first.", "warn");
      return;
    }

    const chosen = templateLibrary[key];
    slides = chosen.slides.map((slide, idx) => normalizeSlide({ ...slide, theme: chosen.theme }, idx));
    activeIndex = 0;
    if (themeEl) {
      themeEl.value = chosen.theme;
    }
    renderAll();
    esSetStatus(statusEl, "Template applied.", "ok");
  });

  addBtn?.addEventListener("click", () => {
    const active = slides[activeIndex] || { theme: "light" };
    const next = {
      id: createSlideId(),
      title: `Slide ${slides.length + 1}`,
      body: "Key point one Key point two",
      bodyHtml: "<ul><li>Key point one</li><li>Key point two</li></ul>",
      theme: active.theme || "light",
      fontFamily: active.fontFamily || "Inter",
      fontSize: Number(active.fontSize || 18),
      imageUrl: "",
      imageWidth: 420,
      imageHeight: 240,
      imageX: null,
      imageY: null,
      imageAsBackground: false,
      textAlign: active.textAlign || "left",
    };
    slides.splice(activeIndex + 1, 0, next);
    activeIndex += 1;
    renderAll();
    esSetStatus(statusEl, "New slide added.", "ok");
  });

  duplicateBtn?.addEventListener("click", () => {
    const active = slides[activeIndex];
    if (!active) {
      return;
    }
    const clonedId = createSlideId();
    slides.splice(activeIndex + 1, 0, { ...active, id: clonedId, title: `${active.title} (Copy)` });
    if (notesBySlideId[active.id]) {
      notesBySlideId[clonedId] = notesBySlideId[active.id];
    }
    if (commentsBySlideId[active.id]) {
      commentsBySlideId[clonedId] = [...commentsBySlideId[active.id]];
    }
    activeIndex += 1;
    renderAll();
    esSetStatus(statusEl, "Slide duplicated.", "ok");
  });

  deleteBtn?.addEventListener("click", () => {
    if (slides.length <= 1) {
      esSetStatus(statusEl, "Deck needs at least one slide.", "warn");
      return;
    }
    const removed = slides[activeIndex];
    slides.splice(activeIndex, 1);
    if (removed?.id) {
      delete notesBySlideId[removed.id];
      delete commentsBySlideId[removed.id];
    }
    if (activeIndex >= slides.length) {
      activeIndex = slides.length - 1;
    }
    renderAll();
    esSetStatus(statusEl, "Slide deleted.", "ok");
  });

  saveBtn?.addEventListener("click", () => {
    persistSlidesState({ createVersion: true, statusText: "Deck saved.", statusTone: "ok" });
  });

  exportBtn?.addEventListener("click", () => {
    try {
      syncActiveFromInputs({ skipAutosave: true });
      downloadBackupJson();
      esSetStatus(statusEl, "Backup exported.", "ok");
    } catch {
      esSetStatus(statusEl, "Could not export backup file.", "warn");
    }
  });

  importBtn?.addEventListener("click", () => {
    importFileEl?.click();
  });

  importFileEl?.addEventListener("change", async () => {
    const file = importFileEl.files?.[0];
    if (!file) {
      return;
    }

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw);
      const payload = parsed && parsed.payload && typeof parsed.payload === "object" ? parsed.payload : null;
      const importedDeck = payload && Array.isArray(payload.slidesDeck) ? payload.slidesDeck : null;

      if (!payload || !importedDeck || !importedDeck.length) {
        esSetStatus(statusEl, "Invalid backup file.", "warn");
        return;
      }

      slides = importedDeck.map((slide, idx) => normalizeSlide(slide, idx));
      notesBySlideId = payload.slidesNotesById && typeof payload.slidesNotesById === "object" ? { ...payload.slidesNotesById } : {};
      commentsBySlideId = payload.slidesCommentsById && typeof payload.slidesCommentsById === "object" ? { ...payload.slidesCommentsById } : {};
      versionHistory = Array.isArray(payload.slidesVersionHistory) ? payload.slidesVersionHistory.slice(0, 25) : [];
      activeIndex = 0;

      renderAll();
      persistSlidesState({ createVersion: true, statusText: "Backup imported.", statusTone: "ok" });
    } catch {
      esSetStatus(statusEl, "Could not read backup JSON.", "warn");
    } finally {
      importFileEl.value = "";
    }
  });

  presentBtn?.addEventListener("click", () => {
    syncActiveFromInputs();
    if (!slides.length) {
      esSetStatus(statusEl, "Add at least one slide before presenting.", "warn");
      return;
    }

    const overlayEl = ensurePresenterOverlay();
    const stageEl = overlayEl.querySelector("#slidesPresenterStage");
    const counterEl = overlayEl.querySelector("#slidesPresenterCounter");
    const hintEl = overlayEl.querySelector("#slidesPresenterHint");
    const playBtnEl = overlayEl.querySelector("#slidesPresenterPlayBtn");
    const closeBtnEl = overlayEl.querySelector("#slidesPresenterCloseBtn");
    const backdropEl = overlayEl.querySelector("[data-presenter-close='1']");

    if (!(stageEl instanceof HTMLElement) || !(counterEl instanceof HTMLElement) || !(hintEl instanceof HTMLElement) || !(playBtnEl instanceof HTMLButtonElement) || !(closeBtnEl instanceof HTMLButtonElement) || !(backdropEl instanceof HTMLElement)) {
      esSetStatus(statusEl, "Could not start presenter mode.", "warn");
      return;
    }

    let presenterIndex = activeIndex;
    let isPlaying = false;
    let timerId = null;
    let startedAt = null;

    const ensureTimerNode = () => {
      let timerEl = overlayEl.querySelector("#slidesPresenterTimer");
      if (!timerEl) {
        timerEl = document.createElement("span");
        timerEl.id = "slidesPresenterTimer";
        timerEl.className = "slides-presenter-counter";
        counterEl.insertAdjacentElement("afterend", timerEl);
      }
      return timerEl;
    };

    const formatElapsed = (ms) => {
      const s = Math.max(0, Math.floor(ms / 1000));
      const mm = String(Math.floor(s / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      return `${mm}:${ss}`;
    };

    const startTimer = () => {
      const timerEl = ensureTimerNode();
      startedAt = Date.now();
      timerEl.textContent = `Elapsed ${formatElapsed(0)}`;
      if (timerId) {
        clearInterval(timerId);
      }
      timerId = window.setInterval(() => {
        timerEl.textContent = `Elapsed ${formatElapsed(Date.now() - startedAt)}`;
      }, 500);
    };

    const stopTimer = () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    };

    const closePresenter = () => {
      overlayEl.classList.add("hidden");
      overlayEl.classList.remove("slides-presenter-overlay-open");
      document.body.classList.remove("presenter-open");
      stageEl.removeEventListener("click", onStageClick);
      playBtnEl.removeEventListener("click", onPlayClick);
      closeBtnEl.removeEventListener("click", closePresenter);
      backdropEl.removeEventListener("click", closePresenter);
      window.removeEventListener("keydown", onKeyDown);
      stopTimer();
      esSetStatus(statusEl, "Presenter closed.", "ok");
    };

    const onStageClick = () => {
      if (!isPlaying) {
        return;
      }
      if (presenterIndex < slides.length - 1) {
        presenterIndex += 1;
        renderPresenterSlide(stageEl, counterEl, hintEl, playBtnEl, presenterIndex, isPlaying);
      } else {
        isPlaying = false;
        renderPresenterSlide(stageEl, counterEl, hintEl, playBtnEl, presenterIndex, isPlaying);
        hintEl.textContent = "End of deck. Click Play to restart from slide 1.";
      }
    };

    const onPlayClick = () => {
      if (presenterIndex >= slides.length - 1) {
        presenterIndex = 0;
      }
      isPlaying = true;
      startTimer();
      renderPresenterSlide(stageEl, counterEl, hintEl, playBtnEl, presenterIndex, isPlaying);
      stageEl.focus();
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closePresenter();
      }
      if ((event.key === "ArrowRight" || event.key === " ") && isPlaying) {
        event.preventDefault();
        onStageClick();
      }
      if (event.key === "ArrowLeft") {
        presenterIndex = Math.max(0, presenterIndex - 1);
        renderPresenterSlide(stageEl, counterEl, hintEl, playBtnEl, presenterIndex, isPlaying);
      }
    };

    overlayEl.classList.remove("hidden");
    overlayEl.classList.add("slides-presenter-overlay-open");
    document.body.classList.add("presenter-open");
    renderPresenterSlide(stageEl, counterEl, hintEl, playBtnEl, presenterIndex, isPlaying);

    stageEl.addEventListener("click", onStageClick);
    playBtnEl.addEventListener("click", onPlayClick);
    closeBtnEl.addEventListener("click", closePresenter);
    backdropEl.addEventListener("click", closePresenter);
    window.addEventListener("keydown", onKeyDown);
    stageEl.focus();
    esSetStatus(statusEl, "Presenter opened. Press Play to start.", "ok");
  });

  startSlidesSnapshotTimer();

  window.addEventListener("beforeunload", () => {
    if (autosaveTimerId) {
      clearTimeout(autosaveTimerId);
      autosaveTimerId = null;
    }
    persistSlidesState({ createVersion: false });
    stopSlidesSnapshotTimer();
  });

  renderAll();
  persistSlidesState({ createVersion: false, statusText: "Recovery autosave active.", statusTone: "muted" });
}

function initProjectsTool(account, data) {
  const boardEl = document.getElementById("projectBoard");
  if (!boardEl) {
    return;
  }

  const titleEl = document.getElementById("taskTitle");
  const dueEl = document.getElementById("taskDue");
  const ownerEl = document.getElementById("taskOwner");
  const addBtn = document.getElementById("taskAddBtn");
  const saveBtn = document.getElementById("projectsSaveBtn");
  const syncBtn = document.getElementById("projectsSyncCalendarBtn");
  const ganttEl = document.getElementById("ganttRows");
  const statusEl = document.getElementById("projectsStatus");

  const tasks = Array.isArray(data.projectsTasks) ? data.projectsTasks : [];

  function render() {
    const cols = ["todo", "doing", "done"];
    boardEl.innerHTML = cols
      .map((c) => {
        const items = tasks.filter((t) => t.status === c);
        const title = c === "todo" ? "To Do" : c === "doing" ? "Doing" : "Done";
        return `<section class="suite-column"><h3>${title}</h3>${items.map((t) => `<div class="suite-chip">${t.title} <small>${t.owner || "unassigned"} | ${t.due || "no due"}</small></div>`).join("") || '<p class="muted">No tasks</p>'}</section>`;
      })
      .join("");

    if (ganttEl) {
      ganttEl.innerHTML = tasks
        .map((t) => `<tr><td>${t.title}</td><td>${t.owner || "-"}</td><td>${t.status}</td><td>${t.due || "-"}</td></tr>`)
        .join("") || '<tr><td colspan="4" class="muted">No tasks yet.</td></tr>';
    }
  }

  render();

  addBtn?.addEventListener("click", () => {
    const title = String(titleEl?.value || "").trim();
    if (!title) {
      esSetStatus(statusEl, "Task title required.", "warn");
      return;
    }

    tasks.push({
      id: `tsk_${Date.now()}`,
      title,
      owner: String(ownerEl?.value || "").trim(),
      due: String(dueEl?.value || "").trim(),
      status: "todo",
    });
    if (titleEl) titleEl.value = "";
    render();
    esSetStatus(statusEl, "Task added to To Do.", "ok");
  });

  saveBtn?.addEventListener("click", () => {
    forEnterpriseAccount(() => ({ projectsTasks: tasks }));
    esSetStatus(statusEl, "Project board saved.", "ok");
  });

  syncBtn?.addEventListener("click", () => {
    const tools = esLoadJson(ES_KEYS.tools, {});
    const prev = tools[account.id] || {};
    const calendar = Array.isArray(prev.calendar) ? prev.calendar.slice() : [];
    tasks.forEach((t) => {
      if (!t.due) return;
      calendar.push({ when: t.due, title: `[Project] ${t.title}` });
    });
    tools[account.id] = { ...prev, calendar, updatedAt: new Date().toISOString() };
    esSaveJson(ES_KEYS.tools, tools);
    esSetStatus(statusEl, "Task due dates synced into Calendar.", "ok");
  });
}

function initChatTool(account, data) {
  const feedEl = document.getElementById("chatFeed");
  if (!feedEl) {
    return;
  }

  const channelEl = document.getElementById("chatChannel");
  const inputEl = document.getElementById("chatInput");
  const linkEl = document.getElementById("chatToolLink");
  const sendBtn = document.getElementById("chatSendBtn");
  const statusEl = document.getElementById("chatStatus");

  const messages = Array.isArray(data.chatMessages) ? data.chatMessages : [];

  function render() {
    const channel = channelEl?.value || "general";
    const list = messages.filter((m) => m.channel === channel);
    feedEl.innerHTML = list
      .map((m) => `<div class="suite-chat-line"><strong>${m.author}</strong> <span class="muted">#${m.channel}</span> ${m.text}${m.toolLink ? ` <a href="${m.toolLink}">open</a>` : ""}</div>`)
      .join("") || '<p class="muted">No messages in this channel.</p>';
  }

  render();
  channelEl?.addEventListener("change", render);

  sendBtn?.addEventListener("click", () => {
    const text = String(inputEl?.value || "").trim();
    if (!text) {
      esSetStatus(statusEl, "Message cannot be empty.", "warn");
      return;
    }
    const msg = {
      id: `chat_${Date.now()}`,
      channel: channelEl?.value || "general",
      author: account.id,
      text,
      toolLink: String(linkEl?.value || "").trim(),
      createdAt: new Date().toISOString(),
    };
    messages.push(msg);
    if (inputEl) inputEl.value = "";
    render();
    forEnterpriseAccount(() => ({ chatMessages: messages }));
    esSetStatus(statusEl, "Message sent.", "ok");
  });
}

function initAiAssistantTool(account, data) {
  const outEl = document.getElementById("aiOutput");
  if (!outEl) {
    return;
  }

  const promptEl = document.getElementById("aiPrompt");
  const runBtn = document.getElementById("aiRunBtn");
  const statusEl = document.getElementById("aiStatus");

  runBtn?.addEventListener("click", () => {
    const prompt = String(promptEl?.value || "").trim().toLowerCase();
    if (!prompt) {
      esSetStatus(statusEl, "Enter a prompt.", "warn");
      return;
    }

    const tools = esLoadJson(ES_KEYS.tools, {});
    const suite = getEnterpriseState()[account.id] || {};
    const notes = String(tools[account.id]?.notes || "");
    const tasks = Array.isArray(suite.projectsTasks) ? suite.projectsTasks : [];
    const events = Array.isArray(tools[account.id]?.calendar) ? tools[account.id].calendar : [];

    if (prompt.includes("summarize") && notes) {
      outEl.textContent = `Summary: ${notes.split(/\s+/).slice(0, 30).join(" ")}...`;
    } else if (prompt.includes("calendar") || prompt.includes("conflict")) {
      const byWhen = {};
      events.forEach((e) => {
        const key = e.when;
        byWhen[key] = (byWhen[key] || 0) + 1;
      });
      const conflicts = Object.entries(byWhen).filter(([, c]) => c > 1);
      outEl.textContent = conflicts.length
        ? `Conflicts found:\n${conflicts.map(([k, c]) => `${k} (${c} events)`).join("\n")}`
        : "No calendar conflicts detected.";
    } else if (prompt.includes("task") || prompt.includes("project")) {
      outEl.textContent = `Project snapshot: ${tasks.length} tasks, ${tasks.filter((t) => t.status === "done").length} completed.`;
    } else {
      outEl.textContent = "AI quick action: I can summarize notes, inspect calendar conflicts, or summarize tasks.";
    }

    forEnterpriseAccount((current) => ({
      aiLog: [
        ...(Array.isArray(current.aiLog) ? current.aiLog : []),
        { prompt, output: outEl.textContent, at: new Date().toISOString() },
      ].slice(-40),
    }));
    esSetStatus(statusEl, "Response generated.", "ok");
  });
}

function initDriveTool(account, data) {
  const listEl = document.getElementById("vaultList");
  if (!listEl) {
    return;
  }

  const fileEl = document.getElementById("vaultFile");
  const scopeEl = document.getElementById("vaultScope");
  const addBtn = document.getElementById("vaultAddBtn");
  const searchEl = document.getElementById("vaultSearch");
  const statusEl = document.getElementById("vaultStatus");

  const files = Array.isArray(data.vaultFiles) ? data.vaultFiles : [];

  function render() {
    const q = String(searchEl?.value || "").trim().toLowerCase();
    const filtered = q ? files.filter((f) => f.name.toLowerCase().includes(q) || f.scope.toLowerCase().includes(q)) : files;
    listEl.innerHTML = filtered
      .map((f) => `<div class="suite-chip"><strong>${f.name}</strong> v${f.version} | ${f.scope} | ${Math.ceil(f.size / 1024)}KB</div>`)
      .join("") || '<p class="muted">No files in vault.</p>';
  }

  render();
  searchEl?.addEventListener("input", render);

  addBtn?.addEventListener("click", () => {
    const file = fileEl?.files?.[0];
    if (!file) {
      esSetStatus(statusEl, "Select a file first.", "warn");
      return;
    }
    const existing = files.find((f) => f.name === file.name);
    files.push({
      id: `vault_${Date.now()}`,
      name: file.name,
      size: file.size,
      scope: scopeEl?.value || "private",
      version: existing ? existing.version + 1 : 1,
      uploadedAt: new Date().toISOString(),
    });
    if (fileEl) fileEl.value = "";
    render();
    forEnterpriseAccount(() => ({ vaultFiles: files }));
    esSetStatus(statusEl, "File metadata saved to vault.", "ok");
  });
}

function initFormsTool(account, data) {
  const qListEl = document.getElementById("formsQuestions");
  if (!qListEl) {
    return;
  }

  const qInputEl = document.getElementById("formsQuestionInput");
  const addQBtn = document.getElementById("formsAddQuestionBtn");
  const publishBtn = document.getElementById("formsPublishBtn");
  const responseEl = document.getElementById("formsResponseInput");
  const submitBtn = document.getElementById("formsSubmitResponseBtn");
  const statusEl = document.getElementById("formsStatus");
  const responsesEl = document.getElementById("formsResponses");

  const questions = Array.isArray(data.formsQuestions) ? data.formsQuestions : [];
  const responses = Array.isArray(data.formsResponses) ? data.formsResponses : [];

  function render() {
    qListEl.innerHTML = questions.map((q, idx) => `<li>${idx + 1}. ${q}</li>`).join("") || "<li class='muted'>No questions yet.</li>";
    responsesEl.innerHTML = responses
      .map((r) => `<tr><td>${r.when}</td><td>${r.answer}</td></tr>`)
      .join("") || '<tr><td colspan="2" class="muted">No responses.</td></tr>';
  }

  render();

  addQBtn?.addEventListener("click", () => {
    const q = String(qInputEl?.value || "").trim();
    if (!q) {
      esSetStatus(statusEl, "Question cannot be empty.", "warn");
      return;
    }
    questions.push(q);
    if (qInputEl) qInputEl.value = "";
    render();
    esSetStatus(statusEl, "Question added.", "ok");
  });

  publishBtn?.addEventListener("click", () => {
    forEnterpriseAccount(() => ({ formsQuestions: questions, formsResponses: responses }));
    esSetStatus(statusEl, "Form published internally.", "ok");
  });

  submitBtn?.addEventListener("click", () => {
    const ans = String(responseEl?.value || "").trim();
    if (!ans) {
      esSetStatus(statusEl, "Response cannot be empty.", "warn");
      return;
    }
    responses.push({ when: new Date().toLocaleString(), answer: ans });
    if (responseEl) responseEl.value = "";
    render();
    forEnterpriseAccount(() => ({ formsQuestions: questions, formsResponses: responses }));
    esSetStatus(statusEl, "Response captured.", "ok");
  });
}

function initWhiteboardTool(account, data) {
  const canvas = document.getElementById("whiteboardCanvas");
  if (!canvas) {
    return;
  }

  const addStickyBtn = document.getElementById("whiteboardAddStickyBtn");
  const penBtn = document.getElementById("whiteboardPenBtn");
  const eraserBtn = document.getElementById("whiteboardEraserBtn");
  const undoBtn = document.getElementById("whiteboardUndoBtn");
  const brushSizeEl = document.getElementById("whiteboardBrushSize");
  const paletteEl = document.getElementById("whiteboardColorPalette");
  const stickyWrap = document.getElementById("whiteboardStickies");
  const clearBtn = document.getElementById("whiteboardClearBtn");
  const saveBtn = document.getElementById("whiteboardSaveBtn");
  const statusEl = document.getElementById("whiteboardStatus");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  let drawing = false;
  let mode = "pen";
  let inkColor = "#7c9cff";
  let brushSize = Math.max(1, Number(brushSizeEl?.value || 3));

  const points = Array.isArray(data.whiteboardPoints)
    ? data.whiteboardPoints.map((p) => ({
      x: Number(p?.x || 0),
      y: Number(p?.y || 0),
      break: Boolean(p?.break),
      color: String(p?.color || "#7c9cff"),
      width: Math.max(1, Number(p?.width || 2)),
      mode: String(p?.mode || "pen"),
    }))
    : [];

  const stickies = Array.isArray(data.whiteboardStickies)
    ? data.whiteboardStickies.map((s, idx) => {
      if (typeof s === "string") {
        return { id: `st_${Date.now().toString(36)}_${idx}`, text: s };
      }
      return {
        id: String(s?.id || `st_${Date.now().toString(36)}_${idx}`),
        text: String(s?.text || ""),
      };
    })
    : [];

  function syncToolStateUI() {
    penBtn?.classList.toggle("mailbox-btn-active", mode === "pen");
    eraserBtn?.classList.toggle("mailbox-btn-active", mode === "eraser");

    if (!paletteEl) {
      return;
    }

    const colorDots = paletteEl.querySelectorAll("[data-ink-color]");
    colorDots.forEach((dot) => {
      const dotColor = String(dot.getAttribute("data-ink-color") || "").toLowerCase();
      dot.classList.toggle("whiteboard-color-active", dotColor === inkColor.toLowerCase());
    });
  }

  function pointerToCanvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / Math.max(1, rect.width);
    const scaleY = canvas.height / Math.max(1, rect.height);
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 1; i < points.length; i += 1) {
      const a = points[i - 1];
      const b = points[i];
      if (b.break) {
        continue;
      }

      ctx.strokeStyle = b.mode === "eraser" ? "#0f1728" : b.color;
      ctx.lineWidth = b.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    if (stickyWrap) {
      stickyWrap.innerHTML = stickies
        .map((s) => {
          const safeText = String(s.text || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
          return `<article class="whiteboard-sticky" data-sticky-id="${s.id}"><button type="button" class="whiteboard-sticky-remove" data-sticky-remove="${s.id}" aria-label="Remove sticky">&times;</button><textarea data-sticky-text="${s.id}" placeholder="Write a note...">${safeText}</textarea></article>`;
        })
        .join("");
    }
  }

  redraw();
  syncToolStateUI();

  canvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    const point = pointerToCanvasPoint(e);
    points.push({
      x: point.x,
      y: point.y,
      break: true,
      color: inkColor,
      width: brushSize,
      mode,
    });
    canvas.setPointerCapture?.(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    const point = pointerToCanvasPoint(e);
    points.push({
      x: point.x,
      y: point.y,
      color: inkColor,
      width: brushSize,
      mode,
    });
    redraw();
  });
  window.addEventListener("pointerup", () => {
    drawing = false;
  });

  paletteEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const dot = target.closest("[data-ink-color]");
    if (!dot) {
      return;
    }
    inkColor = String(dot.getAttribute("data-ink-color") || "#7c9cff");
    mode = "pen";
    syncToolStateUI();
  });

  brushSizeEl?.addEventListener("input", () => {
    brushSize = Math.max(1, Number(brushSizeEl.value || 3));
  });

  penBtn?.addEventListener("click", () => {
    mode = "pen";
    syncToolStateUI();
    esSetStatus(statusEl, "Pen mode enabled.", "muted");
  });

  eraserBtn?.addEventListener("click", () => {
    mode = "eraser";
    syncToolStateUI();
    esSetStatus(statusEl, "Eraser mode enabled.", "muted");
  });

  undoBtn?.addEventListener("click", () => {
    if (!points.length) {
      return;
    }
    let idx = points.length - 1;
    while (idx >= 0 && !points[idx].break) {
      idx -= 1;
    }
    points.splice(Math.max(0, idx), points.length - Math.max(0, idx));
    redraw();
    esSetStatus(statusEl, "Last stroke removed.", "ok");
  });

  addStickyBtn?.addEventListener("click", () => {
    const sticky = {
      id: `st_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      text: "",
    };
    stickies.push(sticky);
    redraw();
    const textarea = stickyWrap?.querySelector(`[data-sticky-text="${sticky.id}"]`);
    if (textarea instanceof HTMLTextAreaElement) {
      textarea.focus();
    }
    esSetStatus(statusEl, "Sticky note added.", "ok");
  });

  stickyWrap?.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) {
      return;
    }
    const id = String(target.getAttribute("data-sticky-text") || "");
    if (!id) {
      return;
    }
    const sticky = stickies.find((s) => s.id === id);
    if (!sticky) {
      return;
    }
    sticky.text = target.value;
  });

  stickyWrap?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const removeBtn = target.closest("[data-sticky-remove]");
    if (!removeBtn) {
      return;
    }
    const id = String(removeBtn.getAttribute("data-sticky-remove") || "");
    if (!id) {
      return;
    }
    const idx = stickies.findIndex((s) => s.id === id);
    if (idx >= 0) {
      stickies.splice(idx, 1);
      redraw();
      esSetStatus(statusEl, "Sticky removed.", "muted");
    }
  });

  clearBtn?.addEventListener("click", () => {
    points.length = 0;
    stickies.length = 0;
    redraw();
    esSetStatus(statusEl, "Canvas cleared.", "muted");
  });

  saveBtn?.addEventListener("click", () => {
    forEnterpriseAccount(() => ({ whiteboardPoints: points, whiteboardStickies: stickies }));
    esSetStatus(statusEl, "Whiteboard saved.", "ok");
  });
}

function initApprovalsTool(account, data) {
  const listEl = document.getElementById("approvalsList");
  if (!listEl) {
    return;
  }

  const titleEl = document.getElementById("approvalTitle");
  const typeEl = document.getElementById("approvalType");
  const submitBtn = document.getElementById("approvalSubmitBtn");
  const saveBtn = document.getElementById("approvalSaveBtn");
  const statusEl = document.getElementById("approvalsStatus");

  const items = Array.isArray(data.approvalsItems) ? data.approvalsItems : [];

  function render() {
    listEl.innerHTML = items
      .map((a, idx) => `<tr><td>${idx + 1}</td><td>${a.title}</td><td>${a.type}</td><td>${a.status}</td><td>${a.audit}</td></tr>`)
      .join("") || '<tr><td colspan="5" class="muted">No workflow items.</td></tr>';
  }

  render();

  submitBtn?.addEventListener("click", () => {
    const title = String(titleEl?.value || "").trim();
    if (!title) {
      esSetStatus(statusEl, "Request title required.", "warn");
      return;
    }
    items.push({
      id: `apr_${Date.now()}`,
      title,
      type: typeEl?.value || "document",
      status: "pending",
      audit: `Submitted by ${account.id} @ ${new Date().toLocaleString()}`,
    });
    if (titleEl) titleEl.value = "";
    render();
    esSetStatus(statusEl, "Approval submitted.", "ok");
  });

  saveBtn?.addEventListener("click", () => {
    forEnterpriseAccount(() => ({ approvalsItems: items }));
    esSetStatus(statusEl, "Workflow ledger saved.", "ok");
  });
}

function bootstrapEnterpriseSuite() {
  const account = gateEnterpriseTool();
  if (!account) {
    return;
  }

  const { data } = getEnterpriseAccountAndData();
  initSlidesTool(account, data);
  initProjectsTool(account, data);
  initChatTool(account, data);
  initAiAssistantTool(account, data);
  initDriveTool(account, data);
  initFormsTool(account, data);
  initWhiteboardTool(account, data);
  initApprovalsTool(account, data);
}

bootstrapEnterpriseSuite();