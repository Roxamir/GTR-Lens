import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPhotos, getEquipmentList } from "../services/apiService";
import { HiArrowLeftCircle } from "react-icons/hi2";
import ImageModal from "../components/ui/ImageModal";
import Button from "../components/ui/Button";
import PageLayout from "../components/layout/Layout";
import PhotoList from "../components/ui/PhotoList";
import EquipmentInfo from "../components/ui/EquipmentInfo";
import DamageReportList from "../components/ui/DamageReportList";

const EquipmentDetailPage = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [damageReports, setDamageReports] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [displayCount, setDisplayCount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allEquipment = await getEquipmentList();
        const thisEquipment = allEquipment.results.find(
          (eq) => eq.id === parseInt(id)
        );
        setEquipment(thisEquipment);
        setDamageReports(thisEquipment.damage_reports);

        // get first 25 photos
        const photosData = await getPhotos(id, 1);
        setPhotos(photosData.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const visiblePhotos = photos.slice(0, displayCount);

  const hasMore = displayCount < photos.length;

  return (
    <PageLayout>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="icon" onClick={() => navigate(-1)}>
          <HiArrowLeftCircle className="size-8" />
        </Button>
        <h1 className="text-3xl font-bold">{equipment?.name} Details</h1>
      </div>

      {equipment && <EquipmentInfo equipment={equipment} />}
      <div className="mt-6">
        <PhotoList
          photos={visiblePhotos}
          setSelectedImage={handleImageSelect}
        />
        <Button
          className={`${!hasMore ? "hidden" : ""} mt-6`}
          onClick={handleLoadMore}
        >
          Load More
        </Button>
        <div className="mt-6">
          <DamageReportList
            damageReports={damageReports}
            setSelectedImage={handleImageSelect}
            className="mt-6"
          />
        </div>

        {selectedImage && (
          <ImageModal
            image={selectedImage}
            isModalOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default EquipmentDetailPage;
