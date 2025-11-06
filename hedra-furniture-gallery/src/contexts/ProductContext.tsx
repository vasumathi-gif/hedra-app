import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiDeleteRequest, apiGetRequest, apiPutRequest } from '../../service';

// Product type definition
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string; // Category will be a string now, fetched dynamically
  images: string[];
  specifications?: Record<string, string>;
  price?: number; // ✅ Add this
  tags?: string[];
  imageUrl: string;
  featured?: boolean;
  bestSeller?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductContextType {
  products: Product[];
  categories: string[]; // Dynamic list of categories
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsByCategory: (category: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  loading: boolean;
  error: string;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]); // Dynamic categories
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(''); // Error state
  const token = localStorage.getItem('authToken'); // Example: get token from localStorage

  const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL?.replace(/\/$/, "") || "";
useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData: any[] = await apiGetRequest('products/getAllProducts', token);

      const toAbsUrl = (url: string) =>
        url?.startsWith('http')
          ? url
          : `${FILE_BASE}/${url?.replace(/^\/+/, '')}`;

      const processedProducts: Product[] = productsData.map((p) => {
        let images: string[] = [];

        // Prefer existing array if backend already sends `images`
        if (Array.isArray(p.images)) {
          images = p.images.filter(Boolean).map(toAbsUrl);
        } else if (typeof p.imageUrl === 'string' && p.imageUrl.trim()) {
          const s = p.imageUrl.trim();
          if (s.startsWith('[')) {
            // JSON array of URLs in imageUrl
            try {
              const arr = JSON.parse(s);
              if (Array.isArray(arr)) {
                images = arr.filter(Boolean).map(toAbsUrl);
              }
            } catch {
              // ignore parse error; fallback below
            }
          } else {
            // single URL string
            images = [toAbsUrl(s)];
          }
        }

        return {
          ...p,
          images,
          // ensure dates are Date objects
          createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
          updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        } as Product;
      });

      setProducts(processedProducts);

      const fetchedCategories: string[] = [
        ...new Set(processedProducts.map((product) => product.category)),
      ];
      setCategories(fetchedCategories);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [token, FILE_BASE]);


  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };


  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const token = JSON.parse(localStorage.getItem('adminUser') || '{}')?.token;
    if (!token) throw new Error('Unauthorized: No token found');

    const formData = new FormData();
    formData.append('name', productData.name || '');
    formData.append('description', productData.description || '');
    formData.append('category', productData.category || '');
    formData.append('price', String((productData as any).price || '0'));
    formData.append('tags', JSON.stringify((productData as any).tags || []));

    if ((productData as any).image instanceof File) {
      formData.append('image', (productData as any).image);
    }

    try {
      const updatedProduct = await apiPutRequest(`products/updateProduct/${id}`, formData, token);

      setProducts(prev =>
        prev.map(product => (product.id === id ? { ...product, ...updatedProduct } : product))
      );
    } catch (error) {
      console.error('❌ Failed to update product:', error);
      throw error;
    }
  };


  const deleteProduct = async (id: string) => {
    const token = JSON.parse(localStorage.getItem('adminUser') || '{}')?.token;

    if (!token) throw new Error('Unauthorized: No token found');

    await apiDeleteRequest(`products/deleteProduct/${id}`, token); // ✅ full path
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  const value = {
    products,
    categories, // Provide dynamic categories
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductById,
    searchProducts,
    loading,
    error,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
