import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Package, Plus, Edit, BarChart3, Users, TrendingUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { PRODUCT_CATEGORIES } from '@/types/product';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const { products, getProductsByCategory } = useProducts();

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      description: 'Products in catalog'
    },
    {
      title: 'Categories',
      value: PRODUCT_CATEGORIES.length,
      icon: BarChart3,
      description: 'Product categories'
    },
    {
      title: 'Featured Products',
      value: products.filter(p => p.featured).length,
      icon: TrendingUp,
      description: 'Featured items'
    },
    {
      title: 'Recent Products',
      value: products.filter(p => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return p.createdAt > weekAgo;
      }).length,
      icon: Plus,
      description: 'Added this week'
    }
  ];

  const categoryStats = PRODUCT_CATEGORIES.map(category => ({
    ...category,
    count: getProductsByCategory(category.value).length
  }));

  const recentProducts = products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your catalog.</p>
          </div>
          <Link to="/admin/products/add">
            <Button variant="hero">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Categories Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Categories Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map((category) => (
                  <div key={category.value} className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{category.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{category.count} products</span>
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-primary h-2 rounded-full"
                          style={{
                            width: `${products.length > 0 ? (category.count / products.length) * 100 : 0}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Products</CardTitle>
              <Link to="/admin/products">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No products added yet.</p>
                    <Link to="/admin/products/add" className="mt-2 inline-block">
                      <Button variant="outline" size="sm">
                        Add Your First Product
                      </Button>
                    </Link>
                  </div>
                ) : (
                  recentProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-4">
                      <img
                        src={
                          Array.isArray(product.images) && product.images.length > 0
                            ? product.images[0]
                            : '/placeholder.jpg' // ✅ change this to your actual fallback image path
                        }
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {product.category.replace('-', ' ')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {product.featured && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                        <Link to={`/admin/products/edit/${product.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/admin/products/add">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <Plus className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Add New Product</div>
                    <div className="text-sm text-muted-foreground">Create a new product listing</div>
                  </div>
                </Button>
              </Link>

              <Link to="/admin/products">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <Package className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Manage Products</div>
                    <div className="text-sm text-muted-foreground">Edit or delete existing products</div>
                  </div>
                </Button>
              </Link>

              <a href="/catalog" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <Eye className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">View Website</div>
                    <div className="text-sm text-muted-foreground">See your catalog live</div>
                  </div>
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}