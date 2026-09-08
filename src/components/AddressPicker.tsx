import { X, MapPin, Plus, Check, Trash2, Home, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { useNavigation } from '@/context/NavigationContext';
import { useUser, Address } from '@/context/UserContext';

export function AddressPicker() {
  const { state, setShowAddressPicker } = useNavigation();
  const { addresses, selectedAddressId, selectAddress, addAddress, removeAddress } = useUser();
  const [showAddForm, setShowAddForm] = useState(false);
  const [label, setLabel] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [instructions, setInstructions] = useState('');

  if (!state.showAddressPicker) return null;

  const handleAdd = () => {
    if (!label.trim() || !street.trim() || !city.trim()) return;
    addAddress({ label, street, city, zip, instructions });
    setLabel('');
    setStreet('');
    setCity('');
    setZip('');
    setInstructions('');
    setShowAddForm(false);
  };

  const getIcon = (addr: Address) => {
    if (addr.label === 'Home') return Home;
    if (addr.label === 'Work') return Briefcase;
    return MapPin;
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/40 flex items-end animate-fade-in" onClick={() => setShowAddressPicker(false)}>
      <div
        className="w-full bg-white rounded-t-3xl p-5 pb-8 animate-slide-up max-h-[85%] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[20px] font-bold text-neutral-900">Delivery Address</h2>
          <button
            onClick={() => setShowAddressPicker(false)}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Saved addresses */}
        <div className="space-y-2.5">
          {addresses.map((addr) => {
            const Icon = getIcon(addr);
            const isSelected = addr.id === selectedAddressId;
            return (
              <div
                key={addr.id}
                onClick={() => {
                  selectAddress(addr.id);
                  setShowAddressPicker(false);
                }}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-colors ${
                  isSelected ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-neutral-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary-500' : 'bg-neutral-200'}`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-neutral-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[15px] text-neutral-900">{addr.label}</div>
                  <div className="text-[13px] text-neutral-600 mt-0.5">{addr.street}</div>
                  <div className="text-[13px] text-neutral-600">{addr.city} {addr.zip}</div>
                  {addr.instructions && (
                    <div className="text-[12px] text-neutral-400 mt-1 italic">Note: {addr.instructions}</div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-2">
                  {isSelected && <Check className="w-5 h-5 text-primary-500" />}
                  {addresses.length > 1 && !isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAddress(addr.id);
                      }}
                      className="text-neutral-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add new address */}
        {showAddForm ? (
          <div className="mt-4 space-y-3 bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
            <input
              type="text"
              placeholder="Label (Home, Work, etc.)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-white rounded-xl px-4 py-3 text-[14px] outline-none border border-neutral-200"
            />
            <input
              type="text"
              placeholder="Street address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full bg-white rounded-xl px-4 py-3 text-[14px] outline-none border border-neutral-200"
            />
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="City, State"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1 bg-white rounded-xl px-4 py-3 text-[14px] outline-none border border-neutral-200"
              />
              <input
                type="text"
                placeholder="ZIP"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-24 bg-white rounded-xl px-4 py-3 text-[14px] outline-none border border-neutral-200"
              />
            </div>
            <input
              type="text"
              placeholder="Delivery instructions (optional)"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-white rounded-xl px-4 py-3 text-[14px] outline-none border border-neutral-200"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-neutral-200 text-neutral-700 rounded-xl py-3 font-semibold text-[14px]"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!label.trim() || !street.trim()}
                className="flex-1 bg-primary-500 text-white rounded-xl py-3 font-semibold text-[14px] disabled:opacity-40"
              >
                Save Address
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mt-4 border-2 border-dashed border-neutral-300 rounded-2xl py-3.5 flex items-center justify-center gap-2 text-primary-500 font-semibold text-[15px] active:scale-95 transition-transform"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </button>
        )}
      </div>
    </div>
  );
}
