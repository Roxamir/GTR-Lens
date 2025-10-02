import Button from "./Button";
import { HiMiniXMark } from "react-icons/hi2";

const ImageModal = ({ image, isModalOpen, onClose }) => {
  if (!isModalOpen) {
    return null;
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose} // Close modal when clicking the backdrop
    >
      {/* Modal Content */}
      <div
        className="relative bg-slate-900 p-4 rounded-lg max-w-4xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <img
          src={image}
          alt="Enlarged view"
          className="max-h-[calc(90vh-80px)] w-auto object-contain"
        />
        <Button
          onClick={onClose}
          className="absolute top-2 right-2 group"
          variant="icon"
        >
          <HiMiniXMark className="w-6 h-6 text-white" />
        </Button>
      </div>
    </div>
  );
};
export default ImageModal;
