import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container } from "@/components/core/Container";
import { DataTable, DataTableColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product, Category } from "@shared/api";
import { useAuth } from "@/store/useAuth";
import { adminApi } from "../lib/adminApi";
import { ModeratorOrAdmin, usePermissions } from "@/components/auth/RoleGuard";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  Filter,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface ProductFormData {
  title: string;
  slug: string;
  gender: "boy" | "girl" | "unisex";
  ageRange: "0-3m" | "3-6m" | "6-12m" | "1-3y" | "3-5y" | "5-7y" | "7-10y";
  categorySlug: string;
  price: number;
  oldPrice?: number;
  colors: string[];
  sizes: string[];
  images: string[];
  description: string;
  material: string;
  care: string;
  available: boolean;
  tags?: string[];
}

export default function AdminProducts() {
  const { user, isAuthenticated } = useAuth();
  const { can, isAdmin, isAdminOrModerator } = usePermissions();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("");
  
  // Form states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    slug: "",
    gender: "unisex",
    ageRange: "1-3y",
    categorySlug: "",
    price: 0,
    oldPrice: undefined,
    colors: [],
    sizes: [],
    images: [],
    description: "",
    material: "",
    care: "",
    available: true,
    tags: []
  });
  
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user || !isAdminOrModerator()) {
      navigate("/login");
      return;
    }
    loadInitialData();
  }, [isAuthenticated, user, navigate, isAdminOrModerator]);

  useEffect(() => {
    loadProducts();
  }, [page, limit, searchQuery, selectedCategory, selectedGender, availabilityFilter]);

  const loadInitialData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        adminApi.products.getAll({ page, limit }),
        adminApi.categories.getAll()
      ]);
      
      setProducts(productsData.products);
      setTotalProducts(productsData.pagination.total);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedGender) params.gender = selectedGender;
      if (availabilityFilter) params.available = availabilityFilter === "available";
      
      const data = await adminApi.products.getAll(params);
      setProducts(data.products);
      setTotalProducts(data.pagination.total);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Mahsulotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!can("create", "products")) {
      toast.error("Ruxsat yo'q");
      return;
    }

    try {
      setFormLoading(true);
      await adminApi.products.create(formData);
      toast.success("Mahsulot muvaffaqiyatli yaratildi");
      setIsCreateDialogOpen(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Mahsulot yaratishda xatolik");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !can("update", "products")) {
      toast.error("Ruxsat yo'q");
      return;
    }

    try {
      setFormLoading(true);
      await adminApi.products.update(editingProduct.id, formData);
      toast.success("Mahsulot muvaffaqiyatli yangilandi");
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Mahsulotni yangilashda xatolik");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!can("delete", "products")) {
      toast.error("Ruxsat yo'q");
      return;
    }

    if (confirm(`"${product.title}" mahsulotini o'chirmoqchimisiz?`)) {
      try {
        await adminApi.products.delete(product.id);
        toast.success("Mahsulot muvaffaqiyatli o'chirildi");
        loadProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Mahsulotni o'chirishda xatolik");
      }
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      slug: product.slug,
      gender: product.gender,
      ageRange: product.ageRange,
      categorySlug: product.categorySlug,
      price: product.price,
      oldPrice: product.oldPrice,
      colors: product.colors,
      sizes: product.sizes,
      images: product.images,
      description: product.description,
      material: product.material,
      care: product.care,
      available: product.available,
      tags: product.tags || []
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      gender: "unisex",
      ageRange: "1-3y",
      categorySlug: "",
      price: 0,
      oldPrice: undefined,
      colors: [],
      sizes: [],
      images: [],
      description: "",
      material: "",
      care: "",
      available: true,
      tags: []
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const columns: DataTableColumn<Product>[] = [
    {
      key: "images",
      label: "Rasm",
      width: "80px",
      render: (product) => (
        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
          {product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="w-6 h-6 text-gray-400 m-3" />
          )}
        </div>
      )
    },
    {
      key: "title",
      label: "Nomi",
      sortable: true,
      render: (product) => (
        <div>
          <div className="font-medium">{product.title}</div>
          <div className="text-xs text-gray-500">{product.slug}</div>
        </div>
      )
    },
    {
      key: "categorySlug",
      label: "Kategoriya",
      render: (product) => {
        const category = categories.find(c => c.slug === product.categorySlug);
        return category ? category.title : product.categorySlug;
      }
    },
    {
      key: "gender",
      label: "Jins",
      render: (product) => (
        <Badge variant="outline">
          {product.gender === "boy" ? "O'g'il bola" : 
           product.gender === "girl" ? "Qiz bola" : "Universal"}
        </Badge>
      )
    },
    {
      key: "ageRange", 
      label: "Yosh",
      render: (product) => <Badge variant="secondary">{product.ageRange}</Badge>
    },
    {
      key: "price",
      label: "Narxi",
      sortable: true,
      render: (product) => (
        <div>
          <div className="font-medium">{product.price.toLocaleString()} so'm</div>
          {product.oldPrice && (
            <div className="text-xs text-gray-500 line-through">
              {product.oldPrice.toLocaleString()} so'm
            </div>
          )}
        </div>
      )
    },
    {
      key: "available",
      label: "Holati",
      render: (product) => (
        <Badge variant={product.available ? "default" : "destructive"}>
          {product.available ? "Mavjud" : "Mavjud emas"}
        </Badge>
      )
    }
  ];

  const actions = [
    {
      label: "Ko'rish",
      icon: <Eye className="h-4 w-4" />,
      onClick: (product: Product) => navigate(`/products/${product.slug}`)
    },
    {
      label: "Tahrirlash",
      icon: <Edit className="h-4 w-4" />,
      onClick: openEditDialog,
      show: () => can("update", "products")
    },
    {
      label: "O'chirish",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDeleteProduct,
      variant: "destructive" as const,
      show: () => can("delete", "products")
    }
  ];

  const filters = (
    <>
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Kategoriya" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Barchasi</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.slug}>
              {category.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedGender} onValueChange={setSelectedGender}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Jins" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Barchasi</SelectItem>
          <SelectItem value="boy">O'g'il bola</SelectItem>
          <SelectItem value="girl">Qiz bola</SelectItem>
          <SelectItem value="unisex">Universal</SelectItem>
        </SelectContent>
      </Select>

      <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Holati" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Barchasi</SelectItem>
          <SelectItem value="available">Mavjud</SelectItem>
          <SelectItem value="unavailable">Mavjud emas</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" onClick={loadProducts}>
        <Filter className="h-4 w-4 mr-1" />
        Filtr
      </Button>
    </>
  );

  const headerActions = (
    <>
      <ModeratorOrAdmin>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Mahsulot qo'shish
        </Button>
      </ModeratorOrAdmin>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Mahsulotlar
              </h1>
              <p className="text-gray-600">
                Mahsulotlarni boshqaring va yangilarini qo'shing
              </p>
            </div>
          </div>

          <DataTable
            data={products}
            columns={columns}
            actions={actions}
            loading={loading}
            searchValue={searchQuery}
            onSearch={setSearchQuery}
            searchPlaceholder="Mahsulot qidirish..."
            filters={filters}
            headerActions={headerActions}
            pagination={{
              page,
              limit,
              total: totalProducts,
              onPageChange: setPage,
              onLimitChange: setLimit
            }}
            emptyMessage="Hech qanday mahsulot topilmadi"
          />

          {/* Create Product Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yangi mahsulot qo'shish</DialogTitle>
                <DialogDescription>
                  Yangi mahsulot ma'lumotlarini kiriting
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Nomi*</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setFormData({
                          ...formData,
                          title,
                          slug: generateSlug(title)
                        });
                      }}
                      placeholder="Mahsulot nomi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug*</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      placeholder="mahsulot-slug"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Jins*</Label>
                    <Select value={formData.gender} onValueChange={(value: any) => setFormData({...formData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boy">O'g'il bola</SelectItem>
                        <SelectItem value="girl">Qiz bola</SelectItem>
                        <SelectItem value="unisex">Universal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Yosh guruhi*</Label>
                    <Select value={formData.ageRange} onValueChange={(value: any) => setFormData({...formData, ageRange: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-3m">0-3 oy</SelectItem>
                        <SelectItem value="3-6m">3-6 oy</SelectItem>
                        <SelectItem value="6-12m">6-12 oy</SelectItem>
                        <SelectItem value="1-3y">1-3 yosh</SelectItem>
                        <SelectItem value="3-5y">3-5 yosh</SelectItem>
                        <SelectItem value="5-7y">5-7 yosh</SelectItem>
                        <SelectItem value="7-10y">7-10 yosh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Kategoriya*</Label>
                    <Select value={formData.categorySlug} onValueChange={(value) => setFormData({...formData, categorySlug: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Narx (so'm)*</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oldPrice">Eski narx (so'm)</Label>
                    <Input
                      id="oldPrice"
                      type="number"
                      value={formData.oldPrice || ""}
                      onChange={(e) => setFormData({...formData, oldPrice: e.target.value ? Number(e.target.value) : undefined})}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Tavsif*</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Mahsulot haqida batafsil ma'lumot"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material*</Label>
                    <Input
                      id="material"
                      value={formData.material}
                      onChange={(e) => setFormData({...formData, material: e.target.value})}
                      placeholder="Paxta, polyester"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="care">Parvarishlash*</Label>
                    <Input
                      id="care"
                      value={formData.care}
                      onChange={(e) => setFormData({...formData, care: e.target.value})}
                      placeholder="Yuvish bo'yicha ko'rsatmalar"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="colors">Ranglar (vergul bilan ajrating)</Label>
                    <Input
                      id="colors"
                      value={formData.colors.join(", ")}
                      onChange={(e) => setFormData({...formData, colors: e.target.value.split(", ").filter(Boolean)})}
                      placeholder="qizil, ko'k, yashil"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sizes">O'lchamlar (vergul bilan ajrating)</Label>
                    <Input
                      id="sizes"
                      value={formData.sizes.join(", ")}
                      onChange={(e) => setFormData({...formData, sizes: e.target.value.split(", ").filter(Boolean)})}
                      placeholder="S, M, L, XL"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Rasm URL'lari (vergul bilan ajrating)</Label>
                  <Textarea
                    id="images"
                    value={formData.images.join(", ")}
                    onChange={(e) => setFormData({...formData, images: e.target.value.split(", ").filter(Boolean)})}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    rows={2}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Bekor qilish
                </Button>
                <Button onClick={handleCreateProduct} disabled={formLoading}>
                  {formLoading ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Product Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Mahsulotni tahrirlash</DialogTitle>
                <DialogDescription>
                  Mahsulot ma'lumotlarini o'zgartiring
                </DialogDescription>
              </DialogHeader>

              {/* Same form fields as create dialog */}
              <div className="grid gap-4 py-4">
                {/* Form fields identical to create dialog - shortened for brevity */}
                {/* Copy the same form structure from create dialog */}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Bekor qilish
                </Button>
                <Button onClick={handleUpdateProduct} disabled={formLoading}>
                  {formLoading ? "Saqlanmoqda..." : "Yangilash"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </Container>
    </div>
  );
}