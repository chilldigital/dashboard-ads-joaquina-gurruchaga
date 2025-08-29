import { useEffect, useState } from "react";

const presets = [
  { value: "today", label: "Hoy" },
  { value: "yesterday", label: "Ayer" },
  { value: "last_7d", label: "Últimos 7 días" },
  { value: "last_14d", label: "Últimos 14 días" },
  { value: "last_30d", label: "Últimos 30 días" },
  { value: "this_month", label: "Este mes" },
  { value: "last_month", label: "Mes pasado" },
  { value: "this_year", label: "Este año" },
];

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos" },
  { value: "inactive", label: "Inactivos" },
];

/**
 * Props:
 * - value: { preset }
 * - onChange(nextRange)
 * - accounts? (opcional): [{ value, label }]
 * - selectedAccount? (opcional): string
 * - onChangeAccount?(value)
 * - timezones? (opcional): [{ value, label }]
 * - selectedTimezone? (opcional): string
 * - onChangeTimezone?(value)
 */
export default function FilterBar({
  value,
  onChange,
  accounts = [],
  selectedAccount,
  onChangeAccount,
  timezones = [],
  selectedTimezone,
  onChangeTimezone,
  selectedStatus = "all",
  onChangeStatus,
}) {
  const [local, setLocal] = useState(value);

  // Mantener estado local en sync si el padre cambia el filtro (por URL u otro evento)
  useEffect(() => {
    setLocal(value);
  }, [value]);

  const handlePreset = (e) => {
    const v = e.target.value;
    const next = { preset: v };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="sr-only" htmlFor="preset">Período</label>
      <select
        id="preset"
        aria-label="Seleccionar período"
        value={local.preset}
        onChange={handlePreset}
        className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {presets.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      {/* Filtro por estado */}
      {onChangeStatus && (
        <>
          <label className="sr-only" htmlFor="status">Estado</label>
          <select
            id="status"
            aria-label="Filtrar por estado"
            value={selectedStatus}
            onChange={(e) => onChangeStatus(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </>
      )}

      {accounts.length > 0 && onChangeAccount && (
        <>
          <label className="sr-only" htmlFor="account">Cuenta</label>
          <select
            id="account"
            aria-label="Seleccionar cuenta"
            value={selectedAccount ?? ""}
            onChange={(e) => onChangeAccount(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {accounts.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </>
      )}

      {timezones.length > 0 && onChangeTimezone && (
        <>
          <label className="sr-only" htmlFor="tz">Zona horaria</label>
          <select
            id="tz"
            aria-label="Seleccionar zona horaria"
            value={selectedTimezone ?? ""}
            onChange={(e) => onChangeTimezone(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timezones.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </>
      )}

    </div>
  );
}