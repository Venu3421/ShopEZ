import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as ordersService from '../services/orders';
import EmptyState from '../components/common/EmptyState';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Orders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('history'); // 'success' or 'history'
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null); // for Invoice modal

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await ordersService.getAllOrders({ userId: user._id });
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getFilteredOrders = () => {
    if (timeFilter === 'all') return orders;

    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      if (timeFilter === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return orderDate >= thirtyDaysAgo;
      }
      if (timeFilter === '6months') {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        return orderDate >= sixMonthsAgo;
      }
      // Check year match
      const year = parseInt(timeFilter);
      if (!isNaN(year)) {
        return orderDate.getFullYear() === year;
      }
      return true;
    });
  };

  const getFilterYears = () => {
    const years = orders.map((order) => new Date(order.orderDate).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
  };

  const handleBuyAgain = async (order) => {
    try {
      const product = {
        _id: order.productId,
        title: order.title,
        description: order.description,
        mainImg: order.mainImg,
        price: order.price,
        discount: order.discount || 0
      };
      await addToCart(product, order.size || 'M', order.quantity || 1);
      navigate('/cart');
    } catch (error) {
      console.error('Failed to buy again:', error);
      alert('Failed to add item to cart');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl max-w-container-max mx-auto px-6 md:px-margin-desktop">
        <div className="space-y-6">
          <SkeletonLoader variant="text" className="w-64 h-8 mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonLoader key={i} variant="rectangle" className="w-full h-32 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background text-on-surface">
        <EmptyState
          icon={<span className="material-symbols-outlined text-5xl">package_2</span>}
          title="No orders yet"
          message="When you purchase our custom styles, they will be listed here."
          actionText="Start Shopping"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl px-margin-desktop max-w-container-max mx-auto selection:bg-primary-fixed selection:text-primary">
      <div className="print:hidden">
        {/* View Toggle */}
      <div className="flex gap-4 mb-stack-lg border-b border-outline-variant">
        <button
          onClick={() => setView('success')}
          className={`pb-4 font-label-caps text-label-caps transition-all ${view === 'success' ? 'border-b-2 border-primary text-primary' : 'border-b-2 border-transparent text-on-surface-variant hover:text-primary'}`}
        >
          Order Success
        </button>
        <button
          onClick={() => setView('history')}
          className={`pb-4 font-label-caps text-label-caps transition-all ${view === 'history' ? 'border-b-2 border-primary text-primary' : 'border-b-2 border-transparent text-on-surface-variant hover:text-primary'}`}
        >
          Order History
        </button>
      </div>

      {/* Order Success View */}
      {view === 'success' && (
        <section className="flex flex-col items-center justify-center py-stack-xl text-center">
          <div className="relative w-32 h-32 mb-stack-lg">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-primary rounded-full shadow-lg">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24">
                <path className="animate-check" d="M20 6L9 17L4 12"></path>
              </svg>
            </div>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-4">Payment Confirmed!</h1>
          <p className="text-body-lg text-on-surface-variant max-w-md mx-auto mb-8">
            Your order has been placed successfully. We&apos;ve sent a confirmation email to <span className="font-semibold text-on-surface">{user?.email}</span>
          </p>
          <div className="glass-card rounded-2xl p-8 w-full max-w-md shadow-xl mb-12 border border-outline-variant/20 bg-white/70 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <span className="text-on-surface-variant font-label-caps text-label-caps">Order ID</span>
              <span className="font-bold text-primary">#EZ-{orders[0]?._id?.substring(orders[0]._id.length - 6)?.toUpperCase() || 'NEW'}</span>
            </div>
            <div className="space-y-4 border-t border-outline-variant pt-6">
              <div className="flex justify-between text-body-md">
                <span className="text-on-surface-variant">Estimated Delivery</span>
                <span className="font-medium">{orders[0]?.deliveryDate ? new Date(orders[0].deliveryDate).toLocaleDateString() : 'Oct 24 - Oct 26'}</span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-on-surface-variant">Payment Method</span>
                <span className="font-medium">{orders[0]?.paymentMethod || 'Card'}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products" className="bg-primary text-on-primary px-8 py-4 rounded-xl font-headline-sm text-headline-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
              Continue Shopping
            </Link>
            <button onClick={() => setView('history')} className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-headline-sm text-headline-sm hover:bg-primary-fixed/30 active:scale-95 transition-all">
              Track Order
            </button>
          </div>
        </section>
      )}

      {/* Order History View */}
      {view === 'history' && (
        <section>
          <div className="flex justify-between items-end mb-stack-lg">
            <div>
              <h2 className="font-display-lg text-display-lg text-on-surface">Order History</h2>
              <p className="text-on-surface-variant font-body-lg">Manage and track your recent premium purchases.</p>
            </div>
            <div className="hidden md:flex gap-4">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="rounded-xl border border-outline-variant bg-surface-container text-body-md focus:ring-primary focus:border-primary px-4 py-2.5 outline-none font-bold"
              >
                <option value="all">All Orders</option>
                <option value="30days">Last 30 Days</option>
                <option value="6months">Last 6 Months</option>
                {getFilterYears().map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {getFilteredOrders().map((order) => {
              const discountedPrice = order.discount
                ? order.price - (order.price * order.discount) / 100
                : order.price;
              const totalOrderPrice = discountedPrice * order.quantity;

              return (
                <div key={order._id} className="bg-white/70 backdrop-blur-sm border border-outline-variant/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center">
                        <span className={`material-symbols-outlined text-3xl ${
                          order.orderStatus?.toLowerCase() === 'cancelled' ? 'text-error' : order.orderStatus?.toLowerCase() === 'delivered' ? 'text-primary' : 'text-secondary'
                        }`}>
                          {order.orderStatus?.toLowerCase() === 'cancelled' ? 'cancel' : order.orderStatus?.toLowerCase() === 'shipped' ? 'local_shipping' : 'package_2'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">#EZ-{order._id.substring(order._id.length - 6).toUpperCase()}</h3>
                        <p className="text-on-surface-variant text-body-md">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1.5 rounded-full font-status-badge text-status-badge flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                        {order.orderStatus || 'Placed'}
                      </span>
                      <div className="h-8 w-px bg-outline-variant"></div>
                      <span className="font-bold text-headline-sm text-on-surface">₹{totalOrderPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-outline-variant">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container-higher flex-shrink-0">
                        <img className="w-full h-full object-cover" src={order.mainImg || '/placeholder.jpg'} alt={order.title} />
                      </div>
                      <div>
                        <p className="text-on-surface font-medium text-body-md">{order.title}</p>
                        <p className="text-on-surface-variant text-label-caps">{order.size ? `${order.size} • ` : ''}Qty {order.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-lg">local_shipping</span>
                      <span className="text-body-md">
                        {order.orderStatus?.toLowerCase() === 'cancelled'
                          ? 'Refunded to Original Payment'
                          : order.orderStatus?.toLowerCase() === 'delivered'
                          ? `Delivered to ${order.address?.split(',')[0] || 'your address'}`
                          : `Arriving ${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'soon'}`}
                      </span>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setSelectedInvoice(order)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                      >
                        <span className="material-symbols-outlined">description</span>
                        <span className="font-label-caps text-label-caps">Invoice</span>
                      </button>
                      {order.orderStatus?.toLowerCase() !== 'cancelled' && (
                        <button
                          onClick={() => handleBuyAgain(order)}
                          className="bg-primary-container text-on-primary-container px-4 py-2 rounded-xl font-label-caps text-label-caps hover:brightness-110 transition-all"
                        >
                          Buy Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div id="invoice-print-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm print:p-0 print:bg-white print:absolute print:inset-0 print:z-[9999]">
          <div id="invoice-print-dialog" className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-outline-variant/30 flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:w-full print:m-0 print:p-0">
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low print:hidden">
              <h3 className="font-bold text-lg text-on-surface">Invoice Receipt</h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-8 space-y-6 overflow-y-auto flex-1 print:overflow-visible" id="invoice-print-area">
              <div className="flex justify-between items-start border-b border-outline-variant/30 pb-6">
                <div>
                  <h1 className="font-display-lg text-2xl font-black text-primary tracking-tight">ShopEZ</h1>
                  <p className="text-xs text-on-surface-variant mt-1">Premium E-commerce Experience</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-base text-on-surface">INVOICE</p>
                  <p className="text-sm font-semibold text-primary mt-1">#EZ-{selectedInvoice._id.substring(selectedInvoice._id.length - 6).toUpperCase()}</p>
                  <p className="text-xs text-on-surface-variant mt-1">Date: {new Date(selectedInvoice.orderDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="font-bold text-on-surface-variant uppercase text-xs tracking-wider mb-2">Billed To:</p>
                  <p className="font-bold text-on-surface">{selectedInvoice.name}</p>
                  <p className="text-on-surface-variant">{selectedInvoice.email}</p>
                  <p className="text-on-surface-variant">{selectedInvoice.mobile}</p>
                </div>
                <div>
                  <p className="font-bold text-on-surface-variant uppercase text-xs tracking-wider mb-2">Shipping Address:</p>
                  <p className="text-on-surface">{selectedInvoice.address}</p>
                  <p className="text-on-surface-variant">Pincode: {selectedInvoice.pincode}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-outline-variant/30 rounded-2xl overflow-hidden bg-surface-container-low/30">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/20">
                      <th className="px-6 py-3 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Item Description</th>
                      <th className="px-6 py-3 font-bold text-on-surface-variant text-xs uppercase tracking-wider text-center">Size</th>
                      <th className="px-6 py-3 font-bold text-on-surface-variant text-xs uppercase tracking-wider text-center">Qty</th>
                      <th className="px-6 py-3 font-bold text-on-surface-variant text-xs uppercase tracking-wider text-right">Price</th>
                      <th className="px-6 py-3 font-bold text-on-surface-variant text-xs uppercase tracking-wider text-right text-primary">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-outline-variant/10">
                      <td className="px-6 py-4 font-semibold text-on-surface">{selectedInvoice.title}</td>
                      <td className="px-6 py-4 text-center font-medium">{selectedInvoice.size || 'M'}</td>
                      <td className="px-6 py-4 text-center font-medium">{selectedInvoice.quantity}</td>
                      <td className="px-6 py-4 text-right font-medium">₹{selectedInvoice.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-bold text-primary">
                        ₹{((selectedInvoice.price - (selectedInvoice.price * (selectedInvoice.discount || 0)) / 100) * selectedInvoice.quantity).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Invoice Calculations */}
              <div className="w-full flex justify-end">
                <div className="w-64 space-y-3 text-sm font-medium text-on-surface-variant font-body-md">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-on-surface">₹{(selectedInvoice.price * selectedInvoice.quantity).toFixed(2)}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-error bg-error/5 px-2 py-0.5 rounded-lg">
                      <span>Discount ({selectedInvoice.discount}%)</span>
                      <span className="font-bold">-₹{((selectedInvoice.price * selectedInvoice.discount / 100) * selectedInvoice.quantity).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-emerald-500 font-bold uppercase text-xs">Free</span>
                  </div>
                  <div className="border-t border-outline-variant/30 pt-3 flex justify-between items-baseline">
                    <span className="text-base font-bold text-on-surface">Grand Total</span>
                    <span className="text-xl font-black text-primary">
                      ₹{((selectedInvoice.price - (selectedInvoice.price * (selectedInvoice.discount || 0)) / 100) * selectedInvoice.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-outline-variant/20 pt-6 text-center text-xs text-on-surface-variant font-medium">
                <p>Thank you for choosing ShopEZ! If you have questions, contact support@shopez.com</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-outline-variant/20 bg-surface-container-low flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2.5 border border-outline-variant/40 rounded-xl hover:bg-surface-container text-sm font-bold transition-all"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-primary text-white rounded-xl hover:brightness-110 shadow-lg shadow-primary/20 text-sm font-bold flex items-center gap-2 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes draw-check {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-check {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: draw-check 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          animation-delay: 0.2s;
        }
        .glass-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(226, 232, 240, 1); }

        @page {
          size: A4 portrait;
          margin: 12mm;
        }

        @media print {
          html, body, #root {
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: white !important;
          }
          #root > div,
          #root > div > main,
          #root > div > main > main {
            display: block !important;
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            max-width: none !important;
          }
          nav, footer {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          #invoice-print-area, #invoice-print-area * {
            visibility: visible;
          }
          #invoice-print-modal {
            position: static !important;
            inset: auto !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            backdrop-filter: none !important;
          }
          #invoice-print-dialog {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          #invoice-print-area {
            position: static !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
            break-inside: avoid;
          }
        }
      `}</style>
    </main>
  );
}
