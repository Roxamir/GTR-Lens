import SearchableDropdown from "../ui/SearchableDropdown";
import InputField from "../ui/InputField";
import Button from "./Button";
import DamageReportForm from "./DamageReportForm";
import FileInput from "./FileInput";

const PhotoUploaderForm = ({
  contractId,
  onContractIdChange,
  equipmentList,
  selectedEquipment,
  onEquipmentSelect,
  damageReports,
  files,
  errors,
  uploadType,
  setUploadType,
  onAddDamageReport,
  onRemoveDamageReport,
  onDamageReportChange,
  onFileChange,
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
      <div className="space-x-2 items-center">
        <label>
          <input
            type="radio"
            name="uploadType"
            value="AFTER"
            checked={uploadType === "AFTER"}
            onChange={() => setUploadType("AFTER")}
          />
          After (Check-In)
        </label>
        <label>
          <input
            type="radio"
            name="uploadType"
            value="BEFORE"
            checked={uploadType === "BEFORE"}
            onChange={() => setUploadType("BEFORE")}
          />
          Before (Check-Out)
        </label>
      </div>

      {uploadType === "AFTER" ? (
        <>
          <FileInput
            label="Front View"
            name="frontPhoto"
            onFileChange={onFileChange}
            error={errors.frontPhoto}
            selectedFile={files.frontPhoto}
          />
          <FileInput
            label="Rear View"
            name="rearPhoto"
            onFileChange={onFileChange}
            error={errors.rearPhoto}
            selectedFile={files.rearPhoto}
          />
          <FileInput
            label="Left Side View"
            name="leftPhoto"
            onFileChange={onFileChange}
            error={errors.leftPhoto}
            selectedFile={files.leftPhoto}
          />
          <FileInput
            label="Right Side View"
            name="rightPhoto"
            onFileChange={onFileChange}
            error={errors.rightPhoto}
            selectedFile={files.rightPhoto}
          />

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

            <Button
              variant="secondary"
              type="button"
              onClick={onAddDamageReport}
            >
              + Add Damage Report
            </Button>
          </div>
        </>
      ) : (
        <FileInput
          label="Hookup View"
          name="hookupPhoto"
          onFileChange={onFileChange}
          selectedFile={files.hookupPhoto}
          error={errors.hookupPhoto}
        />
      )}
      <div className="flex flex-col items-center space-y-3">
        <Button>Submit</Button>
      </div>
    </form>
  );
};

export default PhotoUploaderForm;
