import { Receipt, ShoppingBag, RotateCcw, ChevronRight, Clock, Calendar, MapPin } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { getRestaurantById } from '@/data/restaurants';
import { OrderTracking } from '@/screens/OrderTracking';
import { StoreCard } from '@/components/StoreCard';
import { restaurants } from '@/data/restaurants';

export function OrdersScreen() {
  const { state, navigateToScreen, navigateToRestaurant, confirmOrder } = useNavigation();
  const { orderHistory } = useUser();
  const { loadCartFromOrder } = useCart();
  const { showToast } = useToast();

  if (state.orderConfirmed && state.activeOrderId) {
    const activeOrder = orderHistory.find((o) => o.id === state.activeOrderId);
    if (activeOrder) {
      return <OrderTracking order={activeOrder} />;
    }
  }

  const activeOrders = orderHistory.filter((o) => o.stage < 3);
  const pastOrders = orderHistory.filter((o) => o.stage >= 3);

  const handleReorder = (orderId: string) => {
    const order = orderHistory.find((o) => o.id === orderId);
    if (!order) return;
    loadCartFromOrder(order.items);
    showToast('Items added to cart');
    navigateToRestaurant(order.restaurantId);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="px-5 pt-4 pb-2">
      <h1 className="text-[22px] font-bold text-neutral-900 mb-4">Orders</h1>

      {orderHistory.length === 0 ? (
        <>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <Receipt className="w-10 h-10 text-neutral-300" />
            </div>
            <h2 className="text-[18px] font-bold text-neutral-900">No orders yet</h2>
            <p className="text-[14px] text-neutral-500 mt-1.5 text-center max-w-[240px]">
              Your past and active orders will appear here once you place them.
            </p>
          </div>
          <div className="mt-4">
            <h3 className="text-[16px] font-bold text-neutral-900 mb-1">Hungry?</h3>
            <p className="text-[13px] text-neutral-500 mb-3">Browse restaurants and start an order.</p>
            <div className="space-y-3">
              {restaurants.slice(0, 3).map((r) => (
                <StoreCard key={r.id} restaurant={r} onClick={() => navigateToRestaurant(r.id)} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Active orders */}
          {activeOrders.length > 0 && (
            <div className="mb-5">
              <h3 className="text-[16px] font-bold text-neutral-900 mb-3">Active Orders</h3>
              <div className="space-y-3">
                {activeOrders.map((order) => {
                  const restaurant = getRestaurantById(order.restaurantId);
                  return (
                    <div
                      key={order.id}
                      onClick={() => confirmOrder(order.id)}
                      className="bg-primary-50 rounded-2xl p-4 border border-primary-200 cursor-pointer active:scale-[0.98] transition-transform"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          {restaurant && (
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-200 shrink-0">
                              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-[15px] text-neutral-900">{order.restaurantName}</div>
                            <div className="text-[12px] text-neutral-500">{formatTime(order.placedAt)}</div>
                          </div>
                        </div>
                        <span className="bg-primary-500 text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
                          {order.stage === 0 ? 'Placed' : order.stage === 1 ? 'Preparing' : order.stage === 2 ? 'On the Way' : 'Delivered'}
                        </span>
                      </div>
                      <div className="text-[13px] text-neutral-600">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-[15px] text-neutral-900">${order.total.toFixed(2)}</span>
                        <span className="text-primary-500 text-[13px] font-semibold flex items-center gap-1">
                          Track Order <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past orders */}
          {pastOrders.length > 0 && (
            <div>
              <h3 className="text-[16px] font-bold text-neutral-900 mb-3">Past Orders</h3>
              <div className="space-y-3">
                {pastOrders.map((order) => {
                  const restaurant = getRestaurantById(order.restaurantId);
                  return (
                    <div key={order.id} className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          {restaurant && (
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-200 shrink-0">
                              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-[15px] text-neutral-900">{order.restaurantName}</div>
                            <div className="text-[12px] text-neutral-500 flex items-center gap-1">
                              {order.deliveryType === 'scheduled' && order.scheduledFor ? (
                                <>
                                  <Calendar className="w-3 h-3" />
                                  {order.scheduledFor}
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3" />
                                  {formatTime(order.placedAt)}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                          Delivered
                        </span>
                      </div>
                      <div className="text-[13px] text-neutral-600 mb-2">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                      {order.address && (
                        <div className="text-[12px] text-neutral-400 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" />
                          {order.address.street}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-[15px] text-neutral-900">${order.total.toFixed(2)}</span>
                        <button
                          onClick={() => handleReorder(order.id)}
                          className="bg-neutral-900 text-white rounded-full px-4 py-2 text-[13px] font-semibold flex items-center gap-1.5 active:scale-95 transition-transform"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Reorder
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeOrders.length === 0 && pastOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="w-12 h-12 text-neutral-200 mb-3" />
              <p className="text-[15px] text-neutral-500">No orders yet</p>
              <button
                onClick={() => navigateToScreen('home')}
                className="mt-4 bg-primary-500 text-white rounded-full px-6 py-3 font-semibold text-[15px] active:scale-95 transition-transform"
              >
                Browse Restaurants
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
