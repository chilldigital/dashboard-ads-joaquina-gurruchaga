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
  // Estado ON/OFF
  selectedStatus,
  onChangeStatus,
  accounts = [],
  selectedAccount,
  onChangeAccount,
  timezones = [],
  selectedTimezone,
  onChangeTimezone,
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

  const SelectShell = ({ id, aria, value, onChange, children, leading }) => (
    <div className="relative">
      {leading && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {leading}
        </span>
      )}
      <select
        id={id}
        aria-label={aria}
        value={value}
        onChange={onChange}
        className={[
          "appearance-none h-10 pl-9 pr-9 rounded-xl",
          "border border-gray-200 bg-white/80 shadow-sm",
          "text-sm text-gray-700",
          "hover:border-gray-300",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
          "transition-colors",
        ].join(" ")}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
      </svg>
    </div>
  );

  const CalendarIcon = (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 112 0v1zm13 7H4v9a1 1 0 001 1h14a1 1 0 001-1V9zM4 7h16V6a1 1 0 00-1-1h-1v1a1 1 0 11-2 0V5H8v1a1 1 0 11-2 0V5H5a1 1 0 00-1 1v1z"/>
    </svg>
  );
  const PowerIcon = (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11 2a1 1 0 012 0v10a1 1 0 11-2 0V2z"/>
      <path d="M7.05 5.05a7 7 0 119.9 9.9 1 1 0 11-1.41-1.41 5 5 0 10-7.07 0 1 1 0 11-1.41 1.41 7 7 0 010-9.9z"/>
    </svg>
  );

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <label className="sr-only" htmlFor="preset">Período</label>
      <SelectShell
        id="preset"
        aria="Seleccionar período"
        value={local.preset}
        onChange={handlePreset}
        leading={CalendarIcon}
      >
        {presets.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </SelectShell>

      {onChangeStatus && (
        <>
          <label className="sr-only" htmlFor="status">Estado</label>
          <SelectShell
            id="status"
            aria="Filtrar por estado"
            value={selectedStatus ?? "all"}
            onChange={(e) => onChangeStatus(e.target.value)}
            leading={PowerIcon}
          >
            <option value="all">Todos</option>
            <option value="on">ON</option>
            <option value="off">OFF</option>
          </SelectShell>
        </>
      )}

      {accounts.length > 0 && onChangeAccount && (
        <>
          <label className="sr-only" htmlFor="account">Cuenta</label>
          <SelectShell
            id="account"
            aria="Seleccionar cuenta"
            value={selectedAccount ?? ""}
            onChange={(e) => onChangeAccount(e.target.value)}
          >
            {accounts.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </SelectShell>
        </>
      )}

      {timezones.length > 0 && onChangeTimezone && (
        <>
          <label className="sr-only" htmlFor="tz">Zona horaria</label>
          <SelectShell
            id="tz"
            aria="Seleccionar zona horaria"
            value={selectedTimezone ?? ""}
            onChange={(e) => onChangeTimezone(e.target.value)}
          >
            {timezones.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </SelectShell>
        </>
      )}
    </div>
  );
}
