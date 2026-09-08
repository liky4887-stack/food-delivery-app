import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface CartItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  itemId: string;
  name: string;
  description: string;
  price: number;
  basePrice: number;
  image: string;
  quantity: number;
  selectedCustomizations: { groupName: string; optionLabel: string; optionPrice: number }[];
  specialInstructions: string;
}

export interface PromoCode {
  code: string;
  description: string;
  type: 'percent' | 'fixed' | 'free-delivery';
  value: number;
}

export const promoCodes: Record<string, PromoCode> = {
  WELCOME10: { code: 'WELCOME10', description: '10% off your order', type: 'percent', value: 10 },
  FREEDEL: { code: 'FREEDEL', description: 'Free delivery', type: 'free-delivery', value: 0 },
  SAVE5: { code: 'SAVE5', description: '$5 off orders $20+', type: 'fixed', value: 5 },
};

export type DeliveryType = 'now' | 'scheduled';

interface CartContextType {
  items: CartItem[];
  addItem: (
    restaurantId: string,
    restaurantName: string,
    item: any,
    quantity: number,
    selectedCustomizations: any[],
    specialInstructions: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  currentRestaurantId: string | null;
  appliedPromo: PromoCode | null;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  discount: number;
  deliveryType: DeliveryType;
  setDeliveryType: (type: DeliveryType) => void;
  scheduledTime: string | null;
  setScheduledTime: (time: string | null) => void;
  loadCartFromOrder: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | null>(null);

function generateCartItemId(restaurantId: string, itemId: string, customizations: any[], instructions: string): string {
  const customizationKey = customizations.map((c) => c.optionLabel).join(',');
  return `${restaurantId}-${itemId}-${customizationKey}-${instructions}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('now');
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);

  const addItem = useCallback(
    (
      restaurantId: string,
      restaurantName: string,
      item: any,
      quantity: number,
      selectedCustomizations: any[],
      specialInstructions: string
    ) => {
      const customizationPrice = selectedCustomizations.reduce((sum, c) => sum + c.optionPrice, 0);
      const unitPrice = item.price + customizationPrice;
      const cartItemId = generateCartItemId(restaurantId, item.id, selectedCustomizations, specialInstructions);

      setItems((prev) => {
        const existing = prev.find((i) => i.id === cartItemId);
        if (existing) {
          return prev.map((i) => (i.id === cartItemId ? { ...i, quantity: i.quantity + quantity } : i));
        }
        return [
          ...prev,
          {
            id: cartItemId,
            restaurantId,
            restaurantName,
            itemId: item.id,
            name: item.name,
            description: item.description,
            price: unitPrice,
            basePrice: item.price,
            image: item.image,
            quantity,
            selectedCustomizations,
            specialInstructions,
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((i) => {
          if (i.id === cartItemId) {
            return { ...i, quantity: i.quantity + delta };
          }
          return i;
        })
        .filter((i) => i.quantity > 0);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedPromo(null);
    setDeliveryType('now');
    setScheduledTime(null);
  }, []);

  const applyPromo = useCallback((code: string) => {
    const upper = code.toUpperCase().trim();
    if (promoCodes[upper]) {
      setAppliedPromo(promoCodes[upper]);
      return true;
    }
    return false;
  }, []);

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
  }, []);

  const loadCartFromOrder = useCallback((orderItems: CartItem[]) => {
    setItems(orderItems.map((item) => ({ ...item })));
    setAppliedPromo(null);
    setDeliveryType('now');
    setScheduledTime(null);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const discount = appliedPromo
    ? appliedPromo.type === 'percent'
      ? subtotal * (appliedPromo.value / 100)
      : appliedPromo.type === 'fixed'
      ? subtotal >= 20 ? appliedPromo.value : 0
      : 0
    : 0;

  const currentRestaurantId = items.length > 0 ? items[0].restaurantId : null;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        currentRestaurantId,
        appliedPromo,
        applyPromo,
        removePromo,
        discount,
        deliveryType,
        setDeliveryType,
        scheduledTime,
        setScheduledTime,
        loadCartFromOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
