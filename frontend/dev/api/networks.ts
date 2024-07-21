const API_BASE_URL = process.env.API_URL

// Tüm Docker ağlarını listele
export const listNetworks = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/networks`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Yeni bir Docker ağı oluştur
export const createNetwork = async (data: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/networks/create`, {
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

// Bir Docker ağını sil
export const removeNetwork = async (networkId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/networks/remove/${networkId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Bir Docker ağını güncelle
export const updateNetwork = async (networkId: string, data: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/networks/update/${networkId}`, {
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
