import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { adminApi } from '@/lib/adminApi';
import { Plus, Eye, Edit, Trash2, FolderPlus, Package } from 'lucide-react';
import type { Category } from '@shared/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    title: '',
    slug: '',
    icon: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminApi.categories.getAll();
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create/Update category
  const handleSaveCategory = async () => {
    try {
      if (isEditing && selectedCategory) {
        await adminApi.categories.update(selectedCategory.id, categoryForm);
      } else {
        await adminApi.categories.create(categoryForm);
      }
      
      fetchCategories();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Bu kategoriyani o\'chirishni tasdiqlaysizmi?')) return;
    
    try {
      await adminApi.categories.delete(categoryId);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Generate slug from title
  const handleTitleChange = (title: string) => {
    setCategoryForm(prev => ({
      ...prev,
      title,
      slug: title.toLowerCase()
        .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .trim()
    }));
  };

  const handleOpenCreateDialog = () => {
    setCategoryForm({ title: '', slug: '', icon: '' });
    setSelectedCategory(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleOpenEditDialog = (category: Category) => {
    setCategoryForm({
      title: category.title,
      slug: category.slug,
      icon: category.icon || ''
    });
    setSelectedCategory(category);
    setIsEditing(true);
    setIsCreating(true);
  };

  const handleCloseDialog = () => {
    setSelectedCategory(null);
    setIsEditing(false);
    setIsCreating(false);
    setCategoryForm({ title: '', slug: '', icon: '' });
  };

  // Table columns
  const columns = [
    {
      key: 'title',
      label: 'Kategoriya',
      render: (category: Category) => (
        <div className="flex items-center gap-3">
          {category.icon ? (
            <div className="w-8 h-8 flex items-center justify-center bg-muted rounded">
              <span>{category.icon}</span>
            </div>
          ) : (
            <Package className="w-8 h-8 text-muted-foreground" />
          )}
          <div>
            <p className="font-medium">{category.title}</p>
            <p className="text-xs text-muted-foreground">{category.slug}</p>
          </div>
        </div>
      )
    },
    {
      key: 'id',
      label: 'ID',
      render: (category: Category) => (
        <span className="font-mono text-xs">{category.id}</span>
      )
    }
  ];

  // Table actions
  const actions = [
    {
      label: 'Ko\'rish',
      icon: <Eye className="w-4 h-4" />,
      onClick: (category: Category) => setSelectedCategory(category)
    },
    {
      label: 'Tahrirlash',
      icon: <Edit className="w-4 h-4" />,
      onClick: handleOpenEditDialog
    },
    {
      label: 'O\'chirish',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (category: Category) => handleDeleteCategory(category.id)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Kategoriyalar</h1>
          <p className="text-muted-foreground">Mahsulot kategoriyalarini boshqaring</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreateDialog}>
              <FolderPlus className="w-4 h-4 mr-2" />
              Yangi Kategoriya
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Kategoriyani Tahrirlash' : 'Yangi Kategoriya'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Nomi *</Label>
                <Input
                  id="title"
                  value={categoryForm.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Kategoriya nomi..."
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="kategoriya-slug"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL da ishlatiladi. Faqat lotin harflari, raqamlar va "-" belgisi
                </p>
              </div>

              <div>
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="👕"
                  maxLength={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Kategoriya uchun emoji icon (ixtiyoriy)
                </p>
              </div>

              {/* Preview */}
              {(categoryForm.title || categoryForm.icon) && (
                <div>
                  <Label>Oldin ko'rish:</Label>
                  <div className="mt-2 p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {categoryForm.icon ? (
                        <div className="w-8 h-8 flex items-center justify-center bg-background rounded">
                          <span>{categoryForm.icon}</span>
                        </div>
                      ) : (
                        <Package className="w-8 h-8 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{categoryForm.title || 'Kategoriya nomi'}</p>
                        <p className="text-xs text-muted-foreground">{categoryForm.slug || 'kategoriya-slug'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button 
                onClick={handleSaveCategory}
                disabled={!categoryForm.title || !categoryForm.slug}
              >
                {isEditing ? 'Saqlash' : 'Qo\'shish'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={categories}
            columns={columns}
            actions={actions}
            loading={loading}
            pagination={null} // Categories usually don't need pagination
          />
        </CardContent>
      </Card>

      {/* Category Details Dialog */}
      {selectedCategory && !isCreating && (
        <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kategoriya Ma'lumotlari</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                {selectedCategory.icon ? (
                  <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-lg text-2xl">
                    {selectedCategory.icon}
                  </div>
                ) : (
                  <Package className="w-12 h-12 text-muted-foreground" />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{selectedCategory.title}</h3>
                  <p className="text-muted-foreground">{selectedCategory.slug}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">ID:</p>
                  <p className="font-mono">{selectedCategory.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Slug:</p>
                  <p className="font-mono">{selectedCategory.slug}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Nomi:</p>
                  <p>{selectedCategory.title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Icon:</p>
                  <p>{selectedCategory.icon || 'Yo\'q'}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                onClick={() => handleOpenEditDialog(selectedCategory)}
                className="mr-auto"
              >
                <Edit className="w-4 h-4 mr-2" />
                Tahrirlash
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  handleDeleteCategory(selectedCategory.id);
                  setSelectedCategory(null);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                O'chirish
              </Button>
              <Button onClick={() => setSelectedCategory(null)}>
                Yopish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}