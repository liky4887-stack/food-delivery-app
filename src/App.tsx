import { CartProvider } from '@/context/CartContext';
import { NavigationProvider, useNavigation } from '@/context/NavigationContext';
import { UserProvider } from '@/context/UserContext';
import { ToastProvider } from '@/context/ToastContext';
import { StatusBar } from '@/components/StatusBar';
import { BottomNav } from '@/components/BottomNav';
import { AddressPicker } from '@/components/AddressPicker';
import { HomeScreen } from '@/screens/HomeScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { CartScreen } from '@/screens/CartScreen';
import { OrdersScreen } from '@/screens/OrdersScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { RestaurantMenuScreen } from '@/screens/RestaurantMenuScreen';
import { ProductDetail } from '@/screens/ProductDetail';

function AppContent() {
  const { state } = useNavigation();
  const hasActiveOrder = state.orderConfirmed;

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'search':
        return <SearchScreen />;
      case 'cart':
        return <CartScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center items-center">
      {/* Phone frame */}
      <div className="relative w-full max-w-[390px] h-[844px] max-h-screen bg-white overflow-hidden flex flex-col shadow-2xl sm:rounded-[40px]">
        <StatusBar />

        {/* Main scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative pb-[72px]">
          {renderScreen()}
        </div>

        {/* Restaurant menu overlay */}
        {state.restaurantId && (
          <RestaurantMenuScreen restaurantId={state.restaurantId} />
        )}

        {/* Product detail overlay */}
        {state.productItemId && state.productRestaurantId && (
          <ProductDetail
            restaurantId={state.productRestaurantId}
            itemId={state.productItemId}
          />
        )}

        {/* Address picker overlay */}
        <AddressPicker />

        {/* Bottom nav */}
        <BottomNav hasActiveOrder={hasActiveOrder} />
      </div>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <ToastProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </ToastProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
