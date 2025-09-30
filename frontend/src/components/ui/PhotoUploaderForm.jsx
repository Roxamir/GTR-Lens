// frontend/src/components/forms/PhotoUploaderForm.jsx

import SearchableDropdown from "../ui/SearchableDropdown";
import InputField from "../ui/InputField";
import Button from "./Button";

const PhotoUploaderForm = ({
  contractId,
  onContractIdChange,
  equipmentList,
  selectedEquipment,
  onEquipmentSelect,
  errors,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <SearchableDropdown
        options={equipmentList}
        selected={selectedEquipment}
        onSelect={onEquipmentSelect}
        label="Select Equipment"
        displayKey="name"
      />

      <InputField
        label="Contract ID"
        name="contractId"
        type="text"
        value={contractId}
        onChange={onContractIdChange}
        error={errors.contractId}
      />

      {/* File inputs will go here later */}

      <Button>Submit</Button>
    </form>
  );
};

export default PhotoUploaderForm;
