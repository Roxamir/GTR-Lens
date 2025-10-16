import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import DamageReportSection from "../components/ui/DamageReportSection";
import SearchableDropdown from "../components/ui/SearchableDropdown";
import Button from "../components/ui/Button";
import useEquipment from "../hooks/useEquipment";
import useDamageReports from "../hooks/useDamageReports";

const DamageReportPage = () => {
  const {
    damageReports,
    addDamageReport,
    removeDamageReport,
    updateDamageReport,
  } = useDamageReports();
  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();

  const preSelectedId = searchParams.get("damage-report");

  const { equipmentList, selectedEquipment, setSelectedEquipment, error } =
    useEquipment(preSelectedId);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};

    // validate equipment
    if (!selectedEquipment) {
      newErrors.equipment = "Please select a piece of equipment.";
    }

    // Validate each damage report's notes
    const damageReportErrors = damageReports.map((report) => {
      const reportErrors = {};

      if (!report.notes || report.notes.trim() === "") {
        reportErrors.notes = "Notes are required";
      }

      return Object.keys(reportErrors).length > 0 ? reportErrors : null;
    });

    const hasDamageReportErrors = damageReportErrors.some(
      (error) => error !== null
    );

    if (hasDamageReportErrors) {
      newErrors.damageReports = damageReportErrors;
    }

    // Check if any errors were found
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop the submission
    }

    // otherwise, clear error state and proceed
    setErrors({});
    console.log(" Validation passed! Submitting form...");

    const formData = new FormData();

    formData.append("equipment", selectedEquipment.id);

    damageReports.forEach((report, index) => {
      formData.append(
        `damage_reports[${index}][damage_location]`,
        report.damage_location
      );
      formData.append(
        `damage_reports[${index}][damage_type]`,
        report.damage_type
      );
      formData.append(`damage_reports[${index}][notes]`, report.notes);
    });

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-4">
          Error loading equipment: {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 w-xs">
        <SearchableDropdown
          options={equipmentList}
          selected={selectedEquipment}
          onSelect={setSelectedEquipment}
          label="Select Equipment"
          displayKey="name"
          error={errors.equipment}
        />

        <div className="flex flex-col items-center space-y-3">
          {damageReports.map((report, index) => {
            return (
              <DamageReportSection
                key={index}
                index={index}
                reportData={report}
                onDamageReportChange={updateDamageReport}
                onRemoveDamageReport={removeDamageReport}
                errors={errors.damageReports?.[index]}
              />
            );
          })}

          <Button variant="secondary" type="button" onClick={addDamageReport}>
            + Add Damage Report
          </Button>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default DamageReportPage;
