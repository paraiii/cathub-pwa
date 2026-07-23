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
    // Map the username 'paraiii' to the dummy email 'paraiii@cathub.local'
    const { error } = await supabase.auth.signInWithPassword({
      email: 'paraiii@cathub.local',
      password: password,
    });
    if (error) throw error;
  },
  
  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  isAdmin: async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },
  
  onAuthStateChange: (callback: (isAdmin: boolean) => void) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(!!session);
    });
    return subscription;
  }
};

// Initialize currentCatId from localStorage if available
const savedCatId = localStorage.getItem('current_cat_id');
if (savedCatId) {
  currentCatId = savedCatId;
}
