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

export type ProductCategory =
  | 'sofa'
  | 'sofa-1-seater'
  | 'sofa-2-seater'
  | 'sofa-3-seater'
  | 'sofa-4-seater-plus'
  | 'sofa-corner'
  | 'sofa-modular'
  | 'sofa-lounge'
  | 'sofa-recliner'
  | 'bed'
  | 'bed-regular'
  | 'bed-storage'
  | 'bed-bedside-tables'
  | 'bed-stools'
  | 'bed-dressing-chairs'
  | 'dining-table'
   | 'dining-table-rectangular'
  | 'dining-table-circular'
  | 'dining-table-oval'
  
  // HOME
  | 'center-tables'
  | 'center-tables-rectangular'
  | 'center-tables-oval'
  | 'center-tables-circular'
  | 'pouffes'
  | 'dining-chairs'
  | 'study-chairs'
  // OFFICE
  | 'boss-chairs'
  | 'high-back-mesh-chairs'
  | 'medium-back-workstation-chairs'
  | 'lounge-chairs'
  | 'office-sofas'
  | 'office-tables'
   | 'office-tables-boss'
  | 'office-tables-conference'
  | 'office-tables-work-desks'
  | 'office-tables-center'
  | 'meeting-room-chairs'
  | 'visitor-chairs'
  | 'training-chairs'
  // CAFÉ
  | 'cafe-chairs'
  | 'bar-stools'
  | 'outdoor'
  | 'cafe-tables'
  | 'high-tables';

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  // HOME
  { value: 'sofa',                label: 'Sofas' },
  { value: 'sofa-1-seater', label: '1 seater to Single seater' },
  { value: 'sofa-2-seater', label: '2 seater to Two-Seater' },
  { value: 'sofa-3-seater', label: '3 Seater to Three-seater' },
  { value: 'sofa-4-seater-plus', label: '4 seater to four-seater' },
  { value: 'sofa-corner', label: 'Corner Sofas' },
  { value: 'sofa-modular', label: 'Modular Sofas' },
  { value: 'sofa-lounge', label: 'Lounge Sofas' },
  { value: 'sofa-recliner', label: 'Recliners' },
  { value: 'center-tables',       label: 'Center Tables' },
    { value: 'center-tables-rectangular', label: 'Rectangular Center Tables' },
  { value: 'center-tables-oval', label: 'Oval Center Tables' },
  { value: 'center-tables-circular', label: 'Circular Center Tables' },
  { value: 'bed',                 label: 'Beds' },
   { value: 'bed-regular', label: 'Regular Beds' },
  { value: 'bed-storage', label: 'Beds with Storage' },
  { value: 'bed-bedside-tables', label: 'Bedside Tables' },
  { value: 'bed-stools', label: 'Bedroom Stools' },
  { value: 'bed-dressing-chairs', label: 'Dressing Table Chairs' },
  { value: 'pouffes',             label: 'Pouffes' },
  { value: 'dining-table',        label: 'Dining Tables' },
   { value: 'dining-table-rectangular', label: 'Rectangular Dining Tables' },
  { value: 'dining-table-circular', label: 'Circular Dining Tables' },
  { value: 'dining-table-oval', label: 'Oval Dining Tables' },
  { value: 'dining-chairs',       label: 'Dining Chairs' },
  { value: 'study-chairs',        label: 'Study Chairs' },

  // OFFICE
  { value: 'boss-chairs',                   label: 'Boss Chairs' },
  { value: 'high-back-mesh-chairs',        label: 'High Back Mesh Chairs' },
  { value: 'medium-back-workstation-chairs', label: 'Medium Back Workstation Chairs' },
  { value: 'lounge-chairs',                 label: 'Lounge Chairs' },
  { value: 'office-sofas',                  label: 'Office Sofas' },
  { value: 'office-tables',                 label: 'Tables' },
  { value: 'office-tables-boss', label: 'Boss Tables' },
  { value: 'office-tables-conference', label: 'Conference Room Tables' },
  { value: 'office-tables-work-desks', label: 'Work Desks' },
  { value: 'office-tables-center', label: 'Office Center Tables' },
  { value: 'meeting-room-chairs',           label: 'Meeting Room Chairs' },
  { value: 'visitor-chairs',                label: 'Visitor Chairs' },
  { value: 'training-chairs',               label: 'Training Chairs' },

  // CAFÉ
  { value: 'cafe-chairs',         label: 'Cafe Chairs' },
  { value: 'bar-stools',          label: 'Bar Stools' },
  { value: 'outdoor',             label: 'Outdoor' },
  { value: 'cafe-tables',         label: 'Cafe Tables' },
  { value: 'high-tables',         label: 'High Tables' },


];


export interface AdminUser {
  id: string;
  email: string;
  role: string;
  token: string;
}
