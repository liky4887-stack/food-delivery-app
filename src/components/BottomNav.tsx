import { Home, Search, ShoppingCart, Receipt, User } from 'lucide-react';
import { useNavigation, ScreenName } from '@/context/NavigationContext';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';

interface BottomNavProps {
  hasActiveOrder: boolean;
}

export function BottomNav({ hasActiveOrder }: BottomNavProps) {
  const { state, navigateToScreen } = useNavigation();
  const { totalItems } = useCart();
  const { orderHistory } = useUser();

  const hasOrders = orderHistory.length > 0;

  const tabs: { screen: ScreenName; label: string; icon: typeof Home; badge?: number }[] = [
    { screen: 'home', label: 'Home', icon: Home },
    { screen: 'search', label: 'Search', icon: Search },
    { screen: 'cart', label: 'Cart', icon: ShoppingCart, badge: totalItems },
    { screen: 'orders', label: 'Orders', icon: Receipt, badge: hasOrders ? orderHistory.length : undefined },
    { screen: 'profile', label: 'Profile', icon: User },
  ];

  const isOnRestaurantPage = state.restaurantId !== null;

  const handleTabClick = (screen: ScreenName) => {
    navigateToScreen(screen);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[72px] bg-white border-t border-neutral-200 flex justify-around items-center pb-2 z-30">
      {tabs.map((tab) => {
        const isActive = state.currentScreen === tab.screen && !isOnRestaurantPage;
        const Icon = tab.icon;
        const badgeCount = tab.badge;
        return (
          <button
            key={tab.screen}
            onClick={() => handleTabClick(tab.screen)}
            className="flex flex-col items-center gap-0.5 transition-colors"
          >
            <div className="relative">
              <Icon
                className={isActive ? 'text-primary-500' : 'text-neutral-400'}
                style={{ width: 22, height: 22 }}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {badgeCount !== undefined && badgeCount > 0 && (
                <span
                  key={badgeCount}
                  className={`absolute -top-1.5 -right-1.5 rounded-full w-[18px] h-[18px] text-[10px] font-bold flex items-center justify-center ${
                    tab.screen === 'cart'
                      ? 'bg-primary-500 text-white animate-bounce-in'
                      : 'bg-neutral-400 text-white'
                  }`}
                >
                  {badgeCount}
                </span>
              )}
            </div>
            <span
              className={`text-[11px] ${isActive ? 'text-primary-500 font-semibold' : 'text-neutral-400'}`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
