import EquipmentCard from "./EquipmentCard";

const EquipmentList = ({ equipment }) => {
  if (equipment.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">No equipment found.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {equipment.map((item) => (
        <EquipmentCard key={item.id} equipment={item} />
      ))}
    </div>
  );
};

export default EquipmentList;
