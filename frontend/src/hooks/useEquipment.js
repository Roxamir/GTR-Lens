import { useState, useEffect } from "react";
import { getEquipmentList } from "../services/apiService";

function useEquipmentSelection(preSelectedId) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const data = await getEquipmentList();
        setEquipmentList(data.results);

        if (preSelectedId) {
          const equipment = data.results.find(
            (eq) => eq.id === parseInt(preSelectedId)
          );
          setSelectedEquipment(equipment);
        }
      } catch (error) {
        console.error("Error fetching equipment:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [preSelectedId]);

  return {
    equipmentList,
    selectedEquipment,
    setSelectedEquipment,
    loading,
    error,
  };
}

export default useEquipmentSelection;
