import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams,useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { PRODUCT_CATEGORIES, ProductCategory } from '@/types/product';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { apiPutRequest } from '../../../service';

export default function EditProduct() {
  const { isAuthenticated } = useAuth();
  const { getProductById, updateProduct } = useProducts();
  const { toast } = useToast();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('adminUser') || '{}')?.token;
  // under other useState lines
const [initialImages, setInitialImages] = useState<string[]>([]); // images originally from DB
const [newFiles, setNewFiles] = useState<File[]>([]);             // files selected now

 
const { state } = useLocation();
const productId = state?.id; // ✅ this is your id

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '' as ProductCategory,
    featured: false,
    price: '',
    tags: '',
    bestSeller: false, 
    specifications: {} as Record<string, string>,
    images: [] as string[]
  });

  const [specifications, setSpecifications] = useState([
    { key: '', value: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      const product = getProductById(productId);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          category: product.category as ProductCategory,
          featured: product.featured || false,
          specifications: product.specifications,
           bestSeller: product.bestSeller || false,
          images: product.images,
          price: product.price?.toString() || '',
          tags: product.tags?.join(', ') || ''
        }); 
        setInitialImages(product.images || []);

        // Convert specifications object to array for editing
  let specsArray: { key: string; value: string }[] = [];

      try {
        if (typeof product.specifications === 'string') {
          specsArray = JSON.parse(product.specifications); // parse string
        } else if (Array.isArray(product.specifications)) {
          specsArray = product.specifications;
        }
      } catch (e) {
        console.warn('Failed to parse specifications:', product.specifications);
        specsArray = [];
      }

      setSpecifications(specsArray.length > 0 ? specsArray : [{ key: '', value: '' }]);

      }
      setIsLoading(false);
    }
  }, [productId, getProductById]);

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  if (!productId) {
    return <Navigate to="/admin/products" replace />;
  }

  const product = getProductById(productId);
  if (!isLoading && !product) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're trying to edit doesn't exist.</p>
          <Button onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value: ProductCategory) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleFeaturedChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      featured: checked
    }));
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index][field] = value;
    setSpecifications(updatedSpecs);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      const updatedSpecs = specifications.filter((_, i) => i !== index);
      setSpecifications(updatedSpecs);
    }
  };

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  const arr = Array.from(files);

  // store real files for submit
  setNewFiles(prev => [...prev, ...arr]);

  // keep your previews
  const imageUrls = arr.map(file => URL.createObjectURL(file));
  setFormData(prev => ({
    ...prev,
    images: [...prev.images, ...imageUrls]
  }));

  // allow re-selecting the same file
  e.currentTarget.value = '';
};


  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleBestSellerChange = (checked: boolean) => {
  setFormData(prev => ({
    ...prev,
    bestSeller: checked
  }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // --- your existing validations ---
    if (!formData.name.trim()) throw new Error('Product name is required');
    if (!formData.description.trim()) throw new Error('Product description is required');
    if (!formData.category) throw new Error('Product category is required');
    if (!formData.price || isNaN(Number(formData.price))) throw new Error('Valid price is required');

    // ✅ figure out which original URLs remain after deletions
    const imagesToKeep = initialImages.filter(url => formData.images.includes(url));

    // ✅ make sure at least one image will remain (old kept + new added)
    if (imagesToKeep.length === 0 && newFiles.length === 0) {
      throw new Error('At least one product image is required');
    }

    const specsArray = specifications
      .filter(spec => spec.key.trim() && spec.value.trim())
      .map(spec => ({ key: spec.key.trim(), value: spec.value.trim() }));

    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('category', formData.category);
    fd.append('price', formData.price);
    fd.append('tags', JSON.stringify(tagsArray));
    fd.append('specifications', JSON.stringify(specsArray));
    fd.append('bestSeller', String(formData.bestSeller));
    fd.append('featured', String(formData.featured));

    // ✅ tell backend exactly which old images to keep
    fd.append('imagesToKeep', JSON.stringify(imagesToKeep));

    // ✅ send ALL new files (not just one)
    newFiles.forEach(file => fd.append('newImages', file));

    console.log('--- FormData Payload ---');
    for (const [key, value] of fd.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        try { console.log(`${key}:`, JSON.parse(value as string)); }
        catch { console.log(`${key}:`, value); }
      }
    }

    const response = await apiPutRequest(`products/updateProduct/${productId}`, fd, token);
    console.log('✅ Update response:', response);

    toast({
      title: 'Product Updated',
      description: `"${formData.name}" has been updated successfully.`,
    });

    navigate('/admin/products');
    window.location.reload();
  } catch (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Update failed',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};



  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/admin/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
              <p className="text-muted-foreground">Update product information and settings</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the product features, materials, and benefits"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="e.g. modern,wood,minimalist"
                    />
                  </div>
{/* 

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={handleFeaturedChange}
                    />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div> */}
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="Property (e.g., Material)"
                        value={spec.key}
                        onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                      />
                      <Input
                        placeholder="Value (e.g., Premium Leather)"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      />
                      {specifications.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSpecification(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSpecification}
                    className="w-full"
                  >
                    Add Specification
                  </Button>
                </CardContent>
              </Card>
              <div className="flex items-center space-x-2">
  <Switch
    id="bestSeller"
    checked={formData.bestSeller}
    onCheckedChange={handleBestSellerChange}
  />
  <Label htmlFor="bestSeller">Best Seller Product</Label>
</div>

            </div>

            {/* Images */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Images *</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="images">Upload Images</Label>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload images</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      <Label>Current Images</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="w-full h-20 object-cover rounded-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Updating Product...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Update Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}