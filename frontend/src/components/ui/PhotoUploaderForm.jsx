import SearchableDropdown from "../ui/SearchableDropdown";
import InputField from "../ui/InputField";
import Button from "./Button";
import DamageReportForm from "./DamageReportForm";

const PhotoUploaderForm = ({
  contractId,
  onContractIdChange,
  equipmentList,
  selectedEquipment,
  onEquipmentSelect,
  damageReports,
  errors,
  onAddDamageReport,
  onRemoveDamageReport,
  onDamageReportChange,
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
      <div className="flex flex-col items-center space-y-3">
        {damageReports.map((report, index) => {
          return (
            <DamageReportForm
              key={index}
              index={index}
              reportData={report}
              onDamageReportChange={onDamageReportChange}
              onRemoveDamageReport={onRemoveDamageReport}
            />
          );
        })}
        <Button variant="secondary" type="button" onClick={onAddDamageReport}>
          Add Damage Report
        </Button>

        <Button>Submit</Button>
      </div>
    </form>
  );
};

export default PhotoUploaderForm;
