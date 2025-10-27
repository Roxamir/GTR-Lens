import { useState, useEffect } from "react";

const FileInput = ({ label, id, onFileChange, error, selectedFile }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectURL = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectURL);
    return () => URL.revokeObjectURL(objectURL);
  }, [selectedFile]);

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block mb-1 text-sm font-semibold text-gray-300"
      >
        {label}
      </label>
      <label
        htmlFor={id}
        className={`w-full flex items-center justify-center p-4 border-2 border-dashed rounded-md cursor-pointer
                    ${error ? "border-red-500" : "border-gray-500 hover:border-blue-400"}`}
      >
        <div className="w-full items-center max-w-sm">
          {previewUrl ? (
            <div className="text-center w-full max-w-md">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-36 object-contain rounded-md mb-2"
              />
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-400 px-2">
                {selectedFile?.name}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <span className="block">Click to upload</span>
              <span className="block text-xs text-gray-400">
                PNG, JPG up to 10MB
              </span>
            </div>
          )}
        </div>
      </label>
      <input
        id={id}
        name={id}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />
      {error && <span className="text-red-600 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default FileInput;
