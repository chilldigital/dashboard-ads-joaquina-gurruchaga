
import StatCard from "./StatCard";

const SummaryMetrics = ({ summary }) => {
  // summary: { totalcost, actions_omni_purchase, action_values_offsite_conversion_fb_pixel_purchase }
  const spend = parseFloat(summary?.totalcost) || 0;
  const purchases = parseFloat(summary?.actions_omni_purchase) || 0;
  const revenue = parseFloat(summary?.action_values_offsite_conversion_fb_pixel_purchase) || 0;

  const cpa = purchases > 0 ? spend / purchases : null;
  const roas = spend > 0 ? revenue / spend : null;
  const ticket = purchases > 0 ? revenue / purchases : null;

  const money = (n) =>
    `$${(n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3 sm:gap-4 mb-8 mt-6">
      <StatCard icon="💸" label="Inversión" value={money(spend)} />
      <StatCard icon="🛒" label="Compras" value={purchases.toLocaleString("en-US")} />
      <StatCard icon="📉" label="CPA" value={cpa == null ? "-" : money(cpa)} />
      <StatCard icon="💰" label="Revenue" value={money(revenue)} />
      <StatCard icon="🚀" label="ROAS" value={roas == null ? "-" : roas.toFixed(2)} />
      <StatCard icon="🎯" label="Ticket Promedio" value={ticket == null ? "-" : money(ticket)} />
    </div>
  );
};

export default SummaryMetrics;
