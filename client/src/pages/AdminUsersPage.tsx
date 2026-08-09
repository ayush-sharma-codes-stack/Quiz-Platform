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
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white flex items-center gap-3 tracking-tight">
          <Users className="w-9 h-9 text-teal-400" /> Player Account Management
        </h1>
        <p className="text-slate-300 font-semibold text-sm mt-1">
          Monitor accounts, toggle status, update permissions, and reset passwords
        </p>
      </div>

      {/* Search Bar */}
      <div className="game-card p-4 border-2 border-slate-700/80">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search players by name or email..."
            className="w-full bg-slate-950/90 border-2 border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin shadow-game-glow-teal" />
          <p className="font-display font-black text-base text-teal-300 animate-pulse">Loading player accounts...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-400 font-black text-lg">{error}</div>
      ) : (
        <div className="game-card p-6 border-2 border-slate-800 shadow-game-teal-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-800 text-slate-300 uppercase font-display tracking-wider">
                  <th className="py-3.5 px-4">Player Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Level / XP</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-bold text-slate-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/80 transition-colors">
                    <td className="py-4 px-4 font-black font-display text-sm text-white">{u.name}</td>
                    <td className="py-4 px-4 text-slate-400 font-semibold">{u.email}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        className={`badge-3d cursor-pointer hover:scale-105 transition-transform ${
                          u.role === 'ADMIN'
                            ? 'bg-teal-950 text-teal-300 border-teal-700'
                            : 'bg-purple-950 text-purple-300 border-purple-700'
                        }`}
                        title="Click to toggle role"
                      >
                        {u.role}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-black text-amber-400">Lv.{u.level}</span>
                      <span className="text-slate-400 font-semibold ml-1">({u.xp} XP)</span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleStatusToggle(u.id, u.status || 'ACTIVE')}
                        className={`badge-3d cursor-pointer hover:scale-105 transition-transform ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : 'bg-rose-950 text-rose-300 border-rose-700'
                        }`}
                        title="Click to toggle status"
                      >
                        {u.status}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setResetModalUser(u)}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-950/60 hover:text-amber-300 border-2 border-slate-700 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="game-card border-2 border-amber-600/40 shadow-game-amber p-8 max-w-md w-full space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-display font-black text-xl text-white">
                Reset Password – {resetModalUser.name}
              </h3>
            </div>

            {resetMsg ? (
              <p className="text-sm text-emerald-400 font-black">{resetMsg}</p>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2 font-display">
                    New Temporary Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 chars"
                    className="w-full bg-slate-950/90 border-2 border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalUser(null)}
                    className="btn-game btn-game-gray px-5 py-3 text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-game btn-game-amber px-6 py-3 text-xs">
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
