import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "./Container";
import { useUI } from "@/store/useUI";
import { useCart } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useTranslation } from "@/lib/useTranslation";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { showMobileMenu, setShowMobileMenu } = useUI();
  const cartItems = useCart((s) => s.items);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <motion.header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled ? "glass-morphism shadow-lg" : "bg-white/80 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <div className="border-b">
        <Container>
          <div className="flex items-center justify-between h-16 gap-4">
            <Logo />

            <div className="hidden md:flex flex-1 max-w-md">
              <form onSubmit={handleSearch} className="relative w-full">
                <Input
                  type="search"
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={handleSearchInput}
                  className="w-full pl-10 pr-4 rounded-full border-2 border-primary/20 focus:border-primary"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </form>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
              <Link
                to="/gender/boy"
                className="text-sm font-medium hover:text-primary transition"
              >
                {t("boys")}
              </Link>
              <Link
                to="/gender/girl"
                className="text-sm font-medium hover:text-primary transition"
              >
                {t("girls")}
              </Link>
              <Link
                to="/category/accessories"
                className="text-sm font-medium hover:text-primary transition"
              >
                {t("accessories")}
              </Link>
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              <LanguageSwitcher />
              <button className="p-2 hover:bg-secondary/20 rounded-full transition">
                <User className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-secondary/20 rounded-full transition">
                <Search className="w-5 h-5 md:hidden" />
              </button>
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Button>
              </Link>
              <button
                className="lg:hidden p-2"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-b bg-white"
        >
          <Container className="py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder={t("search")}
                value={searchQuery}
                onChange={handleSearchInput}
                className="w-full pl-10 pr-4 rounded-full border-2 border-primary/20"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </form>
            <div className="flex justify-center mb-4">
              <LanguageSwitcher />
            </div>
            <nav className="flex flex-col gap-3">
              <Link to="/gender/boy" className="text-sm font-medium py-2">
                {t("boys")}
              </Link>
              <Link to="/gender/girl" className="text-sm font-medium py-2">
                {t("girls")}
              </Link>
              <Link
                to="/category/accessories"
                className="text-sm font-medium py-2"
              >
                {t("accessories")}
              </Link>
              <Link to="/products" className="text-sm font-medium py-2">
                {t("allProducts")}
              </Link>
            </nav>
          </Container>
        </motion.div>
      )}
    </motion.header>
  );
};
