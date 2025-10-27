import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/core/Container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User, Phone, Mail, LogOut, ShoppingBag, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/store/useAuth";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Tizimdan chiqdingiz");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600">Profil</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Chiqish
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Telefon</p>
                  <p className="font-semibold text-gray-900">{user.phone}</p>
                </div>
              </div>
              {user.email && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{user.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate("/orders")}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Buyurtmalarim</h3>
                  <p className="text-gray-600 text-sm">Barcha buyurtmalar</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate("/products")}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Sharhlarim</h3>
                  <p className="text-gray-600 text-sm">Yozgan sharhlarim</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mt-6 text-white"
          >
            <h3 className="text-2xl font-bold mb-2">Xush kelibsiz!</h3>
            <p className="text-white/90">
              Endi siz sharh qoldirish va buyurtma berish imkoniyatiga ega bo'ldingiz.
              Xaridlaringizdan rohatlaning! 🎉
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}