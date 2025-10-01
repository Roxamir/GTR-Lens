const FileInput = ({ label, name, onFileChange, error, selectedFile }) => {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block mb-1 text-sm font-semibold text-gray-300"
      >
        {label}
      </label>
      <label
        htmlFor={name}
        className={`w-full flex items-center justify-center p-4 border-2 border-dashed rounded-md cursor-pointer
                    ${error ? "border-red-500" : "border-gray-500 hover:border-blue-400"}`}
      >
        <div className="text-center">
          <span className="hidden md:block">
            {selectedFile
              ? selectedFile.name + " ✅"
              : "Click to upload or drag and drop"}
          </span>
          <span className="md:hidden block">
            {selectedFile ? selectedFile.name + " ✅" : "Click to upload"}
          </span>
          <span className="block text-xs text-gray-400">
            PNG, JPG up to 10MB
          </span>
        </div>
      </label>
      <input
        id={name}
        name={name}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={onFileChange}
        className="hidden"
      />
      {error && <span className="text-red-600 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default FileInput;
