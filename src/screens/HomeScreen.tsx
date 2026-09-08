import { MapPin, Search as SearchIcon, ChevronDown, Crown, Store, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { categories, restaurants } from '@/data/restaurants';
import { StoreCard } from '@/components/StoreCard';
import { useNavigation } from '@/context/NavigationContext';
import { useUser } from '@/context/UserContext';

export function HomeScreen() {
  const { state, navigateToRestaurant, navigateToScreen, setActiveCategory, setShowAddressPicker } = useNavigation();
  const { favorites, selectedAddress } = useUser();
  const [searchValue, setSearchValue] = useState('');

  const filtered = state.activeCategory === 'all'
    ? restaurants
    : restaurants.filter((r) => r.categories.includes(state.activeCategory));

  const dashPassRestaurants = restaurants.filter((r) => r.dashPass);
  const favoriteRestaurants = restaurants.filter((r) => favorites.includes(r.id));

  const handleSearchFocus = () => {
    navigateToScreen('search');
  };

  return (
    <div className="px-5 pb-2">
      {/* Location */}
      <div className="flex justify-between items-center mt-1 mb-3">
        <button
          onClick={() => setShowAddressPicker(true)}
          className="flex items-center gap-1.5 text-left active:opacity-70"
        >
          <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
          <div>
            <div className="text-[17px] font-bold text-neutral-900 leading-tight flex items-center">
              {selectedAddress ? selectedAddress.street : 'Set Address'}
              <ChevronDown className="w-4 h-4 ml-0.5 text-neutral-400" />
            </div>
            <div className="text-[12px] text-neutral-500">
              {selectedAddress ? selectedAddress.city : 'Tap to choose'}
            </div>
          </div>
        </button>
      </div>

      {/* Search */}
      <div
        className="bg-neutral-100 rounded-full px-4 py-3 flex items-center gap-2.5 mb-4 cursor-text"
        onClick={handleSearchFocus}
      >
        <SearchIcon className="w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search restaurants, dishes..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={handleSearchFocus}
          className="bg-transparent text-[15px] w-full outline-none placeholder:text-neutral-400"
          readOnly
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-3.5 mb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors ${
              state.activeCategory === cat.id
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-700'
            }`}
            style={{ paddingLeft: 18, paddingRight: 18 }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Action row */}
      <div className="flex gap-3 mb-4">
        <button className="flex-1 bg-primary-500 rounded-2xl py-2.5 text-center font-semibold text-[13px] text-white flex items-center justify-center gap-1.5">
          <Crown className="w-4 h-4" />
          DashPass
        </button>
        <button className="flex-1 bg-neutral-100 rounded-2xl py-2.5 text-center font-semibold text-[13px] text-neutral-900 flex items-center justify-center gap-1.5">
          <Store className="w-4 h-4" />
          Pickup
        </button>
        <button className="flex-1 bg-neutral-100 rounded-2xl py-2.5 text-center font-semibold text-[13px] text-neutral-900 flex items-center justify-center gap-1.5">
          <Star className="w-4 h-4" />
          Top Rated
        </button>
      </div>

      {/* DashPass exclusive card */}
      <div className="bg-neutral-900 rounded-2xl p-4 mb-4 text-white">
        <span className="bg-primary-500 px-3 py-0.5 rounded-full text-[10px] font-bold inline-block mb-1.5">
          DASHPASS EXCLUSIVE
        </span>
        <div className="text-[16px] font-bold">Save $10 on your next 3 orders</div>
        <div className="text-[13px] text-neutral-300 mt-0.5">Zero delivery fees on orders $12+</div>
        <div className="text-[12px] text-primary-300 mt-2 font-semibold">Use code WELCOME10 for 10% off</div>
      </div>

      {/* Favorites section */}
      {state.activeCategory === 'all' && favoriteRestaurants.length > 0 && (
        <>
          <div className="flex justify-between items-baseline mb-3">
            <h3 className="text-[18px] font-bold text-neutral-900 flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-primary-500 text-primary-500" />
              Your Favorites
            </h3>
          </div>
          <div className="space-y-3 mb-2">
            {favoriteRestaurants.map((restaurant) => (
              <StoreCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => navigateToRestaurant(restaurant.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Restaurants */}
      <div className="flex justify-between items-baseline mb-3 mt-5">
        <h3 className="text-[18px] font-bold text-neutral-900">
          {state.activeCategory === 'all' ? 'Popular Near You' : `${categories.find((c) => c.id === state.activeCategory)?.name} Restaurants`}
        </h3>
      </div>

      <div className="space-y-3">
        {filtered.map((restaurant) => (
          <StoreCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => navigateToRestaurant(restaurant.id)}
          />
        ))}
      </div>

      {/* DashPass section */}
      {state.activeCategory === 'all' && (
        <>
          <div className="flex justify-between items-baseline mt-5 mb-3">
            <h3 className="text-[18px] font-bold text-neutral-900">DashPass Restaurants</h3>
            <button className="text-primary-500 text-[14px] font-semibold">See all</button>
          </div>
          <div className="space-y-3">
            {dashPassRestaurants.slice(0, 3).map((restaurant) => (
              <StoreCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => navigateToRestaurant(restaurant.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
