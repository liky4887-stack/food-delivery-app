import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Tag, X, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useCart, promoCodes, PromoCode } from '@/context/CartContext';
import { useNavigation } from '@/context/NavigationContext';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { restaurants, getRestaurantById } from '@/data/restaurants';
import { StoreCard } from '@/components/StoreCard';

export function CartScreen() {
  const {
    items, updateQuantity, subtotal, clearCart, currentRestaurantId,
    appliedPromo, applyPromo, removePromo, discount, deliveryType, setDeliveryType, scheduledTime, setScheduledTime,
  } = useCart();
  const { navigateToScreen, navigateToRestaurant, confirmOrder } = useNavigation();
  const { selectedAddress, addOrder } = useUser();
  const { showToast } = useToast();
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [showPromoList, setShowPromoList] = useState(false);

  const currentRestaurant = currentRestaurantId ? getRestaurantById(currentRestaurantId) : null;
  const baseDeliveryFee = currentRestaurant?.deliveryFee ?? 0;
  const deliveryFee = appliedPromo?.type === 'free-delivery' ? 0 : baseDeliveryFee;
  const serviceFee = subtotal * 0.15;
  const tax = (subtotal - discount) * 0.0875;
  const total = subtotal - discount + deliveryFee + serviceFee + tax;

  const suggestions = currentRestaurant
    ? currentRestaurant.menu.filter((item) => !items.some((ci) => ci.itemId === item.id)).slice(0, 4)
    : [];
  const otherRestaurants = restaurants.filter((r) => r.id !== currentRestaurantId).slice(0, 3);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    if (applyPromo(promoInput)) {
      showToast(`Promo code ${promoInput.toUpperCase()} applied!`);
      setPromoInput('');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      showToast('Please select a delivery address', 'info');
      return;
    }
    const orderId = addOrder({
      items: [...items],
      restaurantName: currentRestaurant?.name || 'Restaurant',
      restaurantId: currentRestaurantId || '',
      total,
      itemCount: items.reduce((s, i) => s + i.quantity, 0),
      deliveredAt: null,
      stage: 0,
      address: selectedAddress,
      promoCode: appliedPromo?.code || null,
      discount,
      scheduledFor: scheduledTime,
      deliveryType,
    });
    clearCart();
    confirmOrder(orderId);
    showToast('Order placed successfully!');
  };

  if (items.length === 0) {
    return (
      <div className="px-5 pt-4 pb-2 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10 text-neutral-300" />
        </div>
        <h2 className="text-[20px] font-bold text-neutral-900">Your cart is empty</h2>
        <p className="text-[14px] text-neutral-500 mt-1.5 text-center">
          Browse restaurants and add items to get started.
        </p>
        <button
          onClick={() => navigateToScreen('home')}
          className="mt-5 bg-primary-500 text-white rounded-full px-6 py-3 font-semibold text-[15px] active:scale-95 transition-transform"
        >
          Browse Restaurants
        </button>
        <div className="w-full mt-8">
          <h3 className="text-[16px] font-bold text-neutral-900 mb-3">Popular Restaurants</h3>
          <div className="space-y-3">
            {otherRestaurants.map((r) => (
              <StoreCard key={r.id} restaurant={r} onClick={() => navigateToRestaurant(r.id)} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-2 pb-2">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigateToScreen('home')}
          className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition-transform shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-900" />
        </button>
        <div>
          <h1 className="text-[20px] font-bold text-neutral-900">Your Cart</h1>
          {currentRestaurant && <p className="text-[13px] text-neutral-500">{currentRestaurant.name}</p>}
        </div>
      </div>

      {/* Delivery type selector */}
      <div className="flex gap-2.5 mb-4">
        <button
          onClick={() => setDeliveryType('now')}
          className={`flex-1 rounded-2xl py-3 px-3 text-left transition-colors border-2 ${
            deliveryType === 'now' ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${deliveryType === 'now' ? 'text-primary-500' : 'text-neutral-400'}`} />
            <span className={`text-[14px] font-semibold ${deliveryType === 'now' ? 'text-primary-600' : 'text-neutral-600'}`}>
              Deliver Now
            </span>
          </div>
          <p className="text-[12px] text-neutral-500 mt-0.5">{currentRestaurant?.deliveryTime || '20-35 min'}</p>
        </button>
        <button
          onClick={() => setDeliveryType('scheduled')}
          className={`flex-1 rounded-2xl py-3 px-3 text-left transition-colors border-2 ${
            deliveryType === 'scheduled' ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${deliveryType === 'scheduled' ? 'text-primary-500' : 'text-neutral-400'}`} />
            <span className={`text-[14px] font-semibold ${deliveryType === 'scheduled' ? 'text-primary-600' : 'text-neutral-600'}`}>
              Schedule
            </span>
          </div>
          <p className="text-[12px] text-neutral-500 mt-0.5">Choose a time</p>
        </button>
      </div>

      {/* Scheduled time picker */}
      {deliveryType === 'scheduled' && (
        <div className="mb-4 bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200 animate-slide-up">
          <h4 className="text-[13px] font-bold text-neutral-900 mb-2.5">Select Delivery Window</h4>
          <div className="grid grid-cols-2 gap-2">
            {['Today 2:00-2:30 PM', 'Today 3:00-3:30 PM', 'Today 4:00-4:30 PM', 'Today 5:00-5:30 PM', 'Today 6:00-6:30 PM', 'Today 7:00-7:30 PM'].map((slot) => (
              <button
                key={slot}
                onClick={() => setScheduledTime(slot)}
                className={`text-[12px] font-medium py-2.5 px-3 rounded-xl transition-colors border ${
                  scheduledTime === slot
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white text-neutral-600 border-neutral-200'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cart items */}
      <div className="space-y-0">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 py-3.5 border-b border-neutral-100">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-200 shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[15px] text-neutral-900">{item.name}</div>
              {item.selectedCustomizations.length > 0 && (
                <div className="text-[12px] text-neutral-500 mt-0.5 leading-snug">
                  {item.selectedCustomizations.map((c) => c.optionLabel).join(', ')}
                </div>
              )}
              {item.specialInstructions && (
                <div className="text-[12px] text-neutral-400 mt-0.5 italic">Note: {item.specialInstructions}</div>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-[15px] text-neutral-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition-transform"
                  >
                    {item.quantity === 1 ? (
                      <Trash2 className="w-3.5 h-3.5 text-primary-500" />
                    ) : (
                      <Minus className="w-3.5 h-3.5 text-neutral-700" />
                    )}
                  </button>
                  <span className="font-semibold text-[15px] w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <Plus className="w-3.5 h-3.5 text-neutral-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add more items */}
      {currentRestaurant && (
        <button
          onClick={() => navigateToRestaurant(currentRestaurant.id)}
          className="text-primary-500 font-semibold text-[15px] py-3.5 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add more items from {currentRestaurant.name}
        </button>
      )}

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[16px] font-bold text-neutral-900">You might also like</h3>
            <button onClick={() => setShowSuggestions(false)} className="text-neutral-400 text-[13px]">Hide</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {suggestions.map((item) => (
              <div
                key={item.id}
                onClick={() => currentRestaurant && navigateToRestaurant(currentRestaurant.id)}
                className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 active:scale-95 transition-transform cursor-pointer"
              >
                <div className="h-16 rounded-lg overflow-hidden bg-neutral-200 mb-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-[13px] font-medium text-neutral-800 truncate">{item.name}</div>
                <div className="text-[14px] font-bold text-neutral-900">${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promo code section */}
      <div className="mt-5">
        <h3 className="text-[16px] font-bold text-neutral-900 mb-2.5 flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary-500" />
          Promo Code
        </h3>
        {appliedPromo ? (
          <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3 border border-green-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-bold text-[14px] text-green-700">{appliedPromo.code}</div>
                <div className="text-[12px] text-green-600">{appliedPromo.description}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {discount > 0 && <span className="text-[14px] font-bold text-green-600">-${discount.toFixed(2)}</span>}
              <button onClick={removePromo} className="text-neutral-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
                className="flex-1 bg-neutral-100 rounded-xl px-4 py-2.5 text-[14px] outline-none uppercase placeholder:normal-case placeholder:text-neutral-400"
              />
              <button
                onClick={handleApplyPromo}
                disabled={!promoInput.trim()}
                className="bg-neutral-900 text-white rounded-xl px-5 py-2.5 font-semibold text-[14px] disabled:opacity-30"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-[12px] text-primary-500 mt-1.5">{promoError}</p>}
            <button
              onClick={() => setShowPromoList(!showPromoList)}
              className="text-primary-500 text-[12px] font-medium mt-2"
            >
              {showPromoList ? 'Hide' : 'Show'} available codes
            </button>
            {showPromoList && (
              <div className="mt-2 space-y-2">
                {Object.values(promoCodes).map((p: PromoCode) => (
                  <button
                    key={p.code}
                    onClick={() => { applyPromo(p.code); showToast(`Promo ${p.code} applied!`); setPromoInput(''); setShowPromoList(false); }}
                    className="w-full flex items-center justify-between bg-neutral-50 rounded-xl px-3.5 py-2.5 border border-neutral-200 active:scale-95 transition-transform text-left"
                  >
                    <div>
                      <div className="font-bold text-[13px] text-neutral-900">{p.code}</div>
                      <div className="text-[12px] text-neutral-500">{p.description}</div>
                    </div>
                    <span className="text-primary-500 font-semibold text-[12px]">Apply</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Order summary */}
      <div className="mt-6 pt-4 border-t-2 border-neutral-100">
        <h3 className="text-[16px] font-bold text-neutral-900 mb-3">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-[15px] text-neutral-600">
            <span>Subtotal</span>
            <span className="text-neutral-900">${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-[15px] text-green-600">
              <span>Discount ({appliedPromo?.code})</span>
              <span className="font-semibold">-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-[15px] text-neutral-600">
            <span>Delivery Fee</span>
            <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : 'text-neutral-900'}>
              {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-[15px] text-neutral-600">
            <span>Service Fee</span>
            <span className="text-neutral-900">${serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[15px] text-neutral-600">
            <span>Estimated Tax</span>
            <span className="text-neutral-900">${tax.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between font-bold text-[18px] text-neutral-900 pt-3 mt-2 border-t border-neutral-100">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Place order */}
      <button
        onClick={handlePlaceOrder}
        className="w-full bg-primary-500 text-white rounded-full py-4 font-bold text-[17px] mt-4 mb-2 active:scale-[0.98] transition-transform shadow-sm flex items-center justify-center gap-2"
      >
        {deliveryType === 'scheduled' && scheduledTime ? `Schedule Order · $${total.toFixed(2)}` : `Place Order · $${total.toFixed(2)}`}
      </button>

      <button onClick={clearCart} className="w-full text-center text-neutral-400 text-[14px] py-2">
        Clear cart
      </button>
    </div>
  );
}
