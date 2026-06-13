import { useState, useEffect } from 'react';
import * as adminService from '../services/admin';
import SkeletonLoader from '../components/common/SkeletonLoader';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl max-w-container-max mx-auto px-6 md:px-margin-desktop">
      {/* Header */}
      <header className="flex justify-between items-center mb-stack-xl">
        <div>
          <h2 className="font-headline-sm text-headline-sm tracking-tight text-on-surface">Customer Management</h2>
          <p className="text-on-surface-variant font-body-md text-body-md opacity-80">Review registered user accounts and authorization roles.</p>
        </div>
      </header>

      {/* User Table */}
      <div className="bg-white border border-outline-variant/30 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <SkeletonLoader key={i} variant="rectangle" className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/10 border-b border-outline-variant/10">
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">User</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Email Address</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Joined Date</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Role</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-surface-container-highest/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        u.userType === 'admin'
                          ? 'bg-primary-container/20 text-primary'
                          : 'bg-secondary-container/20 text-secondary'
                      }`}>
                        {u.username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-body-md text-body-md font-semibold">{u.username}</p>
                        {u.userType === 'admin' && (
                          <span className="bg-primary/10 text-primary text-[9px] uppercase px-2 py-0.5 rounded-full font-bold">Admin</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center">
                    {u.userType === 'admin' ? (
                      <span className="px-3 py-1 text-[11px] font-bold rounded-lg border bg-primary/10 text-primary border-primary/20 uppercase tracking-wider">Administrator</span>
                    ) : (
                      <span className="px-3 py-1 text-[11px] font-bold rounded-lg border bg-surface-container text-on-surface-variant border-outline-variant/20 uppercase tracking-wider">Customer</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="px-4 py-1.5 border border-outline/30 rounded-full text-[11px] font-label-caps uppercase hover:bg-surface-container-highest transition-all text-error hover:border-error/30">
                        Block User
                      </button>
                      <button className="px-4 py-1.5 border border-error/30 text-error rounded-full text-[11px] font-label-caps uppercase hover:bg-error/10 transition-all">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-on-surface-variant/60 font-semibold">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
