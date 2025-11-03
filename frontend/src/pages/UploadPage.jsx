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
import { uploadConditionPhotos, uploadFileToS3 } from "../services/apiService";
import LoadingOverlay from "../components/ui/LoadingOverlay";

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
  const [loading, setLoading] = useState(false);

  const { equipmentList, selectedEquipment, setSelectedEquipment, error } =
    useEquipment(preSelectedId);

  const {
    damageReports,
    addDamageReport,
    removeDamageReport,
    updateDamageReport,
    updateDamagePhoto,
    clearDamageReports,
  } = useDamageReports([]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    // --- VALIDATION  --- //
    if (!selectedEquipment) {
      newErrors.equipment = "Please select a piece of equipment.";
    }

    const contractIdError = validateInput(contractIdValidators, contractId);
    if (contractIdError) {
      newErrors.contractId = contractIdError;
    }

    const damageReportErrors = damageReports.map((report) => {
      const reportErrors = {};
      if (!report.notes || report.notes.trim() === "") {
        reportErrors.notes = "Notes are required";
      }
      if (!report.photo) {
        reportErrors.photo = "Photo is required";
      } else {
        const maxSize = 5 * 1024 * 1024;
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

    if (uploadType === "IN") {
      if (!files.frontPhoto) newErrors.frontPhoto = "Front photo is required.";
      if (!files.rearPhoto) newErrors.rearPhoto = "Rear photo is required.";
      if (!files.leftPhoto)
        newErrors.leftPhoto = "Left side photo is required.";
      if (!files.rightPhoto)
        newErrors.rightPhoto = "Right side photo is required.";
    } else if (uploadType === "OUT") {
      if (!files.hookupPhoto)
        newErrors.hookupPhoto = "Hookup photo is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormError("Please correct the errors above before submitting.");
      return;
    }

    setErrors({});
    setFormError(null);
    setLoading(true);

    // --- SUBMISSION LOGIC --- //
    try {
      // Upload all condition photos in parallel
      const [frontKey, rearKey, leftKey, rightKey, hookupKey] =
        await Promise.all([
          uploadFileToS3(files.frontPhoto, "condition"),
          uploadFileToS3(files.rearPhoto, "condition"),
          uploadFileToS3(files.leftPhoto, "condition"),
          uploadFileToS3(files.rightPhoto, "condition"),
          uploadFileToS3(files.hookupPhoto, "condition"),
        ]);

      // Upload all damage report photos and create new report data
      const processedDamageReports = await Promise.all(
        damageReports.map(async (report) => {
          const photoKey = await uploadFileToS3(report.photo, "damage");
          return {
            damage_type: report.damage_type,
            damage_location: report.damage_location,
            notes: report.notes,
            photo_key: photoKey,
          };
        })
      );

      // --- SUBMIT FINAL DATA TO BACKEND --- //
      const finalFormData = new FormData();
      finalFormData.append("equipment", selectedEquipment.id);
      finalFormData.append("contract_identifier", contractId);
      finalFormData.append("upload_type", uploadType);

      // Add condition photo keys (if they exist)
      if (frontKey) finalFormData.append("front_view_key", frontKey);
      if (rearKey) finalFormData.append("rear_view_key", rearKey);
      if (leftKey) finalFormData.append("left_view_key", leftKey);
      if (rightKey) finalFormData.append("right_view_key", rightKey);
      if (hookupKey) finalFormData.append("hookup_view_key", hookupKey);

      // Add processed damage reports
      if (processedDamageReports.length > 0) {
        finalFormData.append(
          "damage_report_count",
          processedDamageReports.length
        );
        processedDamageReports.forEach((report, index) => {
          finalFormData.append(
            `damage_report_${index}_type`,
            report.damage_type
          );
          finalFormData.append(
            `damage_report_${index}_location`,
            report.damage_location
          );
          finalFormData.append(`damage_report_${index}_notes`, report.notes);
          if (report.photo_key) {
            finalFormData.append(
              `damage_report_${index}_photo_key`,
              report.photo_key
            );
          }
        });
      }

      // Send the final data to our Django server
      await uploadConditionPhotos(finalFormData);

      // --- RESET FORM ON SUCCESS ---
      setFiles({
        frontPhoto: null,
        rearPhoto: null,
        leftPhoto: null,
        rightPhoto: null,
        hookupPhoto: null,
      });
      setContractId("");
      clearDamageReports();
      setSelectedEquipment(null);

      alert("Photos uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      setFormError(
        error.message || "Failed to upload photos. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 w-full max-w-md mx-auto">
      <LoadingOverlay loading={loading} />
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
    </div>
  );
};
export default UploadPage;
