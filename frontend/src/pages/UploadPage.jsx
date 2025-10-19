import { useState, useEffect } from "react";
import {
  validateRequired,
  validateIsNumber,
  validateLength,
} from "../utils/validators";
import PhotoUploadSection from "../components/ui/PhotoUploadSection";
import { validateInput } from "../utils/validateInput";
import { useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import DamageReportSection from "../components/ui/DamageReportSection";
import useDamageReports from "../hooks/useDamageReports";
import useEquipment from "../hooks/useEquipment";

const contractIdValidators = [
  validateRequired,
  validateIsNumber,
  (value) => validateLength(value, 6),
];

const UploadPage = () => {
  // State for the form data
  const [contractId, setContractId] = useState("");
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState({
    frontPhoto: null,
    rearPhoto: null,
    leftPhoto: null,
    rightPhoto: null,
    hookupPhoto: null,
  });
  const [uploadType, setUploadType] = useState("OUT");
  const [formError, setFormError] = useState(null);
  const [searchParams] = useSearchParams();
  const preSelectedId = searchParams.get("equipment");
  const preSelectedType = searchParams.get("type");

  const { equipmentList, selectedEquipment, setSelectedEquipment, error } =
    useEquipment(preSelectedId);

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

  useEffect(() => {
    if (preSelectedType) {
      const validTypes = ["IN", "OUT"];
      const normalizedType = preSelectedType.toUpperCase();

      if (validTypes.includes(normalizedType)) {
        setUploadType(normalizedType);
      } else {
        // Invalid type defaults to "OUT"
        setUploadType("OUT");
      }
    }
  }, [preSelectedType]);

  useEffect(() => {
    // Reset all files back to null when uploadType changes
    setFiles({
      frontPhoto: null,
      rearPhoto: null,
      leftPhoto: null,
      rightPhoto: null,
      hookupPhoto: null,
    });

    clearDamageReports();
  }, [uploadType, clearDamageReports]);

  const handleFileChange = (event) => {
    const { name, files: selectedFiles } = event.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [name]: selectedFiles[0],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!selectedEquipment) {
      newErrors.equipment = "Please select a piece of equipment.";
    }

    const contractIdError = validateInput(contractIdValidators, contractId);

    // validate contractID
    if (contractIdError) {
      newErrors.contractId = contractIdError;
    }

    // Validate damage report notes
    const damageReportErrors = damageReports.map((report) => {
      const reportErrors = {};

      if (!report.notes || report.notes.trim() === "") {
        reportErrors.notes = "Notes are required";
      }

      // Validate photo if present
      if (!report.photo) {
        reportErrors.photo = "Photo is required";
      } else {
        // Only validate size if photo exists
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

    // check file uploads
    if (uploadType === "IN") {
      if (!files.frontPhoto) {
        newErrors.frontPhoto = "Front photo is required.";
      }
      if (!files.rearPhoto) {
        newErrors.rearPhoto = "Rear photo is required.";
      }
      if (!files.leftPhoto) {
        newErrors.leftPhoto = "Left side photo is required.";
      }
      if (!files.rightPhoto) {
        newErrors.rightPhoto = "Right side photo is required.";
      }
    } else if (uploadType === "OUT") {
      if (!files.hookupPhoto) {
        newErrors.hookupPhoto = "Hookup photo is required.";
      }
    }

    // Check if any errors were found
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormError("Please correct the errors above before submitting.");
      return; // Stop the submission
    }

    // otherwise, clear error state and proceed
    setErrors({});
    setFormError(null);
    console.log(" Validation passed! Submitting form...");

    const formData = new FormData();

    formData.append("equipment", selectedEquipment.id);
    formData.append("contract_identifier", contractId);

    if (files.frontPhoto) formData.append("front_view_photo", files.frontPhoto);
    if (files.rearPhoto) formData.append("rear_view_photo", files.rearPhoto);
    if (files.leftPhoto) formData.append("left_view_photo", files.leftPhoto);
    if (files.rightPhoto) formData.append("right_view_photo", files.rightPhoto);
    if (files.hookupPhoto)
      formData.append("hookup_view_photo", files.hookupPhoto);

    // Process damage reports
    if (damageReports.length > 0) {
      // Create copy without photos for JSON
      const reportsForJson = damageReports.map(({ photo: _, ...rest }) => rest);
      formData.append("damage_reports", JSON.stringify(reportsForJson));

      // Append photos separately
      damageReports.forEach((report, index) => {
        if (report.photo) {
          formData.append(`damage_photo_${index}`, report.photo);
        }
      });
    }

    // Debug: log FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Equipment Photos</h1>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading equipment</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="pb-3">
          <PhotoUploadSection
            contractId={contractId}
            onContractIdChange={(e) => setContractId(e.target.value)}
            equipmentList={equipmentList}
            selectedEquipment={selectedEquipment}
            onEquipmentSelect={setSelectedEquipment}
            errors={errors}
            onFileChange={handleFileChange}
            files={files}
            uploadType={uploadType}
            setUploadType={setUploadType}
          />
        </div>

        <div className="flex flex-col items-center space-y-3 pb-3">
          {damageReports.map((report, index) => {
            return (
              <DamageReportSection
                key={index}
                index={index}
                reportData={report}
                onDamageReportChange={updateDamageReport}
                onRemoveDamageReport={removeDamageReport}
                onPhotoChange={updateDamagePhoto}
                errors={errors.damageReports?.[index]}
              />
            );
          })}

          <Button variant="secondary" type="button" onClick={addDamageReport}>
            + Add Damage Report
          </Button>
        </div>
        <Button type="submit" error={formError}>
          Submit
        </Button>
      </form>

      {/* A small panel to display the current selection for testing */}
      {selectedEquipment && (
        <div className="mt-8 p-4 bg-transparent rounded">
          <h3 className="font-bold">Current Selection:</h3>
          <p>ID: {selectedEquipment.id}</p>
          <p>Name: {selectedEquipment.name}</p>
        </div>
      )}
    </div>
  );
};
export default UploadPage;
