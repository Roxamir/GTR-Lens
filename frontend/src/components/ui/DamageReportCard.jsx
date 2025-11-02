import { formatDate } from "../../utils/formatDate";

const DamageReportCard = ({ report, setSelectedPhoto }) => {
  const formattedDate = formatDate(report.reported_at);
  const imageUrl = report.photo;

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3">
          Date: {formattedDate}
        </h3>

        <div className="space-y-2">
          <div>
            <span className="font-semibold">
              Type: {report.damage_type}
            </span>{" "}
          </div>
          <div>
            <span className="font-semibold">
              Location: {report.damage_location}
            </span>{" "}
          </div>
          <div>
            <span className="font-semibold">Notes: {report.notes}</span>{" "}
          </div>
          <div>
            <span className="font-semibold">
              Reported By: {report.reported_by}
            </span>{" "}
          </div>
          <div>
            <img
              className="rounded-sm shadow-lg w-full h-48 object-cover transition-transform duration-200 hover:scale-103 cursor-pointer"
              src={imageUrl}
              alt="Damage Report Photo"
              onClick={() => setSelectedPhoto(imageUrl)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamageReportCard;
