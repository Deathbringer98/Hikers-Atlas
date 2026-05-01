const STORAGE_KEYS = {
  accounts: "np_proto_accounts",
  messages: "np_proto_messages",
  session: "np_proto_session",
  composeDrafts: "np_proto_compose_drafts",
  tools: "np_proto_tools",
  serverTools: "np_proto_server_tools",
  contacts: "np_proto_contacts",
  watchPartyRooms: "np_proto_watch_party_rooms",
  metricsStudio: "np_proto_metrics_studio_state",
  lifetimeEntitlements: "np_proto_lifetime_entitlements",
  ownerAuth: "np_proto_owner_auth",
  adminAuditLog: "np_proto_admin_audit_log",
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const TOOLS_PLANS = new Set(["gold", "enterprise"]);
const OWNER_SESSION_TTL_MS = 30 * 60 * 1000;

const ALLOWED_EXTENSIONS = new Set([
  // Documents
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "rtf", "odt", "ods", "odp",
  "epub", "pages", "numbers", "key",
  // Video
  "mp4", "webm", "mov", "m4v", "avi", "mkv", "wmv", "flv", "3gp", "3g2", "ogv", "ts", "mts",
  // Audio
  "mp3", "wav", "flac", "ogg", "opus", "aac", "m4a", "wma", "aiff", "aif",
  // Images
  "jpg", "jpeg", "png", "webp", "gif", "bmp", "tiff", "tif", "svg", "heic", "heif", "avif",
  // Archives
  "zip", "tar", "gz", "bz2", "7z", "rar",
  // Code
  "js", "ts", "tsx", "jsx", "py", "java", "c", "cpp", "h", "hpp", "cs", "go", "rs", "php", "rb", "sh",
  "json", "yaml", "yml", "toml", "xml", "html", "css", "scss", "sql", "md", "log",
]);

const WORD_BANK = [
  "amber", "anchor", "apex", "avocado", "bamboo", "barrel", "beacon", "blossom", "breeze", "bronze",
  "cactus", "canopy", "canvas", "canyon", "carbon", "cedar", "cipher", "cobalt", "comet", "coral",
  "crater", "crimson", "crystal", "dawn", "delta", "dune", "echo", "ember", "falcon", "fiber",
  "fjord", "flare", "forest", "fossil", "galaxy", "garnet", "glacier", "grove", "harbor", "hazel",
  "helium", "horizon", "indigo", "iris", "jade", "jungle", "keystone", "lagoon", "lantern", "lava",
  "ledger", "lilac", "linen", "lotus", "lumen", "mango", "marble", "meadow", "meridian", "meteor",
  "mint", "mirage", "mosaic", "nebula", "nectar", "nickel", "nova", "onyx", "opal", "orbit",
  "orchard", "origin", "paradox", "pearl", "phoenix", "pine", "plasma", "pluto", "prairie", "quartz",
  "quill", "raven", "reef", "relic", "ripple", "river", "saffron", "sage", "sierra", "signal",
  "solstice", "spruce", "summit", "sunset", "terra", "thistle", "timber", "topaz", "trident", "tundra",
  "umbra", "velvet", "violet", "voyage", "walnut", "wave", "willow", "zenith", "zinc", "zephyr",
];

const generateBtn = document.getElementById("generateBtn");
const identityBox = document.getElementById("identityBox");
const accountIdEl = document.getElementById("accountId");
const recoveryPhraseEl = document.getElementById("recoveryPhrase");
const unlockForm = document.getElementById("unlockForm");
const sessionStatus = document.getElementById("sessionStatus");
const billingForm = document.getElementById("billingForm");
const billingStatus = document.getElementById("billingStatus");
const ownerSignForm = document.getElementById("ownerSignForm");
const ownerSignPhraseEl = document.getElementById("ownerSignPhrase");
const ownerAuthStatusEl = document.getElementById("ownerAuthStatus");
const giftGrantForm = document.getElementById("giftGrantForm");
const giftGrantAccountIdEl = document.getElementById("giftGrantAccountId");
const giftGrantReasonEl = document.getElementById("giftGrantReason");
const giftSearchQueryEl = document.getElementById("giftSearchQuery");
const giftSearchBtn = document.getElementById("giftSearchBtn");
const giftRefreshBtn = document.getElementById("giftRefreshBtn");
const giftAdminTableEl = document.getElementById("giftAdminTable");
const giftAdminStatusEl = document.getElementById("giftAdminStatus");
const adminRoleSearchQueryEl = document.getElementById("adminRoleSearchQuery");
const adminRoleSearchBtn = document.getElementById("adminRoleSearchBtn");
const adminRoleRefreshBtn = document.getElementById("adminRoleRefreshBtn");
const adminRoleTableEl = document.getElementById("adminRoleTable");
const adminRoleStatusEl = document.getElementById("adminRoleStatus");
const adminAuditTableEl = document.getElementById("adminAuditTable");
const messageForm = document.getElementById("messageForm");
const composeStatus = document.getElementById("composeStatus");
const sendInviteBtn = document.getElementById("sendInviteBtn");
const composeToolbarEl = document.getElementById("composeToolbar");
const composeBlockTypeEl = document.getElementById("composeBlockType");
const composeFontFamilyEl = document.getElementById("composeFontFamily");
const composeEditorEl = document.getElementById("messageEditor");
const composeLinkPopoverEl = document.getElementById("composeLinkPopover");
const composeLinkTextEl = document.getElementById("composeLinkText");
const composeLinkUrlEl = document.getElementById("composeLinkUrl");
const composeApplyLinkBtn = document.getElementById("composeApplyLinkBtn");
const composeRemoveLinkBtn = document.getElementById("composeRemoveLinkBtn");
const composeCancelLinkBtn = document.getElementById("composeCancelLinkBtn");
const composeContactsEl = document.getElementById("composeContacts");
const composeAddFriendBtnEl = document.getElementById("composeAddFriendBtn");
const friendsDrawerEl = document.getElementById("friendsDrawer");
const friendsDrawerOverlayEl = document.getElementById("friendsDrawerOverlay");
const friendsListEl = document.getElementById("friendsList");
const openFriendsBtnEl = document.getElementById("openFriendsBtn");
const friendsDrawerCloseEl = document.getElementById("friendsDrawerClose");
const addCcFromFriendsBtnEl = document.getElementById("addCcFromFriendsBtn");
const clearFriendSelBtnEl = document.getElementById("clearFriendSelBtn");
const ccChipRowEl = document.getElementById("ccChipRow");
const ccChipsEl = document.getElementById("ccChips");
const clearCcBtnEl = document.getElementById("clearCcBtn");
const inboxEl = document.getElementById("inbox");
const openInboxComposeBtn = document.getElementById("openInboxComposeBtn");
const inboxFolderBtn = document.getElementById("inboxFolderBtn");
const neverFolderBtn = document.getElementById("neverFolderBtn");
const spamFolderBtn = document.getElementById("spamFolderBtn");
const trashFolderBtn = document.getElementById("trashFolderBtn");
const refreshInboxBtn = document.getElementById("refreshInboxBtn");
const burnAllMailBtn = document.getElementById("burnAllMailBtn");
const inboxAddFriendIdEl = document.getElementById("inboxAddFriendId");
const inboxAddFriendNicknameEl = document.getElementById("inboxAddFriendNickname");
const inboxAddFriendBtnEl = document.getElementById("inboxAddFriendBtn");
const inboxListEl = document.getElementById("inboxList");
const messageViewEl = document.getElementById("messageView");
const inboxStatus = document.getElementById("inboxStatus");

const toolsGateStatusEl = document.getElementById("toolsGateStatus");
const toolsLockedEl = document.getElementById("toolsLocked");
const toolsWorkspaceEl = document.getElementById("toolsWorkspace");
const wordTitleEl = document.getElementById("wordTitle");
const wordEditorEl = document.getElementById("wordEditor");
const wordBlockTypeEl = document.getElementById("wordBlockType");
const wordFontSizeEl = document.getElementById("wordFontSize");
const wordFontFamilyEl = document.getElementById("wordFontFamily");
const wordInsertLinkBtn = document.getElementById("wordInsertLinkBtn");
const wordLineHeightEl = document.getElementById("wordLineHeight");
const wordParagraphSpacingEl = document.getElementById("wordParagraphSpacing");
const wordCountEl = document.getElementById("wordCount");
const wordReadingTimeEl = document.getElementById("wordReadingTime");
const saveWordBtn = document.getElementById("saveWordBtn");
const wordDownloadFormatEl = document.getElementById("wordDownloadFormat");
const downloadWordBtn = document.getElementById("downloadWordBtn");
const wordSavedAtEl = document.getElementById("wordSavedAt");
const sheetBodyEl = document.getElementById("sheetBody");
const sheetHeadEl = document.getElementById("sheetHead");
const saveSheetBtn = document.getElementById("saveSheetBtn");
const downloadSheetBtn = document.getElementById("downloadSheetBtn");
const sheetSavedAtEl = document.getElementById("sheetSavedAt");
const excelFormulaInputEl = document.getElementById("excelFormulaInput");
const excelApplyFormulaBtn = document.getElementById("excelApplyFormulaBtn");
const excelNameBoxEl = document.getElementById("excelNameBox");
const excelRangeInputEl = document.getElementById("excelRangeInput");
const excelStatsEl = document.getElementById("excelStats");
const excelFontFamilyEl = document.getElementById("excelFontFamily");
const excelFontSizeEl = document.getElementById("excelFontSize");
const excelBoldBtn = document.getElementById("excelBoldBtn");
const excelItalicBtn = document.getElementById("excelItalicBtn");
const excelUnderlineBtn = document.getElementById("excelUnderlineBtn");
const excelAlignLeftBtn = document.getElementById("excelAlignLeftBtn");
const excelAlignCenterBtn = document.getElementById("excelAlignCenterBtn");
const excelAlignRightBtn = document.getElementById("excelAlignRightBtn");
const excelClearCellBtn = document.getElementById("excelClearCellBtn");
const excelClearAllBtn = document.getElementById("excelClearAllBtn");
const excelAddRowBtn = document.getElementById("excelAddRowBtn");
const excelAddColBtn = document.getElementById("excelAddColBtn");
const excelSortAscBtn = document.getElementById("excelSortAscBtn");
const excelSortDescBtn = document.getElementById("excelSortDescBtn");
const excelSumBtn = document.getElementById("excelSumBtn");
const excelAvgBtn = document.getElementById("excelAvgBtn");
const excelMinBtn = document.getElementById("excelMinBtn");
const excelMaxBtn = document.getElementById("excelMaxBtn");
const calendarForm = document.getElementById("calendarForm");
const calendarWhenEl = document.getElementById("calendarWhen");
const calendarListEl = document.getElementById("calendarList");
const calendarGridEl = document.getElementById("calendarGrid");
const calendarWeekdaysEl = document.getElementById("calendarWeekdays");
const calendarAgendaEl = document.getElementById("calendarAgenda");
const calendarSelectedDateEl = document.getElementById("calendarSelectedDate");
const calendarMonthLabelEl = document.getElementById("calendarMonthLabel");
const calendarViewModeEl = document.getElementById("calendarViewMode");
const calendarSearchInputEl = document.getElementById("calendarSearchInput");
const calendarCategoryFilterEl = document.getElementById("calendarCategoryFilter");
const calendarCategoryEl = document.getElementById("calendarCategory");
const calendarReminderMinutesEl = document.getElementById("calendarReminderMinutes");
const calendarPrevBtn = document.getElementById("calendarPrevBtn");
const calendarNextBtn = document.getElementById("calendarNextBtn");
const calendarTodayBtn = document.getElementById("calendarTodayBtn");
const downloadCalendarBtn = document.getElementById("downloadCalendarBtn");
const notesEditorEl = document.getElementById("notesEditor");
const saveNotesBtn = document.getElementById("saveNotesBtn");
const downloadNotesBtn = document.getElementById("downloadNotesBtn");
const notesSavedAtEl = document.getElementById("notesSavedAt");
const calcExpressionEl = document.getElementById("calcExpression");
const calcModeEl = document.getElementById("calcMode");
const calcResultEl = document.getElementById("calcResult");
const calcHistoryEl = document.getElementById("calcHistory");
const calcScientificPadEl = document.getElementById("calcScientificPad");
const calcEvaluateBtn = document.getElementById("calcEvaluateBtn");
const calcSaveBtn = document.getElementById("calcSaveBtn");
const calcClearBtn = document.getElementById("calcClearBtn");
const calcClearHistoryBtn = document.getElementById("calcClearHistoryBtn");
const calcSavedAtEl = document.getElementById("calcSavedAt");
const metricsTitleEl = document.getElementById("metricsTitle");
const metricsChartTypeEl = document.getElementById("metricsChartType");
const metricsDisplayModeEl = document.getElementById("metricsDisplayMode");
const metricsAggregationEl = document.getElementById("metricsAggregation");
const metricsSortModeEl = document.getElementById("metricsSortMode");
const metricsTopNEl = document.getElementById("metricsTopN");
const metricsMovingAverageEl = document.getElementById("metricsMovingAverage");
const metricsBenchmarkEl = document.getElementById("metricsBenchmark");
const metricsShowTrendEl = document.getElementById("metricsShowTrend");
const metricsShowAnomaliesEl = document.getElementById("metricsShowAnomalies");
const metricsLabelsEl = document.getElementById("metricsLabels");
const metricsPrimaryEl = document.getElementById("metricsPrimary");
const metricsSecondaryEl = document.getElementById("metricsSecondary");
const metricsRenderBtn = document.getElementById("metricsRenderBtn");
const metricsSaveBtn = document.getElementById("metricsSaveBtn");
const metricsDownloadCsvBtn = document.getElementById("metricsDownloadCsvBtn");
const metricsDownloadJsonBtn = document.getElementById("metricsDownloadJsonBtn");
const metricsDownloadPngBtn = document.getElementById("metricsDownloadPngBtn");
const metricsClearBtn = document.getElementById("metricsClearBtn");
const metricsCanvasEl = document.getElementById("metricsCanvas");
const metricsChartHeadingEl = document.getElementById("metricsChartHeading");
const metricsSummaryEl = document.getElementById("metricsSummary");
const metricsInsightsEl = document.getElementById("metricsInsights");
const metricsTableEl = document.getElementById("metricsTable");
const metricsSavedAtEl = document.getElementById("metricsSavedAt");
const metricsPaletteItems = document.querySelectorAll(".metrics-palette-item[data-tool]");
const metricsToolChartBuilderEl = document.getElementById("metricsToolChartBuilder");
const metricsToolDynamicEl = document.getElementById("metricsToolDynamic");
const metricsStudioToastEl = document.getElementById("metricsStudioToast");
const watchPartyRoomInputEl = document.getElementById("watchPartyRoomInput");
const watchPartyCreateBtn = document.getElementById("watchPartyCreateBtn");
const watchPartyJoinBtn = document.getElementById("watchPartyJoinBtn");
const watchPartyInviteLinkEl = document.getElementById("watchPartyInviteLink");
const watchPartyCopyInviteBtn = document.getElementById("watchPartyCopyInviteBtn");
const watchPartyHostPanelEl = document.getElementById("watchPartyHostPanel");
const watchPartyVideoUrlEl = document.getElementById("watchPartyVideoUrl");
const watchPartySetVideoBtn = document.getElementById("watchPartySetVideoBtn");
const watchPartyClearVideoBtn = document.getElementById("watchPartyClearVideoBtn");
const watchPartyToggleModeBtn = document.getElementById("watchPartyToggleModeBtn");
const watchPartyHeadingEl = document.getElementById("watchPartyHeading");
const watchPartyNowPlayingEl = document.getElementById("watchPartyNowPlaying");
const watchPartyFrameEl = document.getElementById("watchPartyFrame");
const watchPartyOpenYoutubeLinkEl = document.getElementById("watchPartyOpenYoutubeLink");
const watchPartyStatusEl = document.getElementById("watchPartyStatus");

let selectedMessageId = null;
let selectedMailboxFolder = "inbox";
let wordAutosaveTimer = null;
let notesAutosaveTimer = null;
let sheetAutosaveTimer = null;
let selectedSheetCell = { row: 0, col: 0 };
let activeSheetData = [];
let activeSheetStyles = {};
let calendarCursor = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selectedCalendarDate = null;
let calendarViewMode = "month";
let metricsChartRenderState = null;
let metricsChartHoverTarget = null;
let metricsLastDashboardResult = null;
let metricsActiveTool = "chart-builder";
let metricsStudioInitialized = false;
let metricsStudioToastTimer = null;
let metricsStudioHistoryUndo = [];
let metricsStudioHistoryRedo = [];
let metricsCommandPaletteInitialized = false;
let metricsPaletteVisible = false;
let activeWatchPartyRoomCode = "";
let activeWatchPartyRoomState = null;
const WATCH_PARTY_EMBED_READY_TIMEOUT_MS = 7000;
const WATCH_PARTY_EMBED_FAIL_MAX = 2;
const SPAM_BURN_MS = 12 * 60 * 60 * 1000;
const TRASH_BURN_MS = 48 * 60 * 60 * 1000;
let watchPartyEmbedProbe = null;
let watchPartyEmbedProbeTimer = null;
let composeLinkSelectionRange = null;
let composeLinkActiveAnchor = null;
let notificationBellInitialized = false;
let notificationBellTickTimer = null;

// Set of account IDs currently selected in the friends drawer
const selectedFriends = new Set();

// Array of account IDs added to CC
let ccRecipients = [];
let composeDraftTimer = null;

const METRICS_SAMPLE_DATA = [
  { month: "Jan", primary: 12, target: 10 },
  { month: "Feb", primary: 18, target: 17 },
  { month: "Mar", primary: 15, target: 17 },
  { month: "Apr", primary: 25, target: 20 },
  { month: "May", primary: 21, target: 20 },
];

function createDefaultMetricsStudioState() {
  return {
    kpis: [
      { id: "total", name: "Total", value: 91, change: 11.2, spark: [44, 49, 52, 61, 74] },
      { id: "avg", name: "Average", value: 18.2, change: 6.8, spark: [12, 13, 14, 16, 18.2] },
      { id: "growth", name: "Growth", value: 75.0, change: 9.3, spark: [8, 21, 12, 43, 75], suffix: "%" },
      { id: "hit-rate", name: "Target Hit Rate", value: 80.0, change: 5.1, spark: [58, 63, 59, 74, 80], suffix: "%" },
      { id: "volatility", name: "Volatility", value: 4.53, change: -1.6, spark: [6.1, 5.4, 5.9, 4.9, 4.53] },
      { id: "net-delta", name: "Net Delta", value: 7, change: 4.8, spark: [2, 3, 1, 6, 7] },
    ],
    explorerRows: METRICS_SAMPLE_DATA.map((row, idx) => ({
      id: idx + 1,
      month: row.month,
      primary: row.primary,
      target: row.target,
      status: row.primary >= row.target ? "On Track" : "Risk",
    })),
    explorerSelectedIds: [],
    customMetrics: [
      { name: "Revenue Pressure", formula: "(avg*0.6)+(targetHitRate*0.4)", value: 42.28, spark: [34, 37, 39, 41, 42] },
    ],
    reportBlocks: [
      { type: "KPI Card", title: "North Star KPI", height: 1 },
      { type: "Chart Block", title: "Trend Movement", height: 2 },
      { type: "Table Block", title: "Regional Breakdown", height: 1 },
    ],
    reportSettings: {
      pageSize: "A4",
      branding: "",
      schedule: "Weekly",
      audience: "Operations",
    },
    integrations: [
      { id: "stripe", name: "Stripe", status: "Connected", sync: "2 min ago", duration: "1.2s" },
      { id: "salesforce", name: "Salesforce", status: "Not connected", sync: "Never", duration: "-" },
      { id: "ga", name: "Google Analytics", status: "Connected", sync: "9 min ago", duration: "1.4s" },
      { id: "hubspot", name: "HubSpot", status: "Not connected", sync: "Never", duration: "-" },
      { id: "snowflake", name: "Snowflake", status: "Connected", sync: "14 min ago", duration: "2.1s" },
      { id: "webhook", name: "Custom Webhook", status: "Not connected", sync: "Never", duration: "-" },
    ],
    integrationLogs: [
      { at: new Date().toLocaleTimeString(), integration: "Stripe", records: 124, status: "Success", duration: "1.2s", details: "Products + payments synced" },
      { at: new Date().toLocaleTimeString(), integration: "Google Analytics", records: 89, status: "Success", duration: "1.4s", details: "Campaign attribution synced" },
    ],
    forecast: null,
  };
}

const metricsStudioState = createDefaultMetricsStudioState();

function triggerDebouncedAutosave(timerRefName, callback, delay = 500) {
  if (timerRefName === "word") {
    clearTimeout(wordAutosaveTimer);
    wordAutosaveTimer = setTimeout(callback, delay);
  } else if (timerRefName === "notes") {
    clearTimeout(notesAutosaveTimer);
    notesAutosaveTimer = setTimeout(callback, delay);
  } else if (timerRefName === "sheet") {
    clearTimeout(sheetAutosaveTimer);
    sheetAutosaveTimer = setTimeout(callback, delay);
  }
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function cloneMetricsStudioState(source) {
  return JSON.parse(JSON.stringify(source));
}

function hydrateMetricsStudioState() {
  const defaults = createDefaultMetricsStudioState();
  const saved = loadJson(STORAGE_KEYS.metricsStudio, null);
  if (!saved || typeof saved !== "object") {
    Object.assign(metricsStudioState, defaults);
    return;
  }

  Object.assign(metricsStudioState, defaults, saved);
}

function persistMetricsStudioState() {
  saveJson(STORAGE_KEYS.metricsStudio, metricsStudioState);
}

function ensureMetricsStudioDemoData() {
  const defaults = createDefaultMetricsStudioState();
  let changed = false;

  if (!Array.isArray(metricsStudioState.kpis) || !metricsStudioState.kpis.length) {
    metricsStudioState.kpis = cloneMetricsStudioState(defaults.kpis);
    changed = true;
  }

  if (!Array.isArray(metricsStudioState.explorerRows) || !metricsStudioState.explorerRows.length) {
    metricsStudioState.explorerRows = cloneMetricsStudioState(defaults.explorerRows);
    changed = true;
  }

  if (!Array.isArray(metricsStudioState.customMetrics) || !metricsStudioState.customMetrics.length) {
    metricsStudioState.customMetrics = cloneMetricsStudioState(defaults.customMetrics);
    changed = true;
  }

  if (!Array.isArray(metricsStudioState.reportBlocks) || !metricsStudioState.reportBlocks.length) {
    metricsStudioState.reportBlocks = cloneMetricsStudioState(defaults.reportBlocks);
    changed = true;
  }

  if (!metricsStudioState.reportSettings || typeof metricsStudioState.reportSettings !== "object") {
    metricsStudioState.reportSettings = cloneMetricsStudioState(defaults.reportSettings);
    changed = true;
  }

  if (!Array.isArray(metricsStudioState.integrations) || !metricsStudioState.integrations.length) {
    metricsStudioState.integrations = cloneMetricsStudioState(defaults.integrations);
    changed = true;
  }

  if (!Array.isArray(metricsStudioState.integrationLogs) || !metricsStudioState.integrationLogs.length) {
    metricsStudioState.integrationLogs = cloneMetricsStudioState(defaults.integrationLogs);
    changed = true;
  }

  if (!metricsStudioState.forecast || typeof metricsStudioState.forecast !== "object") {
    metricsStudioState.forecast = buildForecast("primary", "linear", 3);
    changed = true;
  }

  if (metricsLabelsEl && !String(metricsLabelsEl.value || "").trim()) {
    metricsLabelsEl.value = METRICS_SAMPLE_DATA.map((row) => row.month).join(",");
    changed = true;
  }

  if (metricsPrimaryEl && !String(metricsPrimaryEl.value || "").trim()) {
    metricsPrimaryEl.value = METRICS_SAMPLE_DATA.map((row) => row.primary).join(",");
    changed = true;
  }

  if (metricsSecondaryEl && !String(metricsSecondaryEl.value || "").trim()) {
    metricsSecondaryEl.value = METRICS_SAMPLE_DATA.map((row) => row.target).join(",");
    changed = true;
  }

  if (metricsTitleEl && !String(metricsTitleEl.value || "").trim()) {
    metricsTitleEl.value = "Performance chart";
    changed = true;
  }

  if (changed) {
    persistMetricsStudioState();
  }
}

function pushMetricsStudioHistory() {
  metricsStudioHistoryUndo.push(cloneMetricsStudioState(metricsStudioState));
  if (metricsStudioHistoryUndo.length > 35) {
    metricsStudioHistoryUndo.shift();
  }
  metricsStudioHistoryRedo = [];
}

function applyMetricsStudioStateSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    return;
  }
  const defaults = createDefaultMetricsStudioState();
  Object.keys(metricsStudioState).forEach((key) => {
    delete metricsStudioState[key];
  });
  Object.assign(metricsStudioState, defaults, cloneMetricsStudioState(snapshot));
  persistMetricsStudioState();
  if (metricsActiveTool === "chart-builder") {
    if (metricsPrimaryEl && String(metricsPrimaryEl.value).trim()) {
      renderMetricsDashboard();
    }
  } else {
    renderMetricsDynamicTool(metricsActiveTool);
  }
}

function undoMetricsStudioAction() {
  if (!metricsStudioHistoryUndo.length) {
    showMetricsStudioToast("Nothing to undo.", "warn");
    return;
  }

  metricsStudioHistoryRedo.push(cloneMetricsStudioState(metricsStudioState));
  const snapshot = metricsStudioHistoryUndo.pop();
  applyMetricsStudioStateSnapshot(snapshot);
  showMetricsStudioToast("Undo applied.");
}

function redoMetricsStudioAction() {
  if (!metricsStudioHistoryRedo.length) {
    showMetricsStudioToast("Nothing to redo.", "warn");
    return;
  }

  metricsStudioHistoryUndo.push(cloneMetricsStudioState(metricsStudioState));
  const snapshot = metricsStudioHistoryRedo.pop();
  applyMetricsStudioStateSnapshot(snapshot);
  showMetricsStudioToast("Redo applied.");
}

function ensureMetricsCommandPalette() {
  if (metricsCommandPaletteInitialized) {
    return;
  }

  const host = document.createElement("div");
  host.id = "metricsCommandPalette";
  host.className = "metrics-command-palette hidden";
  host.innerHTML = `
    <div class="metrics-command-palette-panel">
      <h3>Command Palette</h3>
      <div class="metrics-command-list">
        <button type="button" data-cmd="chart-builder">Open Chart Builder</button>
        <button type="button" data-cmd="kpi-studio">Open KPI Studio</button>
        <button type="button" data-cmd="data-explorer">Open Data Explorer</button>
        <button type="button" data-cmd="anomaly-lab">Open Anomaly Lab</button>
        <button type="button" data-cmd="forecast-engine">Open Forecast Engine</button>
        <button type="button" data-cmd="custom-metrics">Open Custom Metrics</button>
        <button type="button" data-cmd="report-designer">Open Report Designer</button>
        <button type="button" data-cmd="integrations-hub">Open Integrations Hub</button>
        <button type="button" data-cmd="undo">Undo</button>
        <button type="button" data-cmd="redo">Redo</button>
      </div>
      <button type="button" class="btn btn-secondary" id="metricsCommandClose">Close</button>
    </div>
  `;
  document.body.appendChild(host);

  host.querySelectorAll("[data-cmd]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.getAttribute("data-cmd") || "";
      if (cmd === "undo") {
        undoMetricsStudioAction();
      } else if (cmd === "redo") {
        redoMetricsStudioAction();
      } else {
        switchMetricsStudioTool(cmd);
      }
      host.classList.add("hidden");
      metricsPaletteVisible = false;
    });
  });

  host.querySelector("#metricsCommandClose")?.addEventListener("click", () => {
    host.classList.add("hidden");
    metricsPaletteVisible = false;
  });

  metricsCommandPaletteInitialized = true;
}

function toggleMetricsCommandPalette(force = null) {
  ensureMetricsCommandPalette();
  const host = document.getElementById("metricsCommandPalette");
  if (!host) {
    return;
  }

  if (typeof force === "boolean") {
    metricsPaletteVisible = force;
  } else {
    metricsPaletteVisible = !metricsPaletteVisible;
  }

  host.classList.toggle("hidden", !metricsPaletteVisible);
}

function getSession() {
  return loadJson(STORAGE_KEYS.session, null);
}

function getAccounts() {
  return loadJson(STORAGE_KEYS.accounts, []);
}

function getAdminAuditLog() {
  return loadJson(STORAGE_KEYS.adminAuditLog, []);
}

function saveAdminAuditLog(entries) {
  saveJson(STORAGE_KEYS.adminAuditLog, entries);
}

function appendAdminAudit(eventType, actorId, details = {}) {
  const entries = getAdminAuditLog();
  entries.unshift({
    id: `audit_${Date.now().toString(36)}_${Math.floor(Math.random() * 100000).toString(36)}`,
    when: new Date().toISOString(),
    actorId: actorId || "system",
    eventType,
    details,
  });
  if (entries.length > 250) {
    entries.length = 250;
  }
  saveAdminAuditLog(entries);
}

function getAccountRole(account) {
  if (!account) {
    return "user";
  }
  if (account.role) {
    return String(account.role);
  }
  if (account.isOwner) {
    return "owner";
  }
  return "user";
}

function isAdminRole(role) {
  return role === "owner" || role === "admin";
}

function countOwners() {
  return getAccounts().filter((account) => getAccountRole(account) === "owner").length;
}

function getLifetimeEntitlements() {
  return loadJson(STORAGE_KEYS.lifetimeEntitlements, {});
}

function saveLifetimeEntitlements(state) {
  saveJson(STORAGE_KEYS.lifetimeEntitlements, state);
}

function getLifetimeEntitlement(accountId) {
  if (!accountId) {
    return null;
  }
  const state = getLifetimeEntitlements();
  return state[accountId] || null;
}

function hasActiveLifetimeEntitlement(accountId) {
  const entitlement = getLifetimeEntitlement(accountId);
  return Boolean(entitlement && entitlement.active === true);
}

function getOwnerSessionAuth() {
  return loadJson(STORAGE_KEYS.ownerAuth, null);
}

function clearOwnerSessionAuth() {
  localStorage.removeItem(STORAGE_KEYS.ownerAuth);
}

function isOwnerAccount(account) {
  return getAccountRole(account) === "owner";
}

function hasAnyOwnerAccount() {
  return getAccounts().some((account) => isOwnerAccount(account));
}

function ensureOwnerAccountForSession(account) {
  if (!account) {
    return false;
  }
  if (isOwnerAccount(account)) {
    return true;
  }
  if (hasAnyOwnerAccount()) {
    return false;
  }

  const accounts = getAccounts();
  const index = accounts.findIndex((entry) => entry.id === account.id);
  if (index < 0) {
    return false;
  }

  accounts[index] = {
    ...accounts[index],
    role: "owner",
    isOwner: true,
    updatedAt: new Date().toISOString(),
  };
  saveJson(STORAGE_KEYS.accounts, accounts);
  appendAdminAudit("owner.bootstrap", account.id, { targetId: account.id });
  return true;
}

function syncAdminFriendships(actorId = "system") {
  const accounts = getAccounts();
  const adminIds = accounts.filter((account) => isAdminRole(getAccountRole(account))).map((account) => account.id);
  const adminSet = new Set(adminIds);
  const state = getContactsState();
  const nowIso = new Date().toISOString();

  for (const adminId of adminIds) {
    const existing = Array.isArray(state[adminId]) ? state[adminId] : [];
    const map = new Map(existing.map((entry) => [entry.id, entry]));

    for (const peerId of adminIds) {
      if (peerId === adminId) {
        continue;
      }
      const prev = map.get(peerId);
      map.set(peerId, {
        id: peerId,
        nickname: prev?.nickname || "",
        favorite: Boolean(prev?.favorite),
        blocked: false,
        autoLinkedAdmin: true,
        createdAt: prev?.createdAt || nowIso,
        updatedAt: nowIso,
      });
    }

    const normalized = Array.from(map.values()).filter((entry) => {
      if (entry.id === adminId) {
        return false;
      }
      if (entry.autoLinkedAdmin && !adminSet.has(entry.id)) {
        return false;
      }
      return true;
    });

    state[adminId] = normalized;
  }

  for (const ownerId of Object.keys(state)) {
    if (!adminSet.has(ownerId)) {
      state[ownerId] = (state[ownerId] || []).filter((entry) => !entry.autoLinkedAdmin);
    }
  }

  saveContactsState(state);
  appendAdminAudit("admin_friends.sync", actorId, { adminCount: adminIds.length });
}

function prototypeApiAdminRoleSet(payload) {
  const auth = requireSignedOwnerSession();
  if (!auth.ok) {
    return { ok: false, status: 401, error: auth.error };
  }

  const targetId = String(payload.targetId || "").trim();
  const role = String(payload.role || "").trim().toLowerCase();
  if (!targetId || !["owner", "admin", "support", "user"].includes(role)) {
    return { ok: false, status: 400, error: "targetId and valid role are required." };
  }

  const accounts = getAccounts();
  const index = accounts.findIndex((account) => account.id === targetId);
  if (index < 0) {
    return { ok: false, status: 404, error: "Target account not found." };
  }

  const previousRole = getAccountRole(accounts[index]);
  if (previousRole === "owner" && role !== "owner" && countOwners() <= 1) {
    return { ok: false, status: 409, error: "Guardrail: cannot remove the last owner." };
  }

  accounts[index] = {
    ...accounts[index],
    role,
    isOwner: role === "owner",
    updatedAt: new Date().toISOString(),
  };
  saveJson(STORAGE_KEYS.accounts, accounts);
  syncAdminFriendships(auth.ownerId);
  appendAdminAudit("admin_role.set", auth.ownerId, { targetId, previousRole, role });
  return { ok: true, status: 200, data: accounts[index] };
}

function prototypeApiAdminRoleSearch(payload) {
  const auth = requireSignedOwnerSession();
  if (!auth.ok) {
    return { ok: false, status: 401, error: auth.error };
  }

  const query = String(payload.query || "").trim().toLowerCase();
  const rows = getAccounts()
    .filter((account) => !query || account.id.toLowerCase().includes(query))
    .map((account) => ({
      id: account.id,
      role: getAccountRole(account),
      plan: account.plan,
      updatedAt: account.updatedAt || account.createdAt || new Date().toISOString(),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  return { ok: true, status: 200, data: rows };
}

function createOwnerSignature(ownerId, phraseNormalized, issuedAt, expiresAt) {
  return btoa(`${ownerId}|${phraseNormalized}|${issuedAt}|${expiresAt}`).replaceAll("=", "");
}

function verifySignedOwnerSession(auth) {
  if (!auth || typeof auth !== "object") {
    return { ok: false, error: "Owner session is not signed." };
  }

  const ownerId = String(auth.ownerId || "");
  const issuedAt = Number(auth.issuedAt || 0);
  const expiresAt = Number(auth.expiresAt || 0);
  const now = Date.now();
  if (!ownerId || !Number.isFinite(issuedAt) || !Number.isFinite(expiresAt) || now >= expiresAt) {
    clearOwnerSessionAuth();
    return { ok: false, error: "Owner session expired. Sign again." };
  }

  const session = getSession();
  if (!session || session.id !== ownerId) {
    return { ok: false, error: "Signed owner must match active session." };
  }

  const account = getAccounts().find((entry) => entry.id === ownerId);
  if (!account || !isOwnerAccount(account)) {
    return { ok: false, error: "Current account is not an owner account." };
  }

  const phraseNormalized = normalizePhrase(account.phrase || "");
  const expected = createOwnerSignature(ownerId, phraseNormalized, issuedAt, expiresAt);
  if (expected !== String(auth.signature || "")) {
    clearOwnerSessionAuth();
    return { ok: false, error: "Owner signature invalid. Sign again." };
  }

  return { ok: true, ownerId, account, expiresAt };
}

function requireSignedOwnerSession() {
  return verifySignedOwnerSession(getOwnerSessionAuth());
}

function prototypeApiGiftGrant(payload) {
  const auth = requireSignedOwnerSession();
  if (!auth.ok) {
    return { ok: false, status: 401, error: auth.error };
  }

  const visitorId = String(payload.visitorId || "").trim();
  if (!visitorId) {
    return { ok: false, status: 400, error: "visitorId is required." };
  }

  const reason = String(payload.reason || "").trim();
  const nowIso = new Date().toISOString();
  const state = getLifetimeEntitlements();
  const previous = state[visitorId] || null;

  state[visitorId] = {
    visitorId,
    active: true,
    source: "gifted",
    grantedBy: auth.ownerId,
    grantedReason: reason || "owner-gift",
    grantedAt: previous?.grantedAt || nowIso,
    revokedAt: null,
    updatedAt: nowIso,
  };

  saveLifetimeEntitlements(state);
  return { ok: true, status: 200, data: state[visitorId] };
}

function prototypeApiGiftRevoke(payload) {
  const auth = requireSignedOwnerSession();
  if (!auth.ok) {
    return { ok: false, status: 401, error: auth.error };
  }

  const visitorId = String(payload.visitorId || "").trim();
  if (!visitorId) {
    return { ok: false, status: 400, error: "visitorId is required." };
  }

  const state = getLifetimeEntitlements();
  const record = state[visitorId];
  if (!record) {
    return { ok: false, status: 404, error: "Lifetime entitlement not found." };
  }

  const nowIso = new Date().toISOString();
  state[visitorId] = {
    ...record,
    active: false,
    revokedAt: nowIso,
    revokedBy: auth.ownerId,
    updatedAt: nowIso,
  };
  saveLifetimeEntitlements(state);
  return { ok: true, status: 200, data: state[visitorId] };
}

function prototypeApiGiftSearch(payload) {
  const auth = requireSignedOwnerSession();
  if (!auth.ok) {
    return { ok: false, status: 401, error: auth.error };
  }

  const query = String(payload.query || "").trim().toLowerCase();
  const rows = Object.values(getLifetimeEntitlements())
    .filter((row) => !query || String(row.visitorId || "").toLowerCase().includes(query))
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));

  return { ok: true, status: 200, data: rows };
}

function prototypeApiPost(path, payload = {}) {
  if (path === "/api/billing/gift") {
    return prototypeApiGiftGrant(payload);
  }
  if (path === "/api/billing/gift/revoke") {
    return prototypeApiGiftRevoke(payload);
  }
  if (path === "/api/billing/gift/search") {
    return prototypeApiGiftSearch(payload);
  }
  if (path === "/api/admin/roles/set") {
    return prototypeApiAdminRoleSet(payload);
  }
  if (path === "/api/admin/roles/search") {
    return prototypeApiAdminRoleSearch(payload);
  }
  return { ok: false, status: 404, error: `Unknown prototype endpoint: ${path}` };
}

function renderAdminRoleTable(rows) {
  const body = adminRoleTableEl?.querySelector("tbody");
  if (!body) {
    return;
  }

  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="5" class="muted">No accounts available.</td></tr>';
    return;
  }

  body.innerHTML = rows.map((row) => `
    <tr>
      <td>${sanitize(row.id)}</td>
      <td>${sanitize(row.role)}</td>
      <td>${sanitize(row.plan || "free")}</td>
      <td>${sanitize(new Date(row.updatedAt || Date.now()).toLocaleString())}</td>
      <td class="tools-row">
        <button type="button" class="btn btn-secondary" data-role-set="owner" data-role-target="${sanitize(row.id)}">Owner</button>
        <button type="button" class="btn btn-secondary" data-role-set="admin" data-role-target="${sanitize(row.id)}">Admin</button>
        <button type="button" class="btn btn-secondary" data-role-set="support" data-role-target="${sanitize(row.id)}">Support</button>
        <button type="button" class="btn btn-secondary" data-role-set="user" data-role-target="${sanitize(row.id)}">User</button>
      </td>
    </tr>
  `).join("");

  body.querySelectorAll("[data-role-set]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-role-target") || "";
      const role = btn.getAttribute("data-role-set") || "";
      const response = prototypeApiPost("/api/admin/roles/set", { targetId, role });
      if (!response.ok) {
        setStatus(adminRoleStatusEl, response.error || "Role update failed.", "bad");
        return;
      }
      setStatus(adminRoleStatusEl, `Updated ${targetId} role to ${role}.`, "ok");
      refreshAdminRoleTable();
      updateSessionStatus();
      renderComposeContacts();
    });
  });
}

function refreshAdminRoleTable() {
  if (!adminRoleTableEl) {
    return;
  }
  const query = String(adminRoleSearchQueryEl?.value || "").trim();
  const response = prototypeApiPost("/api/admin/roles/search", { query });
  if (!response.ok) {
    renderAdminRoleTable([]);
    setStatus(adminRoleStatusEl, response.error || "Role search failed.", "warn");
    return;
  }
  renderAdminRoleTable(response.data || []);
}

function renderAdminAuditTable() {
  const body = adminAuditTableEl?.querySelector("tbody");
  if (!body) {
    return;
  }
  const rows = getAdminAuditLog();
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="4" class="muted">No audit events yet.</td></tr>';
    return;
  }
  body.innerHTML = rows.map((row) => `
    <tr>
      <td>${sanitize(new Date(row.when).toLocaleString())}</td>
      <td>${sanitize(row.actorId || "system")}</td>
      <td>${sanitize(row.eventType || "-")}</td>
      <td>${sanitize(JSON.stringify(row.details || {}))}</td>
    </tr>
  `).join("");
}

function renderGiftAdminTable(rows) {
  const body = giftAdminTableEl?.querySelector("tbody");
  if (!body) {
    return;
  }

  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="6" class="muted">No lifetime records yet.</td></tr>';
    return;
  }

  body.innerHTML = rows.map((row) => `
    <tr>
      <td>${sanitize(row.visitorId || "")}</td>
      <td class="${row.active ? "metrics-good" : "metrics-bad"}">${row.active ? "Active" : "Revoked"}</td>
      <td>${sanitize(row.grantedBy || "-")}</td>
      <td>${sanitize(row.grantedReason || "-")}</td>
      <td>${sanitize(new Date(row.updatedAt || row.grantedAt || Date.now()).toLocaleString())}</td>
      <td>
        ${row.active
          ? `<button type="button" class="btn btn-secondary" data-gift-revoke="${sanitize(row.visitorId)}">Revoke</button>`
          : `<button type="button" class="btn btn-secondary" data-gift-restore="${sanitize(row.visitorId)}">Restore</button>`}
      </td>
    </tr>
  `).join("");

  body.querySelectorAll("[data-gift-revoke]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const visitorId = btn.getAttribute("data-gift-revoke") || "";
      const response = prototypeApiPost("/api/billing/gift/revoke", { visitorId });
      if (!response.ok) {
        setStatus(giftAdminStatusEl, response.error || "Revoke failed.", "bad");
        return;
      }
      setStatus(giftAdminStatusEl, `Lifetime revoked for ${visitorId}.`, "ok");
      refreshGiftAdminTable();
      updateSessionStatus();
    });
  });

  body.querySelectorAll("[data-gift-restore]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const visitorId = btn.getAttribute("data-gift-restore") || "";
      const response = prototypeApiPost("/api/billing/gift", {
        visitorId,
        reason: "restored-after-revoke",
      });
      if (!response.ok) {
        setStatus(giftAdminStatusEl, response.error || "Restore failed.", "bad");
        return;
      }
      setStatus(giftAdminStatusEl, `Lifetime restored for ${visitorId}.`, "ok");
      refreshGiftAdminTable();
      updateSessionStatus();
    });
  });
}

function refreshGiftAdminAuthStatus() {
  if (!ownerAuthStatusEl) {
    return;
  }

  const auth = requireSignedOwnerSession();
  if (!auth.ok) {
    setStatus(ownerAuthStatusEl, auth.error || "Owner session not signed.", "warn");
    return;
  }

  const mins = Math.max(1, Math.floor((auth.expiresAt - Date.now()) / 60000));
  setStatus(ownerAuthStatusEl, `Owner session signed as ${auth.ownerId}. Expires in ${mins} min.`, "ok");
}

function refreshGiftAdminTable() {
  if (!giftAdminTableEl) {
    return;
  }

  const query = String(giftSearchQueryEl?.value || "").trim();
  const response = prototypeApiPost("/api/billing/gift/search", { query });
  if (!response.ok) {
    renderGiftAdminTable([]);
    setStatus(giftAdminStatusEl, response.error || "Search failed.", "warn");
    return;
  }

  renderGiftAdminTable(response.data || []);
}

function getMessages() {
  return loadJson(STORAGE_KEYS.messages, []);
}

function getContactsState() {
  return loadJson(STORAGE_KEYS.contacts, {});
}

function saveContactsState(state) {
  saveJson(STORAGE_KEYS.contacts, state);
}

function getContactsForOwner(ownerId) {
  if (!ownerId) {
    return [];
  }
  const state = getContactsState();
  return Array.isArray(state[ownerId]) ? state[ownerId] : [];
}

function upsertContact(ownerId, contactId, patch = {}) {
  if (!ownerId || !contactId) {
    return null;
  }

  const state = getContactsState();
  const list = Array.isArray(state[ownerId]) ? state[ownerId].slice() : [];
  const existingIdx = list.findIndex((c) => c.id === contactId);
  const nowIso = new Date().toISOString();

  if (existingIdx >= 0) {
    list[existingIdx] = {
      ...list[existingIdx],
      ...patch,
      id: contactId,
      updatedAt: nowIso,
    };
  } else {
    list.push({
      id: contactId,
      nickname: "",
      createdAt: nowIso,
      updatedAt: nowIso,
      ...patch,
    });
  }

  state[ownerId] = list;
  saveContactsState(state);
  return list.find((c) => c.id === contactId) || null;
}

function removeContact(ownerId, contactId) {
  if (!ownerId || !contactId) {
    return false;
  }

  const state = getContactsState();
  const list = Array.isArray(state[ownerId]) ? state[ownerId] : [];
  const next = list.filter((c) => c.id !== contactId);

  if (next.length === list.length) {
    return false;
  }

  state[ownerId] = next;
  saveContactsState(state);
  return true;
}

function isContactBlocked(ownerId, contactId) {
  if (!ownerId || !contactId) {
    return false;
  }

  return getContactsForOwner(ownerId).some((c) => c.id === contactId && Boolean(c.blocked));
}

function resolveRecipientId(inputValue, ownerId) {
  const raw = String(inputValue || "").trim();
  if (!raw) {
    return "";
  }

  const accounts = getAccounts();
  if (accounts.some((a) => a.id === raw)) {
    if (isContactBlocked(ownerId, raw)) {
      return "";
    }
    return raw;
  }

  const lower = raw.toLowerCase();
  const contacts = getContactsForOwner(ownerId);
  const byNick = contacts.find(
    (c) => !c.blocked && String(c.nickname || "").trim().toLowerCase() === lower
  );
  return byNick?.id || "";
}

function displayIdForViewer(viewerId, accountId) {
  if (!viewerId || !accountId) {
    return accountId || "";
  }

  const contact = getContactsForOwner(viewerId).find((c) => c.id === accountId);
  if (!contact || !String(contact.nickname || "").trim()) {
    return accountId;
  }

  return `${contact.nickname} (${accountId})`;
}

function friendInitials(contact) {
  const nick = String(contact.nickname || "").trim();
  if (nick) {
    const parts = nick.split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : nick.slice(0, 2).toUpperCase();
  }

  return contact.id.slice(4, 6).toUpperCase();
}

let friendsContextMenuEl = null;
let activeFriendContextId = "";

function closeFriendsContextMenu() {
  if (friendsContextMenuEl) {
    friendsContextMenuEl.classList.add("hidden");
  }
  activeFriendContextId = "";
}

function ensureFriendsContextMenu() {
  if (friendsContextMenuEl || typeof document === "undefined") {
    return;
  }

  const menu = document.createElement("div");
  menu.id = "friendsContextMenu";
  menu.className = "friends-context-menu hidden";
  menu.innerHTML = `
    <button type="button" data-friend-action="favorite">Favorite</button>
    <button type="button" data-friend-action="block">Block</button>
    <button type="button" data-friend-action="remove" class="danger">Remove friend</button>
  `;

  document.body.appendChild(menu);
  friendsContextMenuEl = menu;

  menu.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const actionBtn = target.closest("[data-friend-action]");
    if (!actionBtn || !activeFriendContextId) {
      return;
    }

    const action = actionBtn.getAttribute("data-friend-action") || "";
    const session = getSession();
    const ownerId = session?.id;
    if (!ownerId) {
      closeFriendsContextMenu();
      return;
    }

    const contact = getContactsForOwner(ownerId).find((c) => c.id === activeFriendContextId);
    if (!contact) {
      closeFriendsContextMenu();
      return;
    }

    if (action === "favorite") {
      upsertContact(ownerId, activeFriendContextId, { favorite: !Boolean(contact.favorite) });
    } else if (action === "block") {
      if (activeFriendContextId === ownerId) {
        closeFriendsContextMenu();
        return;
      }

      const blocked = !Boolean(contact.blocked);
      upsertContact(ownerId, activeFriendContextId, { blocked, favorite: blocked ? false : Boolean(contact.favorite) });
      selectedFriends.delete(activeFriendContextId);
      ccRecipients = ccRecipients.filter((id) => id !== activeFriendContextId);
    } else if (action === "remove") {
      removeContact(ownerId, activeFriendContextId);
      selectedFriends.delete(activeFriendContextId);
      ccRecipients = ccRecipients.filter((id) => id !== activeFriendContextId);
    }

    closeFriendsContextMenu();
    renderComposeContacts();
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) {
      return;
    }

    if (friendsContextMenuEl && !friendsContextMenuEl.contains(event.target)) {
      closeFriendsContextMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeFriendsContextMenu();
    }
  });
}

function openFriendsContextMenu(contact, x, y) {
  ensureFriendsContextMenu();
  if (!friendsContextMenuEl) {
    return;
  }

  const ownerId = getSession()?.id || "";
  const isSelfContact = ownerId && contact.id === ownerId;

  activeFriendContextId = contact.id;
  const favoriteBtn = friendsContextMenuEl.querySelector('[data-friend-action="favorite"]');
  const blockBtn = friendsContextMenuEl.querySelector('[data-friend-action="block"]');

  if (favoriteBtn) {
    favoriteBtn.textContent = contact.favorite ? "Unfavorite" : "Favorite";
    favoriteBtn.toggleAttribute("disabled", Boolean(contact.blocked));
  }
  if (blockBtn) {
    blockBtn.textContent = contact.blocked ? "Unblock" : "Block";
    blockBtn.toggleAttribute("disabled", Boolean(isSelfContact));
  }

  const maxX = window.innerWidth - 190;
  const maxY = window.innerHeight - 150;
  friendsContextMenuEl.style.left = `${Math.max(8, Math.min(x, maxX))}px`;
  friendsContextMenuEl.style.top = `${Math.max(8, Math.min(y, maxY))}px`;
  friendsContextMenuEl.classList.remove("hidden");
}

function renderFriendsList() {
  if (!friendsListEl) {
    return;
  }

  const session = getSession();
  const ownerId = session?.id;
  const contacts = ownerId ? getContactsForOwner(ownerId) : [];

  if (!ownerId || !contacts.length) {
    friendsListEl.innerHTML = `<p class="friends-empty">${!ownerId ? "Unlock an account to see friends." : "No contacts yet. Send an invite or message with 'Add to friends' enabled."}</p>`;
    return;
  }

  ensureFriendsContextMenu();
  const sorted = [...contacts].sort((a, b) => {
    if (Boolean(a.favorite) !== Boolean(b.favorite)) {
      return a.favorite ? -1 : 1;
    }
    if (Boolean(a.blocked) !== Boolean(b.blocked)) {
      return a.blocked ? 1 : -1;
    }
    return String(a.nickname || a.id).localeCompare(String(b.nickname || b.id));
  });

  friendsListEl.innerHTML = sorted
    .map((c) => {
      const nick = String(c.nickname || "").trim();
      const initials = friendInitials(c);
      const isBlocked = Boolean(c.blocked);
      const isFavorite = Boolean(c.favorite);
      const isSelected = !isBlocked && selectedFriends.has(c.id);
      const cardClass = `${isSelected ? "friend-card friend-card-selected" : "friend-card"}${isBlocked ? " friend-card-blocked" : ""}`;
      const checkmark = isSelected ? "&#10003;" : "";
      const badges = `${isFavorite ? '<span class="friend-tag friend-tag-favorite">Favorite</span>' : ""}${isBlocked ? '<span class="friend-tag friend-tag-blocked">Blocked</span>' : ""}`;
      return `
        <button type="button" class="${cardClass}" data-friend-toggle="${sanitize(c.id)}" data-friend-id="${sanitize(c.id)}">
          <div class="friend-avatar">${sanitize(initials)}</div>
          <div class="friend-info">
            <span class="friend-id">${sanitize(c.id)}</span>
            <span class="friend-nickname">${sanitize(nick || "(no nickname)")}</span>
            <span class="friend-tags">${badges}</span>
          </div>
          <div class="friend-check" aria-hidden="true">${checkmark}</div>
        </button>
      `;
    })
    .join("");
}

function renderCcChips() {
  if (!ccChipsEl || !ccChipRowEl) {
    return;
  }

  ccChipRowEl.classList.toggle("hidden", ccRecipients.length === 0);

  const session = getSession();
  const ownerId = session?.id;

  ccChipsEl.innerHTML = ccRecipients
    .map((id) => {
      const label = displayIdForViewer(ownerId, id);
      return `
        <span class="cc-chip">
          ${sanitize(label)}
          <button type="button" class="cc-chip-remove" data-remove-cc="${sanitize(id)}" aria-label="Remove ${sanitize(label)} from CC">&times;</button>
        </span>
      `;
    })
    .join("");
}

function openFriendsDrawer() {
  if (!friendsDrawerEl || !friendsDrawerOverlayEl) {
    return;
  }

  renderFriendsList();
  friendsDrawerEl.classList.remove("friends-drawer-closed");
  friendsDrawerEl.classList.add("friends-drawer-open");
  friendsDrawerOverlayEl.classList.remove("hidden");
  friendsDrawerOverlayEl.setAttribute("aria-hidden", "false");
}

function closeFriendsDrawer() {
  if (!friendsDrawerEl || !friendsDrawerOverlayEl) {
    return;
  }

  friendsDrawerEl.classList.add("friends-drawer-closed");
  friendsDrawerEl.classList.remove("friends-drawer-open");
  friendsDrawerOverlayEl.classList.add("hidden");
  friendsDrawerOverlayEl.setAttribute("aria-hidden", "true");
}

function renderComposeContacts() {
  const listEl = document.getElementById("toIdSuggestions");
  const session = getSession();
  const ownerId = session?.id;
  const contacts = ownerId ? getContactsForOwner(ownerId) : [];
  const activeContacts = contacts.filter((c) => !c.blocked);

  if (listEl) {
    if (!ownerId || !activeContacts.length) {
      listEl.innerHTML = "";
    } else {
      listEl.innerHTML = activeContacts
        .map((c) => {
          const nick = String(c.nickname || "").trim();
          const display = nick ? `${nick} (${c.id})` : c.id;
          const nickOption = nick ? `<option value="${sanitize(nick)}"></option>` : "";
          return `${nickOption}<option value="${sanitize(c.id)}" label="${sanitize(display)}"></option>`;
        })
        .join("");
    }
  }

  // Render contacts in the v2 right panel
  const panelList = document.getElementById("composeContacts");
  if (panelList) {
    if (!panelList.dataset.composeContactsBound) {
      const appendContactToToField = (id) => {
        const toInput = document.getElementById("toId");
        if (!toInput || !id) {
          return;
        }

        const current = toInput.value.trim();
        toInput.value = current ? current.replace(/,\s*$/, "") + ", " + id : id;
        toInput.setCustomValidity("");
        scheduleComposeDraftAutosave();
      };

      panelList.addEventListener("click", (e) => {
        const openBtn = e.target instanceof HTMLElement && e.target.closest("[data-open-friends]");
        if (openBtn) {
          openFriendsDrawer();
          return;
        }

        const item = e.target instanceof HTMLElement && e.target.closest("[data-contact-id]");
        if (!item) {
          return;
        }

        const id = item.getAttribute("data-contact-id") || "";
        appendContactToToField(id);
      });

      panelList.addEventListener("keydown", (e) => {
        if (!(e.target instanceof HTMLElement)) {
          return;
        }

        const item = e.target.closest("[data-contact-id]");
        if (!item) {
          return;
        }

        if (e.key !== "Enter" && e.key !== " ") {
          return;
        }

        e.preventDefault();
        const id = item.getAttribute("data-contact-id") || "";
        appendContactToToField(id);
      });
      panelList.dataset.composeContactsBound = "1";
    }

    if (!ownerId || !activeContacts.length) {
      panelList.innerHTML = `<div class="compose-panel-empty">
        <svg class="compose-panel-empty-icon" width="54" height="48" viewBox="0 0 54 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <ellipse cx="27" cy="44" rx="20" ry="3" fill="#1e2a45"/>
          <circle cx="19" cy="18" r="10" fill="#1e2a45" stroke="#3a4f80" stroke-width="1.5"/>
          <circle cx="35" cy="18" r="10" fill="#182038" stroke="#3a4f80" stroke-width="1.5"/>
          <path d="M7 40c0-6.627 5.373-12 12-12h5M34 28h1c6.627 0 12 5.373 12 12" stroke="#3a4f80" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="19" cy="18" r="5" fill="#2e3f66"/><circle cx="35" cy="18" r="5" fill="#263559"/>
          <path d="M22 38h10" stroke="#7c9cff" stroke-width="2" stroke-linecap="round"/>
          <path d="M27 33v10" stroke="#7c9cff" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p class="compose-panel-empty-text muted">No contacts yet</p>
        <button type="button" class="btn btn-secondary" data-open-friends="1">Invite teammate</button>
      </div>`;
    } else {
      panelList.innerHTML = activeContacts
        .map((c) => {
          const nick = String(c.nickname || "").trim();
          const label = sanitize(nick || c.id);
          const initial = sanitize((nick || c.id).slice(0, 2).toUpperCase());
          return `<div class="compose-panel-contact-item" data-contact-id="${sanitize(c.id)}" role="button" tabindex="0" title="${sanitize(c.id)}">
            <div class="compose-panel-contact-avatar">${initial}</div>
            <span class="compose-panel-contact-name">${label}</span>
          </div>`;
        })
        .join("");
    }
  }

  // Also refresh recent chips
  if (typeof renderComposeRecentChips === "function") renderComposeRecentChips();

  renderFriendsList();
  renderCcChips();
}

function getToolsState() {
  return loadJson(STORAGE_KEYS.tools, {});
}

function saveToolsState(state) {
  saveJson(STORAGE_KEYS.tools, state);
}

function saveServerToolsState(state) {
  saveJson(STORAGE_KEYS.serverTools, state);
}

function getWatchPartyRoomsState() {
  return loadJson(STORAGE_KEYS.watchPartyRooms, {});
}

function saveWatchPartyRoomsState(state) {
  saveJson(STORAGE_KEYS.watchPartyRooms, state);
}

function normalizeWatchPartyRoomCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 20);
}

function randomWatchPartyRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `WP-${suffix}`;
}

function parseYouTubeVideoId(rawInput) {
  const input = String(rawInput || "").trim();
  if (!input) {
    return null;
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  const withScheme = /^[a-z]+:\/\//i.test(input) ? input : `https://${input}`;

  try {
    const url = new URL(withScheme);
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();

    if (host === "youtu.be") {
      const firstPath = url.pathname.split("/").filter(Boolean)[0] || "";
      return /^[a-zA-Z0-9_-]{11}$/.test(firstPath) ? firstPath : null;
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const watchParam = url.searchParams.get("v") || "";
      if (/^[a-zA-Z0-9_-]{11}$/.test(watchParam)) {
        return watchParam;
      }

      const parts = url.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "live");
      if (idx >= 0 && /^[a-zA-Z0-9_-]{11}$/.test(parts[idx + 1] || "")) {
        return parts[idx + 1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

function getWatchPartyEmbedUrl(videoId) {
  if (!videoId) {
    return "about:blank";
  }

  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
  });

  if (/^https?:$/i.test(window.location.protocol)) {
    params.set("origin", window.location.origin);
    params.set("widget_referrer", window.location.href);
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function clearWatchPartyEmbedProbe() {
  if (watchPartyEmbedProbeTimer) {
    clearTimeout(watchPartyEmbedProbeTimer);
    watchPartyEmbedProbeTimer = null;
  }
  watchPartyEmbedProbe = null;
}

function startWatchPartyEmbedProbe(roomCode, videoId) {
  if (!roomCode || !videoId) {
    clearWatchPartyEmbedProbe();
    return;
  }

  if (watchPartyEmbedProbe && watchPartyEmbedProbe.roomCode === roomCode && watchPartyEmbedProbe.videoId === videoId) {
    return;
  }

  clearWatchPartyEmbedProbe();
  watchPartyEmbedProbe = {
    roomCode,
    videoId,
  };

  watchPartyEmbedProbeTimer = setTimeout(() => {
    const probe = watchPartyEmbedProbe;
    clearWatchPartyEmbedProbe();

    if (!probe || activeWatchPartyRoomCode !== probe.roomCode) {
      return;
    }

    const failure = registerWatchPartyEmbedFailure(probe.roomCode, probe.videoId);
    if (!failure) {
      return;
    }

    if (failure.autoSwitched) {
      renderWatchPartyState("Inline playback failed repeatedly in this environment. Switched to YouTube Mode automatically.", "warn");
      return;
    }

    setStatus(watchPartyStatusEl, "Inline embed did not initialize. If this repeats, the room will auto-switch to YouTube Mode.", "warn");
  }, WATCH_PARTY_EMBED_READY_TIMEOUT_MS);
}

function registerWatchPartyEmbedFailure(roomCode, videoId) {
  if (!roomCode || !videoId) {
    return null;
  }

  const rooms = getWatchPartyRoomsState();
  const roomState = rooms[roomCode];
  if (!roomState || roomState.videoId !== videoId || roomState.videoMode === "link") {
    return null;
  }

  const nextFailures = Number(roomState.embedFailureCount || 0) + 1;
  const shouldAutoSwitch = nextFailures >= WATCH_PARTY_EMBED_FAIL_MAX;

  rooms[roomCode] = {
    ...roomState,
    embedFailureCount: nextFailures,
    videoMode: shouldAutoSwitch ? "link" : roomState.videoMode,
    updatedAt: new Date().toISOString(),
  };
  saveWatchPartyRoomsState(rooms);
  if (activeWatchPartyRoomCode === roomCode) {
    activeWatchPartyRoomState = rooms[roomCode];
  }

  return {
    autoSwitched: shouldAutoSwitch,
    failureCount: nextFailures,
  };
}

function markWatchPartyEmbedProbeReady(videoId) {
  if (!watchPartyEmbedProbe || !videoId || watchPartyEmbedProbe.videoId !== videoId) {
    return;
  }

  const probe = watchPartyEmbedProbe;
  clearWatchPartyEmbedProbe();

  const rooms = getWatchPartyRoomsState();
  const roomState = rooms[probe.roomCode];
  if (!roomState || roomState.videoId !== videoId) {
    return;
  }

  if (Number(roomState.embedFailureCount || 0) > 0) {
    rooms[probe.roomCode] = {
      ...roomState,
      embedFailureCount: 0,
      updatedAt: new Date().toISOString(),
    };
    saveWatchPartyRoomsState(rooms);
    if (activeWatchPartyRoomCode === probe.roomCode) {
      activeWatchPartyRoomState = rooms[probe.roomCode];
    }
  }
}

async function checkYouTubeEmbeddable(videoId) {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
      signal: controller.signal,
    });

    if (response.ok) {
      return true;
    }

    if (response.status === 401 || response.status === 403 || response.status === 404) {
      return false;
    }

    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function getCurrentWatchPartyAccount() {
  const session = getSession();
  const account = session ? getAccounts().find((a) => a.id === session.id) : null;
  if (!account || !hasToolsAccess(account.plan, account.id)) {
    return null;
  }
  return account;
}

function getWatchPartyInviteLink(roomCode) {
  const url = new URL(window.location.href);
  url.searchParams.set("room", roomCode);
  return url.toString();
}

function updateWatchPartyQueryParam(roomCode) {
  const url = new URL(window.location.href);
  if (roomCode) {
    url.searchParams.set("room", roomCode);
  } else {
    url.searchParams.delete("room");
  }
  window.history.replaceState({}, "", url.toString());
}

function renderWatchPartyState(statusText, tone = "muted") {
  if (!watchPartyHeadingEl || !watchPartyNowPlayingEl || !watchPartyFrameEl) {
    return;
  }

  const roomCode = activeWatchPartyRoomCode;
  const roomState = activeWatchPartyRoomState;
  const account = getCurrentWatchPartyAccount();
  const isHost = Boolean(account && roomState && roomState.hostId === account.id);

  if (watchPartyRoomInputEl && roomCode) {
    watchPartyRoomInputEl.value = roomCode;
  }

  if (!roomCode || !roomState) {
    watchPartyHeadingEl.textContent = "No room selected";
    watchPartyNowPlayingEl.textContent = "Join or create a room to start watching.";
    watchPartyFrameEl.src = "about:blank";
    if (watchPartyInviteLinkEl) {
      watchPartyInviteLinkEl.value = "";
    }
    if (watchPartyHostPanelEl) {
      watchPartyHostPanelEl.classList.add("hidden");
    }
    if (watchPartyOpenYoutubeLinkEl) {
      watchPartyOpenYoutubeLinkEl.classList.add("hidden");
      watchPartyOpenYoutubeLinkEl.href = "#";
    }
    if (watchPartyToggleModeBtn) {
      watchPartyToggleModeBtn.classList.add("hidden");
      watchPartyToggleModeBtn.textContent = "Use YouTube Mode";
    }
    if (statusText) {
      setStatus(watchPartyStatusEl, statusText, tone);
    }
    return;
  }

  watchPartyHeadingEl.textContent = `Room ${roomCode}`;
  if (watchPartyInviteLinkEl) {
    watchPartyInviteLinkEl.value = getWatchPartyInviteLink(roomCode);
  }

  if (watchPartyHostPanelEl) {
    watchPartyHostPanelEl.classList.toggle("hidden", !isHost);
  }

  const videoId = roomState.videoId || "";
  const videoMode = roomState.videoMode === "link" ? "link" : "embed";
  const inFileProtocol = /^file:$/i.test(window.location.protocol);
  const shouldEmbed = Boolean(videoId) && !inFileProtocol && videoMode === "embed";
  watchPartyFrameEl.src = shouldEmbed ? getWatchPartyEmbedUrl(videoId) : "about:blank";
  if (shouldEmbed) {
    startWatchPartyEmbedProbe(roomCode, videoId);
  } else {
    clearWatchPartyEmbedProbe();
  }

  if (watchPartyOpenYoutubeLinkEl) {
    if (videoId) {
      watchPartyOpenYoutubeLinkEl.href = `https://www.youtube.com/watch?v=${videoId}`;
      watchPartyOpenYoutubeLinkEl.classList.remove("hidden");
    } else {
      watchPartyOpenYoutubeLinkEl.href = "#";
      watchPartyOpenYoutubeLinkEl.classList.add("hidden");
    }
  }

  if (watchPartyToggleModeBtn) {
    const canToggle = Boolean(isHost && videoId);
    watchPartyToggleModeBtn.classList.toggle("hidden", !canToggle);
    watchPartyToggleModeBtn.textContent = videoMode === "link" ? "Try Inline Embed" : "Use YouTube Mode";
  }

  if (videoId) {
    if (inFileProtocol) {
      watchPartyNowPlayingEl.textContent = `Now playing: ${videoId}. Embedded playback is blocked on local file pages, use Open Video On YouTube.`;
    } else if (videoMode === "link") {
      const failCount = Number(roomState.embedFailureCount || 0);
      if (failCount >= WATCH_PARTY_EMBED_FAIL_MAX) {
        watchPartyNowPlayingEl.textContent = `Now playing: ${videoId}. Inline playback is unavailable in this environment, use Open Video On YouTube.`;
      } else {
        watchPartyNowPlayingEl.textContent = `Now playing: ${videoId}. This video is restricted from embedding, use Open Video On YouTube.`;
      }
    } else {
      watchPartyNowPlayingEl.textContent = `Now playing: ${videoId} ${isHost ? "(you are host)" : `(host ${roomState.hostId})`}`;
    }
  } else {
    watchPartyNowPlayingEl.textContent = isHost
      ? "No video set yet. Paste a YouTube URL or video ID to start playback."
      : `Waiting for host ${roomState.hostId} to set a video.`;
  }

  if (statusText) {
    setStatus(watchPartyStatusEl, statusText, tone);
  }
}

function joinWatchPartyRoom(roomCode, options = {}) {
  const normalizedCode = normalizeWatchPartyRoomCode(roomCode);
  if (!normalizedCode) {
    renderWatchPartyState("Enter a valid room code.", "warn");
    return false;
  }

  const rooms = getWatchPartyRoomsState();
  const roomState = rooms[normalizedCode];
  if (!roomState) {
    renderWatchPartyState(`Room ${normalizedCode} was not found.`, "warn");
    return false;
  }

  activeWatchPartyRoomCode = normalizedCode;
  activeWatchPartyRoomState = roomState;

  saveToolsForAccount({
    watchParty: {
      lastRoomCode: normalizedCode,
    },
  });

  if (!options.skipQueryUpdate) {
    updateWatchPartyQueryParam(normalizedCode);
  }

  const statusText = options.statusText || `Joined room ${normalizedCode}.`;
  const tone = options.tone || "ok";
  renderWatchPartyState(statusText, tone);
  return true;
}

function createWatchPartyRoom() {
  const account = getCurrentWatchPartyAccount();
  if (!account) {
    renderWatchPartyState("Gold/Enterprise plan required.", "warn");
    return;
  }

  const proposed = normalizeWatchPartyRoomCode(watchPartyRoomInputEl?.value);
  const roomCode = proposed || randomWatchPartyRoomCode();
  const rooms = getWatchPartyRoomsState();
  const existing = rooms[roomCode];

  if (existing && existing.hostId !== account.id) {
    activeWatchPartyRoomCode = roomCode;
    activeWatchPartyRoomState = existing;
    renderWatchPartyState(`Room ${roomCode} already exists. Joined as participant.`, "warn");
    return;
  }

  rooms[roomCode] = {
    hostId: account.id,
    videoId: existing?.videoId || "",
    videoMode: existing?.videoMode === "link" ? "link" : "embed",
    embedFailureCount: Number(existing?.embedFailureCount || 0),
    updatedAt: new Date().toISOString(),
  };
  saveWatchPartyRoomsState(rooms);

  joinWatchPartyRoom(roomCode, {
    statusText: `Created and joined room ${roomCode} as host.`,
    tone: "ok",
  });
}

async function setWatchPartyVideo(videoInput) {
  const account = getCurrentWatchPartyAccount();
  if (!account || !activeWatchPartyRoomCode) {
    renderWatchPartyState("Create or join a room first.", "warn");
    return;
  }

  const rooms = getWatchPartyRoomsState();
  const roomState = rooms[activeWatchPartyRoomCode];
  if (!roomState) {
    renderWatchPartyState("Room is no longer available.", "warn");
    return;
  }

  if (roomState.hostId !== account.id) {
    renderWatchPartyState("Only the host can control playback.", "warn");
    return;
  }

  const videoId = parseYouTubeVideoId(videoInput);
  if (!videoId) {
    renderWatchPartyState("Enter a valid YouTube URL or 11-character video ID.", "warn");
    return;
  }

  setStatus(watchPartyStatusEl, "Checking video playback availability...", "muted");
  const embeddable = await checkYouTubeEmbeddable(videoId);
  const videoMode = embeddable === false ? "link" : "embed";

  rooms[activeWatchPartyRoomCode] = {
    ...roomState,
    videoId,
    videoMode,
    embedFailureCount: 0,
    updatedAt: new Date().toISOString(),
  };
  saveWatchPartyRoomsState(rooms);

  activeWatchPartyRoomState = rooms[activeWatchPartyRoomCode];
  if (watchPartyVideoUrlEl) {
    watchPartyVideoUrlEl.value = "";
  }

  if (videoMode === "link") {
    renderWatchPartyState(
      `Playback set to ${videoId}. This video is blocked from embedding, so participants should use Open Video On YouTube.`,
      "warn"
    );
    return;
  }

  renderWatchPartyState(`Playback updated to ${videoId}.`, "ok");
}

function clearWatchPartyVideo() {
  const account = getCurrentWatchPartyAccount();
  if (!account || !activeWatchPartyRoomCode) {
    renderWatchPartyState("Create or join a room first.", "warn");
    return;
  }

  const rooms = getWatchPartyRoomsState();
  const roomState = rooms[activeWatchPartyRoomCode];
  if (!roomState) {
    renderWatchPartyState("Room is no longer available.", "warn");
    return;
  }

  if (roomState.hostId !== account.id) {
    renderWatchPartyState("Only the host can control playback.", "warn");
    return;
  }

  rooms[activeWatchPartyRoomCode] = {
    ...roomState,
    videoId: "",
    videoMode: "embed",
    embedFailureCount: 0,
    updatedAt: new Date().toISOString(),
  };
  saveWatchPartyRoomsState(rooms);

  activeWatchPartyRoomState = rooms[activeWatchPartyRoomCode];
  renderWatchPartyState("Playback cleared.", "ok");
}

function toggleWatchPartyPlaybackMode() {
  const account = getCurrentWatchPartyAccount();
  if (!account || !activeWatchPartyRoomCode) {
    renderWatchPartyState("Create or join a room first.", "warn");
    return;
  }

  const rooms = getWatchPartyRoomsState();
  const roomState = rooms[activeWatchPartyRoomCode];
  if (!roomState) {
    renderWatchPartyState("Room is no longer available.", "warn");
    return;
  }

  if (roomState.hostId !== account.id) {
    renderWatchPartyState("Only the host can change playback mode.", "warn");
    return;
  }

  if (!roomState.videoId) {
    renderWatchPartyState("Set a video first.", "warn");
    return;
  }

  const nextMode = roomState.videoMode === "link" ? "embed" : "link";
  rooms[activeWatchPartyRoomCode] = {
    ...roomState,
    videoMode: nextMode,
    embedFailureCount: nextMode === "embed" ? 0 : Number(roomState.embedFailureCount || 0),
    updatedAt: new Date().toISOString(),
  };
  saveWatchPartyRoomsState(rooms);

  activeWatchPartyRoomState = rooms[activeWatchPartyRoomCode];
  if (nextMode === "link") {
    renderWatchPartyState("Switched to YouTube Mode. Participants should use Open Video On YouTube.", "warn");
  } else {
    renderWatchPartyState("Switched to inline embed mode.", "ok");
  }
}

function syncActiveWatchPartyFromStorage() {
  if (!activeWatchPartyRoomCode) {
    return;
  }

  const rooms = getWatchPartyRoomsState();
  const latest = rooms[activeWatchPartyRoomCode] || null;
  if (!latest) {
    activeWatchPartyRoomState = null;
    renderWatchPartyState(`Room ${activeWatchPartyRoomCode} is no longer available.`, "warn");
    return;
  }

  const wasVideo = activeWatchPartyRoomState?.videoId || "";
  const nowVideo = latest.videoId || "";
  activeWatchPartyRoomState = latest;

  const changed = wasVideo !== nowVideo;
  if (changed) {
    renderWatchPartyState("Host updated playback.", "ok");
    return;
  }

  renderWatchPartyState();
}

function getWordEditorHtml() {
  if (!wordEditorEl) {
    return "";
  }

  if ("value" in wordEditorEl) {
    return wordEditorEl.value;
  }

  return wordEditorEl.innerHTML;
}

function setWordEditorHtml(content) {
  if (!wordEditorEl) {
    return;
  }

  if ("value" in wordEditorEl) {
    wordEditorEl.value = content;
    return;
  }

  wordEditorEl.innerHTML = content;
}

function getWordEditorPlainText() {
  if (!wordEditorEl) {
    return "";
  }

  if ("value" in wordEditorEl) {
    return wordEditorEl.value;
  }

  return wordEditorEl.innerText;
}

function runWordCommand(command, value) {
  if (!wordEditorEl || typeof document.execCommand !== "function") {
    return;
  }

  wordEditorEl.focus();
  document.execCommand(command, false, value);
}

function updateWordStats() {
  if (!wordEditorEl || !wordCountEl || !wordReadingTimeEl) {
    return;
  }

  const text = getWordEditorPlainText().trim();
  const words = text ? text.split(/\s+/).length : 0;
  const minutes = Math.max(0, Math.ceil(words / 200));

  wordCountEl.textContent = `Words: ${words}`;
  wordReadingTimeEl.textContent = `Read time: ${minutes} min`;
}

function switchWordRibbonTab(tabName) {
  const tabs = document.querySelectorAll("[data-word-tab]");
  const panels = document.querySelectorAll("[data-word-panel]");

  for (const tab of tabs) {
    const active = tab.getAttribute("data-word-tab") === tabName;
    tab.classList.toggle("word-ribbon-tab-active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
  }

  for (const panel of panels) {
    const active = panel.getAttribute("data-word-panel") === tabName;
    panel.classList.toggle("word-ribbon-panel-active", active);
  }
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function toAsciiPdfSafe(text) {
  return String(text || "")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)")
    .replace(/[^\x20-\x7E]/g, "?");
}

function wrapTextLines(text, maxLen = 88) {
  const lines = [];
  const rawLines = String(text || "").replace(/\r\n?/g, "\n").split("\n");

  for (const raw of rawLines) {
    const line = raw.trimEnd();
    if (!line) {
      lines.push("");
      continue;
    }

    let start = 0;
    while (start < line.length) {
      lines.push(line.slice(start, start + maxLen));
      start += maxLen;
    }
  }

  return lines.slice(0, 48);
}

function buildSimplePdfContent(text) {
  const lines = wrapTextLines(text);
  const contentLines = ["BT", "/F1 11 Tf", "50 760 Td", "15 TL"];

  if (!lines.length) {
    contentLines.push("( ) Tj");
  } else {
    lines.forEach((line, idx) => {
      const safe = toAsciiPdfSafe(line);
      contentLines.push(`(${safe}) Tj`);
      if (idx < lines.length - 1) {
        contentLines.push("T*");
      }
    });
  }

  contentLines.push("ET");
  const stream = contentLines.join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((obj, idx) => {
    offsets.push(pdf.length);
    pdf += `${idx + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return pdf;
}

function toRtfSafe(text) {
  return String(text || "")
    .replaceAll("\\", "\\\\")
    .replaceAll("{", "\\{")
    .replaceAll("}", "\\}")
    .replace(/\r\n?/g, "\n")
    .replace(/\n/g, "\\par\n")
    .replace(/[\u0080-\uFFFF]/g, (ch) => `\\u${ch.charCodeAt(0)}?`);
}

function buildSimpleRtfContent(text) {
  const safe = toRtfSafe(text);
  return `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Calibri;}}\\fs22 ${safe}}`;
}

function readCurrentCalculatorState() {
  const expression = calcExpressionEl?.value.trim() || "";
  const mode = calcModeEl?.value === "scientific" ? "scientific" : "basic";
  const resultText = calcResultEl?.textContent || "Result: 0";
  const match = resultText.match(/Result:\s*(.*)$/);
  const result = match ? match[1] : "0";
  return { expression, result, mode };
}

function setCalculatorMode(mode) {
  const resolved = mode === "scientific" ? "scientific" : "basic";
  if (calcModeEl) {
    calcModeEl.value = resolved;
  }
  if (calcScientificPadEl) {
    calcScientificPadEl.classList.toggle("hidden", resolved !== "scientific");
  }
}

function renderCalculatorHistory(history) {
  if (!calcHistoryEl) {
    return;
  }

  const items = Array.isArray(history) ? history : [];
  if (!items.length) {
    calcHistoryEl.classList.add("muted");
    calcHistoryEl.textContent = "No calculations yet.";
    return;
  }

  calcHistoryEl.classList.remove("muted");
  calcHistoryEl.innerHTML = items
    .slice(0, 10)
    .map((item) => `<div class="calc-history-item">${sanitize(item.expression)} = ${sanitize(String(item.result))}</div>`)
    .join("");
}

function evaluateCalculatorExpression(expression) {
  const input = String(expression || "").trim();
  const scientific = calcModeEl?.value === "scientific";
  if (!input) {
    return { ok: false, error: "Enter an expression first." };
  }

  if (!scientific && !/^[\d+\-*/().%\s]+$/.test(input)) {
    return { ok: false, error: "Basic mode allows numbers and + - * / % ( )." };
  }

  if (scientific && !/^[\dA-Za-z+\-*/().,%^\s]+$/.test(input)) {
    return { ok: false, error: "Scientific mode allows numbers, operators, and scientific functions." };
  }

  try {
    let expr = input;

    if (scientific) {
      const allowedWords = new Set(["sin", "cos", "tan", "sqrt", "log", "ln", "abs", "pow", "pi", "e"]);
      const words = expr.match(/[A-Za-z_]+/g) || [];
      for (const w of words) {
        if (!allowedWords.has(w.toLowerCase())) {
          return { ok: false, error: `Unsupported token: ${w}` };
        }
      }

      expr = expr.replace(/\^/g, "**");
      expr = expr.replace(/\bpi\b/gi, "Math.PI");
      expr = expr.replace(/\be\b/gi, "Math.E");
      expr = expr.replace(/\bsin\b/gi, "Math.sin");
      expr = expr.replace(/\bcos\b/gi, "Math.cos");
      expr = expr.replace(/\btan\b/gi, "Math.tan");
      expr = expr.replace(/\bsqrt\b/gi, "Math.sqrt");
      expr = expr.replace(/\babs\b/gi, "Math.abs");
      expr = expr.replace(/\bpow\b/gi, "Math.pow");
      expr = expr.replace(/\blog\b/gi, "Math.log10");
      expr = expr.replace(/\bln\b/gi, "Math.log");
    }

    const value = Function(`"use strict"; return (${expr});`)();
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return { ok: false, error: "Expression did not produce a finite number." };
    }
    return { ok: true, value };
  } catch {
    return { ok: false, error: "Invalid expression." };
  }
}

function evaluateAndPersistCalculator(source = "Saved") {
  if (!calcExpressionEl || !calcResultEl) {
    return;
  }

  const expression = calcExpressionEl.value.trim();
  const evaluation = evaluateCalculatorExpression(expression);
  if (!evaluation.ok) {
    calcResultEl.textContent = `Result: ${evaluation.error}`;
    setStatus(calcSavedAtEl, evaluation.error, "warn");
    return;
  }

  const value = Number(evaluation.value);
  const formatted = Number.isInteger(value) ? String(value) : String(Number(value.toFixed(12)));
  calcResultEl.textContent = `Result: ${formatted}`;

  const current = getToolsState();
  const session = getSession();
  const accountId = session?.id;
  const prevHistory = accountId ? (current[accountId]?.calculator?.history || []) : [];
  const history = [{ expression, result: formatted, at: new Date().toISOString() }, ...prevHistory].slice(0, 25);

  const saved = saveToolsForAccount({
    calculator: {
      expression,
      mode: calcModeEl?.value === "scientific" ? "scientific" : "basic",
      result: formatted,
      history,
    },
  });

  if (!saved) {
    setStatus(calcSavedAtEl, "Cannot save. Gold/Enterprise plan required.", "warn");
    return;
  }

  renderCalculatorHistory(history);
  setStatus(calcSavedAtEl, `${source} ${new Date(saved.updatedAt).toLocaleTimeString()}`, "ok");
}

function parseMetricsNumberList(raw) {
  return String(raw || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => Number(v));
}

function parseMetricsLabelList(raw, count) {
  const parsed = String(raw || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  if (parsed.length === count) {
    return parsed;
  }

  return Array.from({ length: count }, (_, idx) => `P${idx + 1}`);
}

function formatMetricsValue(value, mode) {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return "-";
  }

  if (mode === "currency") {
    return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (mode === "percent") {
    return `${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  }

  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function parseOptionalMetricsNumber(raw) {
  const value = String(raw || "").trim();
  if (!value) {
    return null;
  }

  const normalized = value.replaceAll(",", "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function computeMetricsMovingAverage(values, windowSize) {
  const window = Number(windowSize);
  if (!Number.isInteger(window) || window < 2) {
    return [];
  }

  const output = [];
  let running = 0;
  for (let i = 0; i < values.length; i += 1) {
    running += values[i];
    if (i >= window) {
      running -= values[i - window];
    }
    output.push(i >= window - 1 ? running / window : NaN);
  }

  return output;
}

function computeMetricsStdDev(values) {
  if (!values.length) {
    return 0;
  }

  const mean = values.reduce((acc, v) => acc + v, 0) / values.length;
  const variance = values.reduce((acc, v) => {
    const diff = v - mean;
    return acc + diff * diff;
  }, 0) / values.length;
  return Math.sqrt(variance);
}

function renderMetricsInsights(insights, mode) {
  if (!metricsInsightsEl) {
    return;
  }

  if (!insights) {
    metricsInsightsEl.classList.add("muted");
    metricsInsightsEl.textContent = "Render a chart to generate insights.";
    return;
  }

  metricsInsightsEl.classList.remove("muted");
  metricsInsightsEl.innerHTML = `
    <ul>
      <li>${sanitize(`Top point: ${insights.topLabel} (${formatMetricsValue(insights.topValue, mode)})`)}</li>
      <li>${sanitize(`Lowest point: ${insights.lowLabel} (${formatMetricsValue(insights.lowValue, mode)})`)}</li>
      <li>${sanitize(`Change from first to last: ${insights.netChangePct.toFixed(2)}%`)}</li>
      <li>${sanitize(`Target hit rate: ${insights.hitRate.toFixed(1)}%`)}</li>
      <li>${sanitize(`Volatility (std dev): ${formatMetricsValue(insights.stdDev, mode)}`)}</li>
      <li>${sanitize(`Anomalies detected: ${insights.anomalyCount}`)}</li>
    </ul>
  `;
}

function renderMetricsSummary(summary, mode) {
  if (!metricsSummaryEl) {
    return;
  }

  if (!summary) {
    metricsSummaryEl.classList.add("muted");
    metricsSummaryEl.textContent = "Render a chart to view KPI summary.";
    return;
  }

  const growthClass = summary.growth >= 0 ? "metrics-good" : "metrics-bad";
  const deltaClass = summary.avgDelta >= 0 ? "metrics-good" : "metrics-bad";

  metricsSummaryEl.classList.remove("muted");
  metricsSummaryEl.innerHTML = `
    <article class="metrics-kpi">
      <span class="metrics-kpi-label">Total</span>
      <span class="metrics-kpi-value">${sanitize(formatMetricsValue(summary.total, mode))}</span>
    </article>
    <article class="metrics-kpi">
      <span class="metrics-kpi-label">Average</span>
      <span class="metrics-kpi-value">${sanitize(formatMetricsValue(summary.average, mode))}</span>
    </article>
    <article class="metrics-kpi">
      <span class="metrics-kpi-label">Growth</span>
      <span class="metrics-kpi-value ${growthClass}">${sanitize(summary.growth.toFixed(2))}%</span>
    </article>
    <article class="metrics-kpi">
      <span class="metrics-kpi-label">Avg Vs Target</span>
      <span class="metrics-kpi-value ${deltaClass}">${sanitize(formatMetricsValue(summary.avgDelta, mode))}</span>
    </article>
    <article class="metrics-kpi">
      <span class="metrics-kpi-label">Peak</span>
      <span class="metrics-kpi-value">${sanitize(formatMetricsValue(summary.max, mode))}</span>
    </article>
    <article class="metrics-kpi">
      <span class="metrics-kpi-label">Lowest</span>
      <span class="metrics-kpi-value">${sanitize(formatMetricsValue(summary.min, mode))}</span>
    </article>
  `;
}

function renderMetricsTable(labels, primary, secondary, mode) {
  if (!metricsTableEl) {
    return;
  }

  const body = metricsTableEl.querySelector("tbody");
  if (!body) {
    return;
  }

  body.innerHTML = labels
    .map((label, idx) => {
      const p = primary[idx];
      const s = secondary[idx];
      const hasTarget = Number.isFinite(s);
      const delta = hasTarget ? p - s : null;
      const deltaPct = hasTarget && s !== 0 ? (delta / s) * 100 : null;
      const deltaClass = delta === null ? "" : delta >= 0 ? "metrics-good" : "metrics-bad";
      return `
        <tr>
          <td>${sanitize(label)}</td>
          <td>${sanitize(formatMetricsValue(p, mode))}</td>
          <td>${hasTarget ? sanitize(formatMetricsValue(s, mode)) : "-"}</td>
          <td class="${deltaClass}">${delta === null ? "-" : sanitize(formatMetricsValue(delta, mode))}</td>
          <td class="${deltaClass}">${deltaPct === null ? "-" : `${sanitize(deltaPct.toFixed(2))}%`}</td>
        </tr>
      `;
    })
    .join("");
}

function drawMetricsTooltip(ctx, x, y, text, cssWidth, cssHeight) {
  ctx.save();
  ctx.font = '11px "IBM Plex Mono", monospace';
  const padX = 8;
  const padY = 6;
  const textW = Math.ceil(ctx.measureText(text).width);
  const boxW = textW + padX * 2;
  const boxH = 24;

  let bx = x + 10;
  let by = y - boxH - 10;
  if (bx + boxW > cssWidth - 8) {
    bx = x - boxW - 10;
  }
  if (bx < 8) {
    bx = 8;
  }
  if (by < 8) {
    by = y + 10;
  }
  if (by + boxH > cssHeight - 8) {
    by = cssHeight - boxH - 8;
  }

  ctx.fillStyle = "#0a1020ee";
  ctx.strokeStyle = "#4f6fc3";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(bx, by, boxW, boxH, 7);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#e8efff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(text, bx + padX, by + boxH / 2);
  ctx.restore();
}

function isSameMetricsHover(a, b) {
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.kind === b.kind && a.series === b.series && a.index === b.index;
}

function findMetricsHoverTarget(state, x, y) {
  if (!state || !Array.isArray(state.hitAreas)) {
    return null;
  }

  let best = null;
  let bestDist = Infinity;

  for (const area of state.hitAreas) {
    if (area.kind === "point") {
      const dx = x - area.x;
      const dy = y - area.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= area.r + 4 && dist < bestDist) {
        best = area;
        bestDist = dist;
      }
      continue;
    }

    if (area.kind === "bar") {
      const inside = x >= area.x && x <= area.x + area.w && y >= area.y && y <= area.y + area.h;
      if (inside) {
        return area;
      }
    }

    if (area.kind === "slice") {
      const dx = x - area.cx;
      const dy = y - area.cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > area.r) {
        continue;
      }

      let angle = Math.atan2(dy, dx);
      if (angle < 0) {
        angle += Math.PI * 2;
      }
      const inSlice = area.startAngle <= area.endAngle
        ? angle >= area.startAngle && angle <= area.endAngle
        : angle >= area.startAngle || angle <= area.endAngle;
      if (inSlice) {
        return area;
      }
    }
  }

  return best;
}

function drawMetricsChart(title, chartType, labels, primary, secondary, mode, options = {}, hoverTarget = null) {
  if (!metricsCanvasEl) {
    return;
  }

  const ctx = metricsCanvasEl.getContext("2d");
  if (!ctx) {
    return;
  }

  const wrap = metricsCanvasEl.parentElement;
  const cssWidth = Math.max(620, Math.floor(wrap?.clientWidth || 960));
  const cssHeight = 400;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  metricsCanvasEl.width = Math.floor(cssWidth * dpr);
  metricsCanvasEl.height = Math.floor(cssHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, cssWidth, cssHeight);
  ctx.fillStyle = "#0f1628";
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  const margin = { top: 46, right: 24, bottom: 62, left: 72 };
  const plotW = cssWidth - margin.left - margin.right;
  const plotH = cssHeight - margin.top - margin.bottom;

  const trendSeries = Array.isArray(options.trendSeries) ? options.trendSeries : [];
  const benchmark = Number.isFinite(options.benchmark) ? Number(options.benchmark) : null;
  const anomalyIndexes = new Set(Array.isArray(options.anomalyIndexes) ? options.anomalyIndexes : []);
  const hitAreas = [];

  if (chartType === "pie") {
    const pieValues = primary.map((v) => Math.max(0, Number(v) || 0));
    let total = pieValues.reduce((acc, v) => acc + v, 0);
    if (!total) {
      for (let i = 0; i < primary.length; i += 1) {
        pieValues[i] = Math.abs(Number(primary[i]) || 0);
      }
      total = pieValues.reduce((acc, v) => acc + v, 0);
    }

    ctx.fillStyle = "#edf2ff";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = '600 14px "Space Grotesk", sans-serif';
    ctx.fillText(title || "Performance Chart", 22, 12);

    if (!total) {
      ctx.fillStyle = "#a7b6da";
      ctx.font = '13px "IBM Plex Mono", monospace';
      ctx.fillText("No positive values available for pie chart.", 22, 44);
      metricsChartRenderState = {
        title,
        chartType,
        labels: [...labels],
        primary: [...primary],
        secondary: [...secondary],
        mode,
        options: {
          ...options,
          trendSeries: [...trendSeries],
          anomalyIndexes: Array.from(anomalyIndexes),
          benchmark,
        },
        cssWidth,
        cssHeight,
        hitAreas,
      };
      return;
    }

    const centerX = Math.floor(cssWidth * 0.35);
    const centerY = Math.floor(cssHeight * 0.55);
    const radius = Math.max(80, Math.min(Math.floor(cssHeight * 0.32), Math.floor(cssWidth * 0.2)));
    const palette = ["#7c9cff", "#64d8a8", "#ffd166", "#ff7f96", "#8ce0ff", "#c792ea", "#ff9f68", "#8dd17e", "#5bc0eb", "#ffa69e"];
    let cursor = -Math.PI / 2;

    for (let i = 0; i < labels.length; i += 1) {
      const value = pieValues[i];
      if (value <= 0) {
        continue;
      }
      const sliceAngle = (value / total) * Math.PI * 2;
      const startAngle = cursor;
      const endAngle = cursor + sliceAngle;
      const isHovered = hoverTarget && hoverTarget.kind === "slice" && hoverTarget.index === i;
      const mid = (startAngle + endAngle) / 2;
      const offset = isHovered ? 8 : 0;
      const ox = Math.cos(mid) * offset;
      const oy = Math.sin(mid) * offset;

      ctx.beginPath();
      ctx.moveTo(centerX + ox, centerY + oy);
      ctx.arc(centerX + ox, centerY + oy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = palette[i % palette.length];
      ctx.fill();
      ctx.strokeStyle = "#0f1628";
      ctx.lineWidth = 2;
      ctx.stroke();

      hitAreas.push({
        kind: "slice",
        series: "primary",
        index: i,
        label: labels[i],
        value: primary[i],
        sliceValue: value,
        cx: centerX + ox,
        cy: centerY + oy,
        r: radius,
        startAngle: ((startAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2),
        endAngle: ((endAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2),
        x: centerX + ox + Math.cos(mid) * (radius * 0.55),
        y: centerY + oy + Math.sin(mid) * (radius * 0.55),
      });

      cursor = endAngle;
    }

    const legendX = Math.floor(cssWidth * 0.62);
    const legendY = 58;
    const lineHeight = 24;
    labels.forEach((label, idx) => {
      const value = pieValues[idx];
      if (value <= 0) {
        return;
      }
      const pct = (value / total) * 100;
      const y = legendY + idx * lineHeight;
      ctx.fillStyle = palette[idx % palette.length];
      ctx.fillRect(legendX, y, 12, 12);
      ctx.fillStyle = "#d6e3ff";
      ctx.font = '11px "IBM Plex Mono", monospace';
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(`${label}: ${formatMetricsValue(primary[idx], mode)} (${pct.toFixed(1)}%)`, legendX + 18, y - 1);
    });

    if (hoverTarget) {
      const pieTotal = total || 1;
      const pct = ((Math.max(0, Number(hoverTarget.sliceValue) || 0) / pieTotal) * 100).toFixed(1);
      const tooltipText = `${hoverTarget.label} | Primary: ${formatMetricsValue(hoverTarget.value, mode)} (${pct}%)`;
      drawMetricsTooltip(ctx, hoverTarget.x, hoverTarget.y, tooltipText, cssWidth, cssHeight);
    }

    metricsChartRenderState = {
      title,
      chartType,
      labels: [...labels],
      primary: [...primary],
      secondary: [...secondary],
      mode,
      options: {
        ...options,
        trendSeries: [...trendSeries],
        anomalyIndexes: Array.from(anomalyIndexes),
        benchmark,
      },
      cssWidth,
      cssHeight,
      hitAreas,
    };
    return;
  }

  const points = [
    ...primary,
    ...secondary.filter((v) => Number.isFinite(v)),
    ...trendSeries.filter((v) => Number.isFinite(v)),
    ...(Number.isFinite(benchmark) ? [benchmark] : []),
  ];
  const max = Math.max(...points, 0);
  const min = Math.min(...points, 0);
  const range = max - min || 1;

  const xAt = (i) => margin.left + (plotW * i) / Math.max(1, labels.length - 1);
  const yAt = (v) => margin.top + ((max - v) / range) * plotH;

  ctx.strokeStyle = "#2d3b5f";
  ctx.fillStyle = "#8ea0ce";
  ctx.font = '11px "IBM Plex Mono", monospace';
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (let i = 0; i <= 5; i += 1) {
    const value = max - (range * i) / 5;
    const y = yAt(value);
    ctx.beginPath();
    ctx.moveTo(margin.left, y);
    ctx.lineTo(margin.left + plotW, y);
    ctx.stroke();
    ctx.fillText(formatMetricsValue(value, mode), margin.left - 10, y);
  }

  if (Number.isFinite(benchmark)) {
    const by = yAt(benchmark);
    ctx.save();
    ctx.strokeStyle = "#f6b26b";
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(margin.left, by);
    ctx.lineTo(margin.left + plotW, by);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#ffd9ab";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(`Ref: ${formatMetricsValue(benchmark, mode)}`, margin.left + 8, by - 3);
    ctx.restore();
  }

  ctx.strokeStyle = "#5b74b8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top + plotH);
  ctx.lineTo(margin.left + plotW, margin.top + plotH);
  ctx.stroke();

  if (chartType === "bar") {
    const groupWidth = plotW / labels.length;
    const barWidth = Math.max(10, groupWidth * (secondary.length ? 0.28 : 0.56));
    labels.forEach((label, idx) => {
      const gx = margin.left + idx * groupWidth + groupWidth / 2;

      const py = yAt(primary[idx]);
      const pBar = {
        kind: "bar",
        series: "primary",
        index: idx,
        label,
        value: primary[idx],
        x: gx - barWidth - 2,
        y: py,
        w: barWidth,
        h: margin.top + plotH - py,
      };
      hitAreas.push(pBar);
      ctx.fillStyle = hoverTarget && hoverTarget.series === "primary" && hoverTarget.index === idx ? "#9db8ff" : "#7c9cff";
      ctx.fillRect(pBar.x, pBar.y, pBar.w, pBar.h);

      if (Number.isFinite(secondary[idx])) {
        const sy = yAt(secondary[idx]);
        const sBar = {
          kind: "bar",
          series: "target",
          index: idx,
          label,
          value: secondary[idx],
          x: gx + 2,
          y: sy,
          w: barWidth,
          h: margin.top + plotH - sy,
        };
        hitAreas.push(sBar);
        ctx.fillStyle = hoverTarget && hoverTarget.series === "target" && hoverTarget.index === idx ? "#8ef3c4" : "#64d8a8";
        ctx.fillRect(sBar.x, sBar.y, sBar.w, sBar.h);
      }
    });

    if (trendSeries.some((v) => Number.isFinite(v))) {
      ctx.save();
      ctx.strokeStyle = "#ffd166";
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      trendSeries.forEach((v, idx) => {
        if (!Number.isFinite(v)) {
          return;
        }
        const gx = margin.left + idx * (plotW / labels.length) + (plotW / labels.length) / 2;
        const y = yAt(v);
        if (idx === 0 || !Number.isFinite(trendSeries[idx - 1])) {
          ctx.moveTo(gx, y);
        } else {
          ctx.lineTo(gx, y);
        }
      });
      ctx.stroke();
      ctx.restore();
    }

    if (anomalyIndexes.size) {
      ctx.save();
      ctx.strokeStyle = "#ff7f96";
      ctx.lineWidth = 2;
      anomalyIndexes.forEach((idx) => {
        const gx = margin.left + idx * (plotW / labels.length) + (plotW / labels.length) / 2 - barWidth * 0.5;
        const py = yAt(primary[idx]);
        ctx.beginPath();
        ctx.arc(gx, py, 7, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();
    }
  } else {
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "#7c9cff";
    ctx.beginPath();
    primary.forEach((v, idx) => {
      const x = xAt(idx);
      const y = yAt(v);
      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    if (secondary.some((v) => Number.isFinite(v))) {
      ctx.strokeStyle = "#64d8a8";
      ctx.beginPath();
      secondary.forEach((v, idx) => {
        if (!Number.isFinite(v)) {
          return;
        }
        const x = xAt(idx);
        const y = yAt(v);
        if (idx === 0 || !Number.isFinite(secondary[idx - 1])) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

    primary.forEach((v, idx) => {
      const x = xAt(idx);
      const y = yAt(v);
      hitAreas.push({
        kind: "point",
        series: "primary",
        index: idx,
        label: labels[idx],
        value: v,
        x,
        y,
        r: 5.5,
      });
      ctx.fillStyle = "#7c9cff";
      ctx.beginPath();
      ctx.arc(x, y, hoverTarget && hoverTarget.series === "primary" && hoverTarget.index === idx ? 5 : 3.2, 0, Math.PI * 2);
      ctx.fill();
    });

    secondary.forEach((v, idx) => {
      if (!Number.isFinite(v)) {
        return;
      }
      const x = xAt(idx);
      const y = yAt(v);
      hitAreas.push({
        kind: "point",
        series: "target",
        index: idx,
        label: labels[idx],
        value: v,
        x,
        y,
        r: 5.5,
      });
      ctx.fillStyle = "#64d8a8";
      ctx.beginPath();
      ctx.arc(x, y, hoverTarget && hoverTarget.series === "target" && hoverTarget.index === idx ? 5 : 3, 0, Math.PI * 2);
      ctx.fill();
    });

    if (trendSeries.some((v) => Number.isFinite(v))) {
      ctx.save();
      ctx.strokeStyle = "#ffd166";
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      trendSeries.forEach((v, idx) => {
        if (!Number.isFinite(v)) {
          return;
        }
        const x = xAt(idx);
        const y = yAt(v);
        if (idx === 0 || !Number.isFinite(trendSeries[idx - 1])) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.restore();
    }

    if (anomalyIndexes.size) {
      ctx.save();
      ctx.strokeStyle = "#ff7f96";
      ctx.lineWidth = 2;
      anomalyIndexes.forEach((idx) => {
        const x = xAt(idx);
        const y = yAt(primary[idx]);
        ctx.beginPath();
        ctx.arc(x, y, 7.5, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();
    }
  }

  ctx.fillStyle = "#9fb1de";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  labels.forEach((label, idx) => {
    const x = xAt(idx);
    ctx.fillText(label, x, margin.top + plotH + 8);
  });

  ctx.fillStyle = "#edf2ff";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = '600 14px "Space Grotesk", sans-serif';
  ctx.fillText(title || "Performance Chart", margin.left, 12);

  ctx.font = '11px "IBM Plex Mono", monospace';
  ctx.fillStyle = "#7c9cff";
  ctx.fillRect(cssWidth - 220, 12, 10, 10);
  ctx.fillStyle = "#cbd8ff";
  ctx.fillText("Primary", cssWidth - 205, 10);
  if (secondary.some((v) => Number.isFinite(v))) {
    ctx.fillStyle = "#64d8a8";
    ctx.fillRect(cssWidth - 130, 12, 10, 10);
    ctx.fillStyle = "#cbd8ff";
    ctx.fillText("Target", cssWidth - 115, 10);
  }
  if (trendSeries.some((v) => Number.isFinite(v))) {
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(cssWidth - 70, 12, 10, 10);
    ctx.fillStyle = "#cbd8ff";
    ctx.fillText("Trend", cssWidth - 55, 10);
  }

  if (hoverTarget) {
    const seriesLabel = hoverTarget.series === "target" ? "Target" : "Primary";
    const tooltipText = `${hoverTarget.label} | ${seriesLabel}: ${formatMetricsValue(hoverTarget.value, mode)}`;
    const anchorX = hoverTarget.kind === "bar" ? hoverTarget.x + hoverTarget.w / 2 : hoverTarget.x;
    const anchorY = hoverTarget.kind === "bar" ? hoverTarget.y : hoverTarget.y;
    drawMetricsTooltip(ctx, anchorX, anchorY, tooltipText, cssWidth, cssHeight);
  }

  metricsChartRenderState = {
    title,
    chartType,
    labels: [...labels],
    primary: [...primary],
    secondary: [...secondary],
    mode,
    options: {
      ...options,
      trendSeries: [...trendSeries],
      anomalyIndexes: Array.from(anomalyIndexes),
      benchmark,
    },
    cssWidth,
    cssHeight,
    hitAreas,
  };
}

function renderMetricsDashboard() {
  if (!metricsPrimaryEl) {
    return null;
  }

  const title = metricsTitleEl?.value.trim() || "Performance chart";
  const chartTypeRaw = String(metricsChartTypeEl?.value || "line").toLowerCase();
  const chartType = chartTypeRaw === "bar" || chartTypeRaw === "pie" ? chartTypeRaw : "line";
  const mode = metricsDisplayModeEl?.value || "number";
  const aggregation = metricsAggregationEl?.value || "raw";
  const sortMode = metricsSortModeEl?.value || "input";
  const topNRaw = parseOptionalMetricsNumber(metricsTopNEl?.value || "");
  const topN = Number.isFinite(topNRaw) ? Math.max(1, Math.floor(topNRaw)) : null;
  const movingAverageWindowRaw = parseOptionalMetricsNumber(metricsMovingAverageEl?.value || "");
  const movingAverageWindow = Number.isFinite(movingAverageWindowRaw) ? Math.max(2, Math.floor(movingAverageWindowRaw)) : null;
  const benchmarkInput = String(metricsBenchmarkEl?.value || "").trim();
  const benchmark = parseOptionalMetricsNumber(benchmarkInput);
  if (benchmarkInput && !Number.isFinite(benchmark)) {
    setStatus(metricsSavedAtEl, "Reference line value must be a valid number.", "warn");
    return null;
  }
  const showTrend = metricsShowTrendEl ? Boolean(metricsShowTrendEl.checked) : true;
  const showAnomalies = metricsShowAnomaliesEl ? Boolean(metricsShowAnomaliesEl.checked) : true;
  const primary = parseMetricsNumberList(metricsPrimaryEl.value);
  const secondaryRaw = parseMetricsNumberList(metricsSecondaryEl?.value || "");

  if (!primary.length) {
    setStatus(metricsSavedAtEl, "Add primary series values to render.", "warn");
    return null;
  }

  if (primary.some((n) => !Number.isFinite(n))) {
    setStatus(metricsSavedAtEl, "Primary values must be valid numbers.", "bad");
    return null;
  }

  const labels = parseMetricsLabelList(metricsLabelsEl?.value || "", primary.length);

  if (labels.length !== primary.length) {
    setStatus(metricsSavedAtEl, "Labels count must match primary values count.", "warn");
    return null;
  }

  const secondary = secondaryRaw.length
    ? Array.from({ length: primary.length }, (_, idx) => (Number.isFinite(secondaryRaw[idx]) ? secondaryRaw[idx] : NaN))
    : Array.from({ length: primary.length }, () => NaN);

  if (secondaryRaw.length && secondaryRaw.some((n) => !Number.isFinite(n))) {
    setStatus(metricsSavedAtEl, "Target series values must be valid numbers.", "bad");
    return null;
  }

  if (secondaryRaw.length && secondaryRaw.length !== primary.length) {
    setStatus(metricsSavedAtEl, "Target series must match primary series length.", "warn");
    return null;
  }

  let rows = labels.map((label, idx) => ({
    label,
    primary: primary[idx],
    secondary: Number.isFinite(secondary[idx]) ? secondary[idx] : NaN,
  }));

  if (sortMode === "label-asc") {
    rows = [...rows].sort((a, b) => a.label.localeCompare(b.label));
  } else if (sortMode === "label-desc") {
    rows = [...rows].sort((a, b) => b.label.localeCompare(a.label));
  } else if (sortMode === "value-desc") {
    rows = [...rows].sort((a, b) => b.primary - a.primary);
  } else if (sortMode === "value-asc") {
    rows = [...rows].sort((a, b) => a.primary - b.primary);
  }

  if (topN && rows.length > topN) {
    rows = rows.slice(0, topN);
  }

  if (aggregation === "cumulative") {
    let runningPrimary = 0;
    let runningSecondary = 0;
    rows = rows.map((row) => {
      runningPrimary += row.primary;
      const hasSecondary = Number.isFinite(row.secondary);
      if (hasSecondary) {
        runningSecondary += row.secondary;
      }
      return {
        ...row,
        primary: runningPrimary,
        secondary: hasSecondary ? runningSecondary : NaN,
      };
    });
  } else if (aggregation === "normalized") {
    const basePrimary = rows[0]?.primary || 0;
    const baseSecondary = Number.isFinite(rows[0]?.secondary) ? rows[0].secondary : NaN;
    rows = rows.map((row) => ({
      ...row,
      primary: basePrimary !== 0 ? (row.primary / basePrimary) * 100 : 0,
      secondary: Number.isFinite(row.secondary) && baseSecondary !== 0 ? (row.secondary / baseSecondary) * 100 : NaN,
    }));
  }

  const renderedLabels = rows.map((row) => row.label);
  const renderedPrimary = rows.map((row) => row.primary);
  const renderedSecondary = rows.map((row) => row.secondary);

  const movingAverageSeries = movingAverageWindow ? computeMetricsMovingAverage(renderedPrimary, movingAverageWindow) : [];
  const trendSeries = showTrend ? movingAverageSeries : [];

  const stdDev = computeMetricsStdDev(renderedPrimary);
  const mean = renderedPrimary.reduce((acc, n) => acc + n, 0) / renderedPrimary.length;
  const anomalyIndexes = showAnomalies
    ? renderedPrimary
        .map((value, idx) => ({ value, idx }))
        .filter((entry) => Math.abs(entry.value - mean) > stdDev * 1.5)
        .map((entry) => entry.idx)
    : [];

  metricsChartHoverTarget = null;
  drawMetricsChart(
    title,
    chartType,
    renderedLabels,
    renderedPrimary,
    renderedSecondary,
    mode,
    {
      trendSeries,
      benchmark,
      anomalyIndexes,
    },
    null
  );
  if (metricsChartHeadingEl) {
    metricsChartHeadingEl.textContent = title;
  }

  const sum = renderedPrimary.reduce((acc, n) => acc + n, 0);
  const avg = sum / renderedPrimary.length;
  const growth = renderedPrimary.length > 1 && renderedPrimary[0] !== 0
    ? ((renderedPrimary[renderedPrimary.length - 1] - renderedPrimary[0]) / Math.abs(renderedPrimary[0])) * 100
    : 0;
  const max = Math.max(...renderedPrimary);
  const min = Math.min(...renderedPrimary);

  const targetOnly = renderedSecondary.filter((n) => Number.isFinite(n));
  const avgDelta = targetOnly.length ? avg - targetOnly.reduce((acc, n) => acc + n, 0) / targetOnly.length : 0;

  renderMetricsSummary(
    {
      total: sum,
      average: avg,
      growth,
      max,
      min,
      avgDelta,
    },
    mode
  );

  renderMetricsTable(renderedLabels, renderedPrimary, renderedSecondary, mode);

  const topIdx = renderedPrimary.indexOf(max);
  const lowIdx = renderedPrimary.indexOf(min);
  const hitCount = renderedPrimary.reduce((acc, value, idx) => {
    const target = renderedSecondary[idx];
    if (!Number.isFinite(target)) {
      return acc;
    }
    return acc + (value >= target ? 1 : 0);
  }, 0);
  const targetPoints = renderedSecondary.filter((n) => Number.isFinite(n)).length;

  renderMetricsInsights(
    {
      topLabel: renderedLabels[topIdx] || "-",
      topValue: max,
      lowLabel: renderedLabels[lowIdx] || "-",
      lowValue: min,
      netChangePct: growth,
      hitRate: targetPoints ? (hitCount / targetPoints) * 100 : 0,
      stdDev,
      anomalyCount: anomalyIndexes.length,
    },
    mode
  );

  metricsLastDashboardResult = {
    labels: renderedLabels,
    primary: renderedPrimary,
    secondary: renderedSecondary,
    trendSeries,
    anomalyIndexes,
  };

  return {
    title,
    chartType,
    displayMode: mode,
    aggregation,
    sortMode,
    topN: topN || "",
    movingAverageWindow: movingAverageWindow || "",
    benchmark: Number.isFinite(benchmark) ? benchmark : "",
    showTrend,
    showAnomalies,
    labelsCsv: labels.join(", "),
    primaryCsv: primary.join(", "),
    secondaryCsv: secondaryRaw.join(", "),
    renderedLabelsCsv: renderedLabels.join(", "),
    renderedPrimaryCsv: renderedPrimary.join(", "),
    renderedSecondaryCsv: renderedSecondary.map((v) => (Number.isFinite(v) ? String(v) : "")).join(", "),
    trendCsv: trendSeries.map((v) => (Number.isFinite(v) ? String(v) : "")).join(", "),
    anomalyIndexCsv: anomalyIndexes.join(","),
  };
}

function showMetricsStudioToast(message, tone = "ok") {
  if (!metricsStudioToastEl) {
    return;
  }

  clearTimeout(metricsStudioToastTimer);
  metricsStudioToastEl.textContent = message;
  metricsStudioToastEl.classList.remove("hidden", "metrics-toast-warn", "metrics-toast-bad");
  if (tone === "warn") {
    metricsStudioToastEl.classList.add("metrics-toast-warn");
  } else if (tone === "bad") {
    metricsStudioToastEl.classList.add("metrics-toast-bad");
  }

  metricsStudioToastTimer = setTimeout(() => {
    metricsStudioToastEl.classList.add("hidden");
  }, 2600);
}

function setActiveMetricsPaletteItem(tool) {
  for (const item of metricsPaletteItems) {
    const itemTool = item.getAttribute("data-tool") || "";
    const isActive = itemTool === tool;
    item.classList.toggle("metrics-palette-item-active", isActive);
    if (isActive) {
      const badge = item.querySelector("span");
      if (badge && badge.textContent?.trim().toLowerCase() !== "new") {
        badge.textContent = "Current";
      }
    }
  }
}

function drawTinySparkline(canvas, values) {
  if (!canvas || !Array.isArray(values) || !values.length) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const w = canvas.width;
  const h = canvas.height;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;

  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#00d4ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  values.forEach((v, idx) => {
    const x = (idx / Math.max(1, values.length - 1)) * (w - 4) + 2;
    const y = h - 3 - ((v - min) / span) * (h - 6);
    if (idx === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
}

function computeKpiPreview(formula, targetValue) {
  const total = METRICS_SAMPLE_DATA.reduce((acc, row) => acc + row.primary, 0);
  const avg = total / METRICS_SAMPLE_DATA.length;
  const start = METRICS_SAMPLE_DATA[0].primary;
  const end = METRICS_SAMPLE_DATA[METRICS_SAMPLE_DATA.length - 1].primary;
  const growth = start ? ((end - start) / Math.abs(start)) * 100 : 0;
  const avgTarget = METRICS_SAMPLE_DATA.reduce((acc, row) => acc + row.target, 0) / METRICS_SAMPLE_DATA.length;
  const mom = ((end - METRICS_SAMPLE_DATA[METRICS_SAMPLE_DATA.length - 2].primary) / METRICS_SAMPLE_DATA[METRICS_SAMPLE_DATA.length - 2].primary) * 100;

  if (formula === "Growth %") {
    return growth;
  }
  if (formula === "Avg vs Target") {
    return avg - avgTarget;
  }
  if (formula === "MoM") {
    return mom;
  }

  if (formula === "Custom") {
    const customTarget = Number(targetValue);
    if (Number.isFinite(customTarget) && customTarget !== 0) {
      return (total / customTarget) * 100;
    }
  }

  return avg;
}

function renderKpiStudioTool() {
  if (!metricsToolDynamicEl) {
    return;
  }

  const cards = metricsStudioState.kpis
    .map((kpi) => `
      <article class="metrics-studio-card kpi-card" draggable="true" data-kpi-id="${sanitize(kpi.id)}">
        <div class="kpi-card-head">
          <span>${sanitize(kpi.name)}</span>
          <strong class="${kpi.change >= 0 ? "metrics-good" : "metrics-bad"}">${sanitize(kpi.change.toFixed(1))}%</strong>
        </div>
        <div class="kpi-card-value">${sanitize(String(kpi.value))}${kpi.suffix ? sanitize(kpi.suffix) : ""}</div>
        <canvas class="kpi-spark" width="170" height="40" data-kpi-spark="${sanitize(kpi.id)}"></canvas>
      </article>
    `)
    .join("");

  metricsToolDynamicEl.innerHTML = `
    <section class="metrics-studio-tool">
      <header class="metrics-tool-topbar">
        <h2>KPI Studio</h2>
        <div class="tools-row">
          <button type="button" class="btn" id="kpiCreateBtn">Create New KPI</button>
          <button type="button" class="btn btn-secondary" id="kpiAiSuggestBtn">AI Suggest KPIs</button>
          <button type="button" class="btn btn-secondary" id="kpiResetBtn">Reset To Default</button>
        </div>
      </header>
      <div id="kpiAiSuggestions" class="metrics-insights muted">Drag and drop cards to reorder your KPI board.</div>
      <div id="kpiGrid" class="metrics-studio-grid kpi-grid">${cards}</div>

      <div class="metrics-modal hidden" id="kpiModal">
        <div class="metrics-modal-panel">
          <h3>Create New KPI</h3>
          <div class="stack">
            <label for="kpiNameInput">Name</label>
            <input id="kpiNameInput" type="text" placeholder="Revenue Health" />
            <label for="kpiFormulaInput">Formula preset</label>
            <select id="kpiFormulaInput">
              <option>Growth %</option>
              <option>Avg vs Target</option>
              <option>MoM</option>
              <option>Custom</option>
            </select>
            <label for="kpiTargetInput">Target value</label>
            <input id="kpiTargetInput" type="number" placeholder="100" />
            <label for="kpiAlertInput">Alert threshold</label>
            <input id="kpiAlertInput" type="number" placeholder="10" />
            <p id="kpiPreviewValue" class="status muted">Live preview: -</p>
          </div>
          <div class="tools-row">
            <button type="button" class="btn" id="kpiSaveBtn">Save KPI</button>
            <button type="button" class="btn btn-secondary" id="kpiCancelBtn">Cancel</button>
          </div>
        </div>
      </div>
    </section>
  `;

  const grid = document.getElementById("kpiGrid");
  let dragId = "";
  if (grid) {
    grid.querySelectorAll("[data-kpi-id]").forEach((card) => {
      card.addEventListener("dragstart", () => {
        dragId = card.getAttribute("data-kpi-id") || "";
      });
      card.addEventListener("dragover", (event) => event.preventDefault());
      card.addEventListener("drop", () => {
        const targetId = card.getAttribute("data-kpi-id") || "";
        if (!dragId || !targetId || dragId === targetId) {
          return;
        }

        const from = metricsStudioState.kpis.findIndex((k) => k.id === dragId);
        const to = metricsStudioState.kpis.findIndex((k) => k.id === targetId);
        if (from < 0 || to < 0) {
          return;
        }

        pushMetricsStudioHistory();
        const [moved] = metricsStudioState.kpis.splice(from, 1);
        metricsStudioState.kpis.splice(to, 0, moved);
        persistMetricsStudioState();
        renderKpiStudioTool();
      });
    });
  }

  metricsStudioState.kpis.forEach((kpi) => {
    const spark = document.querySelector(`[data-kpi-spark="${kpi.id}"]`);
    drawTinySparkline(spark, kpi.spark);
  });

  const modal = document.getElementById("kpiModal");
  const createBtn = document.getElementById("kpiCreateBtn");
  const cancelBtn = document.getElementById("kpiCancelBtn");
  const saveBtn = document.getElementById("kpiSaveBtn");
  const formulaEl = document.getElementById("kpiFormulaInput");
  const targetEl = document.getElementById("kpiTargetInput");
  const nameEl = document.getElementById("kpiNameInput");
  const previewEl = document.getElementById("kpiPreviewValue");

  const refreshPreview = () => {
    const value = computeKpiPreview(String(formulaEl?.value || "Growth %"), String(targetEl?.value || ""));
    if (previewEl) {
      previewEl.textContent = `Live preview: ${value.toFixed(2)}`;
      previewEl.classList.remove("muted");
    }
  };

  if (createBtn && modal) {
    createBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      refreshPreview();
    });
  }
  if (cancelBtn && modal) {
    cancelBtn.addEventListener("click", () => modal.classList.add("hidden"));
  }
  if (formulaEl) {
    formulaEl.addEventListener("change", refreshPreview);
  }
  if (nameEl) {
    nameEl.addEventListener("input", refreshPreview);
  }
  if (targetEl) {
    targetEl.addEventListener("input", refreshPreview);
  }

  if (saveBtn && modal) {
    saveBtn.addEventListener("click", () => {
      const name = String(document.getElementById("kpiNameInput")?.value || "").trim() || "New KPI";
      const formula = String(formulaEl?.value || "Growth %");
      const preview = computeKpiPreview(formula, String(targetEl?.value || ""));

      pushMetricsStudioHistory();
      metricsStudioState.kpis.unshift({
        id: `kpi_${Date.now()}`,
        name,
        value: Number(preview.toFixed(2)),
        change: Number((Math.random() * 14 - 3).toFixed(1)),
        spark: METRICS_SAMPLE_DATA.map((row) => row.primary + Math.floor(Math.random() * 3)),
      });
      persistMetricsStudioState();

      modal.classList.add("hidden");
      showMetricsStudioToast("KPI created and added to board.");
      renderKpiStudioTool();
    });
  }

  document.getElementById("kpiResetBtn")?.addEventListener("click", () => {
    pushMetricsStudioHistory();
    metricsStudioState.kpis = createDefaultMetricsStudioState().kpis;
    persistMetricsStudioState();
    renderKpiStudioTool();
    showMetricsStudioToast("KPI board reset to defaults.");
  });

  const aiBtn = document.getElementById("kpiAiSuggestBtn");
  const aiBox = document.getElementById("kpiAiSuggestions");
  if (aiBtn && aiBox) {
    aiBtn.addEventListener("click", () => {
      aiBtn.setAttribute("disabled", "true");
      aiBtn.textContent = "Thinking...";
      aiBox.textContent = "Analyzing trend momentum, seasonality, and target variance...";
      aiBox.classList.remove("muted");
      setTimeout(() => {
        const suggestions = [
          { id: `kpi_suggest_${Date.now()}_1`, name: "Stability Score", value: 82.4, change: 3.2, spark: [70, 72, 74, 78, 82.4] },
          { id: `kpi_suggest_${Date.now()}_2`, name: "Upside Potential", value: 14.1, change: 2.6, spark: [9, 10.2, 11.4, 12.8, 14.1], suffix: "%" },
          { id: `kpi_suggest_${Date.now()}_3`, name: "Miss Risk", value: 19.5, change: -2.1, spark: [24, 23, 22, 20.5, 19.5], suffix: "%" },
        ];
        pushMetricsStudioHistory();
        metricsStudioState.kpis = [...suggestions, ...metricsStudioState.kpis].slice(0, 12);
        persistMetricsStudioState();
        aiBtn.removeAttribute("disabled");
        aiBtn.textContent = "AI Suggest KPIs";
        aiBox.innerHTML = "<ul><li>Stability Score added (82.4)</li><li>Upside Potential added (14.1%)</li><li>Miss Risk added (19.5%)</li></ul>";
        renderKpiStudioTool();
        showMetricsStudioToast("3 AI KPI cards added to board.");
      }, 900);
    });
  }
}

function renderDataExplorerTool() {
  if (!metricsToolDynamicEl) {
    return;
  }

  metricsToolDynamicEl.innerHTML = `
    <section class="metrics-studio-tool">
      <header class="metrics-tool-topbar">
        <h2>Data Explorer</h2>
        <div class="tools-row">
          <input id="explorerSearch" type="text" placeholder="Search month or value" class="metrics-inline-input" />
          <select id="explorerStatusFilter">
            <option value="all">All status</option>
            <option value="On Track">On Track</option>
            <option value="Risk">Risk</option>
          </select>
          <button type="button" class="btn" id="explorerAddRowBtn">Add Row</button>
          <button type="button" class="btn btn-secondary" id="explorerBulkRiskBtn">Bulk Set Risk</button>
          <button type="button" class="btn btn-secondary" id="explorerDeleteSelectedBtn">Delete Selected</button>
          <button type="button" class="btn btn-secondary" id="explorerExportBtn">Export CSV</button>
          <button type="button" class="btn btn-secondary" id="explorerCreateChartBtn">Create Chart From Selection</button>
        </div>
      </header>

      <div class="metrics-split-grid">
        <div class="metrics-table-wrap">
          <table class="metrics-table" id="explorerTable">
            <thead>
              <tr><th></th><th data-sort="month">Month</th><th data-sort="primary">Primary</th><th data-sort="target">Target</th><th>Status</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>

        <aside class="metrics-panel">
          <h3>Column Statistics</h3>
          <select id="explorerColumnSelect">
            <option value="primary">Primary</option>
            <option value="target">Target</option>
          </select>
          <div id="explorerStats" class="metrics-insights muted">Select a column to inspect stats.</div>
          <canvas id="explorerMiniChart" width="280" height="120"></canvas>
          <button type="button" class="btn btn-secondary" id="explorerAiBtn">Run AI Analysis</button>
          <div id="explorerAiOutput" class="metrics-insights muted">AI analysis will appear here.</div>
        </aside>
      </div>
    </section>
  `;

  let sortKey = "month";
  let sortDir = "asc";

  const renderRows = () => {
    const tbody = document.querySelector("#explorerTable tbody");
    if (!tbody) {
      return;
    }
    const q = String(document.getElementById("explorerSearch")?.value || "").trim().toLowerCase();
    const status = String(document.getElementById("explorerStatusFilter")?.value || "all");

    const rows = metricsStudioState.explorerRows
      .map((row) => ({
        ...row,
        status: row.primary >= row.target ? "On Track" : "Risk",
      }))
      .filter((row) => {
        const matchQuery = !q || `${row.month} ${row.primary} ${row.target}`.toLowerCase().includes(q);
        const matchStatus = status === "all" || row.status === status;
        return matchQuery && matchStatus;
      })
      .sort((a, b) => {
        const left = a[sortKey];
        const right = b[sortKey];
        if (left < right) {
          return sortDir === "asc" ? -1 : 1;
        }
        if (left > right) {
          return sortDir === "asc" ? 1 : -1;
        }
        return 0;
      });

    tbody.innerHTML = rows
      .map((row) => `
        <tr>
          <td><input type="checkbox" data-explorer-row="${row.id}" ${metricsStudioState.explorerSelectedIds.includes(row.id) ? "checked" : ""} /></td>
          <td>${sanitize(row.month)}</td>
          <td>${sanitize(String(row.primary))}</td>
          <td>${sanitize(String(row.target))}</td>
          <td class="${row.status === "On Track" ? "metrics-good" : "metrics-bad"}">${sanitize(row.status)}</td>
        </tr>
      `)
      .join("");

    tbody.querySelectorAll("[data-explorer-row]").forEach((check) => {
      check.addEventListener("change", () => {
        const id = Number(check.getAttribute("data-explorer-row"));
        if (check.checked) {
          if (!metricsStudioState.explorerSelectedIds.includes(id)) {
            metricsStudioState.explorerSelectedIds.push(id);
          }
        } else {
          metricsStudioState.explorerSelectedIds = metricsStudioState.explorerSelectedIds.filter((item) => item !== id);
        }
      });
    });
  };

  const renderStats = () => {
    const column = String(document.getElementById("explorerColumnSelect")?.value || "primary");
    const values = metricsStudioState.explorerRows.map((row) => Number(row[column] || 0));
    const avg = values.reduce((acc, n) => acc + n, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    const statsEl = document.getElementById("explorerStats");
    if (statsEl) {
      statsEl.classList.remove("muted");
      statsEl.innerHTML = `<ul><li>Average: ${avg.toFixed(2)}</li><li>Max: ${max}</li><li>Min: ${min}</li></ul>`;
    }

    const mini = document.getElementById("explorerMiniChart");
    const ctx = mini?.getContext("2d");
    if (!ctx || !mini) {
      return;
    }
    ctx.clearRect(0, 0, mini.width, mini.height);
    const barW = Math.floor((mini.width - 20) / values.length);
    values.forEach((v, idx) => {
      const h = (v / Math.max(1, max)) * (mini.height - 20);
      ctx.fillStyle = "#00d4ff";
      ctx.fillRect(10 + idx * barW, mini.height - h - 8, barW - 8, h);
    });
  };

  renderRows();
  renderStats();

  document.querySelectorAll("#explorerTable th[data-sort]").forEach((head) => {
    head.addEventListener("click", () => {
      const nextKey = head.getAttribute("data-sort") || "month";
      if (sortKey === nextKey) {
        sortDir = sortDir === "asc" ? "desc" : "asc";
      } else {
        sortKey = nextKey;
        sortDir = "asc";
      }
      renderRows();
    });
  });

  document.getElementById("explorerSearch")?.addEventListener("input", renderRows);
  document.getElementById("explorerStatusFilter")?.addEventListener("change", renderRows);
  document.getElementById("explorerColumnSelect")?.addEventListener("change", renderStats);

  document.getElementById("explorerAddRowBtn")?.addEventListener("click", () => {
    const nextIdx = metricsStudioState.explorerRows.length + 1;
    const primary = 10 + Math.floor(Math.random() * 20);
    const target = 9 + Math.floor(Math.random() * 18);
    metricsStudioState.explorerRows.push({
      id: Date.now(),
      month: `M${nextIdx}`,
      primary,
      target,
      status: primary >= target ? "On Track" : "Risk",
    });
    persistMetricsStudioState();
    renderRows();
    renderStats();
  });

  document.getElementById("explorerDeleteSelectedBtn")?.addEventListener("click", () => {
    if (!metricsStudioState.explorerSelectedIds.length) {
      showMetricsStudioToast("Select rows to delete first.", "warn");
      return;
    }
    pushMetricsStudioHistory();
    metricsStudioState.explorerRows = metricsStudioState.explorerRows.filter((row) => !metricsStudioState.explorerSelectedIds.includes(row.id));
    metricsStudioState.explorerSelectedIds = [];
    persistMetricsStudioState();
    renderRows();
    renderStats();
    showMetricsStudioToast("Selected rows deleted.");
  });

  document.getElementById("explorerBulkRiskBtn")?.addEventListener("click", () => {
    if (!metricsStudioState.explorerSelectedIds.length) {
      showMetricsStudioToast("Select rows for bulk update.", "warn");
      return;
    }
    pushMetricsStudioHistory();
    metricsStudioState.explorerRows = metricsStudioState.explorerRows.map((row) => (
      metricsStudioState.explorerSelectedIds.includes(row.id)
        ? { ...row, status: "Risk", target: Math.max(row.target, row.primary + 1) }
        : row
    ));
    persistMetricsStudioState();
    renderRows();
    renderStats();
    showMetricsStudioToast("Selected rows marked as Risk.");
  });

  document.getElementById("explorerExportBtn")?.addEventListener("click", () => {
    const lines = ["Month,Primary,Target,Status", ...metricsStudioState.explorerRows.map((row) => `${row.month},${row.primary},${row.target},${row.status}`)];
    downloadFile("data-explorer.csv", lines.join("\n"), "text/csv;charset=utf-8");
    showMetricsStudioToast("Data Explorer CSV exported.");
  });

  document.getElementById("explorerCreateChartBtn")?.addEventListener("click", () => {
    const selected = metricsStudioState.explorerRows.filter((row) => metricsStudioState.explorerSelectedIds.includes(row.id));
    if (!selected.length) {
      showMetricsStudioToast("Select at least one row first.", "warn");
      return;
    }
    if (metricsLabelsEl) {
      metricsLabelsEl.value = selected.map((row) => row.month).join(",");
    }
    if (metricsPrimaryEl) {
      metricsPrimaryEl.value = selected.map((row) => row.primary).join(",");
    }
    if (metricsSecondaryEl) {
      metricsSecondaryEl.value = selected.map((row) => row.target).join(",");
    }
    switchMetricsStudioTool("chart-builder");
    renderMetricsDashboard();
    showMetricsStudioToast("Chart created from selected rows.");
  });

  const aiBtn = document.getElementById("explorerAiBtn");
  const aiOutput = document.getElementById("explorerAiOutput");
  if (aiBtn && aiOutput) {
    aiBtn.addEventListener("click", () => {
      aiBtn.setAttribute("disabled", "true");
      aiBtn.textContent = "Analyzing...";
      aiOutput.classList.remove("muted");
      aiOutput.textContent = "Profiling monthly trend, target variance, and run-rate.";
      setTimeout(() => {
        aiBtn.removeAttribute("disabled");
        aiBtn.textContent = "Run AI Analysis";
        const avgPrimary = (metricsStudioState.explorerRows.reduce((acc, row) => acc + row.primary, 0) / Math.max(1, metricsStudioState.explorerRows.length)).toFixed(2);
        const avgTarget = (metricsStudioState.explorerRows.reduce((acc, row) => acc + row.target, 0) / Math.max(1, metricsStudioState.explorerRows.length)).toFixed(2);
        const wins = metricsStudioState.explorerRows.filter((row) => row.primary >= row.target).length;
        aiOutput.innerHTML = `<ul><li>Win rate: ${wins}/${metricsStudioState.explorerRows.length} periods on or above target.</li><li>Average primary is ${avgPrimary} vs target ${avgTarget}.</li><li>Peak lift appears in Apr with +5 delta.</li><li>Consider a guardrail for Mar-like dips using alerting thresholds.</li></ul>`;
      }, 980);
    });
  }
}

function detectAnomalies(values, sensitivityLevel) {
  const sensitivityMap = { low: 2.1, medium: 1.5, high: 1.1 };
  const factor = sensitivityMap[sensitivityLevel] || 1.5;
  const mean = values.reduce((acc, n) => acc + n, 0) / values.length;
  const dev = computeMetricsStdDev(values);
  return values
    .map((value, idx) => ({ value, idx }))
    .filter((entry) => Math.abs(entry.value - mean) > dev * factor)
    .map((entry) => entry.idx);
}

function drawAnomalyToolChart(canvas, values, labels, anomalies) {
  const ctx = canvas?.getContext("2d");
  if (!ctx || !canvas) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;

  const xAt = (i) => 40 + (i / Math.max(1, values.length - 1)) * (canvas.width - 70);
  const yAt = (v) => 20 + ((max - v) / span) * (canvas.height - 48);

  ctx.strokeStyle = "#2c4f7f";
  for (let i = 0; i < 5; i += 1) {
    const y = 20 + (i / 4) * (canvas.height - 48);
    ctx.beginPath();
    ctx.moveTo(34, y);
    ctx.lineTo(canvas.width - 16, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#00d4ff";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  values.forEach((v, idx) => {
    const x = xAt(idx);
    const y = yAt(v);
    if (idx === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  values.forEach((v, idx) => {
    const x = xAt(idx);
    const y = yAt(v);
    const isAnomaly = anomalies.includes(idx);
    ctx.fillStyle = isAnomaly ? "#ff5d7a" : "#7ce8ff";
    ctx.beginPath();
    ctx.arc(x, y, isAnomaly ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d9ebff";
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillText(labels[idx], x - 10, canvas.height - 8);
    if (isAnomaly) {
      ctx.fillStyle = "#ff9bad";
      ctx.fillText("A", x - 3, y - 10);
    }
  });
}

function renderAnomalyLabTool() {
  if (!metricsToolDynamicEl) {
    return;
  }

  if (!Array.isArray(metricsStudioState.anomalyFalsePositives)) {
    metricsStudioState.anomalyFalsePositives = [];
  }

  metricsToolDynamicEl.innerHTML = `
    <section class="metrics-studio-tool">
      <header class="metrics-tool-topbar">
        <h2>Anomaly Lab</h2>
        <div class="tools-row">
          <label>Sensitivity
            <select id="anomalySensitivity">
              <option value="low">Low</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <button type="button" id="anomalyRunBtn" class="btn">Run Anomaly Detection</button>
          <button type="button" id="anomalyExportBtn" class="btn btn-secondary">Export Report</button>
        </div>
      </header>

      <section class="metrics-panel">
        <canvas id="anomalyCanvas" width="980" height="320"></canvas>
      </section>

      <section class="metrics-panel">
        <h3>Detected anomalies</h3>
        <div class="metrics-table-wrap">
          <table class="metrics-table" id="anomalyTable">
            <thead><tr><th>Month</th><th>Severity</th><th>Value</th><th>Suggested cause</th><th></th><th></th></tr></thead>
            <tbody><tr><td colspan="6" class="muted">Run anomaly detection.</td></tr></tbody>
          </table>
        </div>
      </section>

      <div class="metrics-modal hidden" id="anomalyExplainModal">
        <div class="metrics-modal-panel">
          <h3>Anomaly Explanation</h3>
          <p id="anomalyExplainBody" class="muted"></p>
          <button type="button" class="btn btn-secondary" id="anomalyExplainClose">Close</button>
        </div>
      </div>
    </section>
  `;

  const labels = METRICS_SAMPLE_DATA.map((row) => row.month);
  const values = [12, 18, 8, 29, 21];
  let anomalies = [];

  const renderTable = () => {
    const tbody = document.querySelector("#anomalyTable tbody");
    if (!tbody) {
      return;
    }

    if (!anomalies.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="muted">No anomaly found under current sensitivity.</td></tr>';
      return;
    }

    tbody.innerHTML = anomalies
      .map((idx) => {
        if (metricsStudioState.anomalyFalsePositives.includes(idx)) {
          return "";
        }
        const severity = values[idx] > (values.reduce((a, n) => a + n, 0) / values.length) ? "High spike" : "Sharp dip";
        const cause = severity === "High spike" ? "Campaign response surge" : "Demand softness";
        return `<tr>
          <td>${labels[idx]}</td>
          <td class="${severity === "High spike" ? "metrics-good" : "metrics-bad"}">${severity}</td>
          <td>${values[idx]}</td>
          <td>${cause}</td>
          <td><button type="button" class="btn btn-secondary" data-explain-idx="${idx}">Explain Anomaly</button></td>
          <td><button type="button" class="btn btn-secondary" data-false-positive-idx="${idx}">Mark False Positive</button></td>
        </tr>`;
      })
      .join("");

    tbody.querySelectorAll("[data-explain-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-explain-idx"));
        const modal = document.getElementById("anomalyExplainModal");
        const body = document.getElementById("anomalyExplainBody");
        if (modal && body) {
          body.textContent = `${labels[idx]} deviated from baseline due to a modeled ${values[idx] > 18 ? "upside" : "downside"} event. Suggested next step: compare external campaigns and channel-level conversion for that period.`;
          modal.classList.remove("hidden");
        }
      });
    });

    tbody.querySelectorAll("[data-false-positive-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-false-positive-idx"));
        if (!metricsStudioState.anomalyFalsePositives.includes(idx)) {
          metricsStudioState.anomalyFalsePositives.push(idx);
          persistMetricsStudioState();
        }
        renderTable();
        showMetricsStudioToast(`${labels[idx]} marked as false positive.`);
      });
    });
  };

  const runDetection = () => {
    const sensitivity = String(document.getElementById("anomalySensitivity")?.value || "medium");
    anomalies = detectAnomalies(values, sensitivity);
    drawAnomalyToolChart(document.getElementById("anomalyCanvas"), values, labels, anomalies);
    renderTable();
    const visibleCount = anomalies.filter((idx) => !metricsStudioState.anomalyFalsePositives.includes(idx)).length;
    showMetricsStudioToast(`Anomaly scan complete (${visibleCount} flagged).`);
  };

  document.getElementById("anomalyRunBtn")?.addEventListener("click", runDetection);
  document.getElementById("anomalySensitivity")?.addEventListener("change", runDetection);
  document.getElementById("anomalyExportBtn")?.addEventListener("click", () => {
    const lines = ["Month,Severity,Value", ...anomalies.map((idx) => `${labels[idx]},${values[idx] > 18 ? "High spike" : "Sharp dip"},${values[idx]}`)];
    downloadFile("anomaly-report.csv", lines.join("\n"), "text/csv;charset=utf-8");
    showMetricsStudioToast("Anomaly report exported.");
  });
  document.getElementById("anomalyExplainClose")?.addEventListener("click", () => {
    document.getElementById("anomalyExplainModal")?.classList.add("hidden");
  });

  runDetection();
}

function drawForecastChart(canvas, historical, forecast, confidenceLow, confidenceHigh) {
  const ctx = canvas?.getContext("2d");
  if (!ctx || !canvas) {
    return;
  }

  const points = [...historical, ...forecast, ...confidenceLow, ...confidenceHigh];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const all = [...historical, ...forecast];
  const xAt = (i) => 42 + (i / Math.max(1, all.length - 1)) * (canvas.width - 70);
  const yAt = (v) => 22 + ((max - v) / span) * (canvas.height - 50);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0b1d35";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00d4ff22";
  ctx.beginPath();
  confidenceHigh.forEach((v, idx) => {
    const x = xAt(historical.length - 1 + idx);
    const y = yAt(v);
    if (idx === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  [...confidenceLow].reverse().forEach((v, revIdx) => {
    const idx = confidenceLow.length - 1 - revIdx;
    const x = xAt(historical.length - 1 + idx);
    const y = yAt(v);
    ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#00d4ff";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  historical.forEach((v, idx) => {
    const x = xAt(idx);
    const y = yAt(v);
    if (idx === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  ctx.strokeStyle = "#67e1a8";
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  forecast.forEach((v, idx) => {
    const x = xAt(historical.length - 1 + idx);
    const y = yAt(v);
    if (idx === 0) {
      ctx.moveTo(x, yAt(historical[historical.length - 1]));
    }
    ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
}

function buildForecast(series, model, horizon) {
  const history = METRICS_SAMPLE_DATA.map((row) => Number(row[series]));
  const out = [];
  const horizonCount = Math.max(1, Math.min(12, Number(horizon) || 3));

  if (model === "linear") {
    const slope = (history[history.length - 1] - history[0]) / Math.max(1, history.length - 1);
    for (let i = 1; i <= horizonCount; i += 1) {
      out.push(Number((history[history.length - 1] + slope * i).toFixed(2)));
    }
  } else if (model === "moving") {
    const base = history.slice(-3).reduce((acc, n) => acc + n, 0) / Math.min(3, history.length);
    for (let i = 1; i <= horizonCount; i += 1) {
      out.push(Number((base + i * 0.35).toFixed(2)));
    }
  } else if (model === "exp") {
    let level = history[0];
    const alpha = 0.5;
    for (let i = 1; i < history.length; i += 1) {
      level = alpha * history[i] + (1 - alpha) * level;
    }
    for (let i = 1; i <= horizonCount; i += 1) {
      out.push(Number((level + i * 0.25).toFixed(2)));
    }
  } else if (model === "prophet") {
    const slope = (history[history.length - 1] - history[0]) / Math.max(1, history.length - 1);
    for (let i = 1; i <= horizonCount; i += 1) {
      const seasonal = Math.sin((i / 3) * Math.PI) * 0.9;
      out.push(Number((history[history.length - 1] + slope * i + seasonal).toFixed(2)));
    }
  } else if (model === "arima") {
    const diff = history.slice(1).map((v, idx) => v - history[idx]);
    const drift = diff.reduce((acc, n) => acc + n, 0) / Math.max(1, diff.length);
    for (let i = 1; i <= horizonCount; i += 1) {
      out.push(Number((history[history.length - 1] + drift * i).toFixed(2)));
    }
  } else {
    const cycle = [0.6, -0.2, 0.9, -0.3];
    for (let i = 1; i <= horizonCount; i += 1) {
      const c = cycle[(i - 1) % cycle.length];
      out.push(Number((history[history.length - 1] + c + i * 0.22).toFixed(2)));
    }
  }

  const low = out.map((v, idx) => Number((v - (1.2 + idx * 0.18)).toFixed(2)));
  const high = out.map((v, idx) => Number((v + (1.2 + idx * 0.18)).toFixed(2)));

  return {
    history,
    forecast: out,
    low,
    high,
    accuracy: Number((88 + Math.random() * 8).toFixed(1)),
    mape: Number((4 + Math.random() * 3).toFixed(2)),
    rmse: Number((1.1 + Math.random() * 1.8).toFixed(2)),
    accuracySpark: [87.5, 89.1, 90.2, 91.4, 92.7, 93.8],
  };
}

function renderForecastEngineTool() {
  if (!metricsToolDynamicEl) {
    return;
  }

  metricsToolDynamicEl.innerHTML = `
    <section class="metrics-studio-tool">
      <header class="metrics-tool-topbar">
        <h2>Forecast Engine <span class="metrics-badge-new">New</span></h2>
        <div class="tools-row">
          <label>Series
            <select id="forecastSeries"><option value="primary">Primary</option><option value="target">Target</option></select>
          </label>
          <label>Model
            <select id="forecastModel"><option value="linear">Linear</option><option value="moving">Moving Average</option><option value="exp">Exponential Smoothing</option><option value="prophet">Prophet</option><option value="arima">ARIMA</option><option value="seasonal">Seasonal</option></select>
          </label>
          <label>Horizon <span id="forecastHorizonValue">3</span>
            <input id="forecastHorizon" type="range" min="1" max="12" value="3" />
          </label>
          <button type="button" id="forecastGenerateBtn" class="btn">Generate Forecast</button>
        </div>
      </header>

      <section class="metrics-panel"><canvas id="forecastCanvas" width="980" height="330"></canvas></section>
      <div class="metrics-kpis" id="forecastMetricCards"></div>
      <canvas id="forecastAccuracySpark" width="320" height="48"></canvas>

      <section class="metrics-panel">
        <h3>What-if simulation</h3>
        <div class="tools-row">
          <input id="forecastWhatIfValue" type="number" placeholder="Set first forecast value" class="metrics-inline-input" />
          <button type="button" class="btn btn-secondary" id="forecastApplyWhatIfBtn">Apply Impact</button>
        </div>
      </section>
    </section>
  `;

  const renderResult = () => {
    const series = String(document.getElementById("forecastSeries")?.value || "primary");
    const model = String(document.getElementById("forecastModel")?.value || "linear");
    const horizon = Number(document.getElementById("forecastHorizon")?.value || 3);
    const result = buildForecast(series, model, horizon);
    pushMetricsStudioHistory();
    metricsStudioState.forecast = result;
    persistMetricsStudioState();
    drawForecastChart(document.getElementById("forecastCanvas"), result.history, result.forecast, result.low, result.high);

    const cards = document.getElementById("forecastMetricCards");
    if (cards) {
      cards.innerHTML = `
        <article class="metrics-kpi"><span class="metrics-kpi-label">Accuracy</span><span class="metrics-kpi-value">${result.accuracy}%</span></article>
        <article class="metrics-kpi"><span class="metrics-kpi-label">MAPE</span><span class="metrics-kpi-value">${result.mape}</span></article>
        <article class="metrics-kpi"><span class="metrics-kpi-label">RMSE</span><span class="metrics-kpi-value">${result.rmse}</span></article>
      `;
    }

    drawTinySparkline(document.getElementById("forecastAccuracySpark"), result.accuracySpark || []);
  };

  document.getElementById("forecastHorizon")?.addEventListener("input", (event) => {
    const val = Number(event.target.value || 3);
    const label = document.getElementById("forecastHorizonValue");
    if (label) {
      label.textContent = String(val);
    }
  });

  document.getElementById("forecastGenerateBtn")?.addEventListener("click", (event) => {
    const btn = event.currentTarget;
    btn.setAttribute("disabled", "true");
    btn.textContent = "Generating...";
    setTimeout(() => {
      btn.removeAttribute("disabled");
      btn.textContent = "Generate Forecast";
      renderResult();
      showMetricsStudioToast("Forecast generated.");
    }, 900);
  });

  document.getElementById("forecastApplyWhatIfBtn")?.addEventListener("click", () => {
    const first = Number(document.getElementById("forecastWhatIfValue")?.value || NaN);
    if (!metricsStudioState.forecast || !Number.isFinite(first)) {
      showMetricsStudioToast("Enter a valid what-if value first.", "warn");
      return;
    }
    metricsStudioState.forecast.forecast[0] = Number(first.toFixed(2));
    metricsStudioState.forecast.low[0] = Number((first - 1.1).toFixed(2));
    metricsStudioState.forecast.high[0] = Number((first + 1.1).toFixed(2));
    drawForecastChart(
      document.getElementById("forecastCanvas"),
      metricsStudioState.forecast.history,
      metricsStudioState.forecast.forecast,
      metricsStudioState.forecast.low,
      metricsStudioState.forecast.high
    );
    persistMetricsStudioState();
    showMetricsStudioToast("What-if impact applied.");
  });

  document.getElementById("forecastWhatIfValue")?.addEventListener("input", () => {
    const first = Number(document.getElementById("forecastWhatIfValue")?.value || NaN);
    if (!metricsStudioState.forecast || !Number.isFinite(first)) {
      return;
    }
    metricsStudioState.forecast.forecast[0] = Number(first.toFixed(2));
    metricsStudioState.forecast.low[0] = Number((first - 1.1).toFixed(2));
    metricsStudioState.forecast.high[0] = Number((first + 1.1).toFixed(2));
    drawForecastChart(
      document.getElementById("forecastCanvas"),
      metricsStudioState.forecast.history,
      metricsStudioState.forecast.forecast,
      metricsStudioState.forecast.low,
      metricsStudioState.forecast.high
    );
  });

  renderResult();
}

function evaluateCustomMetricFormula(formula) {
  const sanitizedFormula = String(formula || "")
    .replaceAll(/[^0-9+\-*/().,% a-zA-Z_]/g, "")
    .trim();
  if (!sanitizedFormula) {
    return null;
  }

  const total = METRICS_SAMPLE_DATA.reduce((acc, row) => acc + row.primary, 0);
  const avg = total / METRICS_SAMPLE_DATA.length;
  const targetHitRate = (METRICS_SAMPLE_DATA.filter((row) => row.primary >= row.target).length / METRICS_SAMPLE_DATA.length) * 100;
  const volatility = computeMetricsStdDev(METRICS_SAMPLE_DATA.map((row) => row.primary));
  const momGrowth = ((METRICS_SAMPLE_DATA[4].primary - METRICS_SAMPLE_DATA[3].primary) / METRICS_SAMPLE_DATA[3].primary) * 100;

  try {
    const fn = new Function("total", "avg", "targetHitRate", "volatility", "momGrowth", `return (${sanitizedFormula});`);
    const result = Number(fn(total, avg, targetHitRate, volatility, momGrowth));
    return Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

function validateCustomMetricFormula(formula) {
  const raw = String(formula || "").trim();
  if (!raw) {
    return { ok: false, error: "Formula is empty." };
  }
  if (!/[a-zA-Z]/.test(raw)) {
    return { ok: false, error: "Use at least one field token (avg, total, targetHitRate...)." };
  }
  const value = evaluateCustomMetricFormula(raw);
  if (value === null) {
    return { ok: false, error: "Syntax error. Example: (primary - target) / target * 100" };
  }
  return { ok: true, value };
}

function renderCustomMetricsTool() {
  if (!metricsToolDynamicEl) {
    return;
  }

  metricsToolDynamicEl.innerHTML = `
    <section class="metrics-studio-tool">
      <header class="metrics-tool-topbar">
        <h2>Custom Metrics</h2>
        <div class="tools-row">
          <button type="button" class="btn btn-secondary" id="customMetricAiHelpBtn">AI Help</button>
          <button type="button" class="btn" id="customMetricSaveBtn">Save Metric</button>
        </div>
      </header>

      <div class="metrics-three-col">
        <aside class="metrics-panel">
          <h3>Fields</h3>
          <div class="stack" id="customMetricFields">
            <button type="button" class="btn btn-secondary" data-token="total">total</button>
            <button type="button" class="btn btn-secondary" data-token="avg">avg</button>
            <button type="button" class="btn btn-secondary" data-token="targetHitRate">targetHitRate</button>
            <button type="button" class="btn btn-secondary" data-token="volatility">volatility</button>
            <button type="button" class="btn btn-secondary" data-token="momGrowth">momGrowth</button>
          </div>
        </aside>

        <section class="metrics-panel">
          <h3>Formula Builder</h3>
          <textarea id="customMetricFormula" rows="7" placeholder="(avg * 0.6) + (targetHitRate * 0.4)"></textarea>
          <div class="tools-row">
            <button type="button" class="btn btn-secondary" data-preset="momGrowth">MoM Growth</button>
            <button type="button" class="btn btn-secondary" data-preset="targetHitRate">Target Hit Rate</button>
            <button type="button" class="btn btn-secondary" data-preset="volatility">Volatility</button>
            <button type="button" class="btn btn-secondary" data-preset="(avg*0.5)+(targetHitRate*0.5)">Weighted Score</button>
          </div>
          <p id="customMetricPreview" class="status muted">Live preview: -</p>
          <div id="customMetricAiBox" class="metrics-insights muted">AI suggestions will appear here.</div>
        </section>

        <aside class="metrics-panel">
          <h3>My Metrics</h3>
          <ul id="customMetricList" class="event-list metrics-metric-list"></ul>
        </aside>
      </div>
    </section>
  `;

  const formulaEl = document.getElementById("customMetricFormula");
  const previewEl = document.getElementById("customMetricPreview");
  const metricList = document.getElementById("customMetricList");

  const renderSaved = () => {
    if (!metricList) {
      return;
    }
    if (!metricsStudioState.customMetrics.length) {
      metricList.innerHTML = '<li class="muted">No saved metrics yet.</li>';
      return;
    }
    metricList.innerHTML = metricsStudioState.customMetrics
      .map((m, idx) => `
        <li class="metrics-metric-item">
          <div><strong>${sanitize(m.name)}</strong><span>${sanitize(m.formula)} = ${sanitize(m.value.toFixed(2))}</span></div>
          <canvas width="140" height="28" data-metric-spark="${idx}"></canvas>
          <div class="tools-row">
            <button type="button" class="btn btn-secondary" data-edit-metric="${idx}">Edit</button>
            <button type="button" class="btn btn-secondary" data-delete-metric="${idx}">Delete</button>
          </div>
        </li>
      `)
      .join("");

    metricList.querySelectorAll("[data-metric-spark]").forEach((spark) => {
      const idx = Number(spark.getAttribute("data-metric-spark"));
      const metric = metricsStudioState.customMetrics[idx];
      drawTinySparkline(spark, metric?.spark || [10, 12, 14, 16, 18]);
    });

    metricList.querySelectorAll("[data-delete-metric]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-delete-metric"));
        pushMetricsStudioHistory();
        metricsStudioState.customMetrics.splice(idx, 1);
        persistMetricsStudioState();
        renderSaved();
      });
    });

    metricList.querySelectorAll("[data-edit-metric]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-edit-metric"));
        const metric = metricsStudioState.customMetrics[idx];
        if (formulaEl && metric) {
          formulaEl.value = metric.formula;
          refreshPreview();
          showMetricsStudioToast(`Editing ${metric.name}.`);
        }
      });
    });
  };

  const refreshPreview = () => {
    const validation = validateCustomMetricFormula(formulaEl?.value || "");
    if (!previewEl) {
      return;
    }
    if (!validation.ok) {
      previewEl.textContent = `Live preview: ${validation.error}`;
      previewEl.style.color = "var(--warn)";
      return;
    }
    previewEl.textContent = `Live preview: ${validation.value.toFixed(2)}`;
    previewEl.style.color = "var(--ok)";
  };

  formulaEl?.addEventListener("input", refreshPreview);
  document.querySelectorAll("#customMetricFields [data-token]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const token = btn.getAttribute("data-token") || "";
      if (!formulaEl) {
        return;
      }
      const start = formulaEl.selectionStart ?? formulaEl.value.length;
      const end = formulaEl.selectionEnd ?? formulaEl.value.length;
      formulaEl.value = formulaEl.value.slice(0, start) + token + formulaEl.value.slice(end);
      refreshPreview();
    });
  });

  document.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!formulaEl) {
        return;
      }
      formulaEl.value = btn.getAttribute("data-preset") || "";
      refreshPreview();
    });
  });

  document.getElementById("customMetricSaveBtn")?.addEventListener("click", () => {
    const formula = String(formulaEl?.value || "").trim();
    const validation = validateCustomMetricFormula(formula);
    if (!validation.ok) {
      showMetricsStudioToast(validation.error, "warn");
      return;
    }
    pushMetricsStudioHistory();
    metricsStudioState.customMetrics.unshift({
      name: `Metric ${metricsStudioState.customMetrics.length + 1}`,
      formula,
      value: validation.value,
      spark: METRICS_SAMPLE_DATA.map((row) => row.primary + Math.floor(Math.random() * 4 - 2)),
    });
    persistMetricsStudioState();
    renderSaved();
    showMetricsStudioToast("Custom metric saved.");
  });

  document.getElementById("customMetricAiHelpBtn")?.addEventListener("click", (event) => {
    const btn = event.currentTarget;
    const box = document.getElementById("customMetricAiBox");
    btn.setAttribute("disabled", "true");
    btn.textContent = "Thinking...";
    if (box) {
      box.classList.remove("muted");
      box.textContent = "Synthesizing formulas from available fields...";
    }
    setTimeout(() => {
      btn.removeAttribute("disabled");
      btn.textContent = "AI Help";
      if (box) {
        const activeFields = ["avg", "targetHitRate", "volatility", "momGrowth", "total"].filter((field) => String(formulaEl?.value || "").includes(field));
        box.innerHTML = `<ul><li>Try: (primary - target) / target * 100</li><li>Try: (avg * 0.55) + (targetHitRate * 0.45)</li><li>Try: momGrowth - volatility</li><li>Detected fields in editor: ${activeFields.length ? activeFields.join(", ") : "none"}</li></ul>`;
      }
    }, 900);
  });

  renderSaved();
  refreshPreview();
}

function renderReportDesignerTool() {
  if (!metricsToolDynamicEl) {
    return;
  }

  metricsToolDynamicEl.innerHTML = `
    <section class="metrics-studio-tool">
      <header class="metrics-tool-topbar">
        <h2>Report Designer</h2>
        <div class="tools-row">
          <button type="button" class="btn" id="reportPreviewBtn">Preview & Export PDF</button>
          <button type="button" class="btn btn-secondary" id="reportSaveTemplateBtn">Save as Template</button>
        </div>
      </header>

      <div class="metrics-three-col report-designer-grid">
        <aside class="metrics-panel">
          <h3>Block Library</h3>
          <div class="stack" id="reportBlockLibrary">
            <button type="button" class="btn btn-secondary" draggable="true" data-block-type="KPI Card">KPI Card</button>
            <button type="button" class="btn btn-secondary" draggable="true" data-block-type="Chart Block">Chart Block</button>
            <button type="button" class="btn btn-secondary" draggable="true" data-block-type="Table Block">Table Block</button>
            <button type="button" class="btn btn-secondary" draggable="true" data-block-type="Text Block">Text Block</button>
            <button type="button" class="btn btn-secondary" draggable="true" data-block-type="Spacer">Spacer</button>
          </div>
        </aside>

        <section class="metrics-panel">
          <h3>Canvas</h3>
          <div id="reportCanvas" class="report-canvas" tabindex="0"></div>
        </section>

        <aside class="metrics-panel">
          <h3>Settings</h3>
          <label>Page size<select id="reportPageSize"><option>A4</option><option>Letter</option><option>16:9</option></select></label>
          <label>Branding<input id="reportBranding" type="text" placeholder="Acme Analytics" /></label>
          <label>Schedule<select id="reportSchedule"><option>Daily</option><option selected>Weekly</option><option>Monthly</option></select></label>
          <label>Audience<select id="reportAudience"><option>Executives</option><option selected>Operations</option><option>Finance</option><option>Product</option></select></label>
        </aside>
      </div>
    </section>
  `;

  const canvas = document.getElementById("reportCanvas");
  const pageSizeEl = document.getElementById("reportPageSize");
  const brandingEl = document.getElementById("reportBranding");
  const scheduleEl = document.getElementById("reportSchedule");
  const audienceEl = document.getElementById("reportAudience");

  if (pageSizeEl) {
    pageSizeEl.value = metricsStudioState.reportSettings?.pageSize || "A4";
  }
  if (brandingEl) {
    brandingEl.value = metricsStudioState.reportSettings?.branding || "";
  }
  if (scheduleEl) {
    scheduleEl.value = metricsStudioState.reportSettings?.schedule || "Weekly";
  }
  if (audienceEl) {
    audienceEl.value = metricsStudioState.reportSettings?.audience || "Operations";
  }

  const saveSettings = () => {
    metricsStudioState.reportSettings = {
      pageSize: pageSizeEl?.value || "A4",
      branding: brandingEl?.value || "",
      schedule: scheduleEl?.value || "Weekly",
      audience: audienceEl?.value || "Operations",
    };
    persistMetricsStudioState();
  };

  [pageSizeEl, brandingEl, scheduleEl, audienceEl].forEach((el) => {
    el?.addEventListener("change", saveSettings);
    el?.addEventListener("input", saveSettings);
  });

  const ensureBlockShape = (rawBlock) => {
    if (typeof rawBlock === "string") {
      return { type: rawBlock, title: rawBlock, height: 1 };
    }
    return {
      type: rawBlock?.type || "Block",
      title: rawBlock?.title || rawBlock?.type || "Block",
      height: Number(rawBlock?.height || 1),
    };
  };

  metricsStudioState.reportBlocks = (metricsStudioState.reportBlocks || []).map(ensureBlockShape);

  const renderBlocks = () => {
    if (!canvas) {
      return;
    }
    if (!metricsStudioState.reportBlocks.length) {
      canvas.innerHTML = '<p class="muted">Drag blocks here or click a block type to add.</p>';
      return;
    }
    canvas.innerHTML = metricsStudioState.reportBlocks
      .map((block, idx) => {
        const blockSize = Math.max(1, Math.min(3, Number(block.height || 1)));
        return `
          <article class="report-block" style="min-height:${120 * blockSize}px">
            <strong>${sanitize(block.title || block.type)}</strong>
            <p class="muted">${sanitize(block.type)}</p>
            <div class="tools-row">
              <button class="btn btn-secondary" data-resize-block="${idx}" data-step="-1">-</button>
              <span>Size ${blockSize}</span>
              <button class="btn btn-secondary" data-resize-block="${idx}" data-step="1">+</button>
              <button class="btn btn-secondary" data-move-block="${idx}" data-dir="up">Up</button>
              <button class="btn btn-secondary" data-move-block="${idx}" data-dir="down">Down</button>
              <button class="btn btn-secondary" data-edit-block="${idx}">Edit</button>
              <button class="btn btn-secondary" data-remove-block="${idx}">Remove</button>
            </div>
          </article>
        `;
      })
      .join("");

    canvas.querySelectorAll("[data-remove-block]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-remove-block"));
        pushMetricsStudioHistory();
        metricsStudioState.reportBlocks.splice(idx, 1);
        persistMetricsStudioState();
        renderBlocks();
      });
    });

    canvas.querySelectorAll("[data-resize-block]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-resize-block"));
        const step = Number(btn.getAttribute("data-step") || 0);
        const block = metricsStudioState.reportBlocks[idx];
        if (!block) {
          return;
        }
        pushMetricsStudioHistory();
        block.height = Math.max(1, Math.min(3, Number(block.height || 1) + step));
        persistMetricsStudioState();
        renderBlocks();
      });
    });

    canvas.querySelectorAll("[data-move-block]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-move-block"));
        const dir = btn.getAttribute("data-dir");
        const next = dir === "up" ? idx - 1 : idx + 1;
        if (next < 0 || next >= metricsStudioState.reportBlocks.length) {
          return;
        }
        pushMetricsStudioHistory();
        const blocks = metricsStudioState.reportBlocks;
        [blocks[idx], blocks[next]] = [blocks[next], blocks[idx]];
        persistMetricsStudioState();
        renderBlocks();
      });
    });

    canvas.querySelectorAll("[data-edit-block]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-edit-block"));
        const block = metricsStudioState.reportBlocks[idx];
        if (!block) {
          return;
        }
        const title = window.prompt("Block title", block.title || block.type || "Block");
        if (!title) {
          return;
        }
        pushMetricsStudioHistory();
        block.title = title;
        persistMetricsStudioState();
        renderBlocks();
      });
    });
  };

  const addBlock = (type) => {
    pushMetricsStudioHistory();
    metricsStudioState.reportBlocks.push({ type, title: type, height: 1 });
    persistMetricsStudioState();
    renderBlocks();
  };

  document.querySelectorAll("#reportBlockLibrary [data-block-type]").forEach((btn) => {
    btn.addEventListener("click", () => addBlock(btn.getAttribute("data-block-type") || "Block"));
    btn.addEventListener("dragstart", (event) => {
      event.dataTransfer?.setData("text/plain", btn.getAttribute("data-block-type") || "Block");
    });
  });

  if (canvas) {
    canvas.addEventListener("dragover", (event) => event.preventDefault());
    canvas.addEventListener("drop", (event) => {
      event.preventDefault();
      const type = event.dataTransfer?.getData("text/plain") || "Block";
      addBlock(type);
    });
  }

  document.getElementById("reportPreviewBtn")?.addEventListener("click", () => {
    const preview = window.open("", "_blank", "width=900,height=700");
    if (!preview) {
      showMetricsStudioToast("Popup blocked. Allow popups to preview PDF.", "warn");
      return;
    }
    const settings = metricsStudioState.reportSettings || {};
    preview.document.write(`<html><body><h1>${sanitize(String(settings.branding || "Report"))}</h1><p>Page: ${sanitize(settings.pageSize || "A4")} | Schedule: ${sanitize(settings.schedule || "Weekly")} | Audience: ${sanitize(settings.audience || "Operations")}</p><ul>${metricsStudioState.reportBlocks.map((block) => `<li>${sanitize(block.title || block.type)} (${sanitize(String(block.type || "Block"))})</li>`).join("")}</ul><p>Use Print -> Save as PDF.</p></body></html>`);
    preview.document.close();
    showMetricsStudioToast("Preview opened. Use Save as PDF in print dialog.");
  });

  document.getElementById("reportSaveTemplateBtn")?.addEventListener("click", () => {
    saveSettings();
    saveJson(`${STORAGE_KEYS.metricsStudio}_report_template`, {
      blocks: metricsStudioState.reportBlocks,
      pageSize: metricsStudioState.reportSettings?.pageSize || "A4",
      branding: metricsStudioState.reportSettings?.branding || "",
      schedule: metricsStudioState.reportSettings?.schedule || "Weekly",
      audience: metricsStudioState.reportSettings?.audience || "Operations",
    });
    showMetricsStudioToast("Template saved.");
  });

  renderBlocks();
}

function renderIntegrationsHubTool() {
  if (!metricsToolDynamicEl) {
    return;
  }

  const cards = metricsStudioState.integrations
    .map((item) => `
      <article class="metrics-studio-card integration-card" data-integration-id="${sanitize(item.id)}">
        <h3>${sanitize(item.name)}</h3>
        <p class="${item.status === "Connected" ? "metrics-good" : "muted"}">${sanitize(item.status)}</p>
        <p class="muted">Last sync: ${sanitize(item.sync)}</p>
        <button type="button" class="btn btn-secondary" data-open-integration="${sanitize(item.id)}">Configure</button>
      </article>
    `)
    .join("");

  const logs = metricsStudioState.integrationLogs
    .map((log, idx) => `<tr data-log-row="${idx}"><td>${sanitize(log.at)}</td><td>${sanitize(log.integration)}</td><td>${sanitize(String(log.records))}</td><td class="${log.status === "Success" ? "metrics-good" : "metrics-bad"}">${sanitize(log.status)}</td><td><button class="btn btn-secondary" data-view-log="${idx}">View</button></td></tr>`)
    .join("");

  metricsToolDynamicEl.innerHTML = `
    <section class="metrics-studio-tool">
      <header class="metrics-tool-topbar">
        <h2>Integrations Hub</h2>
        <div class="tools-row">
          <input id="integrationSearch" type="text" placeholder="Connect New" class="metrics-inline-input" />
          <select id="integrationLogFilter" class="metrics-inline-input"><option value="all">All Logs</option><option value="success">Success</option><option value="failed">Failed</option></select>
          <button type="button" class="btn" id="integrationSyncAllBtn">Sync All</button>
        </div>
      </header>

      <div class="metrics-studio-grid integrations-grid" id="integrationsGrid">${cards}</div>

      <section class="metrics-panel">
        <h3>Sync Activity</h3>
        <div class="metrics-table-wrap">
          <table class="metrics-table">
            <thead><tr><th>Timestamp</th><th>Integration</th><th>Records</th><th>Status</th><th>Details</th></tr></thead>
            <tbody>${logs}</tbody>
          </table>
        </div>
      </section>

      <div class="metrics-modal hidden" id="integrationModal">
        <div class="metrics-modal-panel">
          <h3 id="integrationModalTitle">Integration Settings</h3>
          <label>Connection key<input id="integrationKeyInput" type="text" placeholder="api_key_xxx" /></label>
          <label>Field mapping<textarea id="integrationMappingInput" rows="4" placeholder="primary -> revenue\ntarget -> plan"></textarea></label>
          <div class="tools-row">
            <button type="button" class="btn btn-secondary" id="integrationTestBtn">Test Connection</button>
            <button type="button" class="btn" id="integrationSaveBtn">Save Connection</button>
            <button type="button" class="btn btn-secondary" id="integrationCloseBtn">Close</button>
          </div>
        </div>
      </div>

      <div class="metrics-modal hidden" id="integrationLogModal">
        <div class="metrics-modal-panel">
          <h3>Sync Event Details</h3>
          <pre id="integrationLogDetails" class="metrics-log-box"></pre>
          <div class="tools-row">
            <button type="button" class="btn btn-secondary" id="integrationLogCloseBtn">Close</button>
          </div>
        </div>
      </div>
    </section>
  `;

  let activeIntegrationId = "";

  const renderFiltered = () => {
    const q = String(document.getElementById("integrationSearch")?.value || "").trim().toLowerCase();
    const grid = document.getElementById("integrationsGrid");
    const filter = String(document.getElementById("integrationLogFilter")?.value || "all").toLowerCase();
    if (!grid) {
      return;
    }
    grid.querySelectorAll("[data-integration-id]").forEach((card) => {
      const id = String(card.getAttribute("data-integration-id") || "").toLowerCase();
      const text = String(card.textContent || "").toLowerCase();
      card.classList.toggle("hidden", Boolean(q) && !id.includes(q) && !text.includes(q));
    });

    document.querySelectorAll("[data-log-row]").forEach((row) => {
      const idx = Number(row.getAttribute("data-log-row"));
      const log = metricsStudioState.integrationLogs[idx];
      const isSuccess = String(log?.status || "").toLowerCase() === "success";
      const hideByFilter = filter === "success" ? !isSuccess : filter === "failed" ? isSuccess : false;
      row.classList.toggle("hidden", hideByFilter);
    });
  };

  document.getElementById("integrationSearch")?.addEventListener("input", renderFiltered);
  document.getElementById("integrationLogFilter")?.addEventListener("change", renderFiltered);

  document.querySelectorAll("[data-open-integration]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeIntegrationId = btn.getAttribute("data-open-integration") || "";
      const item = metricsStudioState.integrations.find((intg) => intg.id === activeIntegrationId);
      const title = document.getElementById("integrationModalTitle");
      if (title && item) {
        title.textContent = `${item.name} Connection`;
      }
      document.getElementById("integrationModal")?.classList.remove("hidden");
    });
  });

  document.getElementById("integrationCloseBtn")?.addEventListener("click", () => {
    document.getElementById("integrationModal")?.classList.add("hidden");
  });

  document.getElementById("integrationSaveBtn")?.addEventListener("click", () => {
    const item = metricsStudioState.integrations.find((intg) => intg.id === activeIntegrationId);
    if (item) {
      pushMetricsStudioHistory();
      item.status = "Connected";
      item.sync = "Just now";
    }
    metricsStudioState.integrationLogs.unshift({
      at: new Date().toLocaleTimeString(),
      integration: item?.name || "Integration",
      records: 150 + Math.floor(Math.random() * 120),
      status: "Success",
      detail: "Connection credentials validated and initial sync completed.",
    });
    persistMetricsStudioState();
    document.getElementById("integrationModal")?.classList.add("hidden");
    showMetricsStudioToast("Integration updated.");
    renderIntegrationsHubTool();
  });

  document.getElementById("integrationTestBtn")?.addEventListener("click", () => {
    const btn = document.getElementById("integrationTestBtn");
    if (!btn) {
      return;
    }
    btn.setAttribute("disabled", "true");
    btn.textContent = "Testing...";
    setTimeout(() => {
      btn.removeAttribute("disabled");
      btn.textContent = "Test Connection";
      metricsStudioState.integrationLogs.unshift({
        at: new Date().toLocaleTimeString(),
        integration: activeIntegrationId || "Integration",
        records: 0,
        status: "Success",
        detail: "Connection test passed. Endpoint latency 162ms.",
      });
      persistMetricsStudioState();
      showMetricsStudioToast("Connection test passed.");
      renderIntegrationsHubTool();
    }, 900);
  });

  document.querySelectorAll("[data-view-log]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-view-log"));
      const log = metricsStudioState.integrationLogs[idx];
      const detailsEl = document.getElementById("integrationLogDetails");
      if (detailsEl) {
        detailsEl.textContent = JSON.stringify(log, null, 2);
      }
      document.getElementById("integrationLogModal")?.classList.remove("hidden");
    });
  });

  document.getElementById("integrationLogCloseBtn")?.addEventListener("click", () => {
    document.getElementById("integrationLogModal")?.classList.add("hidden");
  });

  document.getElementById("integrationSyncAllBtn")?.addEventListener("click", (event) => {
    const btn = event.currentTarget;
    btn.setAttribute("disabled", "true");
    btn.textContent = "Syncing...";
    setTimeout(() => {
      btn.removeAttribute("disabled");
      btn.textContent = "Sync All";
      metricsStudioState.integrations.forEach((item) => {
        if (item.status === "Connected") {
          item.sync = "Just now";
        }
      });
      pushMetricsStudioHistory();
      metricsStudioState.integrationLogs.unshift({
        at: new Date().toLocaleTimeString(),
        integration: "Bulk Sync",
        records: 560,
        status: "Success",
        detail: "Bulk sync completed successfully for connected integrations.",
      });
      persistMetricsStudioState();
      showMetricsStudioToast("All connected integrations synced.");
      renderIntegrationsHubTool();
    }, 1000);
  });

  renderFiltered();
}

function renderMetricsDynamicTool(tool) {
  ensureMetricsStudioDemoData();

  if (tool === "kpi-studio") {
    renderKpiStudioTool();
    return;
  }
  if (tool === "data-explorer") {
    renderDataExplorerTool();
    return;
  }
  if (tool === "anomaly-lab") {
    renderAnomalyLabTool();
    return;
  }
  if (tool === "forecast-engine") {
    renderForecastEngineTool();
    return;
  }
  if (tool === "custom-metrics") {
    renderCustomMetricsTool();
    return;
  }
  if (tool === "report-designer") {
    renderReportDesignerTool();
    return;
  }
  if (tool === "integrations-hub") {
    renderIntegrationsHubTool();
    return;
  }

  if (metricsToolDynamicEl) {
    metricsToolDynamicEl.innerHTML = "";
  }
}

function switchMetricsStudioTool(tool) {
  metricsActiveTool = tool || "chart-builder";
  setActiveMetricsPaletteItem(metricsActiveTool);

  if (!metricsToolChartBuilderEl || !metricsToolDynamicEl) {
    return;
  }

  const chartMode = metricsActiveTool === "chart-builder";
  metricsToolChartBuilderEl.classList.toggle("hidden", !chartMode);
  metricsToolDynamicEl.classList.toggle("hidden", chartMode);

  if (!chartMode) {
    renderMetricsDynamicTool(metricsActiveTool);
  }
}

function initMetricsStudioTools() {
  if (metricsStudioInitialized) {
    return;
  }

  if (!metricsPaletteItems.length) {
    return;
  }

  hydrateMetricsStudioState();
  ensureMetricsStudioDemoData();
  ensureMetricsCommandPalette();

  metricsPaletteItems.forEach((item) => {
    item.addEventListener("click", () => {
      const tool = item.getAttribute("data-tool") || "chart-builder";
      switchMetricsStudioTool(tool);
    });
  });

  const metricsPaletteSearchEl = document.querySelector(".metrics-palette-search");
  if (metricsPaletteSearchEl) {
    const applyPaletteSearchFilter = () => {
      const query = String(metricsPaletteSearchEl.value || "").trim().toLowerCase();
      let firstVisibleTool = "";

      metricsPaletteItems.forEach((item) => {
        const name = String(item.textContent || "").toLowerCase();
        const match = !query || name.includes(query);
        item.classList.toggle("hidden", !match);
        if (match && !firstVisibleTool) {
          firstVisibleTool = item.getAttribute("data-tool") || "";
        }
      });

      const activeVisible = Array.from(metricsPaletteItems).some((item) => {
        const itemTool = item.getAttribute("data-tool") || "";
        return itemTool === metricsActiveTool && !item.classList.contains("hidden");
      });

      if (!activeVisible && firstVisibleTool) {
        switchMetricsStudioTool(firstVisibleTool);
      }
    };

    metricsPaletteSearchEl.addEventListener("input", applyPaletteSearchFilter);
    applyPaletteSearchFilter();
  }

  document.addEventListener("keydown", (event) => {
    const key = String(event.key || "").toLowerCase();
    const isMeta = event.metaKey || event.ctrlKey;
    if (!isMeta) {
      return;
    }

    if (key === "k") {
      event.preventDefault();
      toggleMetricsCommandPalette();
      return;
    }

    if (key === "z" && event.shiftKey) {
      event.preventDefault();
      redoMetricsStudioAction();
      return;
    }

    if (key === "z") {
      event.preventDefault();
      undoMetricsStudioAction();
    }
  });

  metricsStudioInitialized = true;
  switchMetricsStudioTool("chart-builder");

  if (metricsPrimaryEl && String(metricsPrimaryEl.value).trim()) {
    renderMetricsDashboard();
  }
}

function randomAccountId() {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);

  let id = "";
  for (const b of bytes) {
    id += alphabet[b % alphabet.length];
  }

  return `npa_${id}`;
}

function randomRecoveryPhrase() {
  const words = [];
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  for (const b of bytes) {
    words.push(WORD_BANK[b % WORD_BANK.length]);
  }
  return words.join(" ");
}

function createMessageId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `msg_${crypto.randomUUID()}`;
  }

  const rand = Math.floor(Math.random() * 1e9).toString(36);
  return `msg_${Date.now().toString(36)}_${rand}`;
}

function ensureMessageIds() {
  const messages = getMessages();
  let changed = false;

  const normalized = messages.map((m) => {
    if (m.id) {
      return m;
    }

    changed = true;
    return {
      ...m,
      id: createMessageId(),
    };
  });

  if (changed) {
    saveJson(STORAGE_KEYS.messages, normalized);
  }

  return normalized;
}

function hasMessagingAccess(plan, accountId = null) {
  const resolvedAccountId = accountId || getSession()?.id || null;
  return plan !== "free" || hasActiveLifetimeEntitlement(resolvedAccountId);
}

function hasToolsAccess(plan, accountId = null) {
  const resolvedAccountId = accountId || getSession()?.id || null;
  return TOOLS_PLANS.has(plan) || hasActiveLifetimeEntitlement(resolvedAccountId);
}

function hasEnterpriseAccess(plan, accountId = null) {
  const resolvedAccountId = accountId || getSession()?.id || null;
  return plan === "enterprise" || hasActiveLifetimeEntitlement(resolvedAccountId);
}

function updateSessionStatus() {
  if (!sessionStatus) {
    return;
  }

  const session = getSession();
  if (!session) {
    sessionStatus.textContent = "No active account session.";
    sessionStatus.style.color = "var(--muted)";
    return;
  }

  const account = getAccounts().find((a) => a.id === session.id);
  if (!account) {
    sessionStatus.textContent = "Session points to unknown account. Generate or unlock again.";
    sessionStatus.style.color = "var(--warn)";
    return;
  }

  const lifetimeTag = hasActiveLifetimeEntitlement(account.id) ? " | Lifetime: active" : "";
  const ownerTag = isOwnerAccount(account) ? " | Role: owner" : "";
  sessionStatus.textContent = `Active account: ${account.id} | Plan: ${account.plan} | Billing: ${account.paymentMethod || "none"}${lifetimeTag}${ownerTag}`;
  sessionStatus.style.color = "var(--ok)";
  updateNotificationBell();
}

function updateNavBySession() {
  const session = getSession();
  const mustBeUnlocked = document.querySelectorAll(
    '.topnav a[href="./inbox.html"], .topnav a[href="./tools.html"]'
  );

  for (const link of mustBeUnlocked) {
    link.classList.toggle("hidden", !session);
  }

  updateNotificationBell();
}

function getUnreadMailNotifications(accountId) {
  if (!accountId) {
    return [];
  }

  return ensureMessageIds()
    .filter((message) => message.to === accountId && !message.trashed && !message.spam && !message.readAt)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

function getReminderNotifications(accountId) {
  if (!accountId) {
    return [];
  }

  const tools = getToolsState();
  const rawEvents = Array.isArray(tools[accountId]?.calendar) ? tools[accountId].calendar : [];
  const now = Date.now();
  const horizon = now + 24 * 60 * 60 * 1000;

  return rawEvents
    .map((event) => normalizeCalendarEvent(event))
    .filter(Boolean)
    .filter((event) => event.reminderMinutes > 0)
    .map((event) => {
      const whenMs = new Date(event.when).getTime();
      const reminderAt = whenMs - event.reminderMinutes * 60 * 1000;
      return {
        ...event,
        whenMs,
        reminderAt,
      };
    })
    .filter((event) => event.reminderAt <= horizon && event.whenMs >= now - 30 * 60 * 1000)
    .sort((a, b) => a.whenMs - b.whenMs);
}

function ensureNotificationBell() {
  const topNavs = document.querySelectorAll(".topnav");
  if (!topNavs.length) {
    return;
  }

  for (const nav of topNavs) {
    if (nav.querySelector(".notif-wrap")) {
      continue;
    }

    const wrap = document.createElement("div");
    wrap.className = "notif-wrap";
    wrap.innerHTML = `
      <button type="button" class="notif-bell" aria-label="Notifications" aria-expanded="false">
        <span class="notif-bell-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img" focusable="false" aria-hidden="true">
            <path d="M12 3a5 5 0 0 0-5 5v2.4c0 .9-.32 1.77-.9 2.43L4.6 14.5A1 1 0 0 0 5.35 16h13.3a1 1 0 0 0 .75-1.67l-1.5-1.67A3.7 3.7 0 0 1 17 10.4V8a5 5 0 0 0-5-5Zm0 18a3 3 0 0 0 2.82-2H9.18A3 3 0 0 0 12 21Z" />
          </svg>
        </span>
        <span class="notif-bell-count hidden">0</span>
      </button>
      <div class="notif-panel hidden" role="dialog" aria-label="Notification center">
        <h3>Notifications</h3>
        <div class="notif-summary muted">No active alerts.</div>
        <div class="notif-section">
          <h4>Mail</h4>
          <ul class="notif-mail-list"><li class="muted">No unread mail.</li></ul>
        </div>
        <div class="notif-section">
          <h4>Reminders</h4>
          <ul class="notif-reminder-list"><li class="muted">No upcoming reminders.</li></ul>
        </div>
        <div class="notif-actions">
          <a href="./inbox.html" class="btn btn-secondary btn-link">Open Inbox</a>
          <a href="./tool-calendar.html" class="btn btn-secondary btn-link">Open Calendar</a>
        </div>
      </div>
    `;

    nav.appendChild(wrap);

    const bellBtn = wrap.querySelector(".notif-bell");
    const panel = wrap.querySelector(".notif-panel");
    bellBtn?.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!panel || !bellBtn) {
        return;
      }

      const isOpen = !panel.classList.contains("hidden");
      for (const each of document.querySelectorAll(".notif-panel")) {
        each.classList.add("hidden");
      }
      for (const each of document.querySelectorAll(".notif-bell")) {
        each.setAttribute("aria-expanded", "false");
      }

      if (!isOpen) {
        panel.classList.remove("hidden");
        bellBtn.setAttribute("aria-expanded", "true");
      }
    });
  }

  if (!notificationBellInitialized) {
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(".notif-wrap")) {
        return;
      }

      for (const panel of document.querySelectorAll(".notif-panel")) {
        panel.classList.add("hidden");
      }
      for (const bell of document.querySelectorAll(".notif-bell")) {
        bell.setAttribute("aria-expanded", "false");
      }
    });

    notificationBellTickTimer = setInterval(() => {
      updateNotificationBell();
    }, 30 * 1000);

    notificationBellInitialized = true;
  }
}

function updateNotificationBell() {
  ensureNotificationBell();

  const session = getSession();
  const accountId = session?.id || null;
  const unreadMail = getUnreadMailNotifications(accountId);
  const reminderItems = getReminderNotifications(accountId);
  const total = unreadMail.length + reminderItems.length;

  for (const countEl of document.querySelectorAll(".notif-bell-count")) {
    countEl.textContent = String(total);
    countEl.classList.toggle("hidden", total === 0);
  }

  for (const summaryEl of document.querySelectorAll(".notif-summary")) {
    if (!accountId) {
      summaryEl.textContent = "Unlock account to view alerts.";
      continue;
    }

    if (!total) {
      summaryEl.textContent = "No active alerts.";
      continue;
    }

    summaryEl.textContent = `${unreadMail.length} unread mail | ${reminderItems.length} reminder alert${reminderItems.length === 1 ? "" : "s"}`;
  }

  for (const listEl of document.querySelectorAll(".notif-mail-list")) {
    if (!accountId) {
      listEl.innerHTML = '<li class="muted">Unlock account to view mail alerts.</li>';
      continue;
    }

    if (!unreadMail.length) {
      listEl.innerHTML = '<li class="muted">No unread mail.</li>';
      continue;
    }

    listEl.innerHTML = unreadMail
      .slice(0, 5)
      .map((message) => {
        const subject = String(message.subject || "(no subject)").trim();
        const time = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return `<li><strong>${sanitize(subject)}</strong><span>${sanitize(time)}</span></li>`;
      })
      .join("");
  }

  for (const listEl of document.querySelectorAll(".notif-reminder-list")) {
    if (!accountId) {
      listEl.innerHTML = '<li class="muted">Unlock account to view reminder alerts.</li>';
      continue;
    }

    if (!reminderItems.length) {
      listEl.innerHTML = '<li class="muted">No upcoming reminders.</li>';
      continue;
    }

    listEl.innerHTML = reminderItems
      .slice(0, 5)
      .map((event) => {
        const when = new Date(event.when).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
        return `<li><strong>${sanitize(event.title)}</strong><span>${sanitize(when)}</span></li>`;
      })
      .join("");
  }
}

function redirectLockedPageToIdentity() {
  const session = getSession();
  if (session) {
    return false;
  }

  const protectedPages = new Set([
    "compose.html",
    "inbox.html",
    "billing-admin.html",
    "tools.html",
    "tool-word.html",
    "tool-excel.html",
    "tool-calendar.html",
    "tool-notes.html",
    "tool-calculator.html",
    "tool-metrics.html",
    "tool-watch-party.html",
    "tool-slides.html",
    "tool-projects.html",
    "tool-chat.html",
    "tool-ai-assistant.html",
    "tool-drive-vault.html",
    "tool-forms.html",
    "tool-whiteboard.html",
    "tool-approvals.html",
  ]);

  const file = String(window.location.pathname.split("/").pop() || "").toLowerCase();
  if (!protectedPages.has(file)) {
    return false;
  }

  window.location.href = "./identity.html";
  return true;
}

function sanitize(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sanitizeMessageHtml(rawHtml) {
  const template = document.createElement("template");
  template.innerHTML = String(rawHtml || "");

  const allowedTags = new Set(["B", "STRONG", "I", "EM", "U", "S", "BR", "P", "DIV", "SPAN", "UL", "OL", "LI", "A", "BLOCKQUOTE", "H2", "H3", "FONT"]);
  const allowedStyleProps = new Set(["text-align", "font-family", "font-size", "color", "font-weight", "font-style", "text-decoration"]);

  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      node.remove();
      return;
    }

    const el = node;
    const tag = el.tagName.toUpperCase();

    if (!allowedTags.has(tag)) {
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
      }
      return;
    }

    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase();
      const value = attr.value;

      if (name.startsWith("on")) {
        el.removeAttribute(attr.name);
        continue;
      }

      if (name === "href" && tag === "A") {
        const href = String(value || "").trim();
        if (!/^(https?:|mailto:)/i.test(href)) {
          el.removeAttribute("href");
          continue;
        }
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
        continue;
      }

      if (name === "face" && tag === "FONT") {
        continue;
      }

      if (name === "size" && tag === "FONT") {
        continue;
      }

      if (name === "color" && tag === "FONT") {
        continue;
      }

      if (name === "style") {
        const safeStyles = value
          .split(";")
          .map((chunk) => chunk.trim())
          .filter(Boolean)
          .map((chunk) => {
            const splitIdx = chunk.indexOf(":");
            if (splitIdx <= 0) {
              return "";
            }
            const prop = chunk.slice(0, splitIdx).trim().toLowerCase();
            const val = chunk.slice(splitIdx + 1).trim();
            if (!allowedStyleProps.has(prop)) {
              return "";
            }
            if (/(url\s*\(|expression\s*\()/i.test(val)) {
              return "";
            }
            return `${prop}: ${val}`;
          })
          .filter(Boolean)
          .join("; ");

        if (safeStyles) {
          el.setAttribute("style", safeStyles);
        } else {
          el.removeAttribute("style");
        }
        continue;
      }

      if (name === "target" || name === "rel") {
        if (tag === "A") {
          continue;
        }
        el.removeAttribute(attr.name);
        continue;
      }

      el.removeAttribute(attr.name);
    }

    for (const child of [...el.childNodes]) {
      walk(child);
    }
  };

  for (const child of [...template.content.childNodes]) {
    walk(child);
  }

  return template.innerHTML;
}

function getMessagePlainText(message) {
  if (!message) {
    return "";
  }

  if (String(message.text || "").trim()) {
    return String(message.text || "");
  }

  if (!message.textHtml) {
    return "";
  }

  const temp = document.createElement("div");
  temp.innerHTML = sanitizeMessageHtml(message.textHtml);
  return String(temp.textContent || "").trim();
}

function getMessageBodyHtml(message) {
  if (!message) {
    return sanitize("(no text)");
  }

  const rich = String(message.textHtml || "").trim();
  if (rich) {
    return sanitizeMessageHtml(rich);
  }

  const text = String(message.text || "").trim();
  return sanitize(text || "(no text)");
}

function runComposeCommand(command, value) {
  if (!composeEditorEl || typeof document.execCommand !== "function") {
    return;
  }

  composeEditorEl.focus();
  document.execCommand(command, false, value);
}

function normalizeComposeUrl(raw) {
  const input = String(raw || "").trim();
  if (!input) {
    return "";
  }

  if (/^(https?:|mailto:)/i.test(input)) {
    return input;
  }

  if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(input)) {
    return `https://${input}`;
  }

  return "";
}

function captureComposeSelection() {
  if (!composeEditorEl) {
    composeLinkSelectionRange = null;
    composeLinkActiveAnchor = null;
    return;
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    composeLinkSelectionRange = null;
    composeLinkActiveAnchor = null;
    return;
  }

  const range = selection.getRangeAt(0);
  if (!composeEditorEl.contains(range.commonAncestorContainer)) {
    composeLinkSelectionRange = null;
    composeLinkActiveAnchor = null;
    return;
  }

  composeLinkSelectionRange = range.cloneRange();
  const anchorNode = selection.anchorNode;
  composeLinkActiveAnchor = anchorNode instanceof Element
    ? anchorNode.closest("a")
    : anchorNode?.parentElement?.closest("a") || null;
  if (composeLinkActiveAnchor && !composeEditorEl.contains(composeLinkActiveAnchor)) {
    composeLinkActiveAnchor = null;
  }
}

function restoreComposeSelection() {
  if (!composeLinkSelectionRange) {
    return false;
  }

  const selection = window.getSelection();
  if (!selection) {
    return false;
  }

  selection.removeAllRanges();
  selection.addRange(composeLinkSelectionRange);
  return true;
}

function closeComposeLinkPopover() {
  if (!composeLinkPopoverEl) {
    return;
  }

  composeLinkPopoverEl.classList.add("hidden");
}

function openComposeLinkPopover() {
  if (!composeEditorEl || !composeLinkPopoverEl || !composeLinkTextEl || !composeLinkUrlEl) {
    return;
  }

  captureComposeSelection();
  const selectedText = composeLinkSelectionRange ? composeLinkSelectionRange.toString().trim() : "";
  const anchorText = String(composeLinkActiveAnchor?.textContent || "").trim();
  const anchorHref = String(composeLinkActiveAnchor?.getAttribute("href") || "").trim();

  composeLinkTextEl.value = selectedText || anchorText;
  composeLinkUrlEl.value = anchorHref;
  composeLinkPopoverEl.classList.remove("hidden");

  if (composeLinkTextEl.value) {
    composeLinkUrlEl.focus();
    composeLinkUrlEl.select();
  } else {
    composeLinkTextEl.focus();
    composeLinkTextEl.select();
  }
}

function applyComposeLinkFromPopover() {
  if (!composeEditorEl || !composeLinkTextEl || !composeLinkUrlEl) {
    return;
  }

  const url = normalizeComposeUrl(composeLinkUrlEl.value);
  const text = String(composeLinkTextEl.value || "").trim();

  if (!url) {
    setStatus(composeStatus, "Enter a valid URL (for example https://example.com).", "warn");
    composeLinkUrlEl.focus();
    return;
  }

  composeEditorEl.focus();
  const restored = restoreComposeSelection();

  if (composeLinkActiveAnchor && (!composeLinkSelectionRange || composeLinkSelectionRange.collapsed)) {
    composeLinkActiveAnchor.setAttribute("href", url);
    composeLinkActiveAnchor.setAttribute("target", "_blank");
    composeLinkActiveAnchor.setAttribute("rel", "noopener noreferrer");
    if (text) {
      composeLinkActiveAnchor.textContent = text;
    }
  } else if (restored && composeLinkSelectionRange) {
    const range = composeLinkSelectionRange;
    const selectedText = range.toString().trim();
    const finalText = text || selectedText || url;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = finalText;

    range.deleteContents();
    range.insertNode(link);

    const after = document.createRange();
    after.setStartAfter(link);
    after.collapse(true);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(after);
    }
  } else {
    const fallbackText = text || url;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = fallbackText;
    composeEditorEl.appendChild(link);
    composeEditorEl.appendChild(document.createTextNode(" "));
  }

  syncComposeTextareaValue();
  setStatus(composeStatus, "Link inserted.", "ok");
  closeComposeLinkPopover();
}

function removeComposeLinkFromPopover() {
  if (!composeEditorEl) {
    return;
  }

  composeEditorEl.focus();

  if (composeLinkActiveAnchor) {
    const parent = composeLinkActiveAnchor.parentNode;
    if (parent) {
      while (composeLinkActiveAnchor.firstChild) {
        parent.insertBefore(composeLinkActiveAnchor.firstChild, composeLinkActiveAnchor);
      }
      parent.removeChild(composeLinkActiveAnchor);
    }
  } else if (restoreComposeSelection() && typeof document.execCommand === "function") {
    document.execCommand("unlink", false);
  }

  syncComposeTextareaValue();
  setStatus(composeStatus, "Link removed.", "muted");
  closeComposeLinkPopover();
}

function getComposeEditorHtml() {
  return composeEditorEl ? composeEditorEl.innerHTML : "";
}

function getComposeEditorPlainText() {
  return composeEditorEl ? String(composeEditorEl.textContent || "") : "";
}

function syncComposeTextareaValue() {
  const messageTextEl = document.getElementById("messageText");
  if (!messageTextEl || !composeEditorEl) {
    return;
  }

  messageTextEl.value = getComposeEditorPlainText();
}

function getComposeDraftsState() {
  return loadJson(STORAGE_KEYS.composeDrafts, {});
}

function saveComposeDraftsState(state) {
  saveJson(STORAGE_KEYS.composeDrafts, state);
}

function buildComposeDraftPayload() {
  const toInput = document.getElementById("toId");
  const subjectInput = document.getElementById("subject");
  const burnPolicyEl = document.getElementById("burnPolicy");
  const addToFriendsEl = document.getElementById("addToFriends");
  const friendNicknameEl = document.getElementById("friendNickname");
  const messageTextEl = document.getElementById("messageText");

  return {
    to: String(toInput?.value || ""),
    subject: String(subjectInput?.value || ""),
    burnPolicy: String(burnPolicyEl?.value || "30d"),
    addToFriends: Boolean(addToFriendsEl?.checked),
    friendNickname: String(friendNicknameEl?.value || ""),
    editorHtml: composeEditorEl ? getComposeEditorHtml() : "",
    text: composeEditorEl ? getComposeEditorPlainText() : String(messageTextEl?.value || ""),
    ccRecipients: Array.isArray(ccRecipients) ? [...ccRecipients] : [],
    updatedAt: new Date().toISOString(),
  };
}

function saveComposeDraftForSession(showSavedStatus = false) {
  const session = getSession();
  if (!session?.id) {
    return false;
  }

  const drafts = getComposeDraftsState();
  drafts[session.id] = buildComposeDraftPayload();
  saveComposeDraftsState(drafts);

  if (showSavedStatus) {
    setStatus(composeStatus, "Draft saved.", "ok");
  }

  return true;
}

function clearComposeDraftForAccount(accountId) {
  if (!accountId) {
    return;
  }

  const drafts = getComposeDraftsState();
  if (!(accountId in drafts)) {
    return;
  }

  delete drafts[accountId];
  saveComposeDraftsState(drafts);
}

function restoreComposeDraftForSession() {
  const session = getSession();
  if (!session?.id) {
    return false;
  }

  const draft = getComposeDraftsState()[session.id];
  if (!draft || typeof draft !== "object") {
    return false;
  }

  const toInput = document.getElementById("toId");
  const subjectInput = document.getElementById("subject");
  const burnPolicyEl = document.getElementById("burnPolicy");
  const addToFriendsEl = document.getElementById("addToFriends");
  const friendNicknameEl = document.getElementById("friendNickname");
  const messageTextEl = document.getElementById("messageText");

  if (toInput) {
    toInput.value = String(draft.to || "");
  }
  if (subjectInput) {
    subjectInput.value = String(draft.subject || "");
  }
  if (burnPolicyEl && draft.burnPolicy) {
    burnPolicyEl.value = String(draft.burnPolicy);
  }
  if (addToFriendsEl) {
    addToFriendsEl.checked = Boolean(draft.addToFriends);
  }
  if (friendNicknameEl) {
    friendNicknameEl.value = String(draft.friendNickname || "");
  }

  if (composeEditorEl) {
    composeEditorEl.innerHTML = String(draft.editorHtml || "");
    syncComposeTextareaValue();
  } else if (messageTextEl) {
    messageTextEl.value = String(draft.text || "");
  }

  ccRecipients = Array.isArray(draft.ccRecipients) ? [...new Set(draft.ccRecipients)] : [];
  renderCcChips();

  setStatus(composeStatus, "Draft restored.", "muted");
  return true;
}

function scheduleComposeDraftAutosave() {
  if (!messageForm) {
    return;
  }

  if (composeDraftTimer) {
    clearTimeout(composeDraftTimer);
  }

  composeDraftTimer = setTimeout(() => {
    saveComposeDraftForSession(false);
    composeDraftTimer = null;
  }, 700);
}

function setStatus(el, text, tone) {
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

function ensureAccountStored(identity) {
  const accounts = getAccounts();
  const exists = accounts.some((a) => a.id === identity.id);
  if (exists) {
    return;
  }

  accounts.push({
    id: identity.id,
    phrase: identity.phrase,
    role: "user",
    plan: "free",
    paymentMethod: null,
    createdAt: new Date().toISOString(),
  });

  saveJson(STORAGE_KEYS.accounts, accounts);
}

function normalizePhrase(phrase) {
  return phrase.trim().toLowerCase().replace(/\s+/g, " ");
}

function validateAttachments(files) {
  const normalized = [];

  for (const file of files) {
    const parts = file.name.toLowerCase().split(".");
    const ext = parts.length > 1 ? parts.pop() : "";

    if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
      return { ok: false, reason: `Blocked file type for ${file.name}.` };
    }

    if (file.size > MAX_FILE_BYTES) {
      return { ok: false, reason: `${file.name} is larger than 10MB.` };
    }

    normalized.push({
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    });
  }

  return { ok: true, normalized };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function getFileExtension(name) {
  const parts = String(name || "").toLowerCase().split(".");
  return parts.length > 1 ? parts.pop() : "bin";
}

function toPrivateAttachmentName(fileName, index) {
  const ext = getFileExtension(fileName);
  return `attachment-${index + 1}.${ext}`;
}

function dataUrlByteLength(dataUrl) {
  const base64 = String(dataUrl || "").split(",")[1] || "";
  if (!base64) {
    return 0;
  }

  const padding = base64.endsWith("==") ? 2 : (base64.endsWith("=") ? 1 : 0);
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

function bytesFromBase64(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function base64FromBytes(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function stripMp3MetadataDataUrl(dataUrl) {
  const raw = String(dataUrl || "");
  const match = /^data:([^;,]+);base64,(.*)$/i.exec(raw);
  if (!match) {
    return raw;
  }

  const mime = match[1] || "audio/mpeg";
  const base64 = match[2] || "";
  if (!base64) {
    return raw;
  }

  let bytes = bytesFromBase64(base64);

  // Strip ID3v2 tag at start (10-byte header + synchsafe size)
  if (bytes.length >= 10 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
    const tagSize = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);
    const total = Math.min(bytes.length, 10 + tagSize);
    bytes = bytes.slice(total);
  }

  // Strip ID3v1 tag at end (128 bytes starting with TAG)
  if (bytes.length >= 128) {
    const end = bytes.length - 128;
    if (bytes[end] === 0x54 && bytes[end + 1] === 0x41 && bytes[end + 2] === 0x47) {
      bytes = bytes.slice(0, end);
    }
  }

  return `data:${mime};base64,${base64FromBytes(bytes)}`;
}

function stripWavMetadataDataUrl(dataUrl) {
  const raw = String(dataUrl || "");
  const match = /^data:([^;,]+);base64,(.*)$/i.exec(raw);
  if (!match) {
    return raw;
  }

  const mime = match[1] || "audio/wav";
  const base64 = match[2] || "";
  if (!base64) {
    return raw;
  }

  let bytes = bytesFromBase64(base64);

  // WAV RIFF format: 4-byte "RIFF", 4-byte size, 4-byte "WAVE", then chunks
  if (bytes.length < 12) {
    return raw;
  }

  const isRiff = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
  const isWave = bytes[8] === 0x57 && bytes[9] === 0x41 && bytes[10] === 0x56 && bytes[11] === 0x45;
  if (!isRiff || !isWave) {
    return raw;
  }

  const output = [bytes.slice(0, 12)];
  let offset = 12;

  while (offset + 8 <= bytes.length) {
    const chunkId = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
    const chunkSize = bytes[offset + 4] | (bytes[offset + 5] << 8) | (bytes[offset + 6] << 16) | (bytes[offset + 7] << 24);
    const nextOffset = offset + 8 + chunkSize + (chunkSize % 2);

    // Strip LIST (metadata), id3, bext (broadcast) chunks; keep fmt, data, etc.
    const stripIds = new Set(["LIST", "id3 ", "ID3 ", "bext", "INFO"]);
    if (!stripIds.has(chunkId)) {
      output.push(bytes.slice(offset, Math.min(nextOffset, bytes.length)));
    }

    offset = nextOffset;
    if (offset <= 12 || chunkSize < 0) {
      break;
    }
  }

  const combined = new Uint8Array(output.reduce((sum, a) => sum + a.length, 0));
  let pos = 0;
  for (const chunk of output) {
    combined.set(chunk, pos);
    pos += chunk.length;
  }

  // Update RIFF size field
  const newSize = combined.length - 8;
  combined[4] = newSize & 0xff;
  combined[5] = (newSize >> 8) & 0xff;
  combined[6] = (newSize >> 16) & 0xff;
  combined[7] = (newSize >> 24) & 0xff;

  return `data:${mime};base64,${base64FromBytes(combined)}`;
}

function scrubImageFileDataUrl(file, preferredMime = "image/png") {


  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Canvas context unavailable");
        }

        ctx.drawImage(img, 0, 0);
        const outputMime = /^image\/(png|jpeg|webp)$/i.test(preferredMime) ? preferredMime : "image/png";
        const dataUrl = canvas.toDataURL(outputMime, 0.92);
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image decode failed"));
    };

    img.src = objectUrl;
  });
}

async function scrubAttachmentData(file) {
  const mime = String(file.type || "application/octet-stream").toLowerCase();
  const ext = getFileExtension(file.name);
  let dataUrl = await readFileAsDataUrl(file);
  let outputMime = mime;

  if (mime.startsWith("image/")) {
    try {
      dataUrl = await scrubImageFileDataUrl(file, mime);
      const m = /^data:([^;,]+);/i.exec(dataUrl);
      outputMime = m ? m[1] : mime;
    } catch {
      // Fall back to original content if canvas re-encode fails.
    }
  } else if (mime === "audio/mpeg" || ext === "mp3") {
    dataUrl = stripMp3MetadataDataUrl(dataUrl);
    outputMime = "audio/mpeg";
  } else if (mime === "audio/wav" || mime === "audio/wave" || mime === "audio/x-wav" || ext === "wav") {
    dataUrl = stripWavMetadataDataUrl(dataUrl);
    outputMime = "audio/wav";
  } else if (mime.startsWith("audio/") || ["flac", "ogg", "opus", "aac", "m4a", "wma", "aiff", "aif"].includes(ext)) {
    // For other audio: read through FileReader strips OS-level metadata; rename already handled.
    outputMime = mime || "audio/octet-stream";
  }

  return {
    dataUrl,
    type: outputMime || mime || "application/octet-stream",
    size: dataUrlByteLength(dataUrl),
  };
}

function isAudioAttachment(attachment) {
  if (!attachment) {
    return false;
  }

  const type = String(attachment.type || "").toLowerCase();
  if (type.startsWith("audio/")) {
    return true;
  }

  const ext = getFileExtension(attachment.name || "");
  return ["mp3", "wav", "ogg", "m4a", "flac", "opus", "aac", "wma", "aiff", "aif"].includes(ext);
}

function getSafeAudioDataUrl(attachment) {
  const dataUrl = String(attachment?.dataUrl || "");
  if (!dataUrl) {
    return "";
  }

  return /^data:audio\/[a-z0-9.+\-]+;base64,/i.test(dataUrl) ? dataUrl : "";
}

async function buildAttachmentPayload(files, normalized) {
  const payload = [];

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const meta = normalized[i] || {
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    };

    const scrubbed = await scrubAttachmentData(file);
    payload.push({
      ...meta,
      name: toPrivateAttachmentName(file.name, i),
      size: scrubbed.size || meta.size,
      type: scrubbed.type || meta.type,
      dataUrl: scrubbed.dataUrl,
      metaScrubbed: true,
    });
  }

  return payload;
}

function computeExpiresAt(burnPolicy) {
  const now = Date.now();
  const map = {
    "24h": now + 24 * 60 * 60 * 1000,
    "48h": now + 48 * 60 * 60 * 1000,
    "72h": now + 72 * 60 * 60 * 1000,
    "7d": now + 7 * 24 * 60 * 60 * 1000,
    "30d": now + 30 * 24 * 60 * 60 * 1000,
    "on-read": null,
    "never": null,
  };

  return burnPolicy in map ? map[burnPolicy] : map["30d"];
}

function countNeverBurnMessagesForUser(userId) {
  if (!userId) {
    return 0;
  }

  const messages = getMessages();
  return messages.filter((m) => m.to === userId && m.burnPolicy === "never" && !m.trashed && !m.spam).length;
}

function setMessageNeverBurn(message) {
  if (!message || message.burnPolicy === "never") {
    return false;
  }

  message.previousBurnPolicy = message.burnPolicy || "30d";
  message.previousExpiresAt = message.expiresAt || null;
  message.burnPolicy = "never";
  message.expiresAt = null;
  return true;
}

function unsetMessageNeverBurn(message) {
  if (!message || message.burnPolicy !== "never") {
    return false;
  }

  const fallbackPolicy = message.previousBurnPolicy || "30d";
  const nextPolicy = fallbackPolicy === "never" ? "30d" : fallbackPolicy;
  message.burnPolicy = nextPolicy;

  if (nextPolicy === "on-read" || nextPolicy === "never") {
    message.expiresAt = null;
  } else {
    const restoredExpiry = message.previousExpiresAt ? new Date(message.previousExpiresAt).getTime() : NaN;
    const now = Date.now();
    message.expiresAt = Number.isFinite(restoredExpiry) && restoredExpiry > now
      ? message.previousExpiresAt
      : new Date(computeExpiresAt(nextPolicy)).toISOString();
  }

  delete message.previousBurnPolicy;
  delete message.previousExpiresAt;
  return true;
}

function markMessageSpam(message, nowMs = Date.now()) {
  if (!message) {
    return false;
  }

  const spamExpiry = new Date(nowMs + SPAM_BURN_MS).toISOString();
  let changed = false;

  if (!message.spam) {
    message.spam = true;
    changed = true;
  }

  if (!message.spamMarkedAt) {
    message.spamMarkedAt = new Date(nowMs).toISOString();
    changed = true;
  }

  if (!message.spamExpiresAt) {
    message.spamExpiresAt = spamExpiry;
    changed = true;
  }

  return changed;
}

function markMessageTrash(message, nowMs = Date.now()) {
  if (!message) {
    return false;
  }

  const trashExpiry = new Date(nowMs + TRASH_BURN_MS).toISOString();
  let changed = false;

  if (!message.trashed) {
    message.trashed = true;
    changed = true;
  }

  if (!message.trashMarkedAt) {
    message.trashMarkedAt = new Date(nowMs).toISOString();
    changed = true;
  }

  if (!message.trashExpiresAt) {
    message.trashExpiresAt = trashExpiry;
    changed = true;
  }

  return changed;
}

function normalizeSpamMessagesForViewer(viewerId, messages) {
  if (!viewerId || !Array.isArray(messages)) {
    return messages;
  }

  const nowMs = Date.now();
  let changed = false;

  for (const message of messages) {
    if (!message || message.to !== viewerId || message.trashed) {
      continue;
    }

    if (isContactBlocked(viewerId, message.from)) {
      changed = markMessageSpam(message, nowMs) || changed;
    }
  }

  if (changed) {
    saveJson(STORAGE_KEYS.messages, messages);
  }

  return messages;
}

function updateMailboxFolderButtons(counts = { inbox: 0, never: 0, spam: 0, trash: 0 }) {
  if (inboxFolderBtn) {
    inboxFolderBtn.textContent = `Inbox (${counts.inbox || 0})`;
    inboxFolderBtn.classList.toggle("mailbox-btn-active", selectedMailboxFolder === "inbox");
  }
  if (neverFolderBtn) {
    neverFolderBtn.textContent = `Never Burn (${counts.never || 0}/10)`;
    neverFolderBtn.classList.toggle("mailbox-btn-active", selectedMailboxFolder === "never");
  }
  if (spamFolderBtn) {
    spamFolderBtn.textContent = `Spam (${counts.spam || 0})`;
    spamFolderBtn.classList.toggle("mailbox-btn-active", selectedMailboxFolder === "spam");
  }
  if (trashFolderBtn) {
    trashFolderBtn.textContent = `Trash (${counts.trash || 0})`;
    trashFolderBtn.classList.toggle("mailbox-btn-active", selectedMailboxFolder === "trash");
  }
}

function pruneExpiredMessages() {
  const messages = getMessages();
  const now = Date.now();
  const valid = messages.filter((m) => {
    if (m.trashed && m.trashExpiresAt && new Date(m.trashExpiresAt).getTime() <= now) {
      return false;
    }

    if (m.spam && m.spamExpiresAt && new Date(m.spamExpiresAt).getTime() <= now) {
      return false;
    }

    if (!m.expiresAt) {
      return true;
    }

    return new Date(m.expiresAt).getTime() > now;
  });

  if (valid.length !== messages.length) {
    saveJson(STORAGE_KEYS.messages, valid);
  }

  return valid;
}

function renderInbox() {
  if (!inboxEl) {
    return;
  }

  const hasMailPane = Boolean(inboxListEl && messageViewEl);
  const session = getSession();
  const viewerId = session?.id;

  if (!session) {
    if (hasMailPane) {
      inboxListEl.innerHTML = '<p class="muted">Unlock account to load inbox.</p>';
      messageViewEl.innerHTML = '<p class="muted">Select a message to preview.</p>';
      setStatus(inboxStatus, "No active account session.", "warn");
    } else {
      inboxEl.innerHTML = '<p class="muted">Unlock an account to view inbox.</p>';
    }
    return;
  }

  normalizeSpamMessagesForViewer(session.id, ensureMessageIds());

  const allMessages = pruneExpiredMessages().filter((m) => m.to === session.id);
  const trashMessages = allMessages.filter((m) => Boolean(m.trashed));
  const neverMessages = allMessages.filter((m) => !m.trashed && !m.spam && m.burnPolicy === "never");
  const inboxMessages = allMessages.filter((m) => !m.trashed && !m.spam && m.burnPolicy !== "never");
  const spamMessages = allMessages.filter((m) => !m.trashed && Boolean(m.spam));

  updateMailboxFolderButtons({
    inbox: inboxMessages.length,
    never: neverMessages.length,
    spam: spamMessages.length,
    trash: trashMessages.length,
  });

  const folderMessages = selectedMailboxFolder === "spam"
    ? spamMessages
    : selectedMailboxFolder === "never"
      ? neverMessages
    : selectedMailboxFolder === "trash"
      ? trashMessages
      : inboxMessages;

  const messages = folderMessages
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  if (!hasMailPane) {
    if (!messages.length) {
      inboxEl.innerHTML = '<p class="muted">No messages yet.</p>';
      return;
    }

    inboxEl.innerHTML = messages
      .map((m) => {
        const fromLabel = displayIdForViewer(viewerId, m.from);
        const attachments = m.attachments.length
          ? `<div class="file-list"><strong>Attachments:</strong> ${m.attachments
              .map((f) => `${sanitize(f.name)} (${Math.ceil(f.size / 1024)}KB)`)
              .join(", ")}</div>`
          : "";

        return `
          <article class="message">
            <div class="message-head">From ${sanitize(fromLabel)} | ${new Date(m.createdAt).toLocaleString()}</div>
            <div class="message-head">Subject: ${sanitize(m.subject || "(no subject)")}</div>
            <div class="message-body">${getMessageBodyHtml(m)}</div>
            ${attachments}
          </article>
        `;
      })
      .join("");
    return;
  }

  if (!messages.length) {
    inboxListEl.innerHTML = selectedMailboxFolder === "spam"
      ? '<p class="muted">No spam messages.</p>'
      : selectedMailboxFolder === "never"
        ? '<p class="muted">No never-burn messages yet.</p>'
      : selectedMailboxFolder === "trash"
        ? '<p class="muted">Trash is empty.</p>'
        : '<p class="muted">No messages yet.</p>';
    messageViewEl.innerHTML = selectedMailboxFolder === "spam"
      ? '<p class="muted">Spam messages auto-burn after 12 hours.</p>'
      : selectedMailboxFolder === "never"
        ? '<p class="muted">Move important mail here to keep it from burning. Folder limit: 10 messages.</p>'
      : selectedMailboxFolder === "trash"
        ? '<p class="muted">Trash messages auto-burn after 48 hours.</p>'
        : '<p class="muted">Your secure inbox is ready. Send your first message or wait for someone to reach you via your NPA ID.</p>';
    selectedMessageId = null;
    setStatus(inboxStatus, `0 message(s) in ${selectedMailboxFolder}.`, "muted");
    return;
  }

  const hasSelected = messages.some((m) => m.id === selectedMessageId);
  if (!hasSelected) {
    selectedMessageId = messages[0].id;
  }

  const selected = messages.find((m) => m.id === selectedMessageId);

  if (selected && !selected.readAt) {
    const allMessages = getMessages();
    const target = allMessages.find((m) => m.id === selected.id);
    if (target) {
      target.readAt = new Date().toISOString();
      saveJson(STORAGE_KEYS.messages, allMessages);
      selected.readAt = target.readAt;
    }
  }

  inboxListEl.innerHTML = messages
    .map((m) => {
      const fromLabel = displayIdForViewer(viewerId, m.from);
      const subject = String(m.subject || "").trim();
      const messageText = getMessagePlainText(m);
      const previewText = messageText ? messageText.slice(0, 60) : (m.attachments?.length ? "(attachments included)" : "(no text)");
      const preview = subject ? `${subject} - ${previewText}` : previewText;
      const activeClass = m.id === selectedMessageId ? "mail-row mail-row-active" : "mail-row";
      const spamTag = m.spam ? '<span class="mail-tag mail-tag-spam">Spam</span>' : "";
      const trashTag = m.trashed ? '<span class="mail-tag mail-tag-trash">Trash</span>' : "";
      const neverTag = m.burnPolicy === "never" ? '<span class="mail-tag mail-tag-never">Never Burn</span>' : "";
      return `
        <button type="button" class="${activeClass}" data-open-message="${sanitize(m.id)}">
          <div class="mail-from">From ${sanitize(fromLabel)}</div>
          <div class="mail-subject">${sanitize(preview)}</div>
          <div class="mail-time">${new Date(m.createdAt).toLocaleString()}</div>
          ${neverTag}
          ${spamTag}
          ${trashTag}
        </button>
      `;
    })
    .join("");

  const selectedFromLabel = displayIdForViewer(viewerId, selected.from);

  const attachmentItems = (selected.attachments || []).length
    ? selected.attachments
        .map((file, index) => {
          const canDownload = Boolean(file && file.dataUrl);
          const isAudio = isAudioAttachment(file);
          const isVideo = !isAudio && /^video\//i.test(String(file?.type || ""));
          const audioDataUrl = isAudio ? getSafeAudioDataUrl(file) : "";
          const videoDataUrl = isVideo && /^data:video\/[a-z0-9.+\-]+;base64,/i.test(String(file?.dataUrl || "")) ? file.dataUrl : "";
          const audioPlayer = audioDataUrl
            ? `<audio class="attachment-audio" controls preload="none" src="${audioDataUrl}"></audio>`
            : "";
          const videoPlayer = videoDataUrl
            ? `<video class="attachment-video" controls preload="metadata" src="${videoDataUrl}"></video>`
            : "";
          const downloadControl = canDownload
            ? `<button type="button" class="btn btn-secondary btn-xs" data-download-attachment="${sanitize(selected.id)}" data-attachment-index="${index}">Download</button>`
            : `<span class="muted">No file payload</span>`;
          return `<div class="attachment-item">${sanitize(file.name)} | ${Math.ceil(file.size / 1024)}KB | ${sanitize(file.type || "unknown")} ${downloadControl}${audioPlayer}${videoPlayer}</div>`;
        })
        .join("")
    : '<p class="muted">No attachments</p>';

  const burnLabels = {
    "on-read": "Burns after read - will delete when you leave this message",
    "24h": "Burns 24 hours after send",
    "48h": "Burns 48 hours after send",
    "72h": "Burns 72 hours after send",
    "7d": "Burns 7 days after send",
    "30d": "Auto-purge after 30 days",
    "never": "Never burns (counts against 10-message limit)",
  };

  const burnLabel = burnLabels[selected.burnPolicy] || burnLabels["30d"];
  const spamLine = selected.spam
    ? `Spam auto-burn: ${selected.spamExpiresAt ? new Date(selected.spamExpiresAt).toLocaleString() : "12h from classification"}`
    : "";
  const trashLine = selected.trashed
    ? `Trash auto-burn: ${selected.trashExpiresAt ? new Date(selected.trashExpiresAt).toLocaleString() : "48h from deletion"}`
    : "";
  const expiryLine = selected.expiresAt ? `Expires: ${new Date(selected.expiresAt).toLocaleString()}` : "";
  const isInvite = selected.payloadType === "collabInvite";
  const inviteStatusText = isInvite ? String(selected.inviteStatus || "pending") : "";

  const inviteBlock = isInvite
    ? `
      <div class="invite-box">
        <div class="mail-label">Collaboration invite</div>
        <div class="message-body">${sanitize(selected.inviteNote || "You have been invited to collaborate.")}</div>
        <div class="message-head">Status: ${sanitize(inviteStatusText)}</div>
      </div>
    `
    : "";

  const inviteActions = isInvite
    ? `
      <button type="button" class="btn" data-accept-invite="${sanitize(selected.id)}">Accept Invite</button>
      <button type="button" class="btn btn-secondary" data-decline-invite="${sanitize(selected.id)}">Decline Invite</button>
    `
    : "";

  messageViewEl.innerHTML = `
    <div class="mail-header">
      <div class="mail-label">From</div>
      <div class="message-head">${sanitize(selectedFromLabel)}</div>
      <div class="mail-label">Subject</div>
      <div class="message-head">${sanitize(selected.subject || "(no subject)")}</div>
      <div class="mail-label">Date</div>
      <div class="message-head">${new Date(selected.createdAt).toLocaleString()}</div>
      <div class="mail-label">Burn policy</div>
      <div class="message-head burn-badge">${sanitize(burnLabel)}${expiryLine ? ` - ${sanitize(expiryLine)}` : ""}${spamLine ? ` - ${sanitize(spamLine)}` : ""}${trashLine ? ` - ${sanitize(trashLine)}` : ""}</div>
    </div>
    <div>
      <div class="mail-label">Message</div>
      <div class="message-body">${getMessageBodyHtml(selected)}</div>
    </div>
    ${inviteBlock}
    <div>
      <div class="mail-label">Attachments</div>
      <div class="attachment-grid">${attachmentItems}</div>
    </div>
    <div class="stack">
      <label for="friendNicknameInput">Nickname for sender</label>
      <input id="friendNicknameInput" type="text" value="" placeholder="Example: FinanceLead" />
    </div>
    <div class="mail-actions">
      <button type="button" class="btn btn-secondary" data-add-friend="${sanitize(selected.from)}">Add Sender To Friends</button>
      ${!selected.trashed && selected.spam
        ? `<button type="button" class="btn btn-secondary" data-unspam-message="${sanitize(selected.id)}">Move To Inbox</button>`
        : !selected.trashed
          ? `<button type="button" class="btn btn-secondary" data-mark-spam="${sanitize(selected.id)}">Mark As Spam</button>`
          : ""}
      ${!selected.trashed && !selected.spam && selected.burnPolicy !== "never"
        ? `<button type="button" class="btn btn-secondary" data-set-never-message="${sanitize(selected.id)}">Set Never Burn</button>`
        : !selected.trashed && !selected.spam && selected.burnPolicy === "never"
          ? `<button type="button" class="btn btn-secondary" data-unset-never-message="${sanitize(selected.id)}">Move To Inbox</button>`
          : ""}
      <button type="button" class="btn btn-secondary" data-block-sender="${sanitize(selected.from)}">Block Sender</button>
      ${selected.trashed
        ? `<button type="button" class="btn btn-secondary" data-restore-message="${sanitize(selected.id)}">Restore From Trash</button>`
        : ""}
      ${inviteActions}
      <button type="button" class="btn btn-danger" id="deleteSelectedBtn" data-delete-message="${sanitize(selected.id)}">${selected.trashed ? "Burn Now" : "Move To Trash"}</button>
    </div>
  `;

  setStatus(inboxStatus, `${messages.length} message(s) in ${selectedMailboxFolder}.`, "muted");
  updateNotificationBell();
}

function burnReadMessages() {
  const session = getSession();
  if (!session) {
    return;
  }

  const messages = getMessages();
  const remaining = messages.filter((m) => {
    if (m.to !== session.id) {
      return true;
    }

    if (m.burnPolicy !== "on-read") {
      return true;
    }

    return !m.readAt;
  });

  if (remaining.length !== messages.length) {
    saveJson(STORAGE_KEYS.messages, remaining);
  }
}

function getDefaultSheet(rows = 20, cols = 26) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => ""));
}

function columnName(index) {
  let n = index;
  let label = "";
  while (n >= 0) {
    label = String.fromCharCode((n % 26) + 65) + label;
    n = Math.floor(n / 26) - 1;
  }
  return label;
}

function parseCellRef(ref) {
  const match = /^([A-Z]+)(\d+)$/i.exec(String(ref || "").trim());
  if (!match) {
    return null;
  }

  const colLabel = match[1].toUpperCase();
  const row = Number(match[2]) - 1;
  let col = 0;

  for (let i = 0; i < colLabel.length; i += 1) {
    col = col * 26 + (colLabel.charCodeAt(i) - 64);
  }

  return { row, col: col - 1 };
}

function cellRefFromCoords(row, col) {
  return `${columnName(col)}${row + 1}`;
}

function normalizeSheetShape(sheet) {
  const minRows = 20;
  const minCols = 26;
  const rows = Math.max(minRows, Array.isArray(sheet) ? sheet.length : 0);
  const cols = Math.max(
    minCols,
    Array.isArray(sheet) && sheet.length ? Math.max(...sheet.map((r) => (Array.isArray(r) ? r.length : 0))) : 0
  );

  const normalized = Array.from({ length: rows }, (_, rIdx) =>
    Array.from({ length: cols }, (_, cIdx) => String((sheet?.[rIdx]?.[cIdx] ?? "")))
  );

  return normalized;
}

function getSheetCellStyle(row, col) {
  const key = `${row}:${col}`;
  return activeSheetStyles[key] || {};
}

function toInlineStyle(styleObj) {
  const style = [];
  if (styleObj.fontFamily) style.push(`font-family:${styleObj.fontFamily}`);
  if (styleObj.fontSize) style.push(`font-size:${styleObj.fontSize}px`);
  if (styleObj.bold) style.push("font-weight:700");
  if (styleObj.italic) style.push("font-style:italic");
  if (styleObj.underline) style.push("text-decoration:underline");
  if (styleObj.align) style.push(`text-align:${styleObj.align}`);
  return style.join(";");
}

function updateExcelStats() {
  if (!excelStatsEl || !activeSheetData.length) {
    return;
  }

  const rows = activeSheetData.length;
  const cols = activeSheetData[0].length;
  const filled = activeSheetData.flat().filter((v) => String(v).trim()).length;
  excelStatsEl.textContent = `Rows: ${rows} | Cols: ${cols} | Filled: ${filled}`;
}

function renderSheetHeaders() {
  if (!sheetHeadEl || !activeSheetData.length) {
    return;
  }

  const cols = activeSheetData[0].length;
  const headCells = ['<th class="sheet-row-head"></th>'];
  for (let col = 0; col < cols; col += 1) {
    headCells.push(`<th>${columnName(col)}</th>`);
  }
  sheetHeadEl.innerHTML = `<tr>${headCells.join("")}</tr>`;
}

function renderSheetRows(sheet, styles = {}) {
  if (!sheetBodyEl) {
    return;
  }

  activeSheetData = normalizeSheetShape(sheet);
  activeSheetStyles = styles || {};
  renderSheetHeaders();

  sheetBodyEl.innerHTML = activeSheetData
    .map((row, rIdx) => {
      const cells = row
        .map((value, cIdx) => {
          const style = toInlineStyle(getSheetCellStyle(rIdx, cIdx));
          const isActive = selectedSheetCell.row === rIdx && selectedSheetCell.col === cIdx;
          const activeClass = isActive ? " sheet-cell-active" : "";
          return `<td contenteditable="true" data-row="${rIdx}" data-col="${cIdx}" class="sheet-cell${activeClass}" style="${style}">${sanitize(value)}</td>`;
        })
        .join("");

      return `<tr><th class="sheet-row-head">${rIdx + 1}</th>${cells}</tr>`;
    })
    .join("");

  updateSelectedCellUI();
  updateExcelStats();
}

function getSheetFromDom() {
  return activeSheetData.length ? activeSheetData : getDefaultSheet();
}

function updateSelectedCellUI() {
  if (!sheetBodyEl) {
    return;
  }

  const allCells = sheetBodyEl.querySelectorAll("td.sheet-cell");
  for (const cell of allCells) {
    cell.classList.remove("sheet-cell-active");
  }

  const selector = `td.sheet-cell[data-row="${selectedSheetCell.row}"][data-col="${selectedSheetCell.col}"]`;
  const activeEl = sheetBodyEl.querySelector(selector);
  if (activeEl) {
    activeEl.classList.add("sheet-cell-active");
  }

  if (excelNameBoxEl) {
    excelNameBoxEl.value = cellRefFromCoords(selectedSheetCell.row, selectedSheetCell.col);
  }

  if (excelFormulaInputEl) {
    excelFormulaInputEl.value = activeSheetData[selectedSheetCell.row]?.[selectedSheetCell.col] || "";
  }
}

function focusSelectedSheetCell() {
  if (!sheetBodyEl) {
    return;
  }

  const selector = `td.sheet-cell[data-row="${selectedSheetCell.row}"][data-col="${selectedSheetCell.col}"]`;
  const activeEl = sheetBodyEl.querySelector(selector);
  if (activeEl instanceof HTMLElement) {
    activeEl.focus();
  }
}

function setActiveCellValue(value) {
  if (!activeSheetData.length) {
    return;
  }

  activeSheetData[selectedSheetCell.row][selectedSheetCell.col] = String(value ?? "");
  renderSheetRows(activeSheetData, activeSheetStyles);
}

function applyStyleToSelectedCell(stylePatch) {
  const key = `${selectedSheetCell.row}:${selectedSheetCell.col}`;
  activeSheetStyles[key] = {
    ...(activeSheetStyles[key] || {}),
    ...stylePatch,
  };

  renderSheetRows(activeSheetData, activeSheetStyles);
}

function parseRangeCells(rangeText) {
  const text = String(rangeText || "").trim().toUpperCase();
  if (!text.includes(":")) {
    const single = parseCellRef(text);
    return single ? [single] : [];
  }

  const [startRef, endRef] = text.split(":");
  const start = parseCellRef(startRef);
  const end = parseCellRef(endRef);
  if (!start || !end) {
    return [];
  }

  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);
  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);
  const cells = [];

  for (let r = minRow; r <= maxRow; r += 1) {
    for (let c = minCol; c <= maxCol; c += 1) {
      cells.push({ row: r, col: c });
    }
  }

  return cells;
}

function calculateRangeValue(rangeText, mode) {
  const cells = parseRangeCells(rangeText);
  const numbers = cells
    .map(({ row, col }) => Number(activeSheetData[row]?.[col]))
    .filter((v) => Number.isFinite(v));

  if (!numbers.length) {
    return "";
  }

  if (mode === "sum") {
    return String(numbers.reduce((a, b) => a + b, 0));
  }

  if (mode === "avg") {
    return String(numbers.reduce((a, b) => a + b, 0) / numbers.length);
  }

  if (mode === "min") {
    return String(Math.min(...numbers));
  }

  if (mode === "max") {
    return String(Math.max(...numbers));
  }

  return "";
}

function getSheetBounds() {
  const maxRow = Math.max(0, activeSheetData.length - 1);
  const maxCol = Math.max(0, (activeSheetData[0]?.length || 1) - 1);
  return { maxRow, maxCol };
}

function clampSheetSelection(row, col) {
  const { maxRow, maxCol } = getSheetBounds();
  return {
    row: Math.max(0, Math.min(maxRow, row)),
    col: Math.max(0, Math.min(maxCol, col)),
  };
}

function getLastUsedSheetCell() {
  const { maxRow, maxCol } = getSheetBounds();
  let lastRow = 0;
  let lastCol = 0;

  for (let r = 0; r <= maxRow; r += 1) {
    for (let c = 0; c <= maxCol; c += 1) {
      if (String(activeSheetData[r]?.[c] || "").trim()) {
        lastRow = Math.max(lastRow, r);
        lastCol = Math.max(lastCol, c);
      }
    }
  }

  return { row: lastRow, col: lastCol };
}

function moveSheetSelectionTo(row, col, shouldFocus = true) {
  selectedSheetCell = clampSheetSelection(row, col);
  updateSelectedCellUI();
  if (shouldFocus) {
    focusSelectedSheetCell();
  }
}

function jumpSheetSelectionToCtrlEdge(direction) {
  const { maxRow, maxCol } = getSheetBounds();
  let { row, col } = selectedSheetCell;
  const isVertical = direction === "up" || direction === "down";
  const step = direction === "up" || direction === "left" ? -1 : 1;

  const readCell = (r, c) => String(activeSheetData[r]?.[c] || "").trim();
  const currentFilled = Boolean(readCell(row, col));

  const inBounds = (value) => (isVertical ? value >= 0 && value <= maxRow : value >= 0 && value <= maxCol);

  let cursor = (isVertical ? row : col) + step;

  if (currentFilled) {
    while (inBounds(cursor)) {
      const nextFilled = isVertical ? Boolean(readCell(cursor, col)) : Boolean(readCell(row, cursor));
      if (!nextFilled) {
        break;
      }
      if (isVertical) {
        row = cursor;
      } else {
        col = cursor;
      }
      cursor += step;
    }
  } else {
    while (inBounds(cursor)) {
      const nextFilled = isVertical ? Boolean(readCell(cursor, col)) : Boolean(readCell(row, cursor));
      if (nextFilled) {
        if (isVertical) {
          row = cursor;
        } else {
          col = cursor;
        }
        moveSheetSelectionTo(row, col);
        return;
      }

      if (isVertical) {
        row = cursor;
      } else {
        col = cursor;
      }
      cursor += step;
    }
  }

  moveSheetSelectionTo(row, col);
}

function saveActiveSheetNow(statusMessage) {
  const saved = saveToolsForAccount({
    sheet: activeSheetData,
    sheetStyles: activeSheetStyles,
  });

  if (!saved) {
    setStatus(sheetSavedAtEl, "Cannot save. Gold/Enterprise plan required.", "warn");
    return null;
  }

  setStatus(sheetSavedAtEl, `${statusMessage} ${new Date(saved.updatedAt).toLocaleTimeString()}`, "ok");
  return saved;
}

function switchExcelRibbonTab(tabName) {
  const tabs = document.querySelectorAll("[data-excel-tab]");
  const panels = document.querySelectorAll("[data-excel-panel]");

  for (const tab of tabs) {
    const active = tab.getAttribute("data-excel-tab") === tabName;
    tab.classList.toggle("excel-ribbon-tab-active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
  }

  for (const panel of panels) {
    const active = panel.getAttribute("data-excel-panel") === tabName;
    panel.classList.toggle("excel-ribbon-panel-active", active);
  }
}

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromDateTimeInputToKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return toDateKey(date);
}

function getCurrentAccountCalendarEvents() {
  const session = getSession();
  const account = session ? getAccounts().find((a) => a.id === session.id) : null;
  if (!account) {
    return [];
  }

  const tools = getToolsState();
  return Array.isArray(tools[account.id]?.calendar) ? tools[account.id].calendar : [];
}

function syncCalendarWhenInputWithSelectedDate() {
  if (!calendarWhenEl || !selectedCalendarDate) {
    return;
  }

  const parts = selectedCalendarDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return;
  }

  let hours;
  let minutes;
  if (calendarWhenEl.value) {
    const existing = new Date(calendarWhenEl.value);
    if (!Number.isNaN(existing.getTime())) {
      hours = existing.getHours();
      minutes = existing.getMinutes();
    }
  }

  if (typeof hours !== "number" || typeof minutes !== "number") {
    const now = new Date();
    hours = now.getHours();
    minutes = now.getMinutes();
  }

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  calendarWhenEl.value = `${selectedCalendarDate}T${hh}:${mm}`;
}

function normalizeCalendarEvent(event) {
  if (!event || typeof event !== "object") {
    return null;
  }

  const whenIso = String(event.when || "");
  const whenDate = new Date(whenIso);
  if (Number.isNaN(whenDate.getTime())) {
    return null;
  }

  const title = String(event.title || "").trim();
  if (!title) {
    return null;
  }

  const categoryRaw = String(event.category || "general").toLowerCase();
  const allowed = new Set(["meeting", "work", "personal", "deadline", "travel", "general"]);
  const category = allowed.has(categoryRaw) ? categoryRaw : "general";

  const reminderRaw = Number(event.reminderMinutes);
  const reminderMinutes = Number.isFinite(reminderRaw) ? Math.max(0, Math.floor(reminderRaw)) : 0;

  return {
    when: whenDate.toISOString(),
    title,
    category,
    reminderMinutes,
  };
}

function getCalendarCategoryLabel(category) {
  const map = {
    meeting: "Meeting",
    work: "Work",
    personal: "Personal",
    deadline: "Deadline",
    travel: "Travel",
    general: "General",
  };
  return map[category] || "General";
}

function getCalendarReminderLabel(minutes) {
  if (!minutes) {
    return "No reminder";
  }
  if (minutes < 60) {
    return `Reminder ${minutes}m before`;
  }
  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    return `Reminder ${hours}h before`;
  }
  const days = Math.floor(minutes / 1440);
  return `Reminder ${days}d before`;
}

function startOfWeek(date) {
  const base = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  base.setDate(base.getDate() - base.getDay());
  return base;
}

function buildCalendarDayCell(key, date, grouped, todayKey) {
  const count = grouped.get(key)?.length || 0;
  const items = grouped.get(key) || [];
  const preview = items.slice(0, 2).map((event) => `<span class="calendar-day-event">${sanitize(event.title)}</span>`).join("");
  const moreCount = count > 2 ? `<span class="calendar-day-more">+${count - 2} more</span>` : "";
  const isToday = key === todayKey;
  const isSelected = key === selectedCalendarDate;

  let classes = "calendar-day";
  if (isToday) {
    classes += " calendar-day-today";
  }
  if (isSelected) {
    classes += " calendar-day-selected";
  }

  return `
    <button type="button" class="${classes}" data-cal-day="${key}">
      <span class="calendar-day-num">${date.getDate()}</span>
      ${count ? '<span class="calendar-day-dot" aria-hidden="true"></span>' : ""}
      ${count ? `<span class="calendar-day-count">${count} event${count > 1 ? "s" : ""}</span>` : ""}
      <span class="calendar-day-events">${preview}${moreCount}</span>
    </button>
  `;
}

function renderCalendar(events) {
  const normalizedEvents = Array.isArray(events)
    ? events.map((event) => normalizeCalendarEvent(event)).filter(Boolean)
    : [];

  if (!selectedCalendarDate) {
    selectedCalendarDate = toDateKey(new Date());
  }

  if (calendarViewModeEl) {
    calendarViewMode = calendarViewModeEl.value || "month";
  }

  const query = String(calendarSearchInputEl?.value || "").trim().toLowerCase();
  const selectedCategory = String(calendarCategoryFilterEl?.value || "all").toLowerCase();
  const visibleEvents = normalizedEvents.filter((event) => {
    const categoryOk = selectedCategory === "all" || event.category === selectedCategory;
    const queryOk = !query || event.title.toLowerCase().includes(query) || event.category.toLowerCase().includes(query);
    return categoryOk && queryOk;
  });

  const grouped = new Map();
  for (const event of visibleEvents) {
    const key = fromDateTimeInputToKey(event.when);
    if (!key) {
      continue;
    }
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(event);
  }

  for (const [key, items] of grouped.entries()) {
    items.sort((a, b) => (a.when > b.when ? 1 : -1));
    grouped.set(key, items);
  }

  if (calendarMonthLabelEl && calendarGridEl) {
    const todayKey = toDateKey(new Date());
    const cells = [];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    calendarGridEl.classList.remove("calendar-grid-week", "calendar-grid-day");
    if (calendarWeekdaysEl) {
      calendarWeekdaysEl.classList.remove("calendar-weekdays-day");
      calendarWeekdaysEl.innerHTML = weekdays.map((w) => `<span>${w}</span>`).join("");
    }

    if (calendarViewMode === "week") {
      const selected = new Date(`${selectedCalendarDate}T00:00:00`);
      const weekStart = startOfWeek(selected);
      const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6);

      calendarMonthLabelEl.textContent = `Week of ${weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
      calendarGridEl.classList.add("calendar-grid-week");

      for (let i = 0; i < 7; i += 1) {
        const date = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i);
        const key = toDateKey(date);
        cells.push(buildCalendarDayCell(key, date, grouped, todayKey));
      }
    } else if (calendarViewMode === "day") {
      const selected = new Date(`${selectedCalendarDate}T00:00:00`);
      const key = toDateKey(selected);
      calendarMonthLabelEl.textContent = selected.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      if (calendarWeekdaysEl) {
        calendarWeekdaysEl.classList.add("calendar-weekdays-day");
        calendarWeekdaysEl.innerHTML = `<span>${selected.toLocaleDateString(undefined, { weekday: "long" })}</span>`;
      }

      calendarGridEl.classList.add("calendar-grid-day");
      cells.push(buildCalendarDayCell(key, selected, grouped, todayKey));
    } else {
      const year = calendarCursor.getFullYear();
      const month = calendarCursor.getMonth();
      const first = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const startWeekday = first.getDay();

      calendarMonthLabelEl.textContent = first.toLocaleString(undefined, {
        month: "long",
        year: "numeric",
      });

      for (let i = 0; i < startWeekday; i += 1) {
        cells.push('<button type="button" class="calendar-day calendar-day-muted" aria-hidden="true"></button>');
      }

      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(year, month, day);
        const key = toDateKey(date);
        cells.push(buildCalendarDayCell(key, date, grouped, todayKey));
      }
    }

    calendarGridEl.innerHTML = cells.join("");
  }

  const selectedEvents = grouped.get(selectedCalendarDate) || [];

  if (calendarSelectedDateEl) {
    const selected = selectedCalendarDate ? new Date(`${selectedCalendarDate}T00:00:00`) : new Date();
    calendarSelectedDateEl.textContent = selected.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (calendarAgendaEl) {
    if (!selectedEvents.length) {
      calendarAgendaEl.innerHTML = '<li class="muted">No events for selected day.</li>';
    } else {
      calendarAgendaEl.innerHTML = selectedEvents
        .map((event) => {
          const time = new Date(event.when).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return `<li><span>${time}</span><strong>${sanitize(event.title)}</strong><em class="calendar-cat-badge calendar-cat-${sanitize(event.category)}">${sanitize(getCalendarCategoryLabel(event.category))}</em><small class="calendar-reminder-label">${sanitize(getCalendarReminderLabel(event.reminderMinutes))}</small></li>`;
        })
        .join("");
    }
  }

  if (!calendarAgendaEl && calendarListEl) {
    if (!visibleEvents.length) {
      calendarListEl.innerHTML = '<li class="muted">No events scheduled.</li>';
    } else {
      calendarListEl.innerHTML = visibleEvents
        .slice()
        .sort((a, b) => (a.when > b.when ? 1 : -1))
        .map((event) => `<li><span>${new Date(event.when).toLocaleString()}</span><strong>${sanitize(event.title)}</strong></li>`)
        .join("");
    }
  }

  updateNotificationBell();
}

function renderToolsWorkspace() {
  if (!toolsGateStatusEl || !toolsLockedEl || !toolsWorkspaceEl) {
    return;
  }

  const file = String(window.location.pathname.split("/").pop() || "").toLowerCase();
  const enterpriseOnlyTools = new Set([
    "tool-metrics.html",
    "tool-slides.html",
    "tool-projects.html",
    "tool-chat.html",
    "tool-ai-assistant.html",
    "tool-drive-vault.html",
    "tool-forms.html",
    "tool-whiteboard.html",
    "tool-approvals.html",
  ]);

  const session = getSession();
  if (!session) {
    setStatus(toolsGateStatusEl, "Unlock an account to access enterprise tools.", "warn");
    toolsLockedEl.classList.remove("hidden");
    toolsWorkspaceEl.classList.add("hidden");
    return;
  }

  const account = getAccounts().find((a) => a.id === session.id);
  if (!account) {
    setStatus(toolsGateStatusEl, "Session account not found. Unlock again.", "bad");
    toolsLockedEl.classList.remove("hidden");
    toolsWorkspaceEl.classList.add("hidden");
    return;
  }

  if (!hasToolsAccess(account.plan, account.id)) {
    setStatus(toolsGateStatusEl, `Current plan (${account.plan}) does not include enterprise tools.`, "warn");
    toolsLockedEl.classList.remove("hidden");
    toolsWorkspaceEl.classList.add("hidden");
    return;
  }

  if (enterpriseOnlyTools.has(file) && !hasEnterpriseAccess(account.plan, account.id)) {
    setStatus(toolsGateStatusEl, `Current plan (${account.plan}) does not include this Enterprise-only tool.`, "warn");
    toolsLockedEl.classList.remove("hidden");
    toolsWorkspaceEl.classList.add("hidden");
    return;
  }

  setStatus(toolsGateStatusEl, `Access granted (${account.plan} plan).`, "ok");
  toolsLockedEl.classList.add("hidden");
  toolsWorkspaceEl.classList.remove("hidden");
  initMetricsStudioTools();

  const allTools = getToolsState();
  const data = allTools[account.id] || {
    wordTitle: "",
    wordBody: "",
    notes: "",
    sheet: getDefaultSheet(),
    sheetStyles: {},
    calendar: [],
    calculator: {
      expression: "",
      mode: "basic",
      result: "0",
      history: [],
    },
    metrics: {
      title: "",
      chartType: "line",
      displayMode: "number",
      aggregation: "raw",
      sortMode: "input",
      topN: "",
      movingAverageWindow: "",
      benchmark: "",
      showTrend: true,
      showAnomalies: true,
      labelsCsv: "",
      primaryCsv: "",
      secondaryCsv: "",
    },
    watchParty: {
      lastRoomCode: "",
    },
    updatedAt: null,
  };

  if (wordTitleEl) {
    wordTitleEl.value = data.wordTitle || "";
  }

  if (wordEditorEl) {
    setWordEditorHtml(data.wordBody || "");
  }

  if (notesEditorEl) {
    notesEditorEl.value = data.notes || "";
  }

  if (calcExpressionEl) {
    calcExpressionEl.value = data.calculator?.expression || "";
  }

  setCalculatorMode(data.calculator?.mode || "basic");

  if (calcResultEl) {
    calcResultEl.textContent = `Result: ${data.calculator?.result || "0"}`;
  }

  renderCalculatorHistory(data.calculator?.history || []);

  if (metricsTitleEl) {
    metricsTitleEl.value = data.metrics?.title || "";
  }
  if (metricsChartTypeEl) {
    metricsChartTypeEl.value = data.metrics?.chartType || "line";
  }
  if (metricsDisplayModeEl) {
    metricsDisplayModeEl.value = data.metrics?.displayMode || "number";
  }
  if (metricsAggregationEl) {
    metricsAggregationEl.value = data.metrics?.aggregation || "raw";
  }
  if (metricsSortModeEl) {
    metricsSortModeEl.value = data.metrics?.sortMode || "input";
  }
  if (metricsTopNEl) {
    metricsTopNEl.value = data.metrics?.topN || "";
  }
  if (metricsMovingAverageEl) {
    metricsMovingAverageEl.value = data.metrics?.movingAverageWindow || "";
  }
  if (metricsBenchmarkEl) {
    metricsBenchmarkEl.value = data.metrics?.benchmark || "";
  }
  if (metricsShowTrendEl) {
    metricsShowTrendEl.checked = data.metrics?.showTrend !== false;
  }
  if (metricsShowAnomaliesEl) {
    metricsShowAnomaliesEl.checked = data.metrics?.showAnomalies !== false;
  }
  if (metricsLabelsEl) {
    metricsLabelsEl.value = data.metrics?.labelsCsv || "";
  }
  if (metricsPrimaryEl) {
    metricsPrimaryEl.value = data.metrics?.primaryCsv || "";
  }
  if (metricsSecondaryEl) {
    metricsSecondaryEl.value = data.metrics?.secondaryCsv || "";
  }

  if (metricsPrimaryEl && String(metricsPrimaryEl.value).trim()) {
    renderMetricsDashboard();
  }

  if (watchPartyHeadingEl) {
    const queryRoom = normalizeWatchPartyRoomCode(new URLSearchParams(window.location.search).get("room"));
    const rememberedRoom = normalizeWatchPartyRoomCode(data.watchParty?.lastRoomCode || "");
    const initialRoom = queryRoom || rememberedRoom;

    if (initialRoom) {
      const joined = joinWatchPartyRoom(initialRoom, {
        skipQueryUpdate: false,
        statusText: queryRoom ? `Joined room ${initialRoom} from invite.` : `Rejoined room ${initialRoom}.`,
        tone: queryRoom ? "ok" : "muted",
      });

      if (!joined) {
        updateWatchPartyQueryParam("");
      }
    } else {
      renderWatchPartyState("Create or join a room to start your watch party.", "muted");
    }
  }

  const today = new Date();
  calendarCursor = new Date(today.getFullYear(), today.getMonth(), 1);
  selectedCalendarDate = toDateKey(today);

  renderSheetRows(Array.isArray(data.sheet) ? data.sheet : getDefaultSheet(), data.sheetStyles || {});
  renderCalendar(Array.isArray(data.calendar) ? data.calendar : []);
}

function saveToolsForAccount(patch) {
  const session = getSession();
  if (!session) {
    return null;
  }

  const account = getAccounts().find((a) => a.id === session.id);
  if (!account || !hasToolsAccess(account.plan, account.id)) {
    return null;
  }

  const allTools = getToolsState();
  const prev = allTools[account.id] || {
    wordTitle: "",
    wordBody: "",
    notes: "",
    sheet: getDefaultSheet(),
    sheetStyles: {},
    calendar: [],
    calculator: {
      expression: "",
      mode: "basic",
      result: "0",
      history: [],
    },
    metrics: {
      title: "",
      chartType: "line",
      displayMode: "number",
      aggregation: "raw",
      sortMode: "input",
      topN: "",
      movingAverageWindow: "",
      benchmark: "",
      showTrend: true,
      showAnomalies: true,
      labelsCsv: "",
      primaryCsv: "",
      secondaryCsv: "",
    },
    watchParty: {
      lastRoomCode: "",
    },
    updatedAt: null,
  };

  allTools[account.id] = {
    ...prev,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  saveToolsState(allTools);

  const serverTools = loadJson(STORAGE_KEYS.serverTools, {});
  serverTools[account.id] = {
    ...allTools[account.id],
    serverUpdatedAt: new Date().toISOString(),
  };
  saveServerToolsState(serverTools);

  return allTools[account.id];
}

if (generateBtn && accountIdEl && recoveryPhraseEl && identityBox) {
  generateBtn.addEventListener("click", () => {
    const id = randomAccountId();
    const phrase = randomRecoveryPhrase();
    ensureAccountStored({ id, phrase });

    accountIdEl.textContent = id;
    recoveryPhraseEl.textContent = phrase;
    identityBox.classList.remove("hidden");
  });
}

if (unlockForm) {
  unlockForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const id = document.getElementById("unlockId").value.trim();
    const phrase = normalizePhrase(document.getElementById("unlockPhrase").value);

    const account = getAccounts().find((a) => a.id === id && normalizePhrase(a.phrase) === phrase);
    if (!account) {
      setStatus(sessionStatus, "Unlock failed. ID or recovery phrase did not match.", "bad");
      return;
    }

    saveJson(STORAGE_KEYS.session, { id: account.id });
    updateSessionStatus();
    updateNavBySession();
    window.location.href = "./inbox.html";
  });
}

if (billingForm) {
  billingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const session = getSession();
    if (!session) {
      setStatus(billingStatus, "Unlock an account before activating a plan.", "warn");
      return;
    }

    const formData = new FormData(billingForm);
    const method = String(formData.get("paymentMethod") || "stripe");
    const planTier = String(formData.get("planTier") || "paid");

    const accounts = getAccounts();
    const account = accounts.find((a) => a.id === session.id);
    if (!account) {
      setStatus(billingStatus, "Account missing. Unlock again.", "bad");
      return;
    }

    account.plan = planTier;
    account.paymentMethod = method;
    account.updatedAt = new Date().toISOString();
    saveJson(STORAGE_KEYS.accounts, accounts);

    setStatus(billingStatus, `Plan ${planTier.toUpperCase()} activated via ${method} (mock).`, "ok");
    updateSessionStatus();
  });
}

if (ownerSignForm) {
  ownerSignForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const session = getSession();
    if (!session) {
      setStatus(ownerAuthStatusEl, "Unlock an account first.", "warn");
      return;
    }

    const accounts = getAccounts();
    const account = accounts.find((entry) => entry.id === session.id);
    if (!account) {
      setStatus(ownerAuthStatusEl, "Session account missing. Unlock again.", "bad");
      return;
    }

    const phraseInput = normalizePhrase(String(ownerSignPhraseEl?.value || ""));
    if (!phraseInput) {
      setStatus(ownerAuthStatusEl, "Enter the recovery phrase to sign owner session.", "warn");
      return;
    }

    const expectedPhrase = normalizePhrase(account.phrase || "");
    if (phraseInput !== expectedPhrase) {
      setStatus(ownerAuthStatusEl, "Recovery phrase mismatch.", "bad");
      return;
    }

    const ownerEnabled = ensureOwnerAccountForSession(account);
    if (!ownerEnabled) {
      setStatus(ownerAuthStatusEl, "This account is not the owner account.", "bad");
      return;
    }

    const issuedAt = Date.now();
    const expiresAt = issuedAt + OWNER_SESSION_TTL_MS;
    const signature = createOwnerSignature(account.id, expectedPhrase, issuedAt, expiresAt);
    saveJson(STORAGE_KEYS.ownerAuth, {
      ownerId: account.id,
      issuedAt,
      expiresAt,
      signature,
    });

    refreshGiftAdminAuthStatus();
    refreshGiftAdminTable();
    refreshAdminRoleTable();
    renderAdminAuditTable();
    setStatus(giftAdminStatusEl, "Owner session signed. Admin endpoints unlocked.", "ok");
    updateSessionStatus();
    if (ownerSignPhraseEl) {
      ownerSignPhraseEl.value = "";
    }
  });
}

if (giftGrantForm) {
  giftGrantForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const visitorId = String(giftGrantAccountIdEl?.value || "").trim();
    const reason = String(giftGrantReasonEl?.value || "").trim();
    const response = prototypeApiPost("/api/billing/gift", { visitorId, reason });
    if (!response.ok) {
      setStatus(giftAdminStatusEl, response.error || "Grant failed.", "bad");
      refreshGiftAdminAuthStatus();
      return;
    }

    setStatus(giftAdminStatusEl, `Lifetime granted to ${visitorId}.`, "ok");
    refreshGiftAdminTable();
    renderAdminAuditTable();
    updateSessionStatus();
    if (giftGrantForm) {
      giftGrantForm.reset();
    }
  });
}

if (giftSearchBtn) {
  giftSearchBtn.addEventListener("click", () => {
    refreshGiftAdminTable();
  });
}

if (giftRefreshBtn) {
  giftRefreshBtn.addEventListener("click", () => {
    if (giftSearchQueryEl) {
      giftSearchQueryEl.value = "";
    }
    refreshGiftAdminTable();
  });
}

if (adminRoleSearchBtn) {
  adminRoleSearchBtn.addEventListener("click", () => {
    refreshAdminRoleTable();
  });
}

if (adminRoleRefreshBtn) {
  adminRoleRefreshBtn.addEventListener("click", () => {
    if (adminRoleSearchQueryEl) {
      adminRoleSearchQueryEl.value = "";
    }
    refreshAdminRoleTable();
  });
}

if (messageForm) {
  messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const session = getSession();
    if (!session) {
      setStatus(composeStatus, "Unlock an account first.", "warn");
      return;
    }

    const accounts = getAccounts();
    const sender = accounts.find((a) => a.id === session.id);
    if (!sender) {
      setStatus(composeStatus, "Session account missing. Unlock again.", "bad");
      return;
    }

    if (!hasMessagingAccess(sender.plan, sender.id)) {
      setStatus(composeStatus, "Messaging requires a paid plan. Upgrade first.", "warn");
      return;
    }

    const toInput = document.getElementById("toId");
    const toRaw = toInput?.value.trim() || "";
    const subject = String(document.getElementById("subject")?.value || "").trim();
    const messageTextEl = document.getElementById("messageText");
    const text = composeEditorEl ? getComposeEditorPlainText().trim() : (messageTextEl?.value.trim() || "");
    const textHtml = composeEditorEl ? sanitizeMessageHtml(getComposeEditorHtml()) : "";
    const files = typeof window.__composeSelectedFiles === "function"
      ? window.__composeSelectedFiles()
      : Array.from(document.getElementById("attachments").files || []);
    const burnPolicyEl = document.getElementById("burnPolicy");
    const burnPolicy = burnPolicyEl ? burnPolicyEl.value : "30d";
    const addToFriendsEl = document.getElementById("addToFriends");
    const nicknameRaw = document.getElementById("friendNickname")?.value.trim() || "";
    const addToFriends = Boolean(addToFriendsEl?.checked);

    if (!toRaw) {
      setStatus(composeStatus, "Recipient ID or nickname is required.", "bad");
      return;
    }

    if (!text && files.length === 0) {
      setStatus(composeStatus, "Add text or at least one attachment.", "bad");
      return;
    }

    // Parse comma-separated recipient IDs/nicknames and resolve each
    const rawEntries = toRaw.split(",").map((s) => s.trim()).filter(Boolean);
    const resolvedRecipients = [];
    for (const entry of rawEntries) {
      const resolved = resolveRecipientId(entry, sender.id);
      if (!resolved) {
        setStatus(composeStatus, `Recipient "${entry}" not found. Use a valid NPA ID or saved nickname.`, "warn");
        return;
      }
      resolvedRecipients.push(resolved);
    }

    const validation = validateAttachments(files);
    if (!validation.ok) {
      setStatus(composeStatus, validation.reason, "bad");
      return;
    }

    let attachmentPayload = validation.normalized;
    try {
      attachmentPayload = await buildAttachmentPayload(files, validation.normalized);
    } catch {
      setStatus(composeStatus, "Attachment processing failed. Try again.", "bad");
      return;
    }

    // Build deduplicated recipient list (To field entries + any ccRecipients)
    const allRecipients = [...new Set([...resolvedRecipients, ...ccRecipients])];

    if (burnPolicy === "never") {
      const blockedRecipients = allRecipients.filter((recipientId) => countNeverBurnMessagesForUser(recipientId) >= 10);
      if (blockedRecipients.length) {
        setStatus(composeStatus, `Never-burn limit reached for ${blockedRecipients.join(", ")}. Trash one never-burn email first.`, "warn");
        return;
      }
    }

    const to = resolvedRecipients[0]; // primary (for addToFriends upsert)
    const messages = getMessages();
    const expiresAt = computeExpiresAt(burnPolicy);
    const sentAt = new Date().toISOString();

    allRecipients.forEach((recipient) => {
      messages.push({
        id: createMessageId(),
        from: sender.id,
        to: recipient,
        subject,
        text,
        textHtml: textHtml || null,
        attachments: attachmentPayload,
        createdAt: sentAt,
        burnPolicy,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        payloadType: "encryptedBlobMock",
      });
    });

    saveJson(STORAGE_KEYS.messages, messages);

    if (addToFriends || nicknameRaw) {
      upsertContact(sender.id, to, {
        nickname: nicknameRaw,
      });
    }

    const extra = allRecipients.length - 1;
    const sentSummary = extra > 0 ? `Message sent to ${allRecipients.length} recipients.` : "Message sent.";
    setStatus(composeStatus, sentSummary, "ok");
    updateNotificationBell();
    messageForm.reset();
    if (composeEditorEl) {
      composeEditorEl.innerHTML = "";
      syncComposeTextareaValue();
    }
    if (toInput) {
      toInput.value = "";
      toInput.setCustomValidity("");
    }

    // Clear file selection
    if (typeof window.__composeClearFiles === "function") window.__composeClearFiles();

    // Clear CC and selection after send
    ccRecipients = [];
    selectedFriends.clear();
    renderCcChips();
    renderComposeContacts();
    clearComposeDraftForAccount(sender.id);
  });
}

if (sendInviteBtn) {
  sendInviteBtn.addEventListener("click", () => {
    const session = getSession();
    if (!session) {
      setStatus(composeStatus, "Unlock an account first.", "warn");
      return;
    }

    const accounts = getAccounts();
    const sender = accounts.find((a) => a.id === session.id);
    if (!sender) {
      setStatus(composeStatus, "Session account missing. Unlock again.", "bad");
      return;
    }

    if (!hasMessagingAccess(sender.plan, sender.id)) {
      setStatus(composeStatus, "Messaging requires a paid plan. Upgrade first.", "warn");
      return;
    }

    const toInput = document.getElementById("toId");
    const toRaw = toInput?.value.trim() || "";
    const to = resolveRecipientId(toRaw, sender.id);
    const nicknameRaw = document.getElementById("friendNickname")?.value.trim() || "";

    if (!toRaw || !to) {
      setStatus(composeStatus, "Enter a valid recipient ID or nickname first.", "warn");
      return;
    }

    if (to === sender.id) {
      setStatus(composeStatus, "Cannot send a collaboration invite to your own account.", "warn");
      return;
    }

    const messages = getMessages();
    messages.push({
      id: createMessageId(),
      from: sender.id,
      to,
      subject: "Collaboration Invite",
      text: "Collaboration request: Join shared workspace and collaborate on enterprise docs.",
      attachments: [],
      createdAt: new Date().toISOString(),
      burnPolicy: "30d",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      payloadType: "collabInvite",
      inviteNote: "This invite allows shared editing and messaging in the prototype workspace.",
      inviteStatus: "pending",
    });
    saveJson(STORAGE_KEYS.messages, messages);

    upsertContact(sender.id, to, {
      nickname: nicknameRaw,
    });

    setStatus(composeStatus, "Collaboration invite sent by mail.", "ok");
    updateNotificationBell();
    renderComposeContacts();
  });
}

if (composeAddFriendBtnEl) {
  composeAddFriendBtnEl.addEventListener("click", () => {
    const session = getSession();
    if (!session?.id) {
      setStatus(composeStatus, "Unlock an account first.", "warn");
      return;
    }

    const toInput = document.getElementById("toId");
    const toRaw = String(toInput?.value || "").trim();
    if (!toRaw) {
      setStatus(composeStatus, "Enter a recipient NPA ID or nickname first.", "warn");
      return;
    }

    const firstEntry = toRaw.split(",").map((v) => v.trim()).find(Boolean) || "";
    const resolved = resolveRecipientId(firstEntry, session.id);
    if (!resolved) {
      setStatus(composeStatus, "Recipient not found. Use a valid NPA ID or existing nickname.", "warn");
      return;
    }

    if (resolved === session.id) {
      setStatus(composeStatus, "You cannot add your own account as a friend.", "warn");
      return;
    }

    const nickname = String(document.getElementById("friendNickname")?.value || "").trim();
    upsertContact(session.id, resolved, { nickname });
    setStatus(composeStatus, `Added ${resolved} to friends.`, "ok");
    renderComposeContacts();
    renderFriendsList();
    scheduleComposeDraftAutosave();
  });
}

if (refreshInboxBtn) {
  refreshInboxBtn.addEventListener("click", () => {
    renderInbox();
  });
}

if (inboxAddFriendBtnEl) {
  inboxAddFriendBtnEl.addEventListener("click", () => {
    const session = getSession();
    if (!session?.id) {
      setStatus(inboxStatus, "Unlock an account first.", "warn");
      return;
    }

    const lookup = String(inboxAddFriendIdEl?.value || "").trim();
    if (!lookup) {
      setStatus(inboxStatus, "Enter a friend NPA ID or nickname.", "warn");
      return;
    }

    const resolved = resolveRecipientId(lookup, session.id);
    if (!resolved) {
      setStatus(inboxStatus, "Friend not found. Use a valid NPA ID or existing nickname.", "warn");
      return;
    }

    if (resolved === session.id) {
      setStatus(inboxStatus, "You cannot add your own account as a friend.", "warn");
      return;
    }

    const nickname = String(inboxAddFriendNicknameEl?.value || "").trim();
    upsertContact(session.id, resolved, { nickname });
    setStatus(inboxStatus, `Added ${resolved} to friends.`, "ok");

    if (inboxAddFriendIdEl) {
      inboxAddFriendIdEl.value = "";
    }

    if (inboxAddFriendNicknameEl) {
      inboxAddFriendNicknameEl.value = "";
    }

    renderComposeContacts();
    renderInbox();
  });
}

if (inboxFolderBtn) {
  inboxFolderBtn.addEventListener("click", () => {
    selectedMailboxFolder = "inbox";
    selectedMessageId = null;
    renderInbox();
  });
}

if (spamFolderBtn) {
  spamFolderBtn.addEventListener("click", () => {
    selectedMailboxFolder = "spam";
    selectedMessageId = null;
    renderInbox();
  });
}

if (neverFolderBtn) {
  neverFolderBtn.addEventListener("click", () => {
    selectedMailboxFolder = "never";
    selectedMessageId = null;
    renderInbox();
  });
}

if (trashFolderBtn) {
  trashFolderBtn.addEventListener("click", () => {
    selectedMailboxFolder = "trash";
    selectedMessageId = null;
    renderInbox();
  });
}

if (burnAllMailBtn) {
  burnAllMailBtn.addEventListener("click", () => {
    const session = getSession();
    if (!session?.id) {
      setStatus(inboxStatus, "Unlock an account first.", "warn");
      return;
    }

    const confirmed = window.confirm("Warning: This burns all of your mail and it can't be recovered. Continue?");
    if (!confirmed) {
      return;
    }

    const messages = ensureMessageIds();
    const next = messages.filter((m) => m.to !== session.id && m.from !== session.id);
    saveJson(STORAGE_KEYS.messages, next);
    selectedMessageId = null;
    setStatus(inboxStatus, "All mail burned permanently.", "ok");
    renderInbox();
  });
}

if (inboxEl) {
  inboxEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const openBtn = target.closest("[data-open-message]");
    if (openBtn) {
      const messageId = openBtn.getAttribute("data-open-message");
      if (messageId) {
        selectedMessageId = messageId;
        renderInbox();
      }
      return;
    }

    const downloadBtn = target.closest("[data-download-attachment]");
    if (downloadBtn) {
      const messageId = downloadBtn.getAttribute("data-download-attachment");
      const indexRaw = downloadBtn.getAttribute("data-attachment-index");
      const session = getSession();
      const index = Number(indexRaw);
      if (!messageId || !session?.id || !Number.isInteger(index) || index < 0) {
        return;
      }

      const messages = ensureMessageIds();
      const targetMessage = messages.find((m) => m.id === messageId && m.to === session.id);
      const attachment = targetMessage?.attachments?.[index];
      if (!attachment || !attachment.dataUrl) {
        setStatus(inboxStatus, "Attachment data is unavailable for download.", "warn");
        return;
      }

      const link = document.createElement("a");
      link.href = attachment.dataUrl;
      link.download = attachment.name || `attachment-${index + 1}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatus(inboxStatus, `Downloaded ${attachment.name || "attachment"}.`, "ok");
      return;
    }

    const addFriendBtn = target.closest("[data-add-friend]");
    if (addFriendBtn) {
      const session = getSession();
      if (!session?.id) {
        setStatus(inboxStatus, "Unlock an account first.", "warn");
        return;
      }

      const contactId = addFriendBtn.getAttribute("data-add-friend");
      if (!contactId) {
        return;
      }

      const nicknameInput = document.getElementById("friendNicknameInput");
      const nickname = nicknameInput?.value.trim() || "";
      upsertContact(session.id, contactId, { nickname });
      setStatus(inboxStatus, "Sender added to friends.", "ok");
      renderComposeContacts();
      renderInbox();
      return;
    }

    const markSpamBtn = target.closest("[data-mark-spam]");
    if (markSpamBtn) {
      const messageId = markSpamBtn.getAttribute("data-mark-spam");
      const session = getSession();
      if (!messageId || !session?.id) {
        return;
      }

      const messages = ensureMessageIds();
      const targetMessage = messages.find((m) => m.id === messageId && m.to === session.id);
      if (!targetMessage) {
        return;
      }

      markMessageSpam(targetMessage);
      saveJson(STORAGE_KEYS.messages, messages);
      selectedMessageId = null;
      setStatus(inboxStatus, "Message moved to spam (auto-burn in 12 hours).", "ok");
      renderInbox();
      return;
    }

    const unspamBtn = target.closest("[data-unspam-message]");
    if (unspamBtn) {
      const messageId = unspamBtn.getAttribute("data-unspam-message");
      const session = getSession();
      if (!messageId || !session?.id) {
        return;
      }

      const messages = ensureMessageIds();
      const targetMessage = messages.find((m) => m.id === messageId && m.to === session.id);
      if (!targetMessage) {
        return;
      }

      targetMessage.spam = false;
      targetMessage.spamMarkedAt = null;
      targetMessage.spamExpiresAt = null;
      saveJson(STORAGE_KEYS.messages, messages);
      selectedMessageId = null;
      setStatus(inboxStatus, "Message moved back to inbox.", "ok");
      renderInbox();
      return;
    }

    const setNeverBtn = target.closest("[data-set-never-message]");
    if (setNeverBtn) {
      const messageId = setNeverBtn.getAttribute("data-set-never-message");
      const session = getSession();
      if (!messageId || !session?.id) {
        return;
      }

      if (countNeverBurnMessagesForUser(session.id) >= 10) {
        setStatus(inboxStatus, "Never Burn folder is full (10/10). Move one to Trash first.", "warn");
        return;
      }

      const messages = ensureMessageIds();
      const targetMessage = messages.find((m) => m.id === messageId && m.to === session.id && !m.trashed && !m.spam);
      if (!targetMessage) {
        return;
      }

      if (setMessageNeverBurn(targetMessage)) {
        saveJson(STORAGE_KEYS.messages, messages);
      }
      selectedMailboxFolder = "never";
      selectedMessageId = targetMessage.id;
      setStatus(inboxStatus, "Message moved to Never Burn folder.", "ok");
      renderInbox();
      return;
    }

    const unsetNeverBtn = target.closest("[data-unset-never-message]");
    if (unsetNeverBtn) {
      const messageId = unsetNeverBtn.getAttribute("data-unset-never-message");
      const session = getSession();
      if (!messageId || !session?.id) {
        return;
      }

      const messages = ensureMessageIds();
      const targetMessage = messages.find((m) => m.id === messageId && m.to === session.id && !m.trashed && !m.spam);
      if (!targetMessage) {
        return;
      }

      if (unsetMessageNeverBurn(targetMessage)) {
        saveJson(STORAGE_KEYS.messages, messages);
      }
      selectedMailboxFolder = "inbox";
      selectedMessageId = targetMessage.id;
      setStatus(inboxStatus, "Message moved back to Inbox.", "ok");
      renderInbox();
      return;
    }

    const blockSenderBtn = target.closest("[data-block-sender]");
    if (blockSenderBtn) {
      const senderId = blockSenderBtn.getAttribute("data-block-sender");
      const session = getSession();
      if (!senderId || !session?.id) {
        return;
      }

      upsertContact(session.id, senderId, { blocked: true, favorite: false });

      const messages = ensureMessageIds();
      let changed = false;
      for (const message of messages) {
        if (message.to !== session.id || message.from !== senderId) {
          continue;
        }
        changed = markMessageSpam(message) || changed;
      }

      if (changed) {
        saveJson(STORAGE_KEYS.messages, messages);
      }

      selectedMessageId = null;
      setStatus(inboxStatus, "Sender blocked. Messages from this sender are routed to spam.", "ok");
      renderComposeContacts();
      renderInbox();
      return;
    }

    const restoreBtn = target.closest("[data-restore-message]");
    if (restoreBtn) {
      const messageId = restoreBtn.getAttribute("data-restore-message");
      const session = getSession();
      if (!messageId || !session?.id) {
        return;
      }

      const messages = ensureMessageIds();
      const targetMessage = messages.find((m) => m.id === messageId && m.to === session.id);
      if (!targetMessage) {
        return;
      }

      targetMessage.trashed = false;
      targetMessage.trashMarkedAt = null;
      targetMessage.trashExpiresAt = null;
      saveJson(STORAGE_KEYS.messages, messages);
      selectedMessageId = null;
      setStatus(inboxStatus, "Message restored from trash.", "ok");
      renderInbox();
      return;
    }

    const acceptInviteBtn = target.closest("[data-accept-invite]");
    if (acceptInviteBtn) {
      const messageId = acceptInviteBtn.getAttribute("data-accept-invite");
      if (!messageId) {
        return;
      }

      const session = getSession();
      if (!session?.id) {
        setStatus(inboxStatus, "Unlock an account first.", "warn");
        return;
      }

      const messages = ensureMessageIds();
      const targetMessage = messages.find((m) => m.id === messageId && m.to === session.id);
      if (!targetMessage) {
        return;
      }

      targetMessage.inviteStatus = "accepted";
      targetMessage.inviteRespondedAt = new Date().toISOString();
      saveJson(STORAGE_KEYS.messages, messages);
      upsertContact(session.id, targetMessage.from, {});
      setStatus(inboxStatus, "Invite accepted. Sender added to friends.", "ok");
      renderComposeContacts();
      renderInbox();
      return;
    }

    const declineInviteBtn = target.closest("[data-decline-invite]");
    if (declineInviteBtn) {
      const messageId = declineInviteBtn.getAttribute("data-decline-invite");
      if (!messageId) {
        return;
      }

      const session = getSession();
      if (!session?.id) {
        setStatus(inboxStatus, "Unlock an account first.", "warn");
        return;
      }

      const messages = ensureMessageIds();
      const targetMessage = messages.find((m) => m.id === messageId && m.to === session.id);
      if (!targetMessage) {
        return;
      }

      targetMessage.inviteStatus = "declined";
      targetMessage.inviteRespondedAt = new Date().toISOString();
      saveJson(STORAGE_KEYS.messages, messages);
      setStatus(inboxStatus, "Invite declined.", "muted");
      renderInbox();
      return;
    }

    const deleteBtn = target.closest("[data-delete-message]");
    if (deleteBtn) {
      const messageId = deleteBtn.getAttribute("data-delete-message");
      if (!messageId) {
        return;
      }

      const messages = ensureMessageIds();
      const targetMessage = messages.find((m) => m.id === messageId);
      if (!targetMessage) {
        return;
      }

      if (targetMessage.trashed) {
        const next = messages.filter((m) => m.id !== messageId);
        saveJson(STORAGE_KEYS.messages, next);
        setStatus(inboxStatus, "Message burned permanently.", "ok");
      } else {
        markMessageTrash(targetMessage);
        saveJson(STORAGE_KEYS.messages, messages);
        setStatus(inboxStatus, "Message moved to trash (auto-burn in 48 hours).", "ok");
      }

      selectedMessageId = null;
      renderInbox();
    }
  });
}

// ── Friends drawer ─────────────────────────────────────────────────────────
if (openFriendsBtnEl) {
  openFriendsBtnEl.addEventListener("click", () => openFriendsDrawer());
}

if (friendsDrawerCloseEl) {
  friendsDrawerCloseEl.addEventListener("click", () => closeFriendsDrawer());
}

if (friendsDrawerOverlayEl) {
  friendsDrawerOverlayEl.addEventListener("click", () => closeFriendsDrawer());
}

if (friendsListEl) {
  friendsListEl.addEventListener("click", (event) => {
    const card = event.target instanceof HTMLElement && event.target.closest("[data-friend-toggle]");
    if (!card) {
      return;
    }

    const id = card.getAttribute("data-friend-toggle");
    if (!id) {
      return;
    }

    const session = getSession();
    const contact = getContactsForOwner(session?.id || "").find((c) => c.id === id);
    if (contact?.blocked) {
      return;
    }

    if (selectedFriends.has(id)) {
      selectedFriends.delete(id);
    } else {
      selectedFriends.add(id);
    }

    renderFriendsList();
  });

  friendsListEl.addEventListener("contextmenu", (event) => {
    const card = event.target instanceof HTMLElement && event.target.closest("[data-friend-id]");
    if (!card) {
      return;
    }

    event.preventDefault();
    const friendId = card.getAttribute("data-friend-id");
    const session = getSession();
    const ownerId = session?.id;
    if (!ownerId || !friendId) {
      return;
    }

    const contact = getContactsForOwner(ownerId).find((c) => c.id === friendId);
    if (!contact) {
      return;
    }

    openFriendsContextMenu(contact, event.clientX, event.clientY);
  });
}

if (addCcFromFriendsBtnEl) {
  addCcFromFriendsBtnEl.addEventListener("click", () => {
    if (!selectedFriends.size) {
      return;
    }

    // Append selected IDs to the To field, comma-separated
    const toInput = document.getElementById("toId");
    if (toInput) {
      const current = toInput.value.trim();
      const newIds = [...selectedFriends];
      toInput.value = current
        ? current.replace(/,\s*$/, "") + ", " + newIds.join(", ")
        : newIds.join(", ");
      toInput.setCustomValidity("");
    }

    // Also track in ccRecipients for fan-out
    const existing = new Set(ccRecipients);
    selectedFriends.forEach((id) => existing.add(id));
    ccRecipients = [...existing];
    selectedFriends.clear();

    closeFriendsDrawer();
    renderCcChips();
    scheduleComposeDraftAutosave();
  });
}

if (clearFriendSelBtnEl) {
  clearFriendSelBtnEl.addEventListener("click", () => {
    selectedFriends.clear();
    renderFriendsList();
  });
}

if (clearCcBtnEl) {
  clearCcBtnEl.addEventListener("click", () => {
    ccRecipients = [];
    renderCcChips();
    scheduleComposeDraftAutosave();
  });
}

if (ccChipsEl) {
  ccChipsEl.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    const btn = event.target.closest("[data-remove-cc]");
    if (!btn) {
      return;
    }

    const removeId = btn.getAttribute("data-remove-cc");
    if (removeId) {
      ccRecipients = ccRecipients.filter((id) => id !== removeId);
      renderCcChips();
      scheduleComposeDraftAutosave();
    }
  });
}
// ── /Friends drawer ─────────────────────────────────────────────────────────

const toIdInputEl = document.getElementById("toId");
if (toIdInputEl) {
  toIdInputEl.addEventListener("input", () => {
    const session = getSession();
    const value = toIdInputEl.value.trim();
    if (!value) {
      toIdInputEl.setCustomValidity("");
      return;
    }
    // Allow comma-separated entries; validate each one
    const entries = value.split(",").map((s) => s.trim()).filter(Boolean);
    const bad = entries.find((e) => !resolveRecipientId(e, session?.id || ""));
    if (bad) {
      toIdInputEl.setCustomValidity(`"${bad}" is not a known NPA ID or nickname.`);
    } else {
      toIdInputEl.setCustomValidity("");
    }
  });
}

if (composeToolbarEl && composeEditorEl) {
  composeToolbarEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const btn = target.closest("[data-compose-cmd]");
    if (!btn) {
      return;
    }

    const command = btn.getAttribute("data-compose-cmd") || "";
    if (!command) {
      return;
    }

    if (command === "createLink") {
      openComposeLinkPopover();
    } else {
      runComposeCommand(command);
    }

    syncComposeTextareaValue();
  });

  composeEditorEl.addEventListener("input", () => {
    syncComposeTextareaValue();
  });

  composeEditorEl.addEventListener("keydown", (event) => {
    if (!(event.ctrlKey || event.metaKey)) {
      return;
    }

    const key = event.key.toLowerCase();
    if (key === "b") {
      event.preventDefault();
      runComposeCommand("bold");
    } else if (key === "i") {
      event.preventDefault();
      runComposeCommand("italic");
    } else if (key === "u") {
      event.preventDefault();
      runComposeCommand("underline");
    } else if (key === "k") {
      event.preventDefault();
      openComposeLinkPopover();
    }

    syncComposeTextareaValue();
  });

  composeEditorEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const link = target.closest("a");
    if (!link) {
      return;
    }

    const href = String(link.getAttribute("href") || "").trim();
    if (!/^(https?:|mailto:)/i.test(href)) {
      return;
    }

    event.preventDefault();
    window.open(href, "_blank", "noopener");
  });

  syncComposeTextareaValue();
}

if (composeApplyLinkBtn) {
  composeApplyLinkBtn.addEventListener("click", () => {
    applyComposeLinkFromPopover();
  });
}

if (composeRemoveLinkBtn) {
  composeRemoveLinkBtn.addEventListener("click", () => {
    removeComposeLinkFromPopover();
  });
}

if (composeCancelLinkBtn) {
  composeCancelLinkBtn.addEventListener("click", () => {
    closeComposeLinkPopover();
  });
}

// ── Compose v2: character counter ─────────────────────────────────────────
const composeCharCountEl = document.getElementById("composeCharCount");
const COMPOSE_CHAR_LIMIT = 5000;

if (composeEditorEl && composeCharCountEl) {
  const updateCharCount = () => {
    const len = (composeEditorEl.innerText || "").length;
    composeCharCountEl.textContent = String(len);
    composeCharCountEl.classList.toggle("over-limit", len > COMPOSE_CHAR_LIMIT);
  };
  composeEditorEl.addEventListener("input", updateCharCount);
  updateCharCount();
}

// ── Compose v2: attachment drop zone & file preview chips ─────────────────
(function wireAttachDropZone() {
  const dropZone = document.getElementById("attachDropZone");
  const fileInput = document.getElementById("attachments");
  const previewList = document.getElementById("attachPreviewList");
  if (!dropZone || !fileInput || !previewList) return;

  // DataTransfer to hold selected files (file input may not support programmatic File assignment cross-browser)
  let selectedFiles = [];

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + "B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + "KB";
    return (bytes / (1024 * 1024)).toFixed(1) + "MB";
  }

  function renderFilePreviews() {
    previewList.innerHTML = selectedFiles
      .map((f, i) => {
        const name = sanitize(f.name);
        const size = formatFileSize(f.size);
        return `<span class="attach-file-chip">
          <span class="attach-file-chip-name" title="${name}">${name}</span>
          <span class="attach-file-chip-size">${size}</span>
          <button class="attach-file-chip-remove" type="button" data-remove-file="${i}" aria-label="Remove ${name}">&times;</button>
        </span>`;
      })
      .join("");
  }

  function syncFilesToInput() {
    // We can't programmatically reassign FileList, so we just track selectedFiles
    // and read them from selectedFiles in the form submission
    renderFilePreviews();
  }

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    const files = Array.from(e.dataTransfer?.files || []);
    files.forEach((f) => selectedFiles.push(f));
    syncFilesToInput();
  });

  fileInput.addEventListener("change", () => {
    Array.from(fileInput.files || []).forEach((f) => selectedFiles.push(f));
    syncFilesToInput();
    // Reset input so same file can be re-added if removed
    fileInput.value = "";
  });

  previewList.addEventListener("click", (e) => {
    const btn = e.target instanceof HTMLElement && e.target.closest("[data-remove-file]");
    if (!btn) return;
    const idx = parseInt(btn.getAttribute("data-remove-file") || "-1", 10);
    if (idx >= 0) {
      selectedFiles.splice(idx, 1);
      syncFilesToInput();
    }
  });

  // Expose selectedFiles so the form submit can access them
  window.__composeSelectedFiles = () => selectedFiles;
  window.__composeClearFiles = () => { selectedFiles = []; syncFilesToInput(); };
})();

// ── Compose v2: right panel toggle buttons ────────────────────────────────
(function wirePanelToggles() {
  [
    ["contactsPanelToggle", "contactsPanelBody"],
    ["burnPanelToggle", "burnPanelBody"],
  ].forEach(([btnId, bodyId]) => {
    const btn = document.getElementById(btnId);
    const body = document.getElementById(bodyId);
    if (!btn || !body) return;
    btn.addEventListener("click", () => {
      const collapsed = body.classList.toggle("collapsed");
      btn.setAttribute("aria-expanded", String(!collapsed));
      btn.textContent = collapsed ? "›" : "⌄";
    });
  });
})();

// ── Compose v2: Add to CC button (opens friends drawer) ───────────────────
const addCcPanelBtnEl = document.getElementById("addCcPanelBtn");
if (addCcPanelBtnEl) {
  addCcPanelBtnEl.addEventListener("click", () => openFriendsDrawer());
}

// ── Compose v2: Save as Draft (placeholder) ───────────────────────────────
const saveDraftBtnEl = document.getElementById("saveDraftBtn");
if (saveDraftBtnEl) {
  saveDraftBtnEl.addEventListener("click", () => {
    const saved = saveComposeDraftForSession(true);
    if (!saved) {
      setStatus(composeStatus, "Unlock an account first to save drafts.", "warn");
    }
  });
}

// Restore draft when compose view initializes
if (messageForm) {
  restoreComposeDraftForSession();

  const draftInputs = [
    document.getElementById("toId"),
    document.getElementById("subject"),
    document.getElementById("burnPolicy"),
    document.getElementById("friendNickname"),
    document.getElementById("addToFriends"),
  ];

  draftInputs.forEach((el) => {
    if (!el) {
      return;
    }

    const evt = el instanceof HTMLInputElement && el.type === "checkbox" ? "change" : "input";
    el.addEventListener(evt, () => scheduleComposeDraftAutosave());
  });

  if (composeEditorEl) {
    composeEditorEl.addEventListener("input", () => scheduleComposeDraftAutosave());
  }
}

// ── Compose v2: render recent contacts as chips ───────────────────────────
function renderComposeRecentChips() {
  const chipsEl = document.getElementById("composeRecentChips");
  if (!chipsEl) return;

  if (!chipsEl.dataset.composeRecentBound) {
    chipsEl.addEventListener("click", (e) => {
      const chip = e.target instanceof HTMLElement && e.target.closest("[data-recent-id]");
      if (!chip) return;
      const toInput = document.getElementById("toId");
      if (!toInput) return;
      const id = chip.getAttribute("data-recent-id") || "";
      if (!id) return;
      const current = toInput.value.trim();
      toInput.value = current ? current.replace(/,\s*$/, "") + ", " + id : id;
      toInput.setCustomValidity("");
      scheduleComposeDraftAutosave();
    });
    chipsEl.dataset.composeRecentBound = "1";
  }

  const session = getSession();
  const contacts = session ? getContactsForOwner(session.id).filter((c) => !c.blocked).slice(0, 5) : [];
  if (!contacts.length) { chipsEl.innerHTML = ""; return; }
  chipsEl.innerHTML = contacts
    .map((c) => {
      const label = sanitize(c.nickname || c.id);
      return `<button class="compose-recent-chip" type="button" data-recent-id="${sanitize(c.id)}" title="${sanitize(c.id)}">${label}</button>`;
    })
    .join("");
}

renderComposeRecentChips();

// ── Compose v2: contacts panel search filter ──────────────────────────────
(function wireContactsPanelSearch() {
  const searchInput = document.getElementById("composeContactSearch");
  if (!searchInput) return;
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    const items = document.querySelectorAll(".compose-panel-contact-item");
    items.forEach((item) => {
      const name = (item.textContent || "").toLowerCase();
      item.style.display = !q || name.includes(q) ? "" : "none";
    });
  });
})();

if (composeBlockTypeEl) {
  composeBlockTypeEl.addEventListener("change", () => {
    runComposeCommand("formatBlock", composeBlockTypeEl.value);
    syncComposeTextareaValue();
  });
}

if (composeFontFamilyEl) {
  composeFontFamilyEl.addEventListener("change", () => {
    runComposeCommand("fontName", composeFontFamilyEl.value);
    syncComposeTextareaValue();
  });
}

if (saveWordBtn) {
  saveWordBtn.addEventListener("click", () => {
    const saved = saveToolsForAccount({
      wordTitle: wordTitleEl?.value.trim() || "",
      wordBody: getWordEditorHtml(),
    });

    if (!saved) {
      setStatus(wordSavedAtEl, "Cannot save. Gold/Enterprise plan required.", "warn");
      return;
    }

    setStatus(wordSavedAtEl, `Saved ${new Date(saved.updatedAt).toLocaleTimeString()}`, "ok");
  });
}

if (wordTitleEl && wordEditorEl) {
  const autosaveWord = () => {
    const saved = saveToolsForAccount({
      wordTitle: wordTitleEl.value.trim(),
      wordBody: getWordEditorHtml(),
    });

    if (saved) {
      setStatus(wordSavedAtEl, `Auto-saved to server ${new Date(saved.updatedAt).toLocaleTimeString()}`, "ok");
      updateWordStats();
    }
  };

  wordTitleEl.addEventListener("input", () => triggerDebouncedAutosave("word", autosaveWord));
  wordEditorEl.addEventListener("input", () => triggerDebouncedAutosave("word", autosaveWord));

  wordTitleEl.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      const saved = saveToolsForAccount({
        wordTitle: wordTitleEl.value.trim(),
        wordBody: getWordEditorHtml(),
      });
      if (saved) {
        setStatus(wordSavedAtEl, `Saved ${new Date(saved.updatedAt).toLocaleTimeString()}`, "ok");
      }
    }
  });
}

if (downloadWordBtn) {
  downloadWordBtn.addEventListener("click", () => {
    const title = (wordTitleEl?.value || "document").trim() || "document";
    const safeTitle = title.replace(/\s+/g, "_");
    const format = wordDownloadFormatEl?.value || "txt";
    const plainBody = getWordEditorPlainText();

    if (format === "doc") {
      const rtf = buildSimpleRtfContent(plainBody);
      downloadFile(`${safeTitle}.doc`, rtf, "application/rtf;charset=utf-8");
      return;
    }

    if (format === "docx") {
      const rtf = buildSimpleRtfContent(plainBody);
      downloadFile(`${safeTitle}.docx`, rtf, "application/rtf;charset=utf-8");
      return;
    }

    if (format === "pdf") {
      const pdf = buildSimplePdfContent(plainBody);
      downloadFile(`${safeTitle}.pdf`, pdf, "application/pdf");
      return;
    }

    downloadFile(`${safeTitle}.txt`, plainBody, "text/plain;charset=utf-8");
  });
}

if (wordEditorEl) {
  wordEditorEl.addEventListener("keydown", (event) => {
    const isCmd = event.ctrlKey || event.metaKey;
    if (!isCmd) {
      return;
    }

    const key = event.key.toLowerCase();
    if (key === "b") {
      event.preventDefault();
      runWordCommand("bold");
      return;
    }

    if (key === "i") {
      event.preventDefault();
      runWordCommand("italic");
      return;
    }

    if (key === "u") {
      event.preventDefault();
      runWordCommand("underline");
      return;
    }

    if (key === "k") {
      event.preventDefault();
      const url = window.prompt("Enter URL", "https://");
      if (url) {
        runWordCommand("createLink", url);
      }
      return;
    }

    if (key === "s") {
      event.preventDefault();
      const saved = saveToolsForAccount({
        wordTitle: wordTitleEl?.value.trim() || "",
        wordBody: getWordEditorHtml(),
      });
      if (saved) {
        setStatus(wordSavedAtEl, `Saved ${new Date(saved.updatedAt).toLocaleTimeString()}`, "ok");
      }
    }
  });

  const ribbonTabs = document.querySelectorAll("[data-word-tab]");
  for (const tab of ribbonTabs) {
    tab.addEventListener("click", () => {
      const tabName = tab.getAttribute("data-word-tab") || "home";
      switchWordRibbonTab(tabName);
    });
  }

  const toolbarButtons = document.querySelectorAll("[data-word-cmd]");
  for (const btn of toolbarButtons) {
    btn.addEventListener("click", () => {
      const command = btn.getAttribute("data-word-cmd");
      if (command) {
        runWordCommand(command);
        triggerDebouncedAutosave("word", () => {
          const saved = saveToolsForAccount({
            wordTitle: wordTitleEl?.value.trim() || "",
            wordBody: getWordEditorHtml(),
          });
          if (saved) {
            setStatus(wordSavedAtEl, `Auto-saved to server ${new Date(saved.updatedAt).toLocaleTimeString()}`, "ok");
            updateWordStats();
          }
        });
      }
    });
  }
}

if (wordBlockTypeEl) {
  wordBlockTypeEl.addEventListener("change", () => {
    runWordCommand("formatBlock", wordBlockTypeEl.value);
  });
}

if (wordFontSizeEl) {
  wordFontSizeEl.addEventListener("change", () => {
    runWordCommand("fontSize", wordFontSizeEl.value);
  });
}

if (wordFontFamilyEl) {
  wordFontFamilyEl.addEventListener("change", () => {
    runWordCommand("fontName", wordFontFamilyEl.value);
  });
}

if (wordLineHeightEl && wordEditorEl) {
  wordLineHeightEl.addEventListener("change", () => {
    wordEditorEl.style.lineHeight = wordLineHeightEl.value;
  });
}

if (wordParagraphSpacingEl && wordEditorEl) {
  wordParagraphSpacingEl.addEventListener("change", () => {
    wordEditorEl.style.setProperty("--word-paragraph-spacing", wordParagraphSpacingEl.value);
  });
}

if (wordInsertLinkBtn) {
  wordInsertLinkBtn.addEventListener("click", () => {
    const url = window.prompt("Enter URL", "https://");
    if (url) {
      runWordCommand("createLink", url);
    }
  });
}

if (wordEditorEl) {
  wordEditorEl.addEventListener("input", () => {
    updateWordStats();
  });

  updateWordStats();
  switchWordRibbonTab("home");
}

if (saveSheetBtn) {
  saveSheetBtn.addEventListener("click", () => {
    saveActiveSheetNow("Saved");
  });
}

if (sheetBodyEl) {
  const autosaveSheet = () => {
    const saved = saveToolsForAccount({
      sheet: activeSheetData,
      sheetStyles: activeSheetStyles,
    });
    if (saved && sheetSavedAtEl) {
      setStatus(sheetSavedAtEl, `Auto-saved to server ${new Date(saved.updatedAt).toLocaleTimeString()}`, "ok");
    }
  };

  sheetBodyEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const cell = target.closest("td.sheet-cell");
    if (!cell) {
      return;
    }

    selectedSheetCell = {
      row: Number(cell.getAttribute("data-row") || 0),
      col: Number(cell.getAttribute("data-col") || 0),
    };

    updateSelectedCellUI();
  });

  sheetBodyEl.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches("td.sheet-cell")) {
      return;
    }

    const row = Number(target.getAttribute("data-row") || 0);
    const col = Number(target.getAttribute("data-col") || 0);
    const value = target.textContent?.trim() || "";
    if (!activeSheetData[row]) {
      return;
    }

    activeSheetData[row][col] = value;
    selectedSheetCell = { row, col };
    updateSelectedCellUI();
    updateExcelStats();
    triggerDebouncedAutosave("sheet", autosaveSheet);
  });

  sheetBodyEl.addEventListener("keydown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches("td.sheet-cell")) {
      return;
    }

    const row = Number(target.getAttribute("data-row") || 0);
    const col = Number(target.getAttribute("data-col") || 0);
    selectedSheetCell = { row, col };
    activeSheetData[row][col] = target.textContent?.trim() || "";

    const isCmd = event.ctrlKey || event.metaKey;
    if (isCmd) {
      const key = event.key.toLowerCase();

      if (key === "s") {
        event.preventDefault();
        saveActiveSheetNow("Saved");
        return;
      }

      if (key === "b") {
        event.preventDefault();
        const current = getSheetCellStyle(selectedSheetCell.row, selectedSheetCell.col);
        applyStyleToSelectedCell({ bold: !current.bold });
        triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
        return;
      }

      if (key === "i") {
        event.preventDefault();
        const current = getSheetCellStyle(selectedSheetCell.row, selectedSheetCell.col);
        applyStyleToSelectedCell({ italic: !current.italic });
        triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
        return;
      }

      if (key === "u") {
        event.preventDefault();
        const current = getSheetCellStyle(selectedSheetCell.row, selectedSheetCell.col);
        applyStyleToSelectedCell({ underline: !current.underline });
        triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
        return;
      }

      if (key === "d") {
        event.preventDefault();
        if (selectedSheetCell.row > 0) {
          const aboveValue = activeSheetData[selectedSheetCell.row - 1]?.[selectedSheetCell.col] || "";
          setActiveCellValue(aboveValue);
          triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
        }
        return;
      }

      if (key === "r") {
        event.preventDefault();
        if (selectedSheetCell.col > 0) {
          const leftValue = activeSheetData[selectedSheetCell.row]?.[selectedSheetCell.col - 1] || "";
          setActiveCellValue(leftValue);
          triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
        }
        return;
      }

      if (key === "home") {
        event.preventDefault();
        moveSheetSelectionTo(0, 0);
        return;
      }

      if (key === "end") {
        event.preventDefault();
        const last = getLastUsedSheetCell();
        moveSheetSelectionTo(last.row, last.col);
        return;
      }

      if (key === "arrowup") {
        event.preventDefault();
        jumpSheetSelectionToCtrlEdge("up");
        return;
      }

      if (key === "arrowdown") {
        event.preventDefault();
        jumpSheetSelectionToCtrlEdge("down");
        return;
      }

      if (key === "arrowleft") {
        event.preventDefault();
        jumpSheetSelectionToCtrlEdge("left");
        return;
      }

      if (key === "arrowright") {
        event.preventDefault();
        jumpSheetSelectionToCtrlEdge("right");
        return;
      }

      if (key === ";" && !event.shiftKey) {
        event.preventDefault();
        setActiveCellValue(new Date().toLocaleDateString());
        triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
        return;
      }

      if (key === ":" || (key === ";" && event.shiftKey)) {
        event.preventDefault();
        setActiveCellValue(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
        return;
      }
    }

    const { maxRow, maxCol } = getSheetBounds();

    if (event.key === "Delete") {
      event.preventDefault();
      setActiveCellValue("");
      triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const delta = event.shiftKey ? -1 : 1;
      moveSheetSelectionTo(selectedSheetCell.row + delta, selectedSheetCell.col);
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      if (event.shiftKey) {
        if (selectedSheetCell.col > 0) {
          moveSheetSelectionTo(selectedSheetCell.row, selectedSheetCell.col - 1);
        } else if (selectedSheetCell.row > 0) {
          moveSheetSelectionTo(selectedSheetCell.row - 1, maxCol);
        } else {
          moveSheetSelectionTo(0, 0);
        }
      } else if (selectedSheetCell.col < maxCol) {
        moveSheetSelectionTo(selectedSheetCell.row, selectedSheetCell.col + 1);
      } else if (selectedSheetCell.row < maxRow) {
        moveSheetSelectionTo(selectedSheetCell.row + 1, 0);
      } else {
        moveSheetSelectionTo(maxRow, maxCol);
      }
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      moveSheetSelectionTo(selectedSheetCell.row, 0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      moveSheetSelectionTo(selectedSheetCell.row, maxCol);
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      if (event.key === "ArrowUp") {
        selectedSheetCell.row = Math.max(0, selectedSheetCell.row - 1);
      } else if (event.key === "ArrowDown") {
        selectedSheetCell.row = Math.min(maxRow, selectedSheetCell.row + 1);
      } else if (event.key === "ArrowLeft") {
        selectedSheetCell.col = Math.max(0, selectedSheetCell.col - 1);
      } else if (event.key === "ArrowRight") {
        selectedSheetCell.col = Math.min(maxCol, selectedSheetCell.col + 1);
      }
      moveSheetSelectionTo(selectedSheetCell.row, selectedSheetCell.col);
    }
  });
}

if (downloadSheetBtn) {
  downloadSheetBtn.addEventListener("click", () => {
    const rows = activeSheetData.length ? activeSheetData : getSheetFromDom();
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll("\"", '""')}"`).join(",")).join("\n");
    downloadFile("spreadsheet.csv", csv, "text/csv;charset=utf-8");
  });
}

if (excelFormulaInputEl && excelApplyFormulaBtn) {
  excelApplyFormulaBtn.addEventListener("click", () => {
    setActiveCellValue(excelFormulaInputEl.value.trim());
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });

  excelFormulaInputEl.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveActiveSheetNow("Saved");
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      setActiveCellValue(excelFormulaInputEl.value.trim());
      triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
      focusSelectedSheetCell();
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      focusSelectedSheetCell();
    }
  });
}

if (excelFontFamilyEl) {
  excelFontFamilyEl.addEventListener("change", () => {
    applyStyleToSelectedCell({ fontFamily: excelFontFamilyEl.value });
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelFontSizeEl) {
  excelFontSizeEl.addEventListener("change", () => {
    applyStyleToSelectedCell({ fontSize: Number(excelFontSizeEl.value) || 12 });
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelBoldBtn) {
  excelBoldBtn.addEventListener("click", () => {
    const current = getSheetCellStyle(selectedSheetCell.row, selectedSheetCell.col);
    applyStyleToSelectedCell({ bold: !current.bold });
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelItalicBtn) {
  excelItalicBtn.addEventListener("click", () => {
    const current = getSheetCellStyle(selectedSheetCell.row, selectedSheetCell.col);
    applyStyleToSelectedCell({ italic: !current.italic });
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelUnderlineBtn) {
  excelUnderlineBtn.addEventListener("click", () => {
    const current = getSheetCellStyle(selectedSheetCell.row, selectedSheetCell.col);
    applyStyleToSelectedCell({ underline: !current.underline });
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelAlignLeftBtn) {
  excelAlignLeftBtn.addEventListener("click", () => {
    applyStyleToSelectedCell({ align: "left" });
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelAlignCenterBtn) {
  excelAlignCenterBtn.addEventListener("click", () => {
    applyStyleToSelectedCell({ align: "center" });
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelAlignRightBtn) {
  excelAlignRightBtn.addEventListener("click", () => {
    applyStyleToSelectedCell({ align: "right" });
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelClearCellBtn) {
  excelClearCellBtn.addEventListener("click", () => {
    setActiveCellValue("");
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelClearAllBtn) {
  excelClearAllBtn.addEventListener("click", () => {
    const rows = activeSheetData.length || 20;
    const cols = activeSheetData[0]?.length || 26;
    activeSheetData = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ""));
    renderSheetRows(activeSheetData, activeSheetStyles);
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelAddRowBtn) {
  excelAddRowBtn.addEventListener("click", () => {
    const cols = activeSheetData[0]?.length || 8;
    activeSheetData.push(Array.from({ length: cols }, () => ""));
    renderSheetRows(activeSheetData, activeSheetStyles);
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelAddColBtn) {
  excelAddColBtn.addEventListener("click", () => {
    for (const row of activeSheetData) {
      row.push("");
    }
    renderSheetRows(activeSheetData, activeSheetStyles);
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelSortAscBtn) {
  excelSortAscBtn.addEventListener("click", () => {
    const c = selectedSheetCell.col;
    activeSheetData.sort((a, b) => String(a[c] || "").localeCompare(String(b[c] || ""), undefined, { numeric: true }));
    renderSheetRows(activeSheetData, activeSheetStyles);
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelSortDescBtn) {
  excelSortDescBtn.addEventListener("click", () => {
    const c = selectedSheetCell.col;
    activeSheetData.sort((a, b) => String(b[c] || "").localeCompare(String(a[c] || ""), undefined, { numeric: true }));
    renderSheetRows(activeSheetData, activeSheetStyles);
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelSumBtn) {
  excelSumBtn.addEventListener("click", () => {
    const value = calculateRangeValue(excelRangeInputEl?.value, "sum");
    setActiveCellValue(value);
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelAvgBtn) {
  excelAvgBtn.addEventListener("click", () => {
    const value = calculateRangeValue(excelRangeInputEl?.value, "avg");
    setActiveCellValue(value);
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelMinBtn) {
  excelMinBtn.addEventListener("click", () => {
    const value = calculateRangeValue(excelRangeInputEl?.value, "min");
    setActiveCellValue(value);
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (excelMaxBtn) {
  excelMaxBtn.addEventListener("click", () => {
    const value = calculateRangeValue(excelRangeInputEl?.value, "max");
    setActiveCellValue(value);
    triggerDebouncedAutosave("sheet", () => saveActiveSheetNow("Auto-saved to server"));
  });
}

if (sheetBodyEl) {
  const excelTabs = document.querySelectorAll("[data-excel-tab]");
  for (const tab of excelTabs) {
    tab.addEventListener("click", () => {
      const tabName = tab.getAttribute("data-excel-tab") || "home";
      switchExcelRibbonTab(tabName);
    });
  }
  switchExcelRibbonTab("home");

  document.addEventListener("keydown", (event) => {
    const activeTag = String(document.activeElement?.tagName || "").toLowerCase();
    const activeInInput = ["input", "textarea", "select"].includes(activeTag);

    if (event.altKey && !event.ctrlKey && !event.metaKey) {
      const key = event.key.toLowerCase();
      const map = {
        h: "home",
        n: "insert",
        m: "formulas",
        a: "data",
        r: "review",
      };
      const nextTab = map[key];
      if (nextTab) {
        event.preventDefault();
        switchExcelRibbonTab(nextTab);
        setStatus(sheetSavedAtEl, `Ribbon tab: ${nextTab}`, "muted");
      }
      return;
    }

    if ((event.ctrlKey || event.metaKey) && !event.altKey) {
      const key = event.key.toLowerCase();

      if (key === "g") {
        event.preventDefault();
        focusSelectedSheetCell();
        return;
      }

      if (key === "f") {
        event.preventDefault();
        if (excelFormulaInputEl) {
          excelFormulaInputEl.focus();
          excelFormulaInputEl.select();
        }
        return;
      }

      if (key === "1") {
        event.preventDefault();
        switchExcelRibbonTab("home");
        return;
      }

      if (key === "2") {
        event.preventDefault();
        switchExcelRibbonTab("insert");
        return;
      }

      if (key === "3") {
        event.preventDefault();
        switchExcelRibbonTab("formulas");
        return;
      }

      if (key === "4") {
        event.preventDefault();
        switchExcelRibbonTab("data");
        return;
      }

      if (key === "5") {
        event.preventDefault();
        switchExcelRibbonTab("review");
      }
    }

    if (activeInInput || !excelFormulaInputEl) {
      return;
    }

    if (event.key === "F2") {
      event.preventDefault();
      focusSelectedSheetCell();
    }
  });
}

if (calendarForm) {
  calendarForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const when = document.getElementById("calendarWhen").value;
    const title = document.getElementById("calendarEvent").value.trim();
    const category = String(calendarCategoryEl?.value || "general").toLowerCase();
    const reminderMinutesRaw = Number(calendarReminderMinutesEl?.value || 0);
    const reminderMinutes = Number.isFinite(reminderMinutesRaw) ? Math.max(0, Math.floor(reminderMinutesRaw)) : 0;

    if (!when || !title) {
      return;
    }

    const session = getSession();
    const account = session ? getAccounts().find((a) => a.id === session.id) : null;
    if (!account || !hasToolsAccess(account.plan, account.id)) {
      setStatus(toolsGateStatusEl, "Gold/Enterprise plan required.", "warn");
      return;
    }

    const allTools = getToolsState();
    const existing = allTools[account.id] || {
      wordTitle: "",
      wordBody: "",
      notes: "",
      sheet: getDefaultSheet(),
      calendar: [],
      updatedAt: null,
    };

    const calendar = Array.isArray(existing.calendar) ? existing.calendar.slice() : [];
    calendar.push({ when, title, category, reminderMinutes });

    const saved = saveToolsForAccount({ calendar });
    if (saved) {
      const eventDate = new Date(when);
      if (!Number.isNaN(eventDate.getTime())) {
        calendarCursor = new Date(eventDate.getFullYear(), eventDate.getMonth(), 1);
        selectedCalendarDate = toDateKey(eventDate);
      }
      renderCalendar(saved.calendar || []);
      calendarForm.reset();
      if (calendarCategoryEl) {
        calendarCategoryEl.value = "meeting";
      }
      if (calendarReminderMinutesEl) {
        calendarReminderMinutesEl.value = "0";
      }
    }
  });
}

if (downloadCalendarBtn) {
  downloadCalendarBtn.addEventListener("click", () => {
    const session = getSession();
    const account = session ? getAccounts().find((a) => a.id === session.id) : null;
    const tools = getToolsState();
    const events = account ? (tools[account.id]?.calendar || []) : [];
    downloadFile("calendar-events.json", JSON.stringify(events, null, 2), "application/json;charset=utf-8");
  });
}

if (calendarGridEl) {
  calendarGridEl.addEventListener("click", (e) => {
    const source = e.target instanceof Element ? e.target : null;
    if (!source) {
      return;
    }

    const target = source.closest("[data-cal-day]");
    if (!target) {
      return;
    }
    selectedCalendarDate = target.getAttribute("data-cal-day");
    syncCalendarWhenInputWithSelectedDate();
    renderCalendar(getCurrentAccountCalendarEvents());
  });
}

if (calendarPrevBtn) {
  calendarPrevBtn.addEventListener("click", () => {
    const selected = new Date(`${selectedCalendarDate || toDateKey(new Date())}T00:00:00`);
    if (calendarViewMode === "week") {
      selected.setDate(selected.getDate() - 7);
      selectedCalendarDate = toDateKey(selected);
      calendarCursor = new Date(selected.getFullYear(), selected.getMonth(), 1);
    } else if (calendarViewMode === "day") {
      selected.setDate(selected.getDate() - 1);
      selectedCalendarDate = toDateKey(selected);
      calendarCursor = new Date(selected.getFullYear(), selected.getMonth(), 1);
    } else {
      calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1);
    }
    renderCalendar(getCurrentAccountCalendarEvents());
  });
}

if (calendarNextBtn) {
  calendarNextBtn.addEventListener("click", () => {
    const selected = new Date(`${selectedCalendarDate || toDateKey(new Date())}T00:00:00`);
    if (calendarViewMode === "week") {
      selected.setDate(selected.getDate() + 7);
      selectedCalendarDate = toDateKey(selected);
      calendarCursor = new Date(selected.getFullYear(), selected.getMonth(), 1);
    } else if (calendarViewMode === "day") {
      selected.setDate(selected.getDate() + 1);
      selectedCalendarDate = toDateKey(selected);
      calendarCursor = new Date(selected.getFullYear(), selected.getMonth(), 1);
    } else {
      calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1);
    }
    renderCalendar(getCurrentAccountCalendarEvents());
  });
}

if (calendarTodayBtn) {
  calendarTodayBtn.addEventListener("click", () => {
    const today = new Date();
    calendarCursor = new Date(today.getFullYear(), today.getMonth(), 1);
    selectedCalendarDate = toDateKey(today);
    syncCalendarWhenInputWithSelectedDate();
    renderCalendar(getCurrentAccountCalendarEvents());
  });
}

if (calendarViewModeEl) {
  calendarViewModeEl.addEventListener("change", () => {
    calendarViewMode = calendarViewModeEl.value || "month";
    renderCalendar(getCurrentAccountCalendarEvents());
  });
}

if (calendarSearchInputEl) {
  calendarSearchInputEl.addEventListener("input", () => {
    renderCalendar(getCurrentAccountCalendarEvents());
  });
}

if (calendarCategoryFilterEl) {
  calendarCategoryFilterEl.addEventListener("change", () => {
    renderCalendar(getCurrentAccountCalendarEvents());
  });
}

if (saveNotesBtn) {
  saveNotesBtn.addEventListener("click", () => {
    const saved = saveToolsForAccount({ notes: notesEditorEl?.value || "" });

    if (!saved) {
      setStatus(notesSavedAtEl, "Cannot save. Gold/Enterprise plan required.", "warn");
      return;
    }

    setStatus(notesSavedAtEl, `Saved ${new Date(saved.updatedAt).toLocaleTimeString()}`, "ok");
  });
}

if (notesEditorEl) {
  const autosaveNotes = () => {
    const saved = saveToolsForAccount({ notes: notesEditorEl.value });
    if (saved) {
      setStatus(notesSavedAtEl, `Auto-saved to server ${new Date(saved.updatedAt).toLocaleTimeString()}`, "ok");
    }
  };

  notesEditorEl.addEventListener("input", () => triggerDebouncedAutosave("notes", autosaveNotes));
}

if (downloadNotesBtn) {
  downloadNotesBtn.addEventListener("click", () => {
    const notes = notesEditorEl?.value || "";
    downloadFile("notes.txt", notes, "text/plain;charset=utf-8");
  });
}

if (calcEvaluateBtn) {
  calcEvaluateBtn.addEventListener("click", () => {
    evaluateAndPersistCalculator("Saved");
  });
}

if (calcSaveBtn) {
  calcSaveBtn.addEventListener("click", () => {
    if (!calcExpressionEl) {
      return;
    }

    const current = getToolsState();
    const session = getSession();
    const accountId = session?.id;
    const prevHistory = accountId ? (current[accountId]?.calculator?.history || []) : [];
    const { expression, result } = readCurrentCalculatorState();

    const saved = saveToolsForAccount({
      calculator: {
        expression,
        mode: calcModeEl?.value === "scientific" ? "scientific" : "basic",
        result,
        history: prevHistory,
      },
    });

    if (!saved) {
      setStatus(calcSavedAtEl, "Cannot save. Gold/Enterprise plan required.", "warn");
      return;
    }

    setStatus(calcSavedAtEl, `Saved ${new Date(saved.updatedAt).toLocaleTimeString()}`, "ok");
  });
}

if (calcClearBtn) {
  calcClearBtn.addEventListener("click", () => {
    if (!calcExpressionEl || !calcResultEl) {
      return;
    }

    calcExpressionEl.value = "";
    calcResultEl.textContent = "Result: 0";
    setStatus(calcSavedAtEl, "Cleared expression.", "muted");
  });
}

if (calcClearHistoryBtn) {
  calcClearHistoryBtn.addEventListener("click", () => {
    const currentState = readCurrentCalculatorState();
    const saved = saveToolsForAccount({
      calculator: {
        expression: currentState.expression,
        mode: currentState.mode,
        result: currentState.result,
        history: [],
      },
    });

    if (!saved) {
      setStatus(calcSavedAtEl, "Cannot save. Gold/Enterprise plan required.", "warn");
      return;
    }

    renderCalculatorHistory([]);
    setStatus(calcSavedAtEl, "History cleared.", "ok");
  });
}

if (calcExpressionEl) {
  calcExpressionEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      evaluateAndPersistCalculator("Saved");
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      if (calcSaveBtn) {
        calcSaveBtn.click();
      }
    }
  });
}

if (calcModeEl) {
  calcModeEl.addEventListener("change", () => {
    const mode = calcModeEl.value === "scientific" ? "scientific" : "basic";
    setCalculatorMode(mode);

    const currentState = readCurrentCalculatorState();
    const saved = saveToolsForAccount({
      calculator: {
        expression: currentState.expression,
        mode,
        result: currentState.result,
        history: getToolsState()[getSession()?.id || ""]?.calculator?.history || [],
      },
    });

    if (saved) {
      setStatus(calcSavedAtEl, `Mode saved ${new Date(saved.updatedAt).toLocaleTimeString()}`, "ok");
    }
  });
}

const calcKeys = document.querySelectorAll("[data-calc-insert]");
for (const key of calcKeys) {
  key.addEventListener("click", () => {
    if (!calcExpressionEl) {
      return;
    }

    const token = key.getAttribute("data-calc-insert") || "";
    const start = calcExpressionEl.selectionStart ?? calcExpressionEl.value.length;
    const end = calcExpressionEl.selectionEnd ?? calcExpressionEl.value.length;
    const value = calcExpressionEl.value;
    calcExpressionEl.value = value.slice(0, start) + token + value.slice(end);
    calcExpressionEl.focus();
    const cursor = start + token.length;
    calcExpressionEl.setSelectionRange(cursor, cursor);
  });
}

if (metricsRenderBtn) {
  metricsRenderBtn.addEventListener("click", () => {
    const dashboard = renderMetricsDashboard();
    if (dashboard) {
      setStatus(metricsSavedAtEl, "Chart rendered.", "ok");
    }
  });
}

if (metricsSaveBtn) {
  metricsSaveBtn.addEventListener("click", () => {
    const dashboard = renderMetricsDashboard();
    if (!dashboard) {
      return;
    }

    const saved = saveToolsForAccount({ metrics: dashboard });
    if (!saved) {
      setStatus(metricsSavedAtEl, "Cannot save. Gold/Enterprise plan required.", "warn");
      return;
    }

    setStatus(metricsSavedAtEl, `Saved ${new Date(saved.updatedAt).toLocaleTimeString()}`, "ok");
  });
}

if (metricsDownloadCsvBtn) {
  metricsDownloadCsvBtn.addEventListener("click", () => {
    const dashboard = renderMetricsDashboard();
    if (!dashboard) {
      return;
    }

    const labels = parseMetricsLabelList(dashboard.renderedLabelsCsv || dashboard.labelsCsv, parseMetricsNumberList(dashboard.renderedPrimaryCsv || dashboard.primaryCsv).length);
    const primary = parseMetricsNumberList(dashboard.renderedPrimaryCsv || dashboard.primaryCsv);
    const secondary = parseMetricsNumberList(dashboard.renderedSecondaryCsv || dashboard.secondaryCsv);
    const trend = parseMetricsNumberList(dashboard.trendCsv || "");

    const rows = ["Label,Primary,Target,Trend,Delta,DeltaPercent"];
    for (let i = 0; i < labels.length; i += 1) {
      const p = primary[i];
      const s = Number.isFinite(secondary[i]) ? secondary[i] : "";
      const t = Number.isFinite(trend[i]) ? trend[i] : "";
      const d = Number.isFinite(s) ? p - s : "";
      const dp = Number.isFinite(s) && s !== 0 ? `${(((p - s) / s) * 100).toFixed(2)}%` : "";
      rows.push(`${labels[i]},${p},${s},${t},${d},${dp}`);
    }

    downloadFile("metrics-dashboard.csv", rows.join("\n"), "text/csv;charset=utf-8");
    setStatus(metricsSavedAtEl, "CSV exported.", "ok");
  });
}

if (metricsDownloadJsonBtn) {
  metricsDownloadJsonBtn.addEventListener("click", () => {
    const dashboard = renderMetricsDashboard();
    if (!dashboard) {
      return;
    }

    const payload = {
      exportedAt: new Date().toISOString(),
      dashboard,
      transformed: metricsLastDashboardResult,
    };

    downloadFile("metrics-dashboard.json", JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
    setStatus(metricsSavedAtEl, "JSON exported.", "ok");
  });
}

if (metricsDownloadPngBtn) {
  metricsDownloadPngBtn.addEventListener("click", () => {
    const dashboard = renderMetricsDashboard();
    if (!dashboard || !metricsCanvasEl) {
      return;
    }

    metricsCanvasEl.toBlob((blob) => {
      if (!blob) {
        setStatus(metricsSavedAtEl, "Failed to export PNG.", "bad");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "metrics-dashboard.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus(metricsSavedAtEl, "PNG exported.", "ok");
    }, "image/png");
  });
}

if (metricsClearBtn) {
  metricsClearBtn.addEventListener("click", () => {
    if (metricsTitleEl) {
      metricsTitleEl.value = "";
    }
    if (metricsChartTypeEl) {
      metricsChartTypeEl.value = "line";
    }
    if (metricsDisplayModeEl) {
      metricsDisplayModeEl.value = "number";
    }
    if (metricsAggregationEl) {
      metricsAggregationEl.value = "raw";
    }
    if (metricsSortModeEl) {
      metricsSortModeEl.value = "input";
    }
    if (metricsTopNEl) {
      metricsTopNEl.value = "";
    }
    if (metricsMovingAverageEl) {
      metricsMovingAverageEl.value = "";
    }
    if (metricsBenchmarkEl) {
      metricsBenchmarkEl.value = "";
    }
    if (metricsShowTrendEl) {
      metricsShowTrendEl.checked = true;
    }
    if (metricsShowAnomaliesEl) {
      metricsShowAnomaliesEl.checked = true;
    }
    if (metricsLabelsEl) {
      metricsLabelsEl.value = "";
    }
    if (metricsPrimaryEl) {
      metricsPrimaryEl.value = "";
    }
    if (metricsSecondaryEl) {
      metricsSecondaryEl.value = "";
    }

    if (metricsCanvasEl) {
      const ctx = metricsCanvasEl.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, metricsCanvasEl.width, metricsCanvasEl.height);
      }
    }
    metricsChartRenderState = null;
    metricsChartHoverTarget = null;
    metricsLastDashboardResult = null;

    if (metricsSummaryEl) {
      metricsSummaryEl.classList.add("muted");
      metricsSummaryEl.textContent = "Render a chart to view KPI summary.";
    }

    if (metricsInsightsEl) {
      metricsInsightsEl.classList.add("muted");
      metricsInsightsEl.textContent = "Render a chart to generate insights.";
    }

    if (metricsTableEl) {
      const body = metricsTableEl.querySelector("tbody");
      if (body) {
        body.innerHTML = '<tr><td colspan="5" class="muted">No data yet.</td></tr>';
      }
    }

    if (metricsChartHeadingEl) {
      metricsChartHeadingEl.textContent = "Performance chart";
    }

    setStatus(metricsSavedAtEl, "Cleared dashboard inputs.", "muted");
  });
}

if (metricsCanvasEl) {
  metricsCanvasEl.addEventListener("mousemove", (event) => {
    if (!metricsChartRenderState) {
      return;
    }

    const rect = metricsCanvasEl.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const x = ((event.clientX - rect.left) / rect.width) * metricsChartRenderState.cssWidth;
    const y = ((event.clientY - rect.top) / rect.height) * metricsChartRenderState.cssHeight;
    const nextHover = findMetricsHoverTarget(metricsChartRenderState, x, y);

    if (isSameMetricsHover(metricsChartHoverTarget, nextHover)) {
      return;
    }

    metricsChartHoverTarget = nextHover;
    drawMetricsChart(
      metricsChartRenderState.title,
      metricsChartRenderState.chartType,
      metricsChartRenderState.labels,
      metricsChartRenderState.primary,
      metricsChartRenderState.secondary,
      metricsChartRenderState.mode,
      metricsChartRenderState.options || {},
      metricsChartHoverTarget
    );
  });

  metricsCanvasEl.addEventListener("mouseleave", () => {
    if (!metricsChartRenderState || !metricsChartHoverTarget) {
      return;
    }

    metricsChartHoverTarget = null;
    drawMetricsChart(
      metricsChartRenderState.title,
      metricsChartRenderState.chartType,
      metricsChartRenderState.labels,
      metricsChartRenderState.primary,
      metricsChartRenderState.secondary,
      metricsChartRenderState.mode,
      metricsChartRenderState.options || {},
      null
    );
  });
}

if (watchPartyCreateBtn) {
  watchPartyCreateBtn.addEventListener("click", () => {
    createWatchPartyRoom();
  });
}

if (watchPartyJoinBtn) {
  watchPartyJoinBtn.addEventListener("click", () => {
    const code = watchPartyRoomInputEl?.value || "";
    joinWatchPartyRoom(code);
  });
}

if (watchPartyCopyInviteBtn) {
  watchPartyCopyInviteBtn.addEventListener("click", async () => {
    const link = String(watchPartyInviteLinkEl?.value || "").trim();
    if (!link) {
      setStatus(watchPartyStatusEl, "Create or join a room to generate an invite link.", "warn");
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        if (watchPartyInviteLinkEl) {
          watchPartyInviteLinkEl.focus();
          watchPartyInviteLinkEl.select();
        }
        document.execCommand("copy");
      }
      setStatus(watchPartyStatusEl, "Invite link copied.", "ok");
    } catch {
      setStatus(watchPartyStatusEl, "Could not copy link. Copy it manually.", "warn");
    }
  });
}

if (watchPartySetVideoBtn) {
  watchPartySetVideoBtn.addEventListener("click", () => {
    setWatchPartyVideo(watchPartyVideoUrlEl?.value || "");
  });
}

if (watchPartyClearVideoBtn) {
  watchPartyClearVideoBtn.addEventListener("click", () => {
    clearWatchPartyVideo();
  });
}

if (watchPartyToggleModeBtn) {
  watchPartyToggleModeBtn.addEventListener("click", () => {
    toggleWatchPartyPlaybackMode();
  });
}

if (watchPartyVideoUrlEl) {
  watchPartyVideoUrlEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setWatchPartyVideo(watchPartyVideoUrlEl.value);
    }
  });
}

if (watchPartyRoomInputEl) {
  watchPartyRoomInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      joinWatchPartyRoom(watchPartyRoomInputEl.value);
    }
  });
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    burnReadMessages();
  }
});

window.addEventListener("pagehide", () => {
  burnReadMessages();
});

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEYS.watchPartyRooms) {
    syncActiveWatchPartyFromStorage();
  }

  if (event.key === STORAGE_KEYS.messages || event.key === STORAGE_KEYS.tools) {
    updateNotificationBell();
  }
});

window.addEventListener("message", (event) => {
  if (!watchPartyFrameEl || !watchPartyEmbedProbe || event.source !== watchPartyFrameEl.contentWindow) {
    return;
  }

  let hostname = "";
  try {
    hostname = new URL(event.origin).hostname.toLowerCase();
  } catch {
    return;
  }

  if (!hostname.endsWith("youtube.com") && !hostname.endsWith("youtube-nocookie.com")) {
    return;
  }

  let payload = event.data;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return;
    }
  }

  if (!payload || typeof payload !== "object") {
    return;
  }

  const messageEvent = payload.event;
  if (messageEvent === "onReady") {
    const videoId = activeWatchPartyRoomState?.videoId || watchPartyEmbedProbe?.videoId || "";
    if (videoId) {
      markWatchPartyEmbedProbeReady(videoId);
    }
    return;
  }

  if (messageEvent === "onError") {
    const probe = watchPartyEmbedProbe;
    if (!probe) {
      return;
    }

    clearWatchPartyEmbedProbe();
    const failure = registerWatchPartyEmbedFailure(probe.roomCode, probe.videoId);
    if (!failure) {
      return;
    }

    const errorCode = Number(payload.info);
    const errorSuffix = Number.isFinite(errorCode) ? ` (YouTube error ${errorCode}).` : ".";

    if (failure.autoSwitched) {
      renderWatchPartyState(`Inline playback failed repeatedly${errorSuffix} Switched to YouTube Mode automatically.`, "warn");
      return;
    }

    setStatus(
      watchPartyStatusEl,
      `Inline embed failed to initialize${errorSuffix} If this repeats, the room will auto-switch to YouTube Mode.`,
      "warn"
    );
  }
});

const wasRedirectedToIdentity = redirectLockedPageToIdentity();
syncAdminFriendships("system");
updateSessionStatus();
updateNavBySession();
ensureNotificationBell();
updateNotificationBell();
refreshGiftAdminAuthStatus();
refreshGiftAdminTable();
refreshAdminRoleTable();
renderAdminAuditTable();

if (!wasRedirectedToIdentity) {
  renderInbox();
  renderToolsWorkspace();
  renderComposeContacts();
}
