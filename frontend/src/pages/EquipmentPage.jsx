import { useState } from "react";
import SearchBar from "../components/ui/SearchBar";
import EquipmentList from "../components/ui/EquipmentList";
import PageLayout from "../components/layout/PageLayout";
import useEquipment from "../hooks/useEquipment";

const EquipmentPage = () => {
  const { equipmentList, error } = useEquipment();
  const [searchText, setSearchText] = useState("");

  const filteredEquipment = equipmentList.filter((equipment) => {
    return equipment.name.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold mb-6">Equipment</h1>

      <div className="mb-6">
        <SearchBar searchText={searchText} setSearchText={setSearchText} />
      </div>

      {error && <div className="text-center text-red-500 mt-8">{error}</div>}

      <EquipmentList equipment={filteredEquipment} />
    </PageLayout>
  );
};

export default EquipmentPage;
