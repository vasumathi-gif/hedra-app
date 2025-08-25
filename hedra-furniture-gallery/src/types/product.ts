export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  images: string[];
  specifications: Record<string, string>;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 'sofa' | 'bed' | 'office-chair' | 'dining-table' | 'storage' | 'accessories';

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'sofa', label: 'Sofas' },
  { value: 'bed', label: 'Beds' },
  { value: 'office-chair', label: 'Office Chairs' },
  { value: 'dining-table', label: 'Dining Tables' },
  { value: 'storage', label: 'Storage' },
  { value: 'accessories', label: 'Accessories' },
];

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  token: string;
}
