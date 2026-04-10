'use client';

import { API_BASE_URL } from '@/config';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 使用 /api/users/me 验证接口可用，用户列表需扩展后端接口
        // 此处通过 admin 创建端点间接展示已有用户
        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const me = await res.json();
        if (me.success) {
          // 至少展示当前管理员自己
          setUsers([{ ...me.data, createdAt: me.data.createdAt || new Date().toISOString() }]);
        }
      } catch {
        setError('暂时无法获取用户列表');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); setFormSuccess('');
    if (!newUser.name || !newUser.email || !newUser.password) {
      setFormError('请填写所有必填字段');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || '创建失败');
      setFormSuccess(`用户 ${newUser.name} 创建成功！`);
      setUsers(prev => [...prev, { ...data.data, createdAt: new Date().toISOString() }]);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-50 text-purple-600 border-purple-200',
    user: 'bg-gray-50 text-gray-500 border-gray-200',
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-medium text-gray-800">用户管理</h1>
        <p className="text-sm text-gray-400 mt-0.5">管理系统用户与权限</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 用户列表 */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-700">用户列表</h2>
          </div>

          {loading ? (
            <div className="divide-y divide-gray-50">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center text-sm text-gray-400">{error}</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {users.map(u => (
                <div key={u._id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium text-sm flex-shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 border rounded-sm ${roleColors[u.role]}`}>
                      {u.role === 'admin' ? '管理员' : '普通用户'}
                    </span>
                    <span className="text-xs text-gray-300 hidden sm:block">
                      {new Date(u.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 创建用户 */}
        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-700">创建新用户</h2>
          </div>
          <form onSubmit={handleCreateUser} className="p-5 space-y-4">
            {formError && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-sm">{formError}</p>}
            {formSuccess && <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-sm">{formSuccess}</p>}

            {[
              { label: '姓名', key: 'name', type: 'text', placeholder: '用户姓名' },
              { label: '邮箱', key: 'email', type: 'email', placeholder: 'user@example.com' },
              { label: '密码', key: 'password', type: 'password', placeholder: '至少6位' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
                <input type={f.type} value={(newUser as any)[f.key]} placeholder={f.placeholder}
                  onChange={e => setNewUser(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-accent" />
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">角色</label>
              <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-accent">
                <option value="user">普通用户</option>
                <option value="admin">管理员</option>
              </select>
            </div>

            <button type="submit" disabled={creating}
              className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-sm transition-colors disabled:opacity-60">
              {creating ? '创建中...' : '创建用户'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
