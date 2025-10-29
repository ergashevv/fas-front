import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { adminApi } from '@/lib/adminApi';
import { formatDate } from '@/lib/format';
import { UserPlus, Eye, Shield, ShieldCheck, UserCheck, UserX, Phone, Calendar } from 'lucide-react';
import type { AdminUser } from '@shared/api';

const roleLabels = {
  'admin': { label: 'Admin', color: 'bg-red-100 text-red-800' },
  'moderator': { label: 'Moderator', color: 'bg-blue-100 text-blue-800' },
  'user': { label: 'Foydalanuvchi', color: 'bg-green-100 text-green-800' }
};

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    search: ''
  });
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    phone: '',
    role: 'user' as 'admin' | 'moderator' | 'user',
    password: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.users.getAll({
        page: pagination.page,
        limit: pagination.limit,
        role: filters.role || undefined,
        isActive: filters.isActive || undefined,
        search: filters.search || undefined
      });

      setUsers(response.users);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, filters]);

  // Create user
  const handleSaveUser = async () => {
    try {
      await adminApi.users.create(userForm);
      fetchUsers();
      handleCloseUserDialog();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Toggle user status
  const handleToggleStatus = async (user: AdminUser) => {
    try {
      await adminApi.users.toggleStatus(user.id);
      fetchUsers();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Update user role
  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'moderator' | 'user') => {
    try {
      await adminApi.users.changeRole(userId, newRole);
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleOpenCreateDialog = () => {
    setUserForm({ name: '', phone: '', role: 'user', password: '' });
    setIsCreating(true);
  };

  const handleCloseUserDialog = () => {
    setSelectedUser(null);
    setIsCreating(false);
    setUserForm({ name: '', phone: '', role: 'user', password: '' });
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Foydalanuvchi',
      render: (user: AdminUser) => (
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.phone}</p>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Rol',
      render: (user: AdminUser) => (
        <Badge className={roleLabels[user.role].color}>
          {roleLabels[user.role].label}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (user: AdminUser) => (
        <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {user.isActive ? 'Faol' : 'Nofaol'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Qo\'shilgan',
      render: (user: AdminUser) => (
        <span className="text-sm">{formatDate(user.createdAt)}</span>
      )
    },
    {
      key: 'lastLogin',
      label: 'Oxirgi kirish',
      render: (user: AdminUser) => (
        <span className="text-sm">
          {user.lastLogin ? formatDate(user.lastLogin) : 'Hech qachon'}
        </span>
      )
    }
  ];

  // Table actions
  const actions = [
    {
      label: 'Ko\'rish',
      icon: <Eye className="w-4 h-4" />,
      onClick: (user: AdminUser) => setSelectedUser(user)
    },
    {
      label: 'Status O\'zgartirish',
      icon: <UserX className="w-4 h-4" />,
      onClick: handleToggleStatus
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Foydalanuvchilar</h1>
          <p className="text-muted-foreground">Tizim foydalanuvchilarini boshqaring</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreateDialog}>
              <UserPlus className="w-4 h-4 mr-2" />
              Yangi Foydalanuvchi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi Foydalanuvchi</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Ism *</Label>
                <Input
                  id="name"
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ism kiriting..."
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  value={userForm.phone}
                  onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+998 xx xxx xx xx"
                />
              </div>

              <div>
                <Label htmlFor="role">Rol *</Label>
                <Select
                  value={userForm.role}
                  onValueChange={(value: 'admin' | 'moderator' | 'user') => 
                    setUserForm(prev => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([key, value]) => (
                      <SelectItem key={key} value={key}>{value.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="password">Parol *</Label>
                <Input
                  id="password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Parol kiriting..."
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCloseUserDialog}>
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button 
                onClick={handleSaveUser}
                disabled={!userForm.name || !userForm.phone || !userForm.password}
              >
                Qo'shish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Rol</Label>
              <Select
                value={filters.role}
                onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Barcha rollar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Barcha rollar</SelectItem>
                  {Object.entries(roleLabels).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={filters.isActive}
                onValueChange={(value) => setFilters(prev => ({ ...prev, isActive: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Barcha statuslar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Barcha statuslar</SelectItem>
                  <SelectItem value="true">Faol</SelectItem>
                  <SelectItem value="false">Nofaol</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Qidiruv</Label>
              <Input
                placeholder="Ism yoki telefon..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={users}
            columns={columns}
            actions={actions}
            loading={loading}
            pagination={{
              ...pagination,
              onPageChange: (newPage: number) => setPagination(prev => ({ ...prev, page: newPage })),
              onLimitChange: (newLimit: number) => setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))
            }}
          />
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Foydalanuvchi Ma'lumotlari</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Asosiy Ma'lumotlar</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">ID:</span> {selectedUser.id}</p>
                  <p><span className="text-muted-foreground">Ism:</span> {selectedUser.name}</p>
                  <p><span className="text-muted-foreground">Telefon:</span> {selectedUser.phone}</p>
                  <p><span className="text-muted-foreground">Qo'shilgan:</span> {formatDate(selectedUser.createdAt)}</p>
                  <p><span className="text-muted-foreground">Oxirgi kirish:</span> {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Hech qachon'}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Rol va Status</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Joriy Rol:</Label>
                    <div className="mt-1">
                      <Badge className={roleLabels[selectedUser.role].color}>
                        {roleLabels[selectedUser.role].label}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label>Yangi Rol:</Label>
                    <Select
                      value={selectedUser.role}
                      onValueChange={(value: 'admin' | 'moderator' | 'user') => 
                        handleUpdateRole(selectedUser.id, value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleLabels).map(([key, value]) => (
                          <SelectItem key={key} value={key}>{value.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Status</Label>
                    <Switch
                      checked={selectedUser.isActive}
                      onCheckedChange={() => handleToggleStatus(selectedUser)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setSelectedUser(null)}>
                Yopish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}