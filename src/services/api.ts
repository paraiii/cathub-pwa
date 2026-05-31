export interface WeightRecord {
  id: string;
  weight: number;
  date: string; // ISO string
}

export interface VomitRecord {
  id: string;
  description: string;
  date: string; // ISO string
}

import initialData from '../data.json';

// Temporary mock backend using LocalStorage for the PWA
const STORAGE_KEY = 'cathub_data_v2';

interface StorageData {
  weights: WeightRecord[];
  vomits: VomitRecord[];
}

const getData = (): StorageData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  
  // Initialize with pre-processed JSON data on first load
  saveData(initialData);
  return initialData;
};

const saveData = (data: StorageData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const api = {
  getWeights: async (): Promise<WeightRecord[]> => {
    return getData().weights.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  addWeight: async (weight: number, date: string): Promise<WeightRecord> => {
    const data = getData();
    const newRecord: WeightRecord = { id: Date.now().toString(), weight, date };
    data.weights.push(newRecord);
    saveData(data);
    return newRecord;
  },
  getVomits: async (): Promise<VomitRecord[]> => {
    return getData().vomits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  addVomit: async (description: string, date: string): Promise<VomitRecord> => {
    const data = getData();
    const newRecord: VomitRecord = { id: Date.now().toString(), description, date };
    data.vomits.push(newRecord);
    saveData(data);
    return newRecord;
  }
};
