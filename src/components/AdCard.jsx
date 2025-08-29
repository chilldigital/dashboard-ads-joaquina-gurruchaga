// src/components/AdCard.jsx
const AdCard = ({ ad }) => {
  const compras = parseFloat(ad.actions_offsite_conversion_fb_pixel_purchase) || 0;
  const revenue = parseFloat(ad.action_values_omni_purchase) || 0;
  const gasto = parseFloat(ad.totalcost) || 0;

  const cpa = compras > 0 ? gasto / compras : null;
  const roas = gasto > 0 ? revenue / gasto : null;
  const ticket = compras > 0 ? revenue / compras : null;

  const money = (n) =>
    n == null
      ? "-"
      : `$${n.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

  const isOn = String(ad.status || "").toUpperCase() === "ACTIVE";

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      {/* Media + Status badge */}
      <div className="relative">
        <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full border border-gray-200 bg-white shadow-sm select-none">
          <span
            className={`h-2 w-2 rounded-full ${
              isOn ? "bg-emerald-500" : "bg-gray-400"
            }`}
          />
          <span className={isOn ? "text-gray-900" : "text-gray-600"}>
            {isOn ? "ON" : "OFF"}
          </span>
        </span>

        {ad.thumbnail_url ? (
          <img
            src={ad.thumbnail_url}
            alt={ad.ad_name}
            className="w-full aspect-[16/9] object-cover"
          />
        ) : (
          <div className="w-full aspect-[16/9] bg-gray-100" />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-800 text-sm truncate">
            {ad.ad_name}
          </h3>
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
            ROAS {roas == null ? "-" : roas.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">{ad.campaign}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <span>💸 {money(gasto)}</span>
          <span>🛒 {compras}</span>
          <span>📉 {money(cpa)}</span>
          <span>💰 {money(revenue)}</span>
        </div>
      </div>
    </div>
  );
};
export default AdCard;