// src/api/windsorApi.js
import axios from "axios";

const API_KEY = process.env.REACT_APP_WINDSOR_API_KEY;
const DEFAULT_ACCOUNT = (process.env.REACT_APP_WINDSOR_ACCOUNT || "").trim();
const DEFAULT_TZ = (process.env.REACT_APP_WINDSOR_TIMEZONE || "America/Buenos_Aires").trim();
const DEFAULT_SOURCE = (process.env.REACT_APP_WINDSOR_SOURCE || "").trim();

/* ---------------------------------- Utils --------------------------------- */
// Fecha en zona horaria (solo partes Y-M-D)
function tzParts(date, timeZone) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  // en-CA -> YYYY-MM-DD
  const [y, m, d] = fmt.format(date).split("-");
  return { y: Number(y), m: Number(m), d: Number(d) };
}
function toISO({ y, m, d }) {
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}
function addDaysInTz(baseDate, days, timeZone) {
  const ms = baseDate.getTime() + days * 86400000;
  const d = new Date(ms);
  return tzParts(d, timeZone);
}
function firstDayOfMonthInTz(baseDate, timeZone) {
  const { y, m } = tzParts(baseDate, timeZone);
  return { y, m, d: 1 };
}
function lastDayOfPrevMonthInTz(baseDate, timeZone) {
  const { y, m } = tzParts(baseDate, timeZone);
  const prevY = m === 1 ? y - 1 : y;
  const prevM = m === 1 ? 12 : m - 1;
  // día 0 del mes actual = último día del mes anterior
  const d = new Date(Date.UTC(y, m - 1, 1)); // primer día mes actual (UTC)
  const prev = new Date(d.getTime() - 86400000);
  const parts = tzParts(prev, timeZone);
  return { y: prevY, m: prevM, d: parts.d };
}
function firstDayOfPrevMonthInTz(baseDate, timeZone) {
  const { y, m } = tzParts(baseDate, timeZone);
  const prevY = m === 1 ? y - 1 : y;
  const prevM = m === 1 ? 12 : m - 1;
  return { y: prevY, m: prevM, d: 1 };
}
function firstDayOfYearInTz(baseDate, timeZone) {
  const { y } = tzParts(baseDate, timeZone);
  return { y, m: 1, d: 1 };
}

function rangeForPreset(preset, timeZone) {
  const now = new Date();
  const today = tzParts(now, timeZone);

  const TODAY = { from: today, to: today };
  const YESTERDAY = {
    from: addDaysInTz(now, -1, timeZone),
    to: addDaysInTz(now, -1, timeZone),
  };
  const LAST_7D = {
    from: addDaysInTz(now, -6, timeZone),
    to: today,
  };
  const LAST_14D = {
    from: addDaysInTz(now, -13, timeZone),
    to: today,
  };
  const LAST_30D = {
    from: addDaysInTz(now, -29, timeZone),
    to: today,
  };
  const THIS_MONTH = {
    from: firstDayOfMonthInTz(now, timeZone),
    to: today,
  };
  const LAST_MONTH = {
    from: firstDayOfPrevMonthInTz(now, timeZone),
    to: lastDayOfPrevMonthInTz(now, timeZone),
  };
  const THIS_YEAR = {
    from: firstDayOfYearInTz(now, timeZone),
    to: today,
  };

  const map = {
    today: TODAY,
    ayer: YESTERDAY, // alias por si enviamos algo en español
    yesterday: YESTERDAY,
    last_7d: LAST_7D,
    last_14d: LAST_14D,
    last_30d: LAST_30D,
    this_month: THIS_MONTH,
    last_month: LAST_MONTH,
    this_year: THIS_YEAR,
  };

  return map[preset] || THIS_MONTH;
}

// Helper to get today's date in YYYY-MM-DD format for a given timezone
function tzTodayISO(timeZone) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date()); // YYYY-MM-DD
}

/* --------------------------------- Fields --------------------------------- */
const FIELDS = [
  "ad_id",
  "ad_name",
  "campaign",
  "totalcost",
  "actions_offsite_conversion_fb_pixel_purchase",
  "action_values_omni_purchase",
  "status",
  "thumbnail_url",
];

/* ----------------------------------- API ---------------------------------- */
export async function getAdsData({
  datePreset = "this_month",
  from = null,
  to = null,
  account = DEFAULT_ACCOUNT,
  timezone = DEFAULT_TZ,
  source = DEFAULT_SOURCE, // opcional: "facebook", "google_ads", etc.
} = {}) {
  const baseURL = "https://connectors.windsor.ai/all";
  const params = new URLSearchParams({
    api_key: API_KEY,
    fields: FIELDS.join(","),
  });

  // 👇 Preferimos presets para alinear con la plataforma, con mapeos específicos
  const tz = timezone || DEFAULT_TZ;
  const preset = (datePreset || "").trim();

  if (preset) {
    if (preset === "today") {
      const today = tzTodayISO(tz);
      params.append("date_from", today);
      params.append("date_to", today);
    } else if (preset === "yesterday") {
      params.append("date_preset", "last_1d");
    } else if (preset === "last_month") {
      params.append("date_preset", "last_1m");
    } else {
      params.append("date_preset", preset);
    }
  } else if (from && to) {
    // Fallback: rango custom solo si NO hay preset
    params.append("date_from", from);
    params.append("date_to", to);
  }

  // Forzar cuenta
  if (account) params.append("select_accounts", account);
  // Opcional: filtrar por fuente
  if (source) params.append("source", source);
  // Timezone (para que Windsor entienda el rango correctamente)
  if (timezone) params.append("timezone", timezone);

  const url = `${baseURL}?${params.toString()}`;
  const res = await axios.get(url);
  const payload = res?.data?.data ?? res?.data;
  return Array.isArray(payload) ? payload : [];
}