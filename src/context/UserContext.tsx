import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CartItem } from './CartContext';

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  zip: string;
  instructions: string;
}

export type DietaryPreference = 'vegetarian' | 'vegan' | 'gluten-free' | 'no-dairy' | 'no-nuts';

export interface PastOrder {
  id: string;
  items: CartItem[];
  restaurantName: string;
  restaurantId: string;
  total: number;
  itemCount: number;
  placedAt: number;
  deliveredAt: number | null;
  stage: number;
  address: Address;
  promoCode: string | null;
  discount: number;
  scheduledFor: string | null;
  deliveryType: 'now' | 'scheduled';
}

interface UserContextType {
  favorites: string[];
  toggleFavorite: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;

  orderHistory: PastOrder[];
  addOrder: (order: Omit<PastOrder, 'id' | 'placedAt'>) => string;
  updateOrderStage: (orderId: string, stage: number) => void;

  addresses: Address[];
  selectedAddressId: string | null;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  selectAddress: (id: string) => void;
  selectedAddress: Address | null;

  dietaryPrefs: DietaryPreference[];
  toggleDietaryPref: (pref: DietaryPreference) => void;

  savedPromoCodes: string[];
}

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = 'food-app-user-state';

interface PersistedState {
  favorites: string[];
  orderHistory: PastOrder[];
  addresses: Address[];
  selectedAddressId: string | null;
  dietaryPrefs: DietaryPreference[];
}

function loadState(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    return {};
  }
  return {};
}

function saveState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    return;
  }
}

const defaultAddress: Address = {
  id: 'addr-home',
  label: 'Home',
  street: '123 Main Street',
  city: 'San Francisco, CA',
  zip: '94102',
  instructions: 'Leave at door',
};

export function UserProvider({ children }: { children: ReactNode }) {
  const persisted = loadState();

  const [favorites, setFavorites] = useState<string[]>(persisted.favorites || []);
  const [orderHistory, setOrderHistory] = useState<PastOrder[]>(persisted.orderHistory || []);
  const [addresses, setAddresses] = useState<Address[]>(persisted.addresses || [defaultAddress]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    persisted.selectedAddressId || 'addr-home'
  );
  const [dietaryPrefs, setDietaryPrefs] = useState<DietaryPreference[]>(persisted.dietaryPrefs || []);
  const [savedPromoCodes] = useState<string[]>([]);

  useEffect(() => {
    saveState({ favorites, orderHistory, addresses, selectedAddressId, dietaryPrefs });
  }, [favorites, orderHistory, addresses, selectedAddressId, dietaryPrefs]);

  const toggleFavorite = useCallback((restaurantId: string) => {
    setFavorites((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
  }, []);

  const isFavorite = useCallback(
    (restaurantId: string) => favorites.includes(restaurantId),
    [favorites]
  );

  const addOrder = useCallback((order: Omit<PastOrder, 'id' | 'placedAt'>) => {
    const id = `order-${Date.now()}`;
    const newOrder: PastOrder = { ...order, id, placedAt: Date.now() };
    setOrderHistory((prev) => [newOrder, ...prev]);
    return id;
  }, []);

  const updateOrderStage = useCallback((orderId: string, stage: number) => {
    setOrderHistory((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, stage, deliveredAt: stage >= 3 ? Date.now() : null }
          : o
      )
    );
  }, []);

  const addAddress = useCallback((addr: Omit<Address, 'id'>) => {
    const id = `addr-${Date.now()}`;
    setAddresses((prev) => [...prev, { ...addr, id }]);
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    setSelectedAddressId((curr) => (curr === id ? null : curr));
  }, []);

  const selectAddress = useCallback((id: string) => {
    setSelectedAddressId(id);
  }, []);

  const toggleDietaryPref = useCallback((pref: DietaryPreference) => {
    setDietaryPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  }, []);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || null;

  return (
    <UserContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        orderHistory,
        addOrder,
        updateOrderStage,
        addAddress,
        removeAddress,
        selectAddress,
        selectedAddress,
        dietaryPrefs,
        toggleDietaryPref,
        savedPromoCodes,
        addresses,
        selectedAddressId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
