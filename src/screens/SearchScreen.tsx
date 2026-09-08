import { ArrowLeft, Search as SearchIcon, X, Star, Utensils } from 'lucide-react';
import { useState, useMemo } from 'react';
import { restaurants, getDishResults } from '@/data/restaurants';
import { StoreCard } from '@/components/StoreCard';
import { useNavigation } from '@/context/NavigationContext';

export function SearchScreen() {
  const { navigateToScreen, navigateToRestaurant, openProduct } = useNavigation();
  const [query, setQuery] = useState('');
  const [recentSearches] = useState(['Burgers', 'Sushi', 'Pizza', 'Healthy', 'Tacos']);
  const [activeFilter, setActiveFilter] = useState<'all' | 'restaurants' | 'dishes'>('all');

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.menu.some((item) => item.name.toLowerCase().includes(q))
    );
  }, [query]);

  const dishResults = useMemo(() => {
    if (!query.trim() || activeFilter === 'restaurants') return [];
    return getDishResults(query);
  }, [query, activeFilter]);

  const popularSearches = ['Burgers', 'Sushi', 'Pizza', 'Salad', 'Wings', 'Ramen', 'Tacos'];

  const showResults = query.trim() && (filteredResults.length > 0 || dishResults.length > 0);

  return (
    <div className="px-5 pt-2 pb-2">
      {/* Search header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigateToScreen('home')}
          className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition-transform shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-900" />
        </button>
        <div className="flex-1 bg-neutral-100 rounded-full px-4 py-2.5 flex items-center gap-2.5">
          <SearchIcon className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search restaurants, dishes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="bg-transparent text-[15px] w-full outline-none placeholder:text-neutral-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="shrink-0">
              <X className="w-4 h-4 text-neutral-400" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {query.trim() ? (
        showResults ? (
          <div className="space-y-4">
            <p className="text-[13px] text-neutral-500">
              {filteredResults.length + dishResults.length} {(filteredResults.length + dishResults.length) === 1 ? 'result' : 'results'} for "{query}"
            </p>

            {/* Filter tabs */}
            <div className="flex gap-2.5">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                  activeFilter === 'all' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('restaurants')}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                  activeFilter === 'restaurants' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                Restaurants
              </button>
              <button
                onClick={() => setActiveFilter('dishes')}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                  activeFilter === 'dishes' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                Dishes
              </button>
            </div>

            {/* Dish results */}
            {activeFilter !== 'restaurants' && dishResults.length > 0 && (
              <div>
                <h3 className="text-[15px] font-bold text-neutral-900 mb-2.5 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-primary-500" />
                  Dishes ({dishResults.length})
                </h3>
                <div className="space-y-2.5">
                  {dishResults.map(({ item, restaurant }) => (
                    <div
                      key={`${restaurant.id}-${item.id}`}
                      onClick={() => openProduct(restaurant.id, item.id)}
                      className="flex gap-3 bg-neutral-50 rounded-2xl p-3 border border-neutral-200 active:scale-[0.98] transition-transform cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-200 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[15px] text-neutral-900 truncate">{item.name}</div>
                        <div className="text-[12px] text-neutral-500 truncate">{restaurant.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-[14px] text-neutral-900">${item.price.toFixed(2)}</span>
                          {item.itemRating && (
                            <span className="flex items-center gap-0.5 text-[12px] text-neutral-500">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {item.itemRating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Restaurant results */}
            {activeFilter !== 'dishes' && filteredResults.length > 0 && (
              <div>
                <h3 className="text-[15px] font-bold text-neutral-900 mb-2.5">Restaurants ({filteredResults.length})</h3>
                <div className="space-y-3">
                  {filteredResults.map((r) => (
                    <StoreCard
                      key={r.id}
                      restaurant={r}
                      onClick={() => navigateToRestaurant(r.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <SearchIcon className="w-12 h-12 text-neutral-200 mb-3" />
            <p className="text-[15px] text-neutral-500">No results for "{query}"</p>
            <p className="text-[13px] text-neutral-400 mt-1">Try a different search term</p>
          </div>
        )
      ) : (
        <>
          {/* Recent searches */}
          <div className="mb-5">
            <h3 className="text-[15px] font-bold text-neutral-900 mb-2.5">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="bg-neutral-100 px-3.5 py-2 rounded-full text-[14px] text-neutral-700 active:scale-95 transition-transform"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Popular searches */}
          <div>
            <h3 className="text-[15px] font-bold text-neutral-900 mb-2.5">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="bg-primary-50 text-primary-600 px-3.5 py-2 rounded-full text-[14px] font-medium active:scale-95 transition-transform"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* All restaurants */}
          <div className="mt-6">
            <h3 className="text-[16px] font-bold text-neutral-900 mb-3">All Restaurants</h3>
            <div className="space-y-3">
              {restaurants.map((r) => (
                <StoreCard
                  key={r.id}
                  restaurant={r}
                  onClick={() => navigateToRestaurant(r.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
