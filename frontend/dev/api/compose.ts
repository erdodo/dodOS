const API_BASE_URL = 'http://localhost:5000'; // API temel URL'si

// Compose dosyalarını listele
export const listComposes = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/composes`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Belirli bir Compose dosyasını al
export const getCompose = async (imageName: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/composes/${imageName}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Compose dosyasını güncelle
export const updateCompose = async (imageName: string, data: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/composes/${imageName}`, {
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

// Compose dosyasını sil
export const deleteCompose = async (imageName: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/composes/${imageName}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};
