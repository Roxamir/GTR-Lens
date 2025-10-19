import { formatDate } from "../../utils/formatDate";

const PhotoCard = ({ photo, setSelectedImage }) => {
  const imageUrl = photo.image;

  const formattedDate = formatDate(photo.timestamp);

  return (
    <div
      className="bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105 group cursor-pointer"
      onClick={() => setSelectedImage(imageUrl)}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={`Photo of ${photo.equipment.name}`}
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-4">
        {/* Photo Location */}
        <p className="text-sm font-semibold text-gray-300">
          {photo.get_photo_location_display ||
            photo.photo_location.replace("_", " ")}
        </p>

        {/* Equipment Name */}
        <p className="text-lg font-bold text-white mt-1">
          {photo.equipment.name}
        </p>

        {/* Contract and Date */}
        <div className="text-xs text-gray-400 mt-2">
          <span>Contract: {photo.contract_identifier}</span>
          <span className="mx-1">|</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
