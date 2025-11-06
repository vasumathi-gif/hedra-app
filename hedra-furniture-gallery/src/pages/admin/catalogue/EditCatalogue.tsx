// src/pages/admin/catalogue/EditCatalogue.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, X, FileText } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiGetRequest, apiPutRequest } from "../../../../service";

// Match your backend enum
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

export default function EditCatalogue() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { code?: string } };
  const code = state?.code;

   const token = useMemo(
     () => JSON.parse(localStorage.getItem("adminUser") || "{}")?.token,
     []
   );
 

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [item, setItem] = useState<Catalogue | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [type, setType] = useState<CatalogueType>("CHAIR_CATALOGUE");

  // Replaceable files
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newBrandLogoFile, setNewBrandLogoFile] = useState<File | null>(null);
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null);

  // Local previews for new images
  const imagePreview = useMemo(() => (newImageFile ? URL.createObjectURL(newImageFile) : null), [newImageFile]);
  const brandLogoPreview = useMemo(() => (newBrandLogoFile ? URL.createObjectURL(newBrandLogoFile) : null), [newBrandLogoFile]);

  useEffect(() => {
    (async () => {
      if (!code) return;
      setLoading(true);
      setErr(null);
      try {
        const res = await apiGetRequest(`catalogue/getCatalogueByCode/${encodeURIComponent(code)}`, token);
        setItem(res || null);
        if (res) {
          setName(res.name || "");
          setType(res.type || "CHAIR_CATALOGUE");
        }
      } catch (e: any) {
        setErr(e?.message || "Failed to load catalogue");
      } finally {
        setLoading(false);
      }
    })();
  }, [code, token]);

  if (!isAuthenticated) return <Navigate to="/admin" replace />;
  if (!code) return <Navigate to="/admin/catalogue" replace />;

  const handleFilePick =
    (setter: React.Dispatch<React.SetStateAction<File | null>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] || null;
      setter(f);
      // allow re-pick same file
      e.currentTarget.value = "";
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    try {
      if (!name.trim()) throw new Error("Name is required");
      if (!type) throw new Error("Type is required");

      setSaving(true);

      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("type", type);

      if (newImageFile) fd.append("image", newImageFile);
      if (newBrandLogoFile) fd.append("brandLogo", newBrandLogoFile);
      if (newPdfFile) fd.append("pdf", newPdfFile);

      // PATCH /catalogue/:code
      await apiPutRequest(`catalogue/catalogue/${encodeURIComponent(code)}`, fd, token);


      toast({ title: "Catalogue Updated", description: `"${name}" has been updated successfully.` });

      navigate("/admin/catalogue/edit");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Update failed",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/admin/catalogue/edit")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalogues
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Catalogue</h1>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : err ? (
          <Card>
            <CardContent className="p-12 text-center text-red-600">{err}</CardContent>
          </Card>
        ) : !item ? (
          <Card>
            <CardContent className="p-12 text-center">Catalogue not found.</CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: fields */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter catalogue name" required />
                  </div>

                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select value={type} onValueChange={(v) => setType(v as CatalogueType)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CHAIR_CATALOGUE">Chair Catalogue</SelectItem>
                        <SelectItem value="UPHOLSTERY">Upholstery</SelectItem>
                        <SelectItem value="BRAND_LOGO">Brand Logo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image (main) */}
                  <div className="space-y-2">
                    <Label>Main Image</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <div className="border rounded-md overflow-hidden h-28 flex items-center justify-center bg-muted">
                          {imagePreview ? (
                            <img src={imagePreview} className="h-full w-full object-contain" />
                          ) : item.imageUrl ? (
                            <img src={item.imageUrl} className="h-full w-full object-contain" />
                          ) : (
                            <div className="text-xs text-muted-foreground">No image</div>
                          )}
                        </div>
                      </div>
                      <label className="border-2 border-dashed rounded-md h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition">
                        <Upload className="w-6 h-6 mb-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Replace image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFilePick(setNewImageFile)} />
                      </label>
                    </div>
                    {imagePreview && (
                      <Button type="button" variant="ghost" size="sm" className="mt-1 px-2" onClick={() => setNewImageFile(null)}>
                        <X className="w-3 h-3 mr-1" /> Clear new image
                      </Button>
                    )}
                  </div>

                  {/* Brand logo */}
                  <div className="space-y-2">
                    <Label>Brand Logo</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <div className="border rounded-md overflow-hidden h-28 flex items-center justify-center bg-muted">
                          {brandLogoPreview ? (
                            <img src={brandLogoPreview} className="h-full w-full object-contain" />
                          ) : item.brandLogoUrl ? (
                            <img src={item.brandLogoUrl} className="h-full w-full object-contain" />
                          ) : (
                            <div className="text-xs text-muted-foreground">No brand logo</div>
                          )}
                        </div>
                      </div>
                      <label className="border-2 border-dashed rounded-md h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition">
                        <Upload className="w-6 h-6 mb-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Replace brand logo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFilePick(setNewBrandLogoFile)} />
                      </label>
                    </div>
                    {brandLogoPreview && (
                      <Button type="button" variant="ghost" size="sm" className="mt-1 px-2" onClick={() => setNewBrandLogoFile(null)}>
                        <X className="w-3 h-3 mr-1" /> Clear new logo
                      </Button>
                    )}
                  </div>

                  {/* PDF */}
                  <div className="space-y-2">
                    <Label>PDF</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={item.pdfUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="border rounded-md h-28 flex items-center justify-center bg-muted"
                        onClick={(e) => {
                          if (!item.pdfUrl) e.preventDefault();
                        }}
                      >
                        {item.pdfUrl ? (
                          <span className="text-sm flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Open current PDF
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">No PDF</span>
                        )}
                      </a>
                      <label className="border-2 border-dashed rounded-md h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition">
                        <Upload className="w-6 h-6 mb-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Replace / upload PDF</span>
                        <input type="file" accept="application/pdf" className="hidden" onChange={handleFilePick(setNewPdfFile)} />
                      </label>
                    </div>
                    {newPdfFile && (
                      <div className="text-xs mt-1">
                        Selected: <strong>{newPdfFile.name}</strong> ({newPdfFile.type})
                        <Button type="button" variant="ghost" size="sm" className="ml-2 px-2" onClick={() => setNewPdfFile(null)}>
                          <X className="w-3 h-3 mr-1" /> Clear
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: submit */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Save</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={saving}>
                    {saving ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                        Updating...
                      </div>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Update Catalogue
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
