import { X, Plus, Minus, Check, Star } from 'lucide-react';
import { useState, useMemo } from 'react';
import { getMenuItemById, getRestaurantById, CustomizationGroup } from '@/data/restaurants';
import { useNavigation } from '@/context/NavigationContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { DietaryBadges } from '@/components/DietaryBadges';

export function ProductDetail({
  restaurantId,
  itemId,
}: {
  restaurantId: string;
  itemId: string;
}) {
  const { closeProduct } = useNavigation();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const restaurant = getRestaurantById(restaurantId);
  const item = getMenuItemById(restaurantId, itemId);

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  useMemo(() => {
    if (!item?.customizations) return;
    const defaults: Record<string, string[]> = {};
    item.customizations.forEach((group) => {
      if (group.type === 'single' && group.options.length > 0) {
        defaults[group.id] = [group.options[0].id];
      } else {
        defaults[group.id] = [];
      }
    });
    setSelectedOptions(defaults);
  }, [item]);

  if (!item || !restaurant) return null;

  const toggleOption = (groupId: string, optionId: string, group: CustomizationGroup) => {
    setSelectedOptions((prev) => {
      if (group.type === 'single') {
        return { ...prev, [groupId]: [optionId] };
      }
      const current = prev[groupId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [groupId]: current.filter((id) => id !== optionId) };
      }
      return { ...prev, [groupId]: [...current, optionId] };
    });
  };

  const calculateTotalPrice = () => {
    let total = item.price;
    if (item.customizations) {
      item.customizations.forEach((group) => {
        const selected = selectedOptions[group.id] || [];
        selected.forEach((optId) => {
          const option = group.options.find((o) => o.id === optId);
          if (option) total += option.price;
        });
      });
    }
    return total * quantity;
  };

  const getSelectedCustomizations = () => {
    const result: { groupName: string; optionLabel: string; optionPrice: number }[] = [];
    if (item.customizations) {
      item.customizations.forEach((group) => {
        const selected = selectedOptions[group.id] || [];
        selected.forEach((optId) => {
          const option = group.options.find((o) => o.id === optId);
          if (option) {
            result.push({
              groupName: group.name,
              optionLabel: option.label,
              optionPrice: option.price,
            });
          }
        });
      });
    }
    return result;
  };

  const handleAddToCart = () => {
    addItem(restaurantId, restaurant.name, item, quantity, getSelectedCustomizations(), specialInstructions);
    showToast(`${quantity}x ${item.name} added to cart`);
    closeProduct();
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="absolute inset-0 z-50 flex flex-col animate-slide-up">
      <div className="flex-1 overflow-y-auto no-scrollbar bg-white rounded-t-3xl">
        {/* Hero image */}
        <div className="relative h-60">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <button
            onClick={closeProduct}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md active:scale-90 transition-transform"
          >
            <X className="w-5 h-5 text-neutral-900" />
          </button>
        </div>

        <div className="px-5 pt-4 pb-32">
          {/* Title and price */}
          <h1 className="text-[22px] font-bold text-neutral-900">{item.name}</h1>
          <p className="text-[14px] text-neutral-600 mt-1.5 leading-relaxed">{item.description}</p>

          {/* Dietary badges + rating */}
          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
            <div className="font-bold text-[20px] text-neutral-900">${item.price.toFixed(2)}</div>
            {item.itemRating && (
              <span className="flex items-center gap-1 text-[13px] text-neutral-600">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {item.itemRating} ({item.reviewCount} reviews)
              </span>
            )}
          </div>
          {item.dietaryTags && item.dietaryTags.length > 0 && (
            <div className="mt-2">
              <DietaryBadges tags={item.dietaryTags} />
            </div>
          )}

          {/* Customizations */}
          {item.customizations?.map((group) => (
            <div key={group.id} className="mt-6">
              <div className="flex items-baseline gap-2 mb-3">
                <h3 className="text-[16px] font-bold text-neutral-900">{group.name}</h3>
                {group.required && (
                  <span className="text-primary-500 text-[12px] font-semibold">
                    Required
                  </span>
                )}
                {group.type === 'multi' && (
                  <span className="text-neutral-400 text-[12px]">Choose any</span>
                )}
                {group.type === 'single' && (
                  <span className="text-neutral-400 text-[12px]">Choose 1</span>
                )}
              </div>
              <div className="space-y-0.5">
                {group.options.map((option) => {
                  const isSelected = (selectedOptions[group.id] || []).includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(group.id, option.id, group)}
                      className="w-full flex items-center justify-between py-2.5 active:bg-neutral-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                            group.type === 'single' ? 'rounded-full' : 'rounded'
                          } ${
                            isSelected
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-neutral-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-[15px] text-neutral-800">{option.label}</span>
                      </div>
                      {option.price > 0 && (
                        <span className="text-[14px] text-neutral-500 font-medium">
                          +${option.price.toFixed(2)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special instructions */}
          <div className="mt-6">
            <h3 className="text-[16px] font-bold text-neutral-900 mb-2.5">Special Instructions</h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Add a note (e.g., allergies, extra napkins, no onions...)"
              className="w-full bg-neutral-100 rounded-xl p-3.5 text-[14px] outline-none resize-none h-20 placeholder:text-neutral-400"
            />
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="bg-white border-t border-neutral-100 px-5 py-3.5 pb-5 flex items-center gap-3">
        {/* Quantity selector */}
        <div className="flex items-center gap-3 bg-neutral-100 rounded-full px-2 py-1.5">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center active:scale-90 transition-transform disabled:opacity-30"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4 text-neutral-700" />
          </button>
          <span className="font-bold text-[16px] text-neutral-900 w-5 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center active:scale-90 transition-transform"
          >
            <Plus className="w-4 h-4 text-neutral-700" />
          </button>
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-primary-500 text-white rounded-full py-3.5 font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-sm"
        >
          Add to Cart
          <span className="bg-white/20 px-2 py-0.5 rounded-full">${totalPrice.toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
}
