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
        setLoading(true); // Start loading
        const productsData: Product[] = await apiGetRequest('products/getAllProducts', token); // Fetch products from API

      const processedProducts = productsData.map((product) => ({
    ...product,
    images: [
      product.imageUrl.startsWith("http")
        ? product.imageUrl
        : `${FILE_BASE}api/uploads/${product.imageUrl.replace(/^\/+/, "")}`,
    ],
}))

setProducts(processedProducts);


        // Extract unique categories dynamically from the fetched products
        const fetchedCategories: string[] = [...new Set(productsData.map((product: Product) => product.category))];
        setCategories(fetchedCategories); // Set categories dynamically

        console.log('Fetched Products: ', productsData); // Debugging: log fetched products
        console.log('Categories: ', fetchedCategories); // Debugging: log categories
        
      } catch (err) {
        setError('Failed to load products'); // Set error message if fetching fails
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchProducts(); // Call the API when the component mounts
  }, [token]);

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
