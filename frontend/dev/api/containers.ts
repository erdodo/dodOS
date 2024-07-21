const API_BASE_URL = 'http://192.168.1.50:5000/api'; // API temel URL'si

import { Container } from "@/models";
import toast from 'react-hot-toast';


// Tüm Docker konteynerlarını listele
export const listContainers = async (): Promise<Container[]> => {
  const response = await fetch(`${API_BASE_URL}/containers`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Docker konteyner oluştur
export const createContainer = async (data: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/containers/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    toast.error('Container could not be created');
    throw new Error('Network response was not ok');
  }
  toast.success('Container created successfully');
  return response.json();
};

// Docker konteyner sil
export const removeContainer = async (containerId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/remove/${containerId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Docker konteyner başlat
export const startContainer = async (containerId: string): Promise<void> => {
  const startContainerRequest = async (containerId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/containers/start/${containerId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  }
  await toast.promise(startContainerRequest(containerId), {
    loading: 'Starting container...',
    success: 'Container started successfully',
    error: 'Container could not be started',
  });
};

// Docker konteyner durdur
export const stopContainer = async (containerId: string): Promise<void> => {
  const stopContainerRequest = async (containerId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/containers/stop/${containerId}`, {
      method: 'POST',
    });
    if (!response.ok) {
   
      throw new Error('Network response was not ok');
    }
  }

  await toast.promise(stopContainerRequest(containerId), {  
    loading: 'Stopping container...',
    success: 'Container stopped successfully',
    error: 'Container could not be stopped',
  });
  
};

// Docker konteyner duraklat
export const pauseContainer = async (containerId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/pause/${containerId}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Docker konteyner adını değiştir
export const renameContainer = async (containerId: string, newName: string): Promise<void> => {
  const renameContainerRequest = async (containerId: string, newName: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/rename/${containerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ new_name: newName }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  }
  await toast.promise(renameContainerRequest(containerId, newName), {
    loading: 'Renaming container...',
    success: 'Container renamed successfully',
    error: 'Container could not be renamed',
  });
};

// Docker konteyner kullanıcısını değiştir
export const changeUser = async (containerId: string, newUser: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/change-user/${containerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ new_user: newUser }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Docker konteyner portu ekle
export const addPort = async (containerId: string, port: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/add-port/${containerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ port }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Docker konteyner portunu kaldır
export const removePort = async (containerId: string, port: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/remove-port/${containerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ port }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Docker konteyner portunu güncelle
export const updatePort = async (containerId: string, oldPort: string, newPort: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/update-port/${containerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ old_port: oldPort, new_port: newPort }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Docker konteyner hacmi ekle
export const addContainerVolume = async (containerId: string, volume: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/add-volume/${containerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ volume }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Docker konteyner hacmini kaldır
export const removeContainerVolume = async (containerId: string, volume: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/remove-volume/${containerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ volume }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Docker konteyner loglarını al
export const getLogs = async (containerName: string): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/containers/logs/${containerName}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Docker konteyner yeniden başlatma politikasını güncelle
export const updateRestartPolicy = async (containerId: string, restartPolicy: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/update-restart/${containerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ restart_policy: restartPolicy }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Docker konteyner komutunu ekle
export const addCommand = async (containerId: string, command: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/add-command/${containerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ command }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Docker konteyner komutunu kaldır
export const removeCommand = async (containerId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/remove-command/${containerId}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Docker konteyner komutunu güncelle
export const updateCommand = async (containerId: string, newCommand: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/update-command/${containerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ new_command: newCommand }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Docker konteyner ortam değişkeni ekle
export const addEnvironment = async (containerId: string, env: Record<string, string>): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/add-environment/${containerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ env }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Docker konteyner ortam değişkenini kaldır
export const removeEnvironment = async (containerId: string, env: string[]): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/remove-environment/${containerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ env }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

// Docker konteyner ortam değişkenini güncelle
export const updateEnvironment = async (containerId: string, oldEnv: string, newEnv: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/containers/update-environment/${containerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ old_env: oldEnv, new_env: newEnv }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};
