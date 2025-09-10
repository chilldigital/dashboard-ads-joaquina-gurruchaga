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
      
      // Verificar que los datos tengan la estructura esperada
      if (Array.isArray(data) && data.length > 0) {
        
        
        // Análisis de los estados presentes en los datos
        const statusAnalysis = {
          total: data.length,
          withStatus: data.filter(ad => ad.hasOwnProperty('status')).length,
          withCampaignStatus: data.filter(ad => ad.hasOwnProperty('campaign_status')).length,
          withAdsetStatus: data.filter(ad => ad.hasOwnProperty('adset_status')).length,
          activeStatus: data.filter(ad => String(ad?.status || "").toUpperCase() === "ACTIVE").length,
          pausedStatus: data.filter(ad => String(ad?.status || "").toUpperCase() === "PAUSED").length,
          otherStatusValues: [...new Set(data.map(ad => String(ad?.status || "").toUpperCase()).filter(s => s !== "ACTIVE" && s !== "PAUSED" && s !== ""))],
        };
        
        // Muestra de datos para verificar estructura
        if (data.length > 0) {
          // ...
        }
      } else {
        console.warn("⚠️ No se recibieron datos o el formato es incorrecto");
      }
      
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
    // Resetear el filtro de estado al cambiar el preset para evitar inconsistencias
    setStatusFilter("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.preset]);

  // Implementación mejorada del filtrado
  const filteredAds = (() => {
    // Añadir log para depurar
    
    
    if (!Array.isArray(ads)) return [];
    if (statusFilter === "all") return ads;
    
    // Verificar estructura de datos para depuración
    if (ads.length > 0) {
      
    }
    
    // Función simplificada para verificar el estado activo - solo ACTIVE o PAUSED
    const checkStatus = (a) => {
      // Normalizar status para manejar cualquier formato
      const adStatus = String(a?.status || "").toUpperCase();
      const campStatus = String(a?.campaign_status || "").toUpperCase();
      const adsetStatus = String(a?.adset_status || "").toUpperCase();
      
      // Un anuncio está activo solo si los tres estados son "ACTIVE"
      // Un anuncio está pausado si cualquiera de los tres estados es "PAUSED"
      const isActive = 
        adStatus === "ACTIVE" && 
        campStatus === "ACTIVE" && 
        adsetStatus === "ACTIVE";
      
      return {
        adStatus,
        campStatus,
        adsetStatus,
        isActive
      };
    };

    // Aplicar filtro según el estado seleccionado - misma lógica para todos los períodos
    let result;
    if (statusFilter === "on") {
      // Lógica unificada para todos los períodos
      result = ads.filter(ad => {
        const adStatus = String(ad?.status || "").toUpperCase();
        const campStatus = String(ad?.campaign_status || "").toUpperCase();
        const adsetStatus = String(ad?.adset_status || "").toUpperCase();
        
        // Para debug
        
        
        return adStatus === "ACTIVE" && campStatus === "ACTIVE" && adsetStatus === "ACTIVE";
      });
      
      
      
      // Log de muestra para depuración
      if (result.length > 0) {
        
      }
    }
    else if (statusFilter === "off") {
      // Lógica unificada para todos los períodos
      result = ads.filter(ad => {
        const adStatus = String(ad?.status || "").toUpperCase();
        const campStatus = String(ad?.campaign_status || "").toUpperCase();
        const adsetStatus = String(ad?.adset_status || "").toUpperCase();
        
        return adStatus === "PAUSED" || campStatus === "PAUSED" || adsetStatus === "PAUSED";
      });
      
      
      
      // Log de muestra para depuración
      if (result.length > 0) {
        
      }
      
      // Log de muestra para depuración
      if (result.length > 0) {
        
      }
    }
    else {
      result = ads;
    }
    
    return result;
  })();


  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
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
