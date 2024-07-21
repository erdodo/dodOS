const API_BASE_URL = process.env.API_URL

// Tüm mağazaları listele
export const listStores = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/store`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Tek bir mağazayı al
export const getStore = async (imageName: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/store/${imageName}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Yeni bir mağaza ekle
export const addStore = async (imageName: string, data: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/store/${imageName}`, {
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

// Bir mağazayı sil
export const deleteStore = async (imageName: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/store/${imageName}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Bir mağazayı güncelle
export const updateStore = async (imageName: string, data: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/store/${imageName}`, {
    method: 'PUT',
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

// Bir mağazayı başlat
export const startStore = async (imageName: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/store/${imageName}/up`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Bir mağazayı durdur
export const stopStore = async (imageName: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/store/${imageName}/down`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
