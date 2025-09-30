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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedEquipment) {
      alert("Please select a piece of equipment.");
      return;
    }

    const contractIdError = validateInput(contractIdValidators, contractId);

    // if error, stop submission
    if (contractIdError) {
      setErrors({ contractId: contractIdError });
      return;
    }

    // otherwise, clear error state and proceed
    setErrors({});
    console.log("Submitting:", {
      equipmentId: selectedEquipment.id,
      contractId: contractId,
      damageReports: damageReports,
    });
    // Final API submission logic will go here
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
