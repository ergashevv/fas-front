import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container } from "@/components/core/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminStats, Order } from "@shared/api";
import { useAuth } from "@/store/useAuth";
import { adminApi } from "@/lib/adminApi";
import { 
  Users, 
  Package, 
  ShoppingBag, 
  MessageCircle, 
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Settings,
  Plus,
  Eye
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'moderator')) {
      navigate("/login");
      return;
    }

    const loadStats = async () => {
      try {
        setLoading(true);
        const dashboardStats = await adminApi.getStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error loading admin stats:", error);
        toast.error("Admin statistikalarni yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [isAuthenticated, user, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'ready_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'in_transit': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Kutilmoqda';
      case 'confirmed': return 'Tasdiqlangan';
      case 'preparing': return 'Tayyorlanmoqda';
      case 'ready_for_delivery': return 'Yetkazishga tayyor';
      case 'in_transit': return 'Yo\'lda';
      case 'delivered': return 'Yetkazilgan';
      case 'cancelled': return 'Bekor qilingan';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Xush kelibsiz, {user?.name}! ({user?.role})
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/admin/products")}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Mahsulot qo'shish
              </Button>
              <Button
                onClick={() => navigate("/admin/users")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Foydalanuvchilar
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Jami foydalanuvchilar
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {stats?.totalUsers || 0}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Jami mahsulotlar
                  </CardTitle>
                  <Package className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {stats?.totalProducts || 0}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Jami buyurtmalar
                  </CardTitle>
                  <ShoppingBag className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {stats?.totalOrders || 0}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Jami daromad
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600">
                    {(stats?.totalRevenue || 0).toLocaleString()} so'm
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Orders & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Oxirgi buyurtmalar
                  </CardTitle>
                  <Button
                    onClick={() => navigate("/admin/orders")}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Barchasini ko'rish
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentOrders?.slice(0, 5).map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            #{order.id.slice(-6)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.totals.total.toLocaleString()} so'm
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </motion.div>
                    ))}
                    
                    {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Hozircha buyurtmalar yo'q</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Tezkor amallar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate("/admin/products/new")}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Yangi mahsulot
                    </Button>
                    
                    <Button
                      onClick={() => navigate("/admin/categories")}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Kategoriyalar
                    </Button>
                    
                    <Button
                      onClick={() => navigate("/admin/orders")}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Buyurtmalar
                    </Button>
                    
                    {user?.role === 'admin' && (
                      <Button
                        onClick={() => navigate("/admin/users")}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Foydalanuvchilar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Status Summary */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Buyurtma holati</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats?.ordersByStatus || {}).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {getStatusText(status)}
                        </span>
                        <Badge variant="secondary">
                          {count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}