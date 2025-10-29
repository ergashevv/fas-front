import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { adminApi } from '@/lib/adminApi';
import { formatDate } from '@/lib/format';
import { Truck, Eye, Edit, Phone, User, MapPin, Package } from 'lucide-react';
import type { Order, AdminUser } from '@shared/api';

const statusLabels = {
  'pending': { label: 'Kutilmoqda', color: 'bg-yellow-100 text-yellow-800' },
  'confirmed': { label: 'Tasdiqlangan', color: 'bg-blue-100 text-blue-800' },
  'preparing': { label: 'Tayyorlanmoqda', color: 'bg-orange-100 text-orange-800' },
  'ready_for_delivery': { label: 'Yetkazish Tayyor', color: 'bg-purple-100 text-purple-800' },
  'in_transit': { label: 'Yo\'lda', color: 'bg-indigo-100 text-indigo-800' },
  'delivered': { label: 'Yetkazilgan', color: 'bg-green-100 text-green-800' },
  'cancelled': { label: 'Bekor qilingan', color: 'bg-red-100 text-red-800' }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState({
    status: '',
    userId: '',
    search: ''
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [courierInfo, setCourierInfo] = useState({ name: '', phone: '' });

  // Fetch orders and users
  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, usersResponse] = await Promise.all([
        adminApi.orders.getAll({
          page: pagination.page,
          limit: pagination.limit,
          status: filters.status || undefined,
          userId: filters.userId || undefined
        }),
        adminApi.users.getAll({ page: 1, limit: 1000 }) // Get all users for filter
      ]);

      setOrders(ordersResponse.orders);
      setPagination(ordersResponse.pagination);
      setUsers(usersResponse.users);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit, filters]);

  // Update order status
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !statusUpdate) return;
    
    try {
      await adminApi.orders.updateStatus(selectedOrder.id, statusUpdate);
      fetchData(); // Refresh data
      setSelectedOrder(null);
      setStatusUpdate('');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Assign courier
  const handleAssignCourier = async () => {
    if (!selectedOrder || !courierInfo.name || !courierInfo.phone) return;
    
    try {
      await adminApi.orders.assignCourier(selectedOrder.id, courierInfo);
      fetchData(); // Refresh data
      setSelectedOrder(null);
      setCourierInfo({ name: '', phone: '' });
    } catch (error) {
      console.error('Error assigning courier:', error);
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (order: Order) => (
        <span className="font-mono text-xs">{order.id.slice(-8)}</span>
      )
    },
    {
      key: 'user',
      label: 'Mijoz',
      render: (order: Order) => {
        const user = users.find(u => u.id === order.userId);
        return (
          <div>
            <p className="font-medium">{user?.name || 'Noma\'lum'}</p>
            <p className="text-xs text-muted-foreground">{user?.phone}</p>
          </div>
        );
      }
    },
    {
      key: 'items',
      label: 'Mahsulotlar',
      render: (order: Order) => (
        <div>
          <p className="font-medium">{order.items.length} ta mahsulot</p>
          <p className="text-xs text-muted-foreground">
            {order.items.slice(0, 2).map(item => item.title).join(', ')}
            {order.items.length > 2 && '...'}
          </p>
        </div>
      )
    },
    {
      key: 'total',
      label: 'Summa',
      render: (order: Order) => (
        <span className="font-semibold">{order.totals.total.toLocaleString()} so'm</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (order: Order) => {
        const status = statusLabels[order.status];
        return (
          <Badge className={status.color}>
            {status.label}
          </Badge>
        );
      }
    },
    {
      key: 'address',
      label: 'Manzil',
      render: (order: Order) => (
        <div className="max-w-xs">
          <p className="text-xs truncate">{order.address.city}, {order.address.street}</p>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Sana',
      render: (order: Order) => (
        <span className="text-sm">{formatDate(order.createdAt)}</span>
      )
    }
  ];

  // Table actions
  const actions = [
    {
      label: 'Ko\'rish',
      icon: <Eye className="w-4 h-4" />,
      onClick: (order: Order) => setSelectedOrder(order)
    },
    {
      label: 'Status O\'zgartirish',
      icon: <Edit className="w-4 h-4" />,
      onClick: (order: Order) => {
        setSelectedOrder(order);
        setStatusUpdate(order.status);
      }
    },
    {
      label: 'Kuryer Tayinlash',
      icon: <Truck className="w-4 h-4" />,
      onClick: (order: Order) => {
        setSelectedOrder(order);
        setCourierInfo({ name: '', phone: '' });
      }
    }
  ];

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Buyurtmalar Boshqaruvi</h1>
          <p className="text-muted-foreground">Barcha buyurtmalarni ko'ring va boshqaring</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Barcha statuslar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Barcha statuslar</SelectItem>
                  {Object.entries(statusLabels).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="user-filter">Mijoz</Label>
              <Select
                value={filters.userId}
                onValueChange={(value) => setFilters(prev => ({ ...prev, userId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Barcha mijozlar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Barcha mijozlar</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.phone})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search">Qidiruv</Label>
              <Input
                id="search"
                placeholder="Buyurtma ID yoki mijoz nomi..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={orders}
            columns={columns}
            actions={actions}
            loading={loading}
            pagination={{
              ...pagination,
              onPageChange: handlePageChange,
              onLimitChange: handleLimitChange
            }}
          />
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Buyurtma Ma'lumotlari #{selectedOrder.id.slice(-8)}</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Buyurtma Ma'lumotlari
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">ID:</p>
                      <p className="font-mono">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status:</p>
                      <Badge className={statusLabels[selectedOrder.status].color}>
                        {statusLabels[selectedOrder.status].label}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sana:</p>
                      <p>{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">To'lov holati:</p>
                      <p className="capitalize">{selectedOrder.paymentStatus}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Mijoz Ma'lumotlari
                  </h3>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Ism:</span> {selectedOrder.address.fullName}</p>
                    <p className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedOrder.address.phone}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Yetkazish Manzili
                  </h3>
                  <div className="text-sm space-y-1">
                    <p>{selectedOrder.address.country}, {selectedOrder.address.city}</p>
                    <p>{selectedOrder.address.street}</p>
                    <p>Pochta indeksi: {selectedOrder.address.zip}</p>
                  </div>
                </div>
              </div>

              {/* Order Items & Totals */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Buyurtma Tarkibi</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start p-2 bg-muted rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.color && `Rang: ${item.color}`} 
                            {item.size && ` • O'lcham: ${item.size}`}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p>{item.qty} × {item.price.toLocaleString()} so'm</p>
                          <p className="font-medium">{(item.qty * item.price).toLocaleString()} so'm</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Hisob-kitob</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Mahsulotlar narxi:</span>
                      <span>{selectedOrder.totals.subtotal.toLocaleString()} so'm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Yetkazish:</span>
                      <span>{selectedOrder.totals.shipping.toLocaleString()} so'm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Soliq:</span>
                      <span>{selectedOrder.totals.tax.toLocaleString()} so'm</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Jami:</span>
                      <span>{selectedOrder.totals.total.toLocaleString()} so'm</span>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Qo'shimcha eslatmalar</h3>
                      <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedOrder(selectedOrder);
                  setStatusUpdate(selectedOrder.status);
                }}
              >
                Status O'zgartirish
              </Button>
              <Button 
                onClick={() => {
                  setSelectedOrder(selectedOrder);
                  setCourierInfo({ name: '', phone: '' });
                }}
              >
                Kuryer Tayinlash
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Status Update Dialog */}
      <Dialog open={!!selectedOrder && !!statusUpdate && statusUpdate !== selectedOrder?.status} onOpenChange={() => {
        setStatusUpdate('');
        setSelectedOrder(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buyurtma Statusini O'zgartirish</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Yangi Status</Label>
              <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Bekor qilish</Button>
            </DialogClose>
            <Button onClick={handleUpdateStatus}>
              Statusni O'zgartirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Courier Assignment Dialog */}
      <Dialog open={!!selectedOrder && courierInfo.name === '' && courierInfo.phone === ''} onOpenChange={() => {
        setCourierInfo({ name: '', phone: '' });
        setSelectedOrder(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kuryer Tayinlash</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="courier-name">Kuryer Ismi</Label>
              <Input
                id="courier-name"
                value={courierInfo.name}
                onChange={(e) => setCourierInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Kuryer ismini kiriting..."
              />
            </div>

            <div>
              <Label htmlFor="courier-phone">Kuryer Telefoni</Label>
              <Input
                id="courier-phone"
                value={courierInfo.phone}
                onChange={(e) => setCourierInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+998 xx xxx xx xx"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Bekor qilish</Button>
            </DialogClose>
            <Button 
              onClick={handleAssignCourier}
              disabled={!courierInfo.name || !courierInfo.phone}
            >
              Kuryer Tayinlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}