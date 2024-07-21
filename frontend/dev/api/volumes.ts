const API_BASE_URL = 'http://localhost:5000'; // API temel URL'si

// Tüm volume'leri listele
export const listVolumes = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/volumes`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Yeni bir volume oluştur
export const createVolume = async (data: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/volumes/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Bir volume'ü sil
export const removeVolume = async (volumeName: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/volumes/remove/${volumeName}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Bir volume'ü güncelle
export const updateVolume = async (volumeName: string, data: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/volumes/update/${volumeName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Yeni bir mount oluştur
export const createMount = async (data: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/mounts/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Bir mount'ı sil
export const removeMount = async (mountId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/mounts/remove/${mountId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Bir mount'ı güncelle
export const updateMount = async (mountId: string, data: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/mounts/update/${mountId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
