import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Heart, Star, Sparkles, Gift, AlertCircle } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";
import { useAuth } from "@/store/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { signup, isLoading, error, clearError, validatePhone } = useAuth();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    console.log("📝 Form submitted with data:", { ...formData, password: "***", confirmPassword: "***" });
    
    // Basic client-side validation
    if ((formData.name || '').trim().length < 2) {
      toast({ title: t("error"), description: "Ism kamida 2 ta belgidan iborat bo'lsin", variant: "destructive" });
      return;
    }
    if (!validatePhone(formData.phone)) {
      toast({ title: t("error"), description: "Telefon raqami noto'g'ri. +998 XX XXX XX XX shaklida kiriting.", variant: "destructive" });
      return;
    }
    if ((formData.password || '').length < 6) {
      toast({ title: t("error"), description: "Parol kamida 6 ta belgidan iborat bo'lishi kerak", variant: "destructive" });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      console.log("❌ Passwords don't match");
      toast({
        title: t("error"),
        description: "Parollar mos kelmaydi",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("🚀 Calling signup function...");
      await signup({ name: formData.name, phone: formData.phone, password: formData.password });
      console.log("✅ Signup successful!");
      toast({
        title: t("success"),
        description: "Ro'yxatdan o'tish muvaffaqiyatli",
      });
      navigate("/profile");
    } catch (error: any) {
      console.error("❌ Signup failed in component:", error);
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen gradient-ocean flex items-center justify-center p-4">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-8 h-8 bg-yellow-300 rounded-full opacity-60"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-6 h-6 bg-pink-300 rounded-full opacity-60"
          animate={{ y: [0, 15, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-10 h-10 bg-blue-300 rounded-full opacity-60"
          animate={{ y: [0, -25, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-4 h-4 bg-green-300 rounded-full opacity-60"
          animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-60 left-1/2 w-6 h-6 bg-purple-300 rounded-full opacity-60"
          animate={{ y: [0, -30, 0], rotate: [0, 360] }}
          transition={{ duration: 3.5, repeat: Infinity }}
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
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse-glow">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -left-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart className="w-4 h-4 text-pink-400" />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("signup.title")}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                {t("signup.subtitle")}
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-4"
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
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  {t("signup.name")}
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("signup.namePlaceholder")}
                  className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-blue-300"
                  required
                />
              </div>



              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  {t("signup.phone")}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("signup.phonePlaceholder")}
                  className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-blue-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {t("signup.password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t("signup.passwordPlaceholder")}
                    className="pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-blue-300"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  {t("signup.confirmPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t("signup.confirmPasswordPlaceholder")}
                    className="pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-blue-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  required
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  {t("signup.agreeTerms")}{" "}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                    {t("signup.terms")}
                  </Link>
                </Label>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    t("signup.button")
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
                {t("signup.haveAccount")}{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  {t("signup.login")}
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
        <div className="absolute bottom-40 right-20 animate-sparkle">
          <Star className="w-3 h-3 text-green-400" />
        </div>
      </motion.div>
    </div>
  );
}
