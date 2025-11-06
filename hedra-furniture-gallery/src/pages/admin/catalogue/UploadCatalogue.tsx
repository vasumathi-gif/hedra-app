import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, X, FileText, ImageIcon, BadgePlus } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiPostRequest } from "../../../../service"; // your existing helper

type CatalogueType = "CHAIR_CATALOGUE" | "UPHOLSTERY" | "BRAND_LOGO";

export default function UploadCatalogue() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = useMemo(
    () => JSON.parse(localStorage.getItem("adminUser") || "{}")?.token,
    []
  );

  const [name, setName] = useState("");
  const [type, setType] = useState<CatalogueType | undefined>(undefined);
  const [image, setImage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [brandLogo, setBrandLogo] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) return <Navigate to="/admin" replace />;

  const onPickImage = (file?: File | null) => {
    setImage(file ?? null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const onPickBrandLogo = (file?: File | null) => {
    setBrandLogo(file ?? null);
    if (brandLogoPreview) URL.revokeObjectURL(brandLogoPreview);
    setBrandLogoPreview(file ? URL.createObjectURL(file) : null);
  };

  const onPickPdf = (file?: File | null) => {
    setPdf(file ?? null);
  };

  const resetForm = () => {
    setName("");
    setType(undefined);
    onPickImage(null);
    onPickBrandLogo(null);
    onPickPdf(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) {
      toast({ title: "Missing type", description: "Please choose a catalogue type.", variant: "destructive" });
      return;
    }
    if (!name.trim()) {
      toast({ title: "Missing name", description: "Please enter a catalogue name.", variant: "destructive" });
      return;
    }
    if (!image) {
      toast({ title: "Image required", description: "Please upload a cover image.", variant: "destructive" });
      return;
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("type", type);
      fd.append("name", name.trim());
      fd.append("image", image);          // 👈 exact field names server expects
      if (pdf) fd.append("pdf", pdf);
      if (brandLogo) fd.append("brandLogo", brandLogo);

      const res = await apiPostRequest("catalogue/createcatalogue", fd, token);

      toast({ title: "Catalogue saved", description: `${res?.name || "Catalogue"} created successfully.` });
      resetForm();
      navigate("/admin/catalogue/upload");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to save catalogue";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back 
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Upload Catalogue</h1>
              <p className="text-muted-foreground">Create a catalogue entry with image, optional PDF, and brand logo.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: form fields */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Catalogue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cat-name">Name *</Label>
                  <Input
                    id="cat-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Process Chair Catalogue 2025"
                    required
                  />
                </div>

                <div>
                  <Label>Type *</Label>
                  <Select value={type} onValueChange={(v) => setType(v as CatalogueType)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CHAIR_CATALOGUE">Chair Catalogue</SelectItem>
                      <SelectItem value="UPHOLSTERY">Upholstery</SelectItem>
                      <SelectItem value="BRAND_LOGO">Brand Logo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Image (required) */}
                <div className="space-y-2">
                  <Label>Cover Image *</Label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload image</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => onPickImage(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>

                  {imagePreview && (
                    <div className="relative inline-block mt-2">
                      <img src={imagePreview} alt="cover" className="h-24 w-24 object-cover rounded-md border" />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => onPickImage(null)}
                        title="Remove"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* PDF (optional) */}
                <div className="space-y-2">
                  <Label>PDF (optional)</Label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-muted/50">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Choose PDF</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="application/pdf"
                        onChange={(e) => onPickPdf(e.target.files?.[0] || null)}
                      />
                    </label>
                    {pdf && <span className="text-sm text-muted-foreground truncate max-w-[240px]">{pdf.name}</span>}
                    {pdf && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => onPickPdf(null)} title="Remove">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

             
              </CardContent>
            </Card>
          </div>

          {/* Right: actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : (<><Save className="mr-2 h-5 w-5" /> Save Catalogue</>)}
                </Button>

                <Button type="button" variant="outline" className="w-full" onClick={resetForm}>
                  Reset
                </Button>

                <div className="text-xs text-muted-foreground pt-2">
                  • Required fields: <strong>Name</strong>, <strong>Type</strong>, <strong>Image</strong><br />
                  • PDF & Brand Logo are optional.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2"><ImageIcon className="h-4 w-4" />Use clear cover images (JPG/PNG/WebP).</div>
                <div className="flex items-center gap-2"><FileText className="h-4 w-4" />Limit PDF size to &lt; 20MB.</div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
