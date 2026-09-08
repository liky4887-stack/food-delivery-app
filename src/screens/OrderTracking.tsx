import { useEffect, useState } from 'react';
import { CheckCircle2, ChefHat, Bike, Package, Phone, MessageCircle, Star, MapPin, Navigation } from 'lucide-react';
import { useUser, PastOrder } from '@/context/UserContext';
import { useNavigation } from '@/context/NavigationContext';

export function OrderTracking({ order }: { order: PastOrder }) {
  const { updateOrderStage } = useUser();
  const { navigateToScreen } = useNavigation();
  const [stage, setStage] = useState(order.stage);
  const [courierProgress, setCourierProgress] = useState(0);

  const stages = [
    { icon: CheckCircle2, label: 'Order Placed', desc: 'Restaurant received your order' },
    { icon: ChefHat, label: 'Preparing', desc: 'Your food is being made' },
    { icon: Bike, label: 'On the Way', desc: 'Courier is heading to you' },
    { icon: Package, label: 'Delivered', desc: 'Enjoy your meal!' },
  ];

  // Auto-advance stages
  useEffect(() => {
    if (stage >= 3) return;
    const timer = setTimeout(() => {
      const next = stage + 1;
      setStage(next);
      updateOrderStage(order.id, next);
    }, stage === 0 ? 2500 : stage === 1 ? 4000 : 6000);
    return () => clearTimeout(timer);
  }, [stage, order.id, updateOrderStage]);

  // Animate courier progress when on the way
  useEffect(() => {
    if (stage < 2) return;
    if (stage >= 3) {
      setCourierProgress(100);
      return;
    }
    const interval = setInterval(() => {
      setCourierProgress((p) => Math.min(p + 1, 95));
    }, 100);
    return () => clearInterval(interval);
  }, [stage]);

  const eta = stage >= 3 ? 'Delivered' : stage === 2 ? `${Math.max(2, 15 - Math.floor(courierProgress / 8))} min` : '25-35 min';

  return (
    <div className="px-5 pt-4 pb-2">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 animate-bounce-in ${stage >= 3 ? 'bg-green-50' : 'bg-primary-50'}`}>
          {stage >= 3 ? (
            <Package className="w-9 h-9 text-green-500" />
          ) : (
            <ChefHat className="w-9 h-9 text-primary-500" />
          )}
        </div>
        <h1 className="text-[22px] font-bold text-neutral-900">
          {stage >= 3 ? 'Order Delivered!' : stage === 0 ? 'Order Confirmed!' : stage === 1 ? 'Preparing...' : 'On the Way!'}
        </h1>
        <p className="text-[14px] text-neutral-500 mt-1">{order.restaurantName}</p>
      </div>

      {/* Map area with animated courier */}
      <div className="relative h-40 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl mb-4 overflow-hidden">
        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 350 160" preserveAspectRatio="none">
          <path
            d="M 30 120 Q 100 80 175 90 T 320 40"
            fill="none"
            stroke="#ff2b2b"
            strokeWidth="3"
            strokeDasharray="8 4"
            opacity="0.4"
          />
        </svg>

        {/* Restaurant marker */}
        <div className="absolute bottom-4 left-3 flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-primary-500" />
          </div>
          <div className="text-[10px] font-bold text-neutral-700 mt-0.5 bg-white/80 px-1.5 rounded">Restaurant</div>
        </div>

        {/* Destination marker */}
        <div className="absolute top-3 right-3 flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-500" />
          </div>
          <div className="text-[10px] font-bold text-neutral-700 mt-0.5 bg-white/80 px-1.5 rounded">You</div>
        </div>

        {/* Animated courier */}
        {stage >= 2 && stage < 3 && (
          <div
            className="absolute transition-all duration-500 ease-linear"
            style={{
              left: `${10 + courierProgress * 0.75}%`,
              top: `${120 - courierProgress * 0.7}px`,
            }}
          >
            <div className="w-10 h-10 rounded-full bg-primary-500 shadow-lg flex items-center justify-center animate-bounce-in">
              <Bike className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        {/* ETA overlay */}
        <div className="absolute top-2 left-2 bg-white/90 rounded-xl px-3 py-1.5 shadow-sm">
          <div className="text-[11px] text-neutral-500">Estimated Arrival</div>
          <div className="text-[15px] font-bold text-neutral-900">{eta}</div>
        </div>
      </div>

      {/* Courier info */}
      {stage >= 2 && stage < 3 && (
        <div className="flex items-center gap-3 bg-neutral-50 rounded-2xl p-3.5 mb-4 animate-slide-up border border-neutral-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-[14px]">
            M
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[14px] text-neutral-900">Marcus T.</div>
            <div className="flex items-center gap-1 text-[12px] text-neutral-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              4.9 · E-Bike
            </div>
          </div>
          <button className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center active:scale-90 transition-transform">
            <MessageCircle className="w-5 h-5 text-neutral-600" />
          </button>
          <button className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center active:scale-90 transition-transform">
            <Phone className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Progress tracker */}
      <div className="bg-neutral-50 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[15px] font-bold text-neutral-900">Order Progress</h3>
          <span className="text-[13px] font-bold text-primary-500">{Math.round((stage / 3) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${(stage / 3) * 100}%` }}
          />
        </div>

        <div className="space-y-0">
          {stages.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx <= stage;
            const isCurrent = idx === stage;
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? isCurrent
                          ? 'bg-primary-500 text-white animate-pulse'
                          : 'bg-primary-500 text-white'
                        : 'bg-neutral-200 text-neutral-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {idx < stages.length - 1 && (
                    <div className={`w-0.5 h-6 ${idx < stage ? 'bg-primary-500' : 'bg-neutral-200'}`} />
                  )}
                </div>
                <div className="pt-1.5 pb-3">
                  <div className={`text-[15px] font-semibold ${isActive ? 'text-neutral-900' : 'text-neutral-400'}`}>
                    {s.label}
                  </div>
                  <div className="text-[12px] text-neutral-500">{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery address */}
      <div className="bg-neutral-50 rounded-2xl p-4 mb-4 border border-neutral-200">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-[14px] text-neutral-900">{order.address.label}</div>
            <div className="text-[13px] text-neutral-600">{order.address.street}</div>
            <div className="text-[13px] text-neutral-600">{order.address.city} {order.address.zip}</div>
            {order.address.instructions && (
              <div className="text-[12px] text-neutral-400 mt-1 italic">Note: {order.address.instructions}</div>
            )}
          </div>
        </div>
      </div>

      {/* Order details */}
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-neutral-900 mb-2.5">Order Details</h3>
        <div className="bg-neutral-50 rounded-2xl p-4 space-y-2.5">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-[14px]">
              <span className="text-neutral-700">{item.quantity}x {item.name}</span>
              <span className="text-neutral-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-neutral-200 pt-2.5 mt-1.5">
            <div className="flex justify-between font-bold text-[16px] text-neutral-900">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigateToScreen('home')}
        className="w-full bg-primary-500 text-white rounded-full py-4 font-bold text-[16px] active:scale-[0.98] transition-transform shadow-sm mb-3"
      >
        Back to Home
      </button>
    </div>
  );
}
