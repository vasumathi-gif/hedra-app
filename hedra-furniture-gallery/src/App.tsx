import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductProvider } from "@/contexts/ProductContext";
import { AuthProvider } from "@/contexts/AuthContext";

// User Pages
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import CategoryBrowse from "@/pages/CategoryBrowse";
import ProductDetail from "./pages/ProductDetail";
import Projects from "./pages/Projects";
import HomeProjects from "./pages/HomeProjects";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import UploadCatalogue from "./pages/admin/catalogue/UploadCatalogue";

import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ui/ScrollToTop";
import CategoryProducts from "@/pages/CategoryProducts";
import ChooseUpholstery from "./pages/ChooseUpholstery";
import FunrifanEnquiry from "./pages/FunrifanEnquiry";
import ChairCatalog from "./pages/ChairCatalog";
import AdminCatalogues from "./pages/admin/catalogue/AdminCatalogues";
import EditCatalogue from "./pages/admin/catalogue/EditCatalogue";




const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProductProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* User Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/catalog/:category/browse" element={<CategoryBrowse />} />
              <Route path="/catalog/:category" element={<Catalog />} />
              <Route path="/product" element={<ProductDetail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/homeprojects" element={<HomeProjects/>}/>
              <Route path="/chooseupholstery" element={<ChooseUpholstery />} />
              <Route path="/funrifanenquiry" element={< FunrifanEnquiry />} />
              <Route path="/chaircatalog" element={<ChairCatalog />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/:category" element={<CategoryProducts />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/add" element={<AddProduct />} />
              <Route path="/admin/products/edit" element={<EditProduct />} />
              <Route path="/admin/catalogue/upload" element={<UploadCatalogue />} />
              <Route path="/admin/catalogue" element={<AdminCatalogues />} />
              <Route path="/admin/catalogue/edit" element={<EditCatalogue />} />


              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ProductProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
