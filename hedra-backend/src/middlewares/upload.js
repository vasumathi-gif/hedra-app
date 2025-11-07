import multer from 'multer';
import path from 'path';
import fs from "fs";



// export default upload;
export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `product-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB per file (optional)
});
export default upload;


/* =========================
   New: Catalogue uploader
   (image + pdf + optional brandLogo)
   ========================= */

// --- helpers ---
const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

const catalogueStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.mimetype === "application/pdf"
      ? "uploads/catalogue/pdfs"
      : "uploads/catalogue/images";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = file.originalname.replace(ext, "").trim().toLowerCase().replace(/\s+/g, "-").slice(0, 80);
    const type = typeof req.body?.type === "string" ? req.body.type.toLowerCase() : "catalogue";
    cb(null, `${type}-${base}-${Date.now()}${ext}`);
  },
});

const uploadCatalogue = multer({
  storage: catalogueStorage,
  fileFilter: (req, file, cb) => {
  const ok =
    file.mimetype === "application/pdf" ||
    ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  console.log("📥 [uploadCatalogue] incoming:", file.fieldname, file.mimetype, "ok?", ok);
  return ok ? cb(null, true) : cb(new Error("Only jpg/png/webp/pdf allowed"), false);
},

  limits: { fileSize: 20 * 1024 * 1024 },
});

// ✅ SINGLE, UNAMBIGUOUS EXPORT. Delete any other handleCatalogueFiles export in this file.
export const handleCatalogueFiles = (req, res, next) => {
  console.log("➡️  handleCatalogueFiles: USING uploadCatalogue.fields([image,pdf,brandLogo])");
  const mw = uploadCatalogue.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
    { name: "brandLogo", maxCount: 1 },
  ]);
  mw(req, res, (err) => {
    if (err) {
      console.error("❌ Multer error:", err);
      return res.status(400).json({ message: err.message });
    }
    console.log("✅ After fields(): keys =", Object.keys(req.files || {}));
    next();
  });
};