const StatCard = ({ icon, label, value }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gray-100 grid place-items-center text-lg">
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};
export default StatCard;