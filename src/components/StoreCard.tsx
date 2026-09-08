import { Star, Clock, Bike, MapPin, Heart } from 'lucide-react';
import { Restaurant } from '@/data/restaurants';
import { useUser } from '@/context/UserContext';

interface StoreCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export function StoreCard({ restaurant, onClick }: StoreCardProps) {
  const { isFavorite, toggleFavorite } = useUser();
  const fav = isFavorite(restaurant.id);

  return (
    <div
      onClick={onClick}
      className="flex gap-3.5 bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0 bg-neutral-200">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(restaurant.id);
          }}
          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center active:scale-80 transition-transform"
        >
          <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-primary-500 text-primary-500' : 'text-neutral-600'}`} />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[15px] text-neutral-900 truncate">{restaurant.name}</div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[13px] text-neutral-600 mt-1">
          <span className="font-semibold text-neutral-900 flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-primary-500 text-primary-500" />
            {restaurant.rating}
            <span className="font-normal text-neutral-500">({restaurant.ratingCount.toLocaleString()})</span>
          </span>
          <span className="flex items-center gap-0.5">
            <Clock className="w-3 h-3" />
            {restaurant.deliveryTime}
          </span>
          <span className="flex items-center gap-0.5">
            <Bike className="w-3 h-3" />
            {restaurant.deliveryFee === 0 ? 'Free' : `$${restaurant.deliveryFee.toFixed(2)}`}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          {restaurant.freeDelivery && (
            <span className="bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
              Free Delivery
            </span>
          )}
          {restaurant.promo && (
            <span className="text-primary-600 text-[11px] font-semibold">{restaurant.promo}</span>
          )}
          <span className="text-neutral-400 text-[11px] flex items-center gap-0.5 ml-auto">
            <MapPin className="w-2.5 h-2.5" />
            {restaurant.distance}
          </span>
        </div>
      </div>
    </div>
  );
}
