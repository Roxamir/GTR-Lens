const API_URL = "http://127.0.0.1:8000/api/";

const getAuthToken = () => {
  return import.meta.env.VITE_API_AUTH_TOKEN;
};

export const getEquipmentList = async () => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}equipment/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch equipment list");
  }
  return response.json();
};
