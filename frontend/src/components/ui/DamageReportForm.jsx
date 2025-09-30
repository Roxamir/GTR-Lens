import Button from "../ui/Button";

const DAMAGE_TYPES = [
  { value: "SCRATCH", label: "Scratch/Scuff" },
  { value: "DENT", label: "Dent" },
  { value: "BROKEN", label: "Broken Part" },
  { value: "MISSING", label: "Missing Part" },
  { value: "OTHER", label: "Other" },
];

const DamageReportForm = ({
  index,
  reportData,
  onDamageReportChange,
  onRemoveDamageReport,
}) => {
  return (
    <div className="w-full border border-red-500 p-4 rounded-md space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-red-500">Damage Report #{index + 1}</h3>
        <Button
          variant="secondary"
          type="button"
          onClick={() => onRemoveDamageReport(index)}
          className="py-1 px-2 text-xs"
        >
          Remove
        </Button>
      </div>

      {/* Damage Type Dropdown */}
      <div>
        <label
          htmlFor={`damage-type-${index}`}
          className="block mb-1 text-sm font-semibold"
        >
          Damage Type
        </label>
        <select
          id={`damage-type-${index}`}
          name="damage_type"
          value={reportData.damage_type}
          onChange={(e) =>
            onDamageReportChange(index, "damage_type", e.target.value)
          }
          className="w-full border rounded-md p-2 bg-slate-800 text-white"
        >
          {DAMAGE_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Damage Notes Text Area */}
      <div>
        <label
          htmlFor={`damage-notes-${index}`}
          className="block mb-1 text-sm font-semibold"
        >
          Notes
        </label>
        <textarea
          id={`damage-notes-${index}`}
          name="notes"
          value={reportData.notes}
          onChange={(e) => onDamageReportChange(index, "notes", e.target.value)}
          rows="3"
          className="w-full border rounded-md p-2 bg-slate-800 text-white"
          placeholder="Describe the damage..."
        />
      </div>
    </div>
  );
};

export default DamageReportForm;
