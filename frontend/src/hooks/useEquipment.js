import { useState, useEffect } from "react";
import { getEquipmentList } from "../services/apiService";

function useEquipment(preSelectedId) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
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
      }
    };

    fetchEquipment();
  }, [preSelectedId]);

  return {
    equipmentList,
    selectedEquipment,
    setSelectedEquipment,
    error,
  };
}

export default useEquipment;
