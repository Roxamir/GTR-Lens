const API_URL = "http://127.0.0.1:8000/api/";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const getEquipmentList = async () => {
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

const getPhotos = async (equipmentId = null, page = 1) => {
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

const uploadConditionPhotos = async (formData) => {
  const token = getAuthToken();
  let url = `${API_URL}photos/bulk_upload/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to submit form");
  }

  return response.json();
};

const uploadDamageReports = async (formData) => {
  const token = getAuthToken();
  const url = `${API_URL}photos/submit_damage_reports/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to submit damage reports");
  }

  return response.json();
};

export {
  uploadConditionPhotos,
  getEquipmentList,
  getPhotos,
  uploadDamageReports,
};
