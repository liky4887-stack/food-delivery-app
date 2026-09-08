import { Heart, MapPin, Tag, Leaf, Settings, ChevronRight, ShoppingBag, Award, TrendingUp, Star } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { useUser, DietaryPreference } from '@/context/UserContext';
import { restaurants } from '@/data/restaurants';
import { StoreCard } from '@/components/StoreCard';

const dietaryOptions: { id: DietaryPreference; label: string; icon: typeof Leaf }[] = [
  { id: 'vegetarian', label: 'Vegetarian', icon: Leaf },
  { id: 'vegan', label: 'Vegan', icon: Leaf },
  { id: 'gluten-free', label: 'Gluten-Free', icon: Leaf },
  { id: 'no-dairy', label: 'No Dairy', icon: Leaf },
  { id: 'no-nuts', label: 'No Nuts', icon: Leaf },
];

export function ProfileScreen() {
  const { state, navigateToScreen, navigateToRestaurant, setShowAddressPicker } = useNavigation();
  const { favorites, dietaryPrefs, toggleDietaryPref, orderHistory, addresses, selectedAddress } = useUser();

  const favoriteRestaurants = restaurants.filter((r) => favorites.includes(r.id));
  const totalOrders = orderHistory.length;
  const totalSpent = orderHistory.reduce((sum, o) => sum + o.total, 0);
  const moneySaved = orderHistory.reduce((sum, o) => sum + o.discount, 0);

  return (
    <div className="px-5 pt-2 pb-2">
      {/* Profile header */}
      <div className="flex items-center gap-3.5 mb-5 mt-2">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[22px] font-bold shrink-0">
          G
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-neutral-900">Welcome back!</h1>
          <p className="text-[13px] text-neutral-500">{selectedAddress?.street || 'Set your address'}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-neutral-50 rounded-2xl p-3.5 text-center border border-neutral-200">
          <ShoppingBag className="w-5 h-5 text-primary-500 mx-auto mb-1" />
          <div className="text-[18px] font-bold text-neutral-900">{totalOrders}</div>
          <div className="text-[11px] text-neutral-500">Orders</div>
        </div>
        <div className="bg-neutral-50 rounded-2xl p-3.5 text-center border border-neutral-200">
          <TrendingUp className="w-5 h-5 text-primary-500 mx-auto mb-1" />
          <div className="text-[18px] font-bold text-neutral-900">${totalSpent.toFixed(0)}</div>
          <div className="text-[11px] text-neutral-500">Spent</div>
        </div>
        <div className="bg-neutral-50 rounded-2xl p-3.5 text-center border border-neutral-200">
          <Award className="w-5 h-5 text-primary-500 mx-auto mb-1" />
          <div className="text-[18px] font-bold text-neutral-900">${moneySaved.toFixed(0)}</div>
          <div className="text-[11px] text-neutral-500">Saved</div>
        </div>
      </div>

      {/* Dietary preferences */}
      <div className="mb-5">
        <h3 className="text-[16px] font-bold text-neutral-900 mb-2.5 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-green-500" />
          Dietary Preferences
        </h3>
        <p className="text-[12px] text-neutral-500 mb-3">Filter menu items to match your diet</p>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map((opt) => {
            const isActive = dietaryPrefs.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggleDietaryPref(opt.id)}
                className={`px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700 border-2 border-green-400'
                    : 'bg-neutral-100 text-neutral-500 border-2 border-transparent'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Favorites */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary-500" />
            Favorites
          </h3>
          {favoriteRestaurants.length > 0 && (
            <span className="text-[13px] text-neutral-500">{favoriteRestaurants.length}</span>
          )}
        </div>
        {favoriteRestaurants.length > 0 ? (
          <div className="space-y-3">
            {favoriteRestaurants.map((r) => (
              <StoreCard
                key={r.id}
                restaurant={r}
                onClick={() => navigateToRestaurant(r.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-neutral-50 rounded-2xl p-6 text-center border border-neutral-200">
            <Heart className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
            <p className="text-[14px] text-neutral-500">No favorites yet</p>
            <p className="text-[12px] text-neutral-400 mt-1">Tap the heart on any restaurant to save it</p>
            <button
              onClick={() => navigateToScreen('home')}
              className="mt-3 text-primary-500 font-semibold text-[13px]"
            >
              Browse Restaurants
            </button>
          </div>
        )}
      </div>

      {/* Settings rows */}
      <div className="space-y-0 mb-5">
        <button
          onClick={() => setShowAddressPicker(true)}
          className="w-full flex items-center gap-3 py-3.5 border-b border-neutral-100 active:bg-neutral-50 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-neutral-600" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-[15px] text-neutral-900">Delivery Addresses</div>
            <div className="text-[12px] text-neutral-500">{addresses.length} saved</div>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-300" />
        </button>

        <button
          onClick={() => navigateToScreen('orders')}
          className="w-full flex items-center gap-3 py-3.5 border-b border-neutral-100 active:bg-neutral-50 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-neutral-600" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-[15px] text-neutral-900">Order History</div>
            <div className="text-[12px] text-neutral-500">{totalOrders} {totalOrders === 1 ? 'order' : 'orders'}</div>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-300" />
        </button>

        <div className="w-full flex items-center gap-3 py-3.5 border-b border-neutral-100">
          <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5 text-neutral-600" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-[15px] text-neutral-900">Promo Codes</div>
            <div className="text-[12px] text-neutral-500">WELCOME10, FREEDEL, SAVE5</div>
          </div>
        </div>

        <div className="w-full flex items-center gap-3 py-3.5">
          <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-neutral-600" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-[15px] text-neutral-900">Settings</div>
            <div className="text-[12px] text-neutral-500">Notifications, preferences</div>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-300" />
        </div>
      </div>
    </div>
  );
}
