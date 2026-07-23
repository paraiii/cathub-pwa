import { supabase } from './supabase';

export interface Cat {
  id: string;
  name: string;
  avatarColor: string;
}

export interface WeightRecord {
  id: string;
  catId?: string;
  weight: number;
  date: string; // ISO string
}

export interface VomitRecord {
  id: string;
  catId?: string;
  description: string;
  date: string; // ISO string
}

let currentCatId = 'c0000000-0000-0000-0000-000000000001';

export const api = {
  getCats: async (): Promise<Cat[]> => {
    const { data, error } = await supabase.from('cats').select('*');
    if (error) throw error;
    return data.map(d => ({ id: d.id, name: d.name, avatarColor: d.avatar_color }));
  },
  
  getCurrentCat: async (): Promise<Cat | undefined> => {
    const { data } = await supabase.from('cats').select('*').eq('id', currentCatId).single();
    if (data) {
      return { id: data.id, name: data.name, avatarColor: data.avatar_color };
    }
    
    // Fallback to first cat if not found
    const { data: firstCat } = await supabase.from('cats').select('*').limit(1).single();
    if (firstCat) {
      currentCatId = firstCat.id;
      return { id: firstCat.id, name: firstCat.name, avatarColor: firstCat.avatar_color };
    }
    return undefined;
  },
  
  setCurrentCatId: async (id: string): Promise<void> => {
    currentCatId = id;
    localStorage.setItem('current_cat_id', id);
  },
  
  addCat: async (name: string, avatarColor: string): Promise<Cat> => {
    const { data, error } = await supabase.from('cats').insert([{ name, avatar_color: avatarColor }]).select().single();
    if (error) throw error;
    const cat = { id: data.id, name: data.name, avatarColor: data.avatar_color };
    currentCatId = cat.id;
    return cat;
  },
  
  updateCat: async (id: string, name: string): Promise<void> => {
    const { error } = await supabase.from('cats').update({ name }).eq('id', id);
    if (error) throw error;
  },
  
  getWeights: async (): Promise<WeightRecord[]> => {
    const { data, error } = await supabase
      .from('weights')
      .select('*')
      .eq('cat_id', currentCatId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data.map(d => ({ id: d.id, catId: d.cat_id, weight: d.weight, date: d.date }));
  },
  
  addWeight: async (weight: number, date: string): Promise<WeightRecord> => {
    const { data, error } = await supabase
      .from('weights')
      .insert([{ cat_id: currentCatId, weight, date }])
      .select()
      .single();
    if (error) throw error;
    return { id: data.id, catId: data.cat_id, weight: data.weight, date: data.date };
  },
  
  updateWeight: async (id: string, weight: number, date: string): Promise<void> => {
    const { error } = await supabase
      .from('weights')
      .update({ weight, date })
      .eq('id', id);
    if (error) throw error;
  },
  
  deleteWeight: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('weights')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
  
  getVomits: async (): Promise<VomitRecord[]> => {
    const { data, error } = await supabase
      .from('vomits')
      .select('*')
      .eq('cat_id', currentCatId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data.map(d => ({ id: d.id, catId: d.cat_id, description: d.description, date: d.date }));
  },
  
  addVomit: async (description: string, date: string): Promise<VomitRecord> => {
    const { data, error } = await supabase
      .from('vomits')
      .insert([{ cat_id: currentCatId, description, date }])
      .select()
      .single();
    if (error) throw error;
    return { id: data.id, catId: data.cat_id, description: data.description, date: data.date };
  },
  
  updateVomit: async (id: string, description: string, date: string): Promise<void> => {
    const { error } = await supabase
      .from('vomits')
      .update({ description, date })
      .eq('id', id);
    if (error) throw error;
  },
  
  deleteVomit: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('vomits')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
  
  // --- Auth Methods ---
  login: async (password: string): Promise<void> => {
    // 1. Fetch the user from custom table
    const { data, error } = await supabase
      .from('admin_users')
      .select('password_hash')
      .eq('username', 'paraiii')
      .single();
      
    if (error || !data) {
      throw new Error('Admin user not found in database.');
    }

    // 2. Hash the input password using SHA-256 to compare
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // 3. Compare (supports both plain text if user stored it that way, or SHA256)
    if (data.password_hash !== password && data.password_hash !== hashHex) {
      throw new Error('Incorrect password');
    }

    // 4. Login successful, set local session
    localStorage.setItem('cat_admin_session', 'true');
    // Notify listeners
    authListeners.forEach(listener => listener(true));
  },
  
  logout: async (): Promise<void> => {
    localStorage.removeItem('cat_admin_session');
    authListeners.forEach(listener => listener(false));
  },
  
  isAdmin: async (): Promise<boolean> => {
    return localStorage.getItem('cat_admin_session') === 'true';
  },
  
  onAuthStateChange: (callback: (isAdmin: boolean) => void) => {
    authListeners.push(callback);
    return {
      unsubscribe: () => {
        authListeners = authListeners.filter(l => l !== callback);
      }
    };
  }
};

let authListeners: Array<(isAdmin: boolean) => void> = [];

// Initialize currentCatId from localStorage if available
const savedCatId = localStorage.getItem('current_cat_id');
if (savedCatId) {
  currentCatId = savedCatId;
}
