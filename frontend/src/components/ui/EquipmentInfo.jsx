import { useNavigate } from "react-router-dom";
import Button from "./Button";

const EquipmentInfo = ({ equipment }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6 flex justify-between items-center">
      {/* Left side: Equipment info */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">{equipment.name}</h2>
        <div className="text-sm text-gray-300">
          <span className="font-semibold">Latest Contract:</span>{" "}
          <span className="text-gray-400">
            {equipment.latest_contract_identifier || "N/A"}
          </span>
        </div>
        <div className="text-sm text-gray-300">
          <span className="font-semibold">Damage Reports:</span>{" "}
          <span
            className={`font-bold ${
              equipment.damage_report_count > 0
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {equipment.damage_report_count}
          </span>
        </div>
      </div>

      <div className="flex flex-col shrink-0 gap-4">
        <Button
          onClick={() => navigate(`/upload?equipment=${equipment.id}&type=IN`)}
        >
          Check-In
        </Button>
        <Button
          onClick={() => navigate(`/upload?equipment=${equipment.id}&type=OUT`)}
        >
          Check-Out
        </Button>
      </div>
    </div>
  );
};

export default EquipmentInfo;
