import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as adminService from '../services/admin';
import SkeletonLoader from '../components/common/SkeletonLoader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
      value: `$${stats?.totalRevenue?.toLocaleString() || 0}`,
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
          <button className="bg-surface-container-high border border-outline/20 px-6 py-3 rounded-xl font-label-caps text-label-caps flex items-center gap-2 hover:bg-surface-container-highest transition-all active:scale-95">
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

      {/* Charts + Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white border border-outline-variant/30 rounded-2xl overflow-hidden">
          <div className="px-stack-lg py-stack-md flex justify-between items-center border-b border-outline-variant/20">
            <h4 className="font-headline-sm text-headline-sm">Recent Orders</h4>
            <Link to="/admin/orders" className="text-primary font-label-caps text-label-caps hover:underline">View All Orders</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-high/30 font-label-caps text-label-caps text-on-surface-variant/60">
                <tr>
                  <th className="px-stack-lg py-4">Order ID</th>
                  <th className="px-stack-lg py-4">Customer</th>
                  <th className="px-stack-lg py-4">Status</th>
                  <th className="px-stack-lg py-4">Date</th>
                  <th className="px-stack-lg py-4 text-right">Amount</th>
                  <th className="px-stack-lg py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {stats?.recentOrders?.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-surface-container-high/10 transition-colors group">
                      <td className="px-stack-lg py-4 font-label-caps text-primary">#EZ-{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                      <td className="px-stack-lg py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[12px] font-bold">
                            {order.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <span className="font-body-md">{order.name}</span>
                        </div>
                      </td>
                      <td className="px-stack-lg py-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-status-badge border ${
                          order.orderStatus === 'delivered' ? 'bg-secondary-container/20 text-on-secondary-container border-secondary-container/30' :
                          order.orderStatus === 'cancelled' ? 'bg-error/10 text-error border-error/20' :
                          'bg-tertiary-fixed-dim/10 text-tertiary-fixed-dim border-tertiary-fixed-dim/20'
                        }`}>
                          {order.orderStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="px-stack-lg py-4 font-label-caps opacity-60">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="px-stack-lg py-4 text-right font-bold">${((order.price * (1 - (order.discount || 0) / 100)) * order.quantity).toFixed(2)}</td>
                      <td className="px-stack-lg py-4 text-right">
                        <button className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-on-surface-variant/60">No recent orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-sm space-y-6">
          <h4 className="font-headline-sm text-headline-sm border-b border-outline-variant/20 pb-3">Quick Actions</h4>
          <div className="space-y-3">
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
        </div>
      </div>
    </main>
  );
}
