import React, { useEffect, useState } from 'react';
import { Users, Search, Shield, User, KeyRound, CheckCircle, XCircle } from 'lucide-react';
import { apiRequest } from '../services/api';
import { User as UserModel } from '../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Password reset modal state
  const [resetModalUser, setResetModalUser] = useState<UserModel | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest(`/admin/users?search=${encodeURIComponent(search)}`);
      setUsers(res.users || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
    try {
      await apiRequest(`/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update user status');
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'ADMIN' ? 'STUDENT' : 'ADMIN';
    try {
      await apiRequest(`/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: nextRole }),
      });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser || !newPassword) return;
    setResetMsg(null);

    try {
      const res = await apiRequest(`/admin/users/${resetModalUser.id}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ newPassword }),
      });

      setResetMsg(res.message);
      setTimeout(() => {
        setResetModalUser(null);
        setNewPassword('');
        setResetMsg(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to reset user password');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-teal-400" /> User Management
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor player accounts, toggle status, update permissions, or reset passwords
        </p>
      </div>

      {/* Search Bar */}
      <div className="game-card p-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email address..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-display font-bold text-sm text-slate-400">Loading user accounts...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-400 font-bold">{error}</div>
      ) : (
        <div className="game-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-display">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Level / XP</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/60">
                    <td className="py-3.5 px-4 font-bold font-display text-sm text-slate-100">
                      {u.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold font-display border transition-all cursor-pointer ${
                          u.role === 'ADMIN'
                            ? 'bg-teal-950 text-teal-300 border-teal-700 hover:bg-teal-900'
                            : 'bg-purple-950 text-purple-300 border-purple-700 hover:bg-purple-900'
                        }`}
                        title="Click to toggle role between ADMIN and STUDENT"
                      >
                        {u.role}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-amber-400">Lvl {u.level}</span> ({u.xp} XP)
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleStatusToggle(u.id, u.status || 'ACTIVE')}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold font-display border transition-all cursor-pointer ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : 'bg-rose-950 text-rose-300 border-rose-700'
                        }`}
                        title="Click to toggle status"
                      >
                        {u.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setResetModalUser(u)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-amber-950 hover:text-amber-300 border border-slate-700 transition-colors"
                        title="Reset User Password"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-xl text-slate-100">
              Reset Password for {resetModalUser.name}
            </h3>

            {resetMsg ? (
              <p className="text-xs text-emerald-400 font-bold">{resetMsg}</p>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                    New Temporary Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 chars"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setResetModalUser(null)}
                    className="btn-game btn-game-gray px-5 py-2.5 text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-game btn-game-amber px-6 py-2.5 text-xs">
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
