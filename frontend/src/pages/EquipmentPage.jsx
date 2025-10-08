import { useState, useEffect } from "react";
import { getEquipmentList } from "../services/apiService";
import SearchBar from "../components/ui/SearchBar";
import EquipmentList from "../components/ui/EquipmentList";
import PageLayout from "../components/layout/Layout";

const EquipmentPage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await getEquipmentList();
        console.log("Full API response:", data);
        setEquipmentList(data.results);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const filteredEquipment = equipmentList.filter((equipment) => {
    return equipment.name.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold mb-6">Equipment</h1>

      <div className="mb-6">
        <SearchBar searchText={searchText} setSearchText={setSearchText} />
      </div>

      {loading ? (
        <div className="text-center text-gray-500 mt-8">Loading...</div>
      ) : (
        <EquipmentList equipment={filteredEquipment} />
      )}
    </PageLayout>
  );
};

export default EquipmentPage;
