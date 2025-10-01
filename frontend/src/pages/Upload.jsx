import { useState, useEffect } from "react";
import { getEquipmentList } from "../services/apiService";
import {
  validateRequired,
  validateIsNumber,
  validateLength,
} from "../utils/validators";
import PhotoUploaderForm from "../components/ui/PhotoUploaderForm"; // Corrected import path
import { validateInput } from "../utils/validateInput";

const contractIdValidators = [
  validateRequired,
  validateIsNumber,
  (value) => validateLength(value, 6),
];

const UploadPage = () => {
  // State for the form data
  const [contractId, setContractId] = useState("");
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [errors, setErrors] = useState({});
  const [damageReports, setDamageReports] = useState([]);
  const [files, setFiles] = useState({
    frontPhoto: null,
    rearPhoto: null,
    leftPhoto: null,
    rightPhoto: null,
    hookupPhoto: null,
  });
  const [uploadType, setUploadType] = useState("AFTER");

  // Fetch the list of equipment when the page loads
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await getEquipmentList();
        setEquipmentList(data);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      }
    };

    fetchEquipment();
  }, []);

  useEffect(() => {
    // Reset all files back to null when uploadType changes
    setFiles({
      frontPhoto: null,
      rearPhoto: null,
      leftPhoto: null,
      rightPhoto: null,
      hookupPhoto: null,
    });

    // Remove damage reports when uploadType changes
    setDamageReports([]);
  }, [uploadType]);

  const handleAddDamageReport = () => {
    setDamageReports([
      ...damageReports,
      { damage_type: "OTHER", notes: "" }, //
    ]);
  };

  const handleRemoveDamageReport = (indexToRemove) => {
    setDamageReports(damageReports.filter((_, i) => i !== indexToRemove));
  };

  const handleDamageReportChange = (index, field, value) => {
    const newDamageReports = damageReports.map((report, i) => {
      if (i === index) {
        return { ...report, [field]: value };
      }
      return report;
    });
    setDamageReports(newDamageReports);
  };

  const handleFileChange = (event) => {
    const { name, files: selectedFiles } = event.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [name]: selectedFiles[0],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedEquipment) {
      alert("Please select a piece of equipment.");
      return;
    }

    const newErrors = {};
    const contractIdError = validateInput(contractIdValidators, contractId);

    // check contract ID
    if (contractIdError) {
      newErrors.contractId = contractIdError;
    }

    // check file uploads
    if (uploadType === "AFTER") {
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
    } else if (uploadType === "BEFORE") {
      if (!files.hookupPhoto) {
        newErrors.hookupPhoto = "Hookup photo is required.";
      }
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
    formData.append("contract_identifier", contractId);

    if (files.frontPhoto) formData.append("front_view_photo", files.frontPhoto);
    if (files.rearPhoto) formData.append("rear_view_photo", files.rearPhoto);
    if (files.leftPhoto) formData.append("left_view_photo", files.leftPhoto);
    if (files.rightPhoto) formData.append("right_view_photo", files.rightPhoto);
    if (files.hookupPhoto)
      formData.append("hookup_view_photo", files.hookupPhoto);

    if (damageReports.length > 0) {
      formData.append("damage_reports", JSON.stringify(damageReports));
    }

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Equipment Photos</h1>

      <PhotoUploaderForm
        contractId={contractId}
        onContractIdChange={(e) => setContractId(e.target.value)}
        equipmentList={equipmentList}
        selectedEquipment={selectedEquipment}
        onEquipmentSelect={setSelectedEquipment}
        onSubmit={handleSubmit}
        errors={errors}
        damageReports={damageReports}
        onAddDamageReport={handleAddDamageReport}
        onDamageReportChange={handleDamageReportChange}
        onRemoveDamageReport={handleRemoveDamageReport}
        onFileChange={handleFileChange}
        files={files}
        uploadType={uploadType}
        setUploadType={setUploadType}
      />

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
