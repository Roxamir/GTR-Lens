import SearchableDropdown from "./SearchableDropdown";
import InputField from "./InputField";
import FileInput from "./FileInput";

const PhotoUploadSection = ({
  contractId,
  onContractIdChange,
  equipmentList,
  selectedEquipment,
  onEquipmentSelect,
  files,
  errors,
  uploadType,
  setUploadType,
  onFileChange,
}) => {
  return (
    <div className="">
      <div className="flex flex-col m-auto w-full rounded-xl bg-slate-900 p-6 items-center shadow-lg">
        <div className="w-full">
          <div>
            <SearchableDropdown
              options={equipmentList}
              selected={selectedEquipment}
              onSelect={onEquipmentSelect}
              label="Select Equipment"
              displayKey="name"
              error={errors.equipment}
            />
          </div>
          <InputField
            label="Contract ID"
            name="contractId"
            type="text"
            value={contractId}
            onChange={onContractIdChange}
            error={errors.contractId}
          />
        </div>
        <div className="space-x-2 items-center mb-3">
          <label>
            <input
              type="radio"
              name="uploadType"
              value="OUT"
              checked={uploadType === "OUT"}
              onChange={() => setUploadType("OUT")}
            />
            Check-Out
          </label>
          <label>
            <input
              type="radio"
              name="uploadType"
              value="IN"
              checked={uploadType === "IN"}
              onChange={() => setUploadType("IN")}
            />
            Check-In
          </label>
        </div>

        {uploadType === "IN" ? (
          <>
            <FileInput
              label="Front View"
              id="frontPhoto"
              onFileChange={onFileChange}
              error={errors.frontPhoto}
              selectedFile={files.frontPhoto}
            />
            <FileInput
              label="Rear View"
              id="rearPhoto"
              onFileChange={onFileChange}
              error={errors.rearPhoto}
              selectedFile={files.rearPhoto}
            />
            <FileInput
              label="Left Side View"
              id="leftPhoto"
              onFileChange={onFileChange}
              error={errors.leftPhoto}
              selectedFile={files.leftPhoto}
            />
            <FileInput
              label="Right Side View"
              id="rightPhoto"
              onFileChange={onFileChange}
              error={errors.rightPhoto}
              selectedFile={files.rightPhoto}
            />
          </>
        ) : (
          <FileInput
            label="Hookup View"
            id="hookupPhoto"
            onFileChange={onFileChange}
            selectedFile={files.hookupPhoto}
            error={errors.hookupPhoto}
          />
        )}
      </div>
    </div>
  );
};

export default PhotoUploadSection;
