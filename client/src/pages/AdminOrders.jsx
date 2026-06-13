import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as adminService from '../services/admin';
import * as ordersService from '../services/orders';
import SkeletonLoader from '../components/common/SkeletonLoader';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await adminService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ordersService.updateOrderStatus(id, { orderStatus: newStatus });
      setOrders(orders.map((o) => (o._id === id ? { ...o, orderStatus: newStatus } : o)));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Error updating status');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'shipped':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <main className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl max-w-container-max mx-auto px-6 md:px-margin-desktop">
      {/* Back button */}
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 font-semibold text-sm w-fit"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Dashboard
      </Link>

      <div className="border-b border-outline-variant/20 pb-4 mb-8">
        <h1 className="font-headline-sm sm:font-headline-md font-bold text-on-surface">Manage Orders</h1>
        <p className="text-xs text-on-surface-variant mt-1">Review and update customer transactions and delivery states</p>
      </div>

      <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonLoader key={i} variant="rectangle" className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-outline-variant/20 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="pb-3 px-4">Order ID</th>
                  <th className="pb-3 px-4">Customer</th>
                  <th className="pb-3 px-4">Product Name</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Amount</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-sm font-medium text-on-surface">
                {orders.map((order) => {
                  const discountedPrice = order.discount
                    ? order.price - (order.price * order.discount) / 100
                    : order.price;
                  const totalOrderPrice = discountedPrice * order.quantity;

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-surface-container-low/20 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-on-surface">
                        #{order._id.substring(order._id.length - 6).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-on-surface">{order.name}</div>
                        <div className="text-xs text-on-surface-variant/80 font-semibold mt-0.5">{order.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="truncate max-w-xs font-bold text-on-surface">{order.title}</div>
                        <span className="text-xs text-on-surface-variant font-semibold">
                          Qty: {order.quantity} {order.size && `| Size: ${order.size}`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant/80">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-primary">
                        ₹{totalOrderPrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus || 'Placed'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <select
                          value={order.orderStatus || 'order placed'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="text-xs bg-surface-container-low border border-outline-variant/40 rounded-xl py-1.5 px-3 font-semibold text-on-surface outline-none focus:border-primary cursor-pointer transition-colors"
                        >
                          <option value="order placed">Placed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-on-surface-variant/60 font-semibold">
                      No orders found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
