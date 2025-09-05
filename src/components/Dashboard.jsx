// src/components/Dashboard.jsx
import { useEffect, useState } from "react";
import { getAdsData } from "../api/windsorApi";
import SummaryMetrics from "./SummaryMetrics";
import MetricsGrid from "./MetricsGrid";
import FilterBar from "./FilterBar";
import useDateFilter from "../hooks/useDateFilter";

const Dashboard = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { range, setRange, humanLabel } = useDateFilter();
  const [statusFilter, setStatusFilter] = useState("all"); // all | on | off

  const load = async () => {
    try {
      setLoading(true);
      const args = { datePreset: range.preset }; // usamos presets siempre

      const data = await getAdsData({
        ...args,
        // account: process.env.REACT_APP_WINDSOR_ACCOUNT,
        // timezone: "America/Buenos_Aires",
      });
      setAds(data);
    } catch (e) {
      console.error("❌ Error cargando datos:", e);
    } finally {
      setLoading(false);
    }
  };

  // carga inicial
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // recarga al cambiar preset
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.preset]);

  const filteredAds = (() => {
    if (!Array.isArray(ads)) return [];
    if (statusFilter === "all") return ads;
    const isActive = (a) => {
      const adActive = String(a?.status || "").toUpperCase() === "ACTIVE";
      const campStatus = String(a?.campaign_status || "").toUpperCase();
      const campaignActive = campStatus ? campStatus === "ACTIVE" : true; // si no viene, asumir activo
      return adActive && campaignActive;
    };
    if (statusFilter === "on") return ads.filter(isActive);
    if (statusFilter === "off") return ads.filter((a) => !isActive(a));
    return ads;
  })();


  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Curveez</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">Performance de Anuncios</h1>
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 text-[11px] rounded-full border border-gray-200 bg-white/70 text-gray-600">
              {humanLabel}
            </span>
          </div>
          <FilterBar
            value={range}
            onChange={setRange}
            selectedStatus={statusFilter}
            onChangeStatus={setStatusFilter}
          />
        </div>

        {loading ? (
          <div className="h-40 grid place-items-center text-gray-500">Cargando datos…</div>
        ) : (
          <>
            <SummaryMetrics ads={filteredAds} />
            <MetricsGrid ads={filteredAds} />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
