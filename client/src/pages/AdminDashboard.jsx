import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as adminService from '../services/admin';
import * as ordersService from '../services/orders';
import SkeletonLoader from '../components/common/SkeletonLoader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return {
          label: 'Delivered',
          icon: 'check_circle',
          className: 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-700 border-emerald-300/60 shadow-[0_8px_20px_rgba(16,185,129,0.16)]',
          dotClassName: 'bg-emerald-500',
        };
      case 'shipped':
        return {
          label: 'Shipped',
          icon: 'local_shipping',
          className: 'bg-gradient-to-r from-amber-400/15 to-orange-500/15 text-amber-700 border-amber-300/60 shadow-[0_8px_20px_rgba(245,158,11,0.16)]',
          dotClassName: 'bg-amber-500',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: 'cancel',
          className: 'bg-gradient-to-r from-rose-500/15 to-red-500/15 text-rose-700 border-rose-300/60 shadow-[0_8px_20px_rgba(244,63,94,0.14)]',
          dotClassName: 'bg-rose-500',
        };
      default:
        return {
          label: status || 'Pending',
          icon: 'schedule',
          className: 'bg-gradient-to-r from-sky-500/15 to-cyan-500/15 text-sky-700 border-sky-300/60 shadow-[0_8px_20px_rgba(14,165,233,0.14)]',
          dotClassName: 'bg-sky-500',
        };
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ordersService.updateOrderStatus(id, { orderStatus: newStatus });
      setStats((prev) => ({
        ...prev,
        recentOrders: prev.recentOrders.map((o) =>
          o._id === id ? { ...o, orderStatus: newStatus } : o
        ),
      }));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Error updating status');
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExportData = () => {
    if (!stats) return;
    
    let csvContent = "\ufeffMetric,Value\n";
    csvContent += `Total Revenue,₹${stats.totalRevenue || 0}\n`;
    csvContent += `Total Orders,${stats.totalOrders || 0}\n`;
    csvContent += `Active Products,${stats.totalProducts || 0}\n`;
    csvContent += `Total Customers,${stats.totalUsers || 0}\n\n`;

    if (stats.recentOrders && stats.recentOrders.length > 0) {
      csvContent += "Recent Orders\n";
      csvContent += "Order ID,Customer,Status,Date,Amount (₹)\n";
      stats.recentOrders.forEach((order) => {
        const orderId = `#EZ-${order._id.substring(order._id.length - 6).toUpperCase()}`;
        const customer = order.name ? `"${order.name.replace(/"/g, '""')}"` : "";
        const status = order.orderStatus || 'Pending';
        const date = new Date(order.orderDate).toLocaleDateString();
        const amount = ((order.price * (1 - (order.discount || 0) / 100)) * order.quantity).toFixed(2);
        csvContent += `${orderId},${customer},${status},${date},₹${amount}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `ShopEZ_Dashboard_Stats_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl max-w-container-max mx-auto px-6 md:px-margin-desktop">
        <div className="space-y-6">
          <SkeletonLoader variant="text" className="w-64 h-8 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonLoader key={i} variant="rectangle" className="h-32 rounded-3xl" />
            ))}
          </div>
          <SkeletonLoader variant="rectangle" className="h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: 'payments',
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      trend: '+24%',
    },
    {
      title: 'New Orders',
      value: stats?.totalOrders || 0,
      icon: 'shopping_cart',
      color: 'from-primary to-primary-container',
      textColor: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: stats?.recentOrders?.length > 5 ? '+12%' : '0%',
    },
    {
      title: 'Active Products',
      value: stats?.totalProducts || 0,
      icon: 'inventory_2',
      color: 'from-secondary to-secondary-container',
      textColor: 'text-secondary',
      bgColor: 'bg-secondary/10',
      trend: '+3%',
    },
    {
      title: 'Total Customers',
      value: stats?.totalUsers || 0,
      icon: 'group',
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-tertiary',
      bgColor: 'bg-tertiary/10',
      trend: '+12%',
    },
  ];

  return (
    <main className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl max-w-container-max mx-auto px-6 md:px-margin-desktop">
      {/* Header */}
      <header className="flex justify-between items-end mb-stack-xl">
        <div>
          <h2 className="font-display-lg text-display-lg text-primary">Welcome back, Admin</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleExportData}
            className="bg-surface-container-high border border-outline/20 px-6 py-3 rounded-xl font-label-caps text-label-caps flex items-center gap-2 hover:bg-surface-container-highest transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export Data
          </button>
          <Link
            to="/admin/add-product"
            className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-caps text-label-caps flex items-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Product
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-xl">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-outline-variant/30 rounded-2xl p-stack-lg flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-default group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 ${stat.bgColor} ${stat.textColor} rounded-xl`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <span className="font-status-badge text-status-badge px-2 py-1 bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim rounded-full flex items-center gap-1">
                {stat.trend} <span className="material-symbols-outlined text-[14px]">trending_up</span>
              </span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant/60 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="font-headline-md text-headline-md font-bold tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-sm mb-stack-xl">
        <h4 className="font-headline-sm text-headline-sm border-b border-outline-variant/20 pb-3 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
          {[
            { label: 'Manage Products', link: '/admin/products', icon: 'inventory_2', color: 'bg-primary/10 text-primary' },
            { label: 'Manage Orders', link: '/admin/orders', icon: 'shopping_bag', color: 'bg-secondary/10 text-secondary' },
            { label: 'Manage Users', link: '/admin/users', icon: 'group', color: 'bg-tertiary/10 text-tertiary' },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.link}
              className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/45 hover:bg-surface-container-low/20 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${action.color}`}>
                  <span className="material-symbols-outlined">{action.icon}</span>
                </div>
                <span className="font-bold text-sm text-on-surface">{action.label}</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all">arrow_forward</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Orders Table */}
      <div className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden">
        <div className="px-6 py-stack-md flex justify-between items-center border-b border-outline-variant/20">
          <h4 className="font-headline-sm text-headline-sm">Recent Orders</h4>
          <Link to="/admin/orders" className="text-primary font-label-caps text-label-caps hover:underline">View All Orders</Link>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-high/30 font-label-caps text-label-caps text-on-surface-variant/60">
               <tr>
                 <th className="px-6 py-4">Order ID</th>
                 <th className="px-6 py-4">Customer</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4">Date</th>
                 <th className="px-6 py-4 text-right">Amount</th>
                 <th className="px-6 py-4 text-right">Actions</th>
               </tr>
             </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.orderStatus);

                  return (
                  <tr key={order._id} className="hover:bg-surface-container-high/10 transition-colors group">
                    <td className="px-6 py-4 font-label-caps text-primary">#EZ-{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[12px] font-bold">
                           {order.name?.charAt(0)?.toUpperCase() || 'U'}
                         </div>
                         <span className="font-body-md">{order.name}</span>
                       </div>
                     </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-status-badge border backdrop-blur-sm ${statusBadge.className}`}>
                        <span className={`h-2 w-2 rounded-full ${statusBadge.dotClassName}`}></span>
                        <span className="material-symbols-outlined text-[14px] leading-none">{statusBadge.icon}</span>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-label-caps opacity-60">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right font-bold">₹{((order.price * (1 - (order.discount || 0) / 100)) * order.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === order._id ? null : order._id)}
                        className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                      </button>
                      {activeMenuId === order._id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-44 rounded-xl border border-outline-variant bg-white shadow-xl z-20 py-1 text-left">
                            <button
                              onClick={() => { handleStatusChange(order._id, 'shipped'); setActiveMenuId(null); }}
                              className="w-full px-4 py-2.5 text-xs text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2 font-medium"
                            >
                              <span className="material-symbols-outlined text-[16px] text-amber-500">local_shipping</span>
                              Mark as Shipped
                            </button>
                            <button
                              onClick={() => { handleStatusChange(order._id, 'delivered'); setActiveMenuId(null); }}
                              className="w-full px-4 py-2.5 text-xs text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2 font-medium"
                            >
                              <span className="material-symbols-outlined text-[16px] text-emerald-500">check_circle</span>
                              Mark as Delivered
                            </button>
                            <button
                              onClick={() => { handleStatusChange(order._id, 'cancelled'); setActiveMenuId(null); }}
                              className="w-full px-4 py-2.5 text-xs text-error hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
                            >
                              <span className="material-symbols-outlined text-[16px]">cancel</span>
                              Cancel Order
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                )})
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-on-surface-variant/60">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
