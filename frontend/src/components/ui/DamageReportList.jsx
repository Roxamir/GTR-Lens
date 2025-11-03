import DamageReportCard from "./DamageReportCard";

const DamageReportList = ({ damageReports, setSelectedPhoto }) => {
  if (damageReports.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No damage reports yet 🎉
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-3">Damage Reports</h2>

      {damageReports.map((report) => (
        <DamageReportCard
          key={report.id}
          report={report}
          setSelectedPhoto={setSelectedPhoto}
        />
      ))}
    </div>
  );
};

export default DamageReportList;
