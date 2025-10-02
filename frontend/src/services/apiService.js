const API_URL = "http://127.0.0.1:8000/api/";

const getAuthToken = () => {
  return import.meta.env.VITE_API_AUTH_TOKEN;
};

export const getEquipmentList = async () => {
  const token = getAuthToken();
  let url = `${API_URL}equipment/`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch equipment list");
  }
  return response.json();
};

export const getPhotos = async (equipmentId = null, page = 1) => {
  const token = getAuthToken();

  let url = `${API_URL}photos/`;

  const params = [];

  if (page) {
    params.push(`page=${page}`);
  }

  if (equipmentId) {
    params.push(`equipment_id=${equipmentId}`);
  }

  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch photos");
  }
  return response.json();
};
