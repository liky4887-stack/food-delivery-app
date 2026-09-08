import { ArrowLeft, Star, Clock, Bike, Heart, Share, Plus, ThumbsUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getRestaurantById, getMenuSections } from '@/data/restaurants';
import { useNavigation } from '@/context/NavigationContext';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { CartBar } from '@/components/CartBar';
import { DietaryBadges } from '@/components/DietaryBadges';

export function RestaurantMenuScreen({ restaurantId }: { restaurantId: string }) {
  const { state, navigateBack, openProduct, setActiveMenuTab } = useNavigation();
  const { items } = useCart();
  const { isFavorite, toggleFavorite } = useUser();
  const { showToast } = useToast();
  const restaurant = getRestaurantById(restaurantId);
  const sections = getMenuSections(restaurantId);
  const [activeSection, setActiveSection] = useState(sections[0] || 'Popular');
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const fav = isFavorite(restaurantId);
  const cartItemsForThisRestaurant = items.filter((i) => i.restaurantId === restaurantId);
  const cartCount = cartItemsForThisRestaurant.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    if (state.activeMenuTab !== 'menu') return;
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const scrollTop = scrollRef.current.scrollTop;
      let currentActive = sections[0];
      for (const section of sections) {
        const el = sectionRefs.current[section];
        if (el && el.offsetTop - 200 <= scrollTop) {
          currentActive = section;
        }
      }
      if (currentActive !== activeSection) {
        setActiveSection(currentActive);
      }
    };
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [activeSection, sections, state.activeMenuTab]);

  const scrollToSection = (section: string) => {
    const el = sectionRefs.current[section];
    if (el && scrollRef.current) {
      scrollRef.current.scrollTo({ top: el.offsetTop - 180, behavior: 'smooth' });
    }
  };

  const handleFavorite = () => {
    toggleFavorite(restaurantId);
    showToast(fav ? 'Removed from favorites' : 'Added to favorites');
  };

  if (!restaurant) return null;

  return (
    <div className="absolute inset-0 bg-white animate-slide-in-right z-20 flex flex-col">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar pb-24"
      >
        {/* Header with image */}
        <div className="relative h-44">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
          <div className="absolute top-2 left-0 right-0 flex justify-between px-4">
            <button
              onClick={navigateBack}
              className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md active:scale-90 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-900" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleFavorite}
                className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md active:scale-90 transition-transform"
              >
                <Heart className={`w-5 h-5 ${fav ? 'fill-primary-500 text-primary-500' : 'text-neutral-900'}`} />
              </button>
              <button className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md active:scale-90 transition-transform">
                <Share className="w-5 h-5 text-neutral-900" />
              </button>
            </div>
          </div>
        </div>

        {/* Restaurant info */}
        <div className="px-5 pt-4">
          <h1 className="text-[22px] font-bold text-neutral-900">{restaurant.name}</h1>
          <p className="text-[14px] text-neutral-500 mt-0.5">{restaurant.cuisine}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-[14px]">
            <span className="font-semibold text-neutral-900 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-primary-500 text-primary-500" />
              {restaurant.rating}
              <span className="font-normal text-neutral-500">({restaurant.ratingCount.toLocaleString()})</span>
            </span>
            <span className="text-neutral-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {restaurant.deliveryTime}
            </span>
            <span className="text-neutral-600 flex items-center gap-1">
              <Bike className="w-3.5 h-3.5" />
              {restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee.toFixed(2)} delivery`}
            </span>
          </div>
          {restaurant.promo && (
            <div className="mt-3 bg-primary-50 text-primary-700 px-3.5 py-2 rounded-xl text-[13px] font-semibold">
              {restaurant.promo}
            </div>
          )}
        </div>

        {/* Menu / Reviews tabs */}
        <div className="sticky top-0 z-10 bg-white mt-4 border-b border-neutral-100">
          <div className="flex gap-5 px-5 py-3">
            <button
              onClick={() => setActiveMenuTab('menu')}
              className={`text-[14px] font-semibold whitespace-nowrap pb-0.5 transition-colors ${
                state.activeMenuTab === 'menu' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-400'
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveMenuTab('reviews')}
              className={`text-[14px] font-semibold whitespace-nowrap pb-0.5 transition-colors ${
                state.activeMenuTab === 'reviews' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-400'
              }`}
            >
              Reviews ({restaurant.reviews.length})
            </button>
          </div>
        </div>

        {state.activeMenuTab === 'menu' ? (
          /* Menu items */
          <div className="px-5 pt-3">
            {/* Section quick nav */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-3 mb-1">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-[12px] font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-colors ${
                    activeSection === section ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            {sections.map((section) => (
              <div key={section} ref={(el) => { sectionRefs.current[section] = el; }}>
                <h2 className="text-[18px] font-bold text-neutral-900 mb-2.5 mt-4">{section}</h2>
                {restaurant.menu
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => openProduct(restaurantId, item.id)}
                      className="flex gap-3.5 py-3.5 border-b border-neutral-100 active:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[15px] text-neutral-900">{item.name}</div>
                        {item.popular && (
                          <span className="inline-block bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1">
                            Popular
                          </span>
                        )}
                        <div className="text-[13px] text-neutral-500 mt-1 leading-snug line-clamp-2">
                          {item.description}
                        </div>
                        {item.dietaryTags && item.dietaryTags.length > 0 && (
                          <div className="mt-1.5">
                            <DietaryBadges tags={item.dietaryTags} size="xs" />
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="font-bold text-[15px] text-neutral-900">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.itemRating && (
                            <span className="flex items-center gap-0.5 text-[12px] text-neutral-500">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {item.itemRating}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="relative shrink-0">
                        <div className="w-[80px] h-[80px] rounded-xl overflow-hidden bg-neutral-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openProduct(restaurantId, item.id);
                          }}
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center active:scale-90 transition-transform"
                        >
                          <Plus className="w-5 h-5 text-primary-500" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ) : (
          /* Reviews tab */
          <div className="px-5 pt-4">
            {/* Rating overview */}
            <div className="bg-neutral-50 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-[36px] font-bold text-neutral-900 leading-none">{restaurant.rating}</div>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= Math.round(restaurant.rating) ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-200'}`}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">{restaurant.ratingCount.toLocaleString()} ratings</div>
                </div>
                <div className="flex-1 space-y-1">
                  {[
                    { stars: 5, pct: restaurant.ratingBreakdown.five },
                    { stars: 4, pct: restaurant.ratingBreakdown.four },
                    { stars: 3, pct: restaurant.ratingBreakdown.three },
                    { stars: 2, pct: restaurant.ratingBreakdown.two },
                    { stars: 1, pct: restaurant.ratingBreakdown.one },
                  ].map((r) => (
                    <div key={r.stars} className="flex items-center gap-2">
                      <span className="text-[11px] text-neutral-500 w-3">{r.stars}</span>
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="text-[11px] text-neutral-500 w-7 text-right">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual reviews */}
            <div className="space-y-4">
              {restaurant.reviews.map((review) => (
                <div key={review.id} className="border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-[13px] font-bold text-neutral-600">
                      {review.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[14px] text-neutral-900">{review.author}</div>
                      <div className="text-[11px] text-neutral-400">{review.date}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[14px] text-neutral-700 leading-relaxed">{review.text}</p>
                  <button className="flex items-center gap-1.5 mt-2 text-[12px] text-neutral-500 font-medium">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating cart bar */}
      {cartCount > 0 && state.activeMenuTab === 'menu' && <CartBar restaurantId={restaurantId} />}
    </div>
  );
}
