const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const getPresignedUploadUrl = async (fileName, fileType) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}generate-upload-url/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file_name: fileName, file_type: fileType }),
  });

  if (!response.ok) {
    throw new Error("Failed to get pre-signed URL");
  }
  return response.json();
};

const uploadFileToS3 = async (file, fileType) => {
  if (!file) return null;

  const presignedData = await getPresignedUploadUrl(file.name, fileType);

  const s3FormData = new FormData();
  Object.entries(presignedData.fields).forEach(([key, value]) => {
    s3FormData.append(key, value);
  });
  s3FormData.append("file", file);

  const s3Response = await fetch(presignedData.url, {
    method: "POST",
    body: s3FormData,
  });

  if (!s3Response.ok) {
    throw new Error(`Failed to upload ${file.name} to S3.`);
  }

  return presignedData.fields.key;
};

const getEquipmentList = async () => {
  const token = getAuthToken();
  let url = `${API_BASE_URL}equipment/`;
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

  let url = `${API_BASE_URL}photos/`;

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
  let url = `${API_BASE_URL}photos/bulk_upload/`;

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
  const url = `${API_BASE_URL}photos/submit_damage_reports/`;

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
  getPresignedUploadUrl,
  uploadFileToS3,
};
