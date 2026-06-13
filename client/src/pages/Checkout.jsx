import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiInfo } from 'react-icons/fi';
import * as ordersService from '../services/orders';

export default function Checkout() {
  const { user } = useContext(AuthContext);
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    mobile: '',
    address: '',
    pincode: '',
    paymentMethod: 'Online',
  });

  const [step, setStep] = useState(1); // 1: shipping, 2: payment, 3: review
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      for (const item of cartItems) {
        await ordersService.createOrder({
          userId: user._id,
          productId: item.productId,
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
          pincode: formData.pincode,
          paymentMethod: formData.paymentMethod,
          title: item.title,
          description: item.description,
          mainImg: item.mainImg,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
      }

      await clearCart();
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to place order. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    navigate('/cart');
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl max-w-container-max mx-auto px-6 md:px-margin-desktop flex flex-col items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white border border-outline-variant/30 rounded-3xl shadow-sm space-y-6">
          <div className="relative w-32 h-32 mx-auto mb-stack-lg">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-primary rounded-full shadow-lg">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24">
                <path d="M20 6L9 17L4 12"></path>
              </svg>
            </div>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-4">Payment Confirmed!</h1>
          <p className="text-body-lg text-on-surface-variant max-w-md mx-auto mb-8">
            Your order has been placed successfully. We&apos;ve sent a confirmation email to <span className="font-semibold text-on-surface">{user?.email}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/orders"
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-headline-sm text-headline-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-headline-sm text-headline-sm hover:bg-primary-fixed/30 active:scale-95 transition-all"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const estimatedTax = cartTotal * 0.08;
  const grandTotal = cartTotal + estimatedTax;

  return (
    <main className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      {/* Progress Stepper */}
      <div className="mb-stack-xl max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-highest -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          {[
            { num: 1, icon: 'check', label: 'Shipping', icon2: 'local_shipping' },
            { num: 2, icon: 'payments', label: 'Payment', icon2: 'payments' },
            { num: 3, icon: 'rate_review', label: 'Review', icon2: 'rate_review' },
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                step > s.num
                  ? 'bg-primary text-on-primary'
                  : step === s.num
                  ? 'bg-primary text-on-primary shadow-xl ring-4 ring-background'
                  : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined text-lg">{step > s.num ? 'check' : s.icon2}</span>
              </div>
              <span className={`font-label-caps text-label-caps ${step >= s.num ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-stack-lg">
          {/* Shipping Address */}
          <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Shipping Address</h2>
              <button className="text-primary font-label-caps hover:underline">Change</button>
            </div>
            <p className="text-on-surface-variant font-body-md">
              {formData.name || user?.username}<br />
              {formData.address || 'Enter your delivery address below'}<br />
              {formData.pincode && `PIN: ${formData.pincode}`}
            </p>
          </section>

          {/* Payment Method */}
          <section className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-stack-lg">Payment Method</h2>
            <div className="space-y-4">
              {[
                { id: 'Online', icon: 'credit_card', label: 'Credit / Debit Card', sub: 'Secure payment via Stripe', color: 'bg-primary-fixed text-primary' },
                { id: 'UPI', icon: 'account_balance_wallet', label: 'UPI Payment', sub: 'Pay using GPay, PhonePe, or BHIM', color: 'bg-secondary-fixed text-secondary' },
                { id: 'COD', icon: 'payments', label: 'Cash on Delivery', sub: 'Pay when you receive the order', color: 'bg-tertiary-fixed text-tertiary' },
              ].map((method) => (
                <div key={method.id}>
                  <input checked={formData.paymentMethod === method.id} onChange={handleChange} className="hidden payment-radio" id={`payment_${method.id}`} name="paymentMethod" type="radio" value={method.id} />
                  <label className="flex items-center justify-between p-5 border-2 border-outline-variant rounded-xl cursor-pointer hover:border-primary-fixed transition-all group" htmlFor={`payment_${method.id}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center`}>
                        <span className="material-symbols-outlined">{method.icon}</span>
                      </div>
                      <div>
                        <div className="font-headline-sm text-body-lg text-on-surface">{method.label}</div>
                        <div className="text-on-surface-variant text-sm">{method.sub}</div>
                      </div>
                    </div>
                    {formData.paymentMethod === method.id && (
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm space-y-6">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Shipping Details</h2>

            {error && (
              <div className="bg-error/10 text-error p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
                <FiInfo className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Mobile Number</label>
                <input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange} placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Delivery Address</label>
              <textarea name="address" required rows="3" value={formData.address} onChange={handleChange} placeholder="Enter house/flat number, street, city, state"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Pincode / Zip Code</label>
              <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} placeholder="e.g. 560001"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary font-headline-sm py-4 rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Place Order <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 sticky top-24 space-y-stack-md">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-lg p-6">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 border-b border-outline-variant pb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item, idx) => {
                const discountedSingle = item.discount ? item.price - (item.price * item.discount) / 100 : item.price;
                const totalItemPrice = discountedSingle * item.quantity;
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="w-20 h-20 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
                      <img className="w-full h-full object-cover" src={item.mainImg || '/placeholder.jpg'} alt={item.title} />
                    </div>
                    <div className="flex-1">
                      <div className="font-body-lg text-on-surface leading-tight mb-1">{item.title}</div>
                      <div className="text-on-surface-variant text-sm">{item.size && `Size: ${item.size} | `}Qty: {item.quantity}</div>
                      <div className="text-on-surface font-bold mt-1">${totalItemPrice.toFixed(2)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 border-t border-outline-variant pt-6 mb-6">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Shipping</span>
                <span className="text-tertiary">Free</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Estimated Tax</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface text-headline-sm font-bold pt-3 border-t border-dashed border-outline-variant">
                <span>Total</span>
                <span className="text-primary">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Promo Code</label>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Enter code"
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button className="px-4 py-2 bg-on-surface text-surface rounded-lg font-label-caps hover:bg-surface-variant hover:text-on-surface transition-all">Apply</button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 py-3 bg-surface-container-low rounded-lg">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <span className="font-label-caps text-on-surface-variant">100% Secure Transaction</span>
          </div>
        </div>
      </div>
    </main>
  );
}
