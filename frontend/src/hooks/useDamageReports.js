import { useCallback, useState } from "react";

function useDamageReports(initialReports = []) {
  const [damageReports, setDamageReports] = useState(initialReports);

  const addDamageReport = useCallback(() => {
    setDamageReports((prev) => [
      ...prev,
      {
        damage_location: "OTHER",
        damage_type: "OTHER",
        notes: "",
        photo: null,
      },
    ]);
  }, []);

  const removeDamageReport = useCallback((indexToRemove) => {
    setDamageReports((prev) => prev.filter((_, i) => i !== indexToRemove));
  }, []);

  const updateDamageReport = useCallback((index, field, value) => {
    setDamageReports((prev) =>
      prev.map((report, i) => {
        if (i === index) {
          return { ...report, [field]: value };
        }
        return report;
      })
    );
  }, []);

  const updateDamagePhoto = useCallback((index, file) => {
    setDamageReports((prev) =>
      prev.map((report, i) => {
        if (i === index) {
          return { ...report, photo: file };
        }
        return report;
      })
    );
  }, []);

  const clearDamageReports = useCallback(() => {
    setDamageReports([]);
  }, []);

  return {
    damageReports,
    addDamageReport,
    removeDamageReport,
    updateDamageReport,
    updateDamagePhoto,
    clearDamageReports,
  };
}

export default useDamageReports;
