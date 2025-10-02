import { useState, useEffect } from "react";
import { getPhotos } from "../services/apiService";
import PhotoList from "../components/ui/PhotoList";
import PageLayout from "../components/layout/Layout";
import Pagination from "../components/ui/Pagination";

// Must match backend/src/config/settings.py PAGE_SIZE
const PAGE_SIZE = 25;

const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPhotos, setTotalPhotos] = useState(0);

  const totalPages = Math.ceil(totalPhotos / PAGE_SIZE);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getPhotos(null, currentPage);
        console.log(`Data for page ${currentPage}:`, data.results);
        setPhotos(data.results);
        setTotalPhotos(data.count);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, [currentPage]);

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold mb-8">Recent Activity</h1>

      <PhotoList photos={photos} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </PageLayout>
  );
};

export default PhotosPage;
