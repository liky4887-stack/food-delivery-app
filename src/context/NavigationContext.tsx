import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ScreenName = 'home' | 'search' | 'cart' | 'orders' | 'profile';
export type MenuTab = 'menu' | 'reviews';

interface NavigationState {
  currentScreen: ScreenName;
  restaurantId: string | null;
  productItemId: string | null;
  productRestaurantId: string | null;
  orderConfirmed: boolean;
  activeOrderId: string | null;
  searchQuery: string;
  activeCategory: string;
  showAddressPicker: boolean;
  activeMenuTab: MenuTab;
}

interface NavigationContextType {
  state: NavigationState;
  navigateToScreen: (screen: ScreenName) => void;
  navigateToRestaurant: (restaurantId: string) => void;
  navigateBack: () => void;
  openProduct: (restaurantId: string, itemId: string) => void;
  closeProduct: () => void;
  confirmOrder: (orderId: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  setShowAddressPicker: (show: boolean) => void;
  setActiveMenuTab: (tab: MenuTab) => void;
  clearActiveOrder: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

const initialState: NavigationState = {
  currentScreen: 'home',
  restaurantId: null,
  productItemId: null,
  productRestaurantId: null,
  orderConfirmed: false,
  activeOrderId: null,
  searchQuery: '',
  activeCategory: 'all',
  showAddressPicker: false,
  activeMenuTab: 'menu',
};

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavigationState>(initialState);

  const navigateToScreen = useCallback((screen: ScreenName) => {
    setState((prev) => ({ ...prev, currentScreen: screen, restaurantId: null }));
  }, []);

  const navigateToRestaurant = useCallback((restaurantId: string) => {
    setState((prev) => ({ ...prev, restaurantId, currentScreen: 'home', activeMenuTab: 'menu' }));
  }, []);

  const navigateBack = useCallback(() => {
    setState((prev) => ({ ...prev, restaurantId: null, currentScreen: 'home' }));
  }, []);

  const openProduct = useCallback((restaurantId: string, itemId: string) => {
    setState((prev) => ({ ...prev, productRestaurantId: restaurantId, productItemId: itemId }));
  }, []);

  const closeProduct = useCallback(() => {
    setState((prev) => ({ ...prev, productItemId: null, productRestaurantId: null }));
  }, []);

  const confirmOrder = useCallback((orderId: string) => {
    setState((prev) => ({
      ...prev,
      orderConfirmed: true,
      activeOrderId: orderId,
      restaurantId: null,
      currentScreen: 'orders',
    }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setActiveCategory = useCallback((category: string) => {
    setState((prev) => ({ ...prev, activeCategory: category }));
  }, []);

  const setShowAddressPicker = useCallback((show: boolean) => {
    setState((prev) => ({ ...prev, showAddressPicker: show }));
  }, []);

  const setActiveMenuTab = useCallback((tab: MenuTab) => {
    setState((prev) => ({ ...prev, activeMenuTab: tab }));
  }, []);

  const clearActiveOrder = useCallback(() => {
    setState((prev) => ({ ...prev, orderConfirmed: false, activeOrderId: null }));
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        state,
        navigateToScreen,
        navigateToRestaurant,
        navigateBack,
        openProduct,
        closeProduct,
        confirmOrder,
        setSearchQuery,
        setActiveCategory,
        setShowAddressPicker,
        setActiveMenuTab,
        clearActiveOrder,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}
