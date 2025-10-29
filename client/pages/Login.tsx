import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Heart, Star, Sparkles, AlertCircle } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";
import { useAuth } from "@/store/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [phone, setPhone] = useState("+998-");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { login, isLoading, error, clearError, validatePhone } = useAuth();
  const { toast } = useToast();

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    let rest = digits.startsWith("998") ? digits.slice(3) : digits;
    rest = rest.slice(0, 9);
    const parts = [rest.slice(0, 2), rest.slice(2, 5), rest.slice(5, 7), rest.slice(7, 9)];
    const joined = parts.filter(Boolean).join("-");
    return `+998-${joined}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      // Basic client-side validation
      if (!validatePhone(phone)) {
        toast({
          title: t("error"),
          description: "Telefon raqami noto'g'ri. +998 XX XXX XX XX shaklida kiriting.",
          variant: "destructive",
        });
        return;
      }
      if ((password || '').length < 6) {
        toast({
          title: t("error"),
          description: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
          variant: "destructive",
        });
        return;
      }
      await login(phone, password);
      toast({
        title: t("success"),
        description: t("login.subtitle"),
      });
      // Redirect to the page they tried to access, or profile by default
      const from = (location.state as any)?.from?.pathname || "/profile";
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen gradient-candy flex items-center justify-center p-4">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-8 h-8 bg-yellow-300 rounded-full opacity-60"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-6 h-6 bg-pink-300 rounded-full opacity-60"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-10 h-10 bg-blue-300 rounded-full opacity-60"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-4 h-4 bg-green-300 rounded-full opacity-60"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="child-friendly-shadow border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse-glow">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t("login.title")}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                {t("login.subtitle")}
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  {t("login.phone") || "Telefon"}
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                inputMode="numeric"
                    placeholder="+998 90 123 45 67"
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 hover:border-purple-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {t("login.password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("login.passwordPlaceholder")}
                    className="pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 hover:border-purple-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    {t("login.remember")}
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                >
                  {t("login.forgot")}
                </Link>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    t("login.button")
                  )}
                </Button>
              </motion.div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-600">
                {t("login.noAccount")}{" "}
                <Link
                  to="/signup"
                  className="text-purple-600 hover:text-purple-800 font-semibold transition-colors"
                >
                  {t("login.signup")}
                </Link>
              </p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Decorative stars */}
        <div className="absolute top-10 left-10 animate-wiggle">
          <Star className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="absolute top-20 right-16 animate-float">
          <Star className="w-4 h-4 text-pink-400" />
        </div>
        <div className="absolute bottom-20 left-16 animate-bounce-gentle">
          <Star className="w-5 h-5 text-blue-400" />
        </div>
      </motion.div>
    </div>
  );
}
