const API_BASE_URL = process.env.API_URL 
// Yedek Listeleme
export const listBackups = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/backup/list`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  
  // Yedek Silme
  export const deleteBackup = async (containerName: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/backup/delete/${containerName}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  
  // Yedek Oluşturma
  export const createBackup = async (containerName: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/backup/create/${containerName}`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  
  // Geri Yükleme
  export const restoreBackup = async (containerName: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/restore/${containerName}`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  
  // Konteyner Bilgisi Alma (Ek olarak, eğer bu API fonksiyonu varsa)
  export const getContainerInfo = async (containerName: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/containers/${containerName}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };