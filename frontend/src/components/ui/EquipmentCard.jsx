const EquipmentCard = ({ equipment }) => {
  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105 cursor-pointer">
      <div className="p-6">
        {/* Equipment Name */}
        <h3 className="text-xl font-bold text-white mb-3">{equipment.name}</h3>

        {/* Contract Info */}
        <div className="space-y-2">
          <div className="text-sm text-gray-300">
            <span className="font-semibold">Latest Contract:</span>{" "}
            <span className="text-gray-400">
              {equipment.latest_contract_identifier || "N/A"}
            </span>
          </div>

          {/* Damage Report Count */}
          <div className="text-sm text-gray-300">
            <span className="font-semibold">Damage Reports:</span>{" "}
            <span
              className={`font-bold ${equipment.damage_report_count > 0 ? "text-red-400" : "text-green-400"}`}
            >
              {equipment.damage_report_count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
