import { useState } from "react";

function useDamageReports(initialReports = []) {
  const [damageReports, setDamageReports] = useState(initialReports);

  const addDamageReport = () => {
    setDamageReports([
      ...damageReports,
      { damage_type: "OTHER", damage_location: "OTHER", notes: "" },
    ]);
  };

  const removeDamageReport = (indexToRemove) => {
    setDamageReports(damageReports.filter((_, i) => i !== indexToRemove));
  };

  const updateDamageReport = (index, field, value) => {
    const newDamageReports = damageReports.map((report, i) => {
      if (i === index) {
        return { ...report, [field]: value };
      }
      return report;
    });
    setDamageReports(newDamageReports);
  };

  const clearDamageReports = () => {
    setDamageReports([]);
  };

  return {
    damageReports,
    addDamageReport,
    removeDamageReport,
    updateDamageReport,
    clearDamageReports,
  };
}

export default useDamageReports;
