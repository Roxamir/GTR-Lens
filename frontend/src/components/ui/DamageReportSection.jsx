import Button from "./Button";
import FileInput from "./FileInput";

const DAMAGE_TYPES = [
  { value: "SCRATCH", label: "Scratch/Scuff" },
  { value: "DENT", label: "Dent" },
  { value: "BROKEN", label: "Broken Part" },
  { value: "MISSING", label: "Missing Part" },
  { value: "OTHER", label: "Other" },
];

const DAMAGE_LOCATIONS = [
  { value: "FRONT", label: "Front" },
  { value: "REAR", label: "Rear" },
  { value: "LEFT", label: "Left" },
  { value: "RIGHT", label: "Right" },
  { value: "OTHER", label: "Other" },
];

const DamageReportSection = ({
  index,
  reportData,
  onDamageReportChange,
  onRemoveDamageReport,
  onPhotoChange,
  errors = {},
  showRemove = true,
}) => {
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    onPhotoChange(index, file);
  };
  return (
    <div className="w-full border border-red-500 p-4 rounded-md space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-red-500">Damage Report #{index + 1}</h3>
        {showRemove && (
          <Button
            variant="secondary"
            type="button"
            onClick={() => onRemoveDamageReport(index)}
            className="py-1 px-2 text-xs"
          >
            Remove
          </Button>
        )}
      </div>

      {/* Damage Location Dropdown */}
      <div>
        <label
          htmlFor={`damage-location-${index}`}
          className="block mb-1 text-sm font-semibold"
        >
          Damage Location
        </label>
        <select
          id={`damage-location-${index}`}
          name="damage_location"
          value={reportData.damage_location}
          onChange={(e) =>
            onDamageReportChange(index, "damage_location", e.target.value)
          }
          className="w-full border rounded-md p-2 bg-slate-800 text-white"
        >
          {DAMAGE_LOCATIONS.map((location) => (
            <option key={location.value} value={location.value}>
              {location.label}
            </option>
          ))}
        </select>
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
          className={`w-full border rounded-md p-2 bg-slate-800 text-white ${
            errors?.notes ? "border-red-500" : "border-gray-500"
          }`}
          placeholder="Describe the damage..."
        />
        {errors?.notes && (
          <span className="text-red-600 text-sm mt-1">{errors.notes}</span>
        )}
      </div>

      <FileInput
        label="Photo of Damage"
        name="damagePhoto"
        onFileChange={handlePhotoChange}
        selectedFile={reportData.photo}
        error={errors.photo}
      />
    </div>
  );
};

export default DamageReportSection;
