const API_BASE_URL = 'http://192.168.1.50:5000/api'; // API temel URL'si

// Konteynerleri al
export const fetchContainers = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/containers`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  return response.json();
};

// Yeni konteyner oluştur
export const createContainer = async (data: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/containers/create`, {
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