import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Search, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiGetRequest, apiDeleteRequest } from "../../../../service"; // same service you use elsewhere

type CatalogueType = "CHAIR_CATALOGUE" | "UPHOLSTERY" | "BRAND_LOGO";

type Catalogue = {
  id: string;
  code: string;
  type: CatalogueType;
  name: string;
  imageUrl?: string | null;
  brandLogoUrl?: string | null;
  pdfUrl?: string | null;
  createdAt: string;
};

export default function AdminCatalogues() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [items, setItems] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<CatalogueType | "all">("all");

  // Redirect if not authenticated
  if (!isAuthenticated) return <Navigate to="/admin" replace />;

  // Fetch all catalogues
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const token = localStorage.getItem("authToken") || "";
        // your base is already prepended by the service
        const res = await apiGetRequest("catalogue/allCatalogues", token);
        // shape: { items: Catalogue[], total, ... } OR direct array
        const list: Catalogue[] = Array.isArray(res?.items)
          ? res.items
          : Array.isArray(res)
          ? res
          : [];
        setItems(list);
      } catch (e: any) {
        setErr(e?.message || "Failed to load catalogues");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q);
      const matchesType = selectedType === "all" || c.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [items, searchQuery, selectedType]);

 const handleDelete = async (code: string, name: string) => {
  if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
  try {
        const token = localStorage.getItem("authToken") || "";
    +   await apiDeleteRequest(`catalogue/catalogue/${code}`, token); // <-- code route
+   setItems((prev) => prev.filter((it) => it.code !== code));
    toast({ title: "Catalogue Deleted", description: `"${name}" has been removed.` });
  } catch (e: any) {
    toast({
      title: "Error",
      description: e?.response?.data?.message || "Failed to delete catalogue",
      variant: "destructive",
    });
  }
};

  const handleView = (c: Catalogue) => {
    // If it’s a PDF, open it; otherwise open image in new tab.
    if (c.pdfUrl) window.open(c.pdfUrl, "_blank");
    else if (c.imageUrl) window.open(c.imageUrl, "_blank");
    else if (c.brandLogoUrl) window.open(c.brandLogoUrl, "_blank");
  };

  const handleEdit = (code: string) => {
  navigate("/admin/catalogue/edit", { state: { code } });
 };

  const primaryImage = (c: Catalogue) =>
    c.imageUrl || c.brandLogoUrl || null;

  const TYPE_BADGE_TONE: Record<CatalogueType, string> = {
    CHAIR_CATALOGUE: "bg-blue-100 text-blue-800",
    UPHOLSTERY: "bg-emerald-100 text-emerald-800",
    BRAND_LOGO: "bg-amber-100 text-amber-800",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Catalogues</h1>
            <p className="text-muted-foreground">Manage all catalogues (chair, upholstery & brand logos)</p>
          </div>
          <Link to="/admin/catalogue/upload">
            <Button variant="hero">
              <Plus className="mr-2 h-4 w-4" />
              Add Catalogue
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={selectedType}
                onValueChange={(val) => setSelectedType(val as CatalogueType | "all")}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="CHAIR_CATALOGUE">Chair Catalogue</SelectItem>
                  <SelectItem value="UPHOLSTERY">Upholstery</SelectItem>
                  <SelectItem value="BRAND_LOGO">Brand Logo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filtered.length} of {items.length} catalogues
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : err ? (
          <Card>
            <CardContent className="p-12 text-center text-red-600">
              {err}
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {items.length === 0 ? "No catalogues yet" : "No catalogues found"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {items.length === 0
                  ? "Get started by adding your first catalogue."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {items.length === 0 && (
                <Link to="/admin/catalogues/add">
                  <Button variant="hero">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Catalogue
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((c) => {
              const img = primaryImage(c);
              return (
                <Card key={c.code} className="overflow-hidden hover:shadow-card transition-all duration-300 group">
                  <div
                    className="aspect-[4/3] overflow-hidden relative cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${c.name}`}
                    onClick={() => handleView(c)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleView(c);
                      }
                    }}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    {c.pdfUrl && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-black/80 text-white">PDF</Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {c.name}
                      </h3>
                      <Badge className={TYPE_BADGE_TONE[c.type]}>{c.type.replace("_", " ")}</Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span className="font-mono">{c.code}</span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleEdit(c.code)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(c)}
                        title="Open"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(c.code, c.name)}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
