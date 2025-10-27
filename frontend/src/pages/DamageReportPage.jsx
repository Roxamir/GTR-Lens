import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import DamageReportSection from "../components/ui/DamageReportSection";
import SearchableDropdown from "../components/ui/SearchableDropdown";
import Button from "../components/ui/Button";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import useEquipment from "../hooks/useEquipment";
import useDamageReports from "../hooks/useDamageReports";
import { uploadDamageReports } from "../services/apiService";

const DamageReportPage = () => {
  const {
    damageReports,
    addDamageReport,
    removeDamageReport,
    updateDamageReport,
    updateDamagePhoto,
    clearDamageReports,
  } = useDamageReports([
    { damage_type: "OTHER", damage_location: "OTHER", notes: "", photo: null },
  ]);

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const preSelectedId = searchParams.get("equipment");

  const { equipmentList, selectedEquipment, setSelectedEquipment, error } =
    useEquipment(preSelectedId);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!selectedEquipment) {
      newErrors.equipment = "Please select a piece of equipment.";
    }

    // Validate each damage report
    const damageReportErrors = damageReports.map((report) => {
      const reportErrors = {};

      if (!report.notes || report.notes.trim() === "") {
        reportErrors.notes = "Notes are required";
      }

      if (!report.photo) {
        reportErrors.photo = "Photo is required";
      } else {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (report.photo.size > maxSize) {
          reportErrors.photo = "Photo must be less than 5MB";
        }
      }

      return Object.keys(reportErrors).length > 0 ? reportErrors : null;
    });

    const hasDamageReportErrors = damageReportErrors.some(
      (error) => error !== null
    );

    if (hasDamageReportErrors) {
      newErrors.damageReports = damageReportErrors;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormError("Please correct the errors above before submitting.");
      return;
    }

    setErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.append("equipment", selectedEquipment.id);
    formData.append("damage_report_count", damageReports.length);

    damageReports.forEach((report, index) => {
      formData.append(`damage_report_${index}_type`, report.damage_type);
      formData.append(
        `damage_report_${index}_location`,
        report.damage_location
      );
      formData.append(`damage_report_${index}_notes`, report.notes);
      if (report.photo) {
        formData.append(`damage_report_${index}_photo`, report.photo);
      }
    });

    try {
      setLoading(true);
      const startTime = Date.now();

      await uploadDamageReports(formData);

      const elapsed = Date.now() - startTime;
      if (elapsed < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - elapsed));
      }

      clearDamageReports();
      addDamageReport();
      setSelectedEquipment(null);

      alert("Damage reports submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      setFormError(
        error.message || "Failed to submit damage reports. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 w-full max-w-md mx-auto">
      <LoadingOverlay loading={loading} />
      <h1 className="text-3xl font-bold mb-6">Damage Report</h1>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading equipment</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <SearchableDropdown
          options={equipmentList}
          selected={selectedEquipment}
          onSelect={setSelectedEquipment}
          label="Select Equipment"
          displayKey="name"
          error={errors.equipment}
        />

        <div className="flex flex-col items-center space-y-3">
          {damageReports.map((report, index) => (
            <DamageReportSection
              key={index}
              index={index}
              reportData={report}
              onDamageReportChange={updateDamageReport}
              onRemoveDamageReport={removeDamageReport}
              onPhotoChange={updateDamagePhoto}
              errors={errors.damageReports?.[index]}
              showRemove={damageReports.length > 1}
            />
          ))}

          <Button variant="secondary" type="button" onClick={addDamageReport}>
            + Add Damage Report
          </Button>
        </div>

        <Button type="submit" error={formError}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default DamageReportPage;
