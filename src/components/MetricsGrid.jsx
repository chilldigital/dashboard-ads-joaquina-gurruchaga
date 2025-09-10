// src/components/MetricsGrid.jsx
import AdCard from "./AdCard";

const MetricsGrid = ({ ads }) => {
  // Agrupa anuncios por ad_id, ad_name, campaign_id y adset_id, sumando métricas relevantes
  const list = Array.isArray(ads) ? ads : [];
  const grouped = [];
  const groupMap = new Map();
  list.forEach(ad => {
    // Clave única para agrupar
    const key = `${ad.ad_id}_${ad.ad_name}_${ad.campaign_id || ''}_${ad.adset_id || ''}`;
    if (!groupMap.has(key)) {
      // Copia el objeto para no mutar el original
      groupMap.set(key, { ...ad });
    } else {
      // Suma métricas relevantes
      const existing = groupMap.get(key);
      // Suma de métricas numéricas comunes
      const sumFields = [
        'spend',
        'actions_omni_purchase',
        'revenue',
        'impressions',
        'clicks',
        'cpm',
        'cpc',
        'ctr',
        'roas',
        'cpa',
        // Agrega aquí otros campos numéricos relevantes
      ];
      sumFields.forEach(field => {
        if (ad[field] !== undefined && !isNaN(parseFloat(ad[field]))) {
          existing[field] = (parseFloat(existing[field]) || 0) + parseFloat(ad[field]);
        }
      });
    }
  });
  groupMap.forEach(ad => grouped.push(ad));

  if (list.length === 0) {
    return (
      <p className="text-gray-500 mt-10 text-center">No hay anuncios disponibles</p>
    );
  }

  // Orden por mayor cantidad de compras
  // Orden por mayor cantidad de compras
  const sorted = [...grouped].sort(
    (a, b) =>
      (parseFloat(b.actions_omni_purchase) || 0) -
      (parseFloat(a.actions_omni_purchase) || 0)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sorted.map((ad, idx) => (
        <AdCard key={`${ad.ad_id}_${idx}`} ad={ad} />
      ))}
    </div>
  );
};

export default MetricsGrid;
