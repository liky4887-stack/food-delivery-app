import { ShoppingCart, ChevronRight } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { useCart } from '@/context/CartContext';

export function CartBar({ restaurantId }: { restaurantId: string }) {
  const { navigateToScreen } = useNavigation();
  const { items, subtotal } = useCart();

  const cartItemsForThisRestaurant = items.filter((i) => i.restaurantId === restaurantId);
  const count = cartItemsForThisRestaurant.reduce((sum, i) => sum + i.quantity, 0);
  const restaurantSubtotal = cartItemsForThisRestaurant.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (count === 0) return null;

  return (
    <div className="absolute bottom-[72px] left-3 right-3 z-20 animate-slide-up">
      <button
        onClick={() => navigateToScreen('cart')}
        className="w-full bg-primary-500 text-white rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-lg active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-white text-primary-500 rounded-full w-4 h-4 text-[10px] font-bold flex items-center justify-center">
              {count}
            </span>
          </div>
          <span className="text-[15px] font-semibold">View Cart</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[15px] font-bold">${restaurantSubtotal.toFixed(2)}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}
