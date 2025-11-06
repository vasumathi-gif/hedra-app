// src/controllers/catalogue.controller.js
import prisma from '../config/db.js';
import { CatalogueType } from "@prisma/client";
import uploadImageToImgBB from '../services/uploadImageToImgBB.js';

const isValidType = (t) => t && Object.values(CatalogueType).includes(t);

const toInt = (v, def) => {
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) && n > 0 ? n : def;
};

// Whitelist sortable fields to avoid SQL injection via Prisma
const SORTABLE_FIELDS = new Set(["createdAt", "name", "code"]);
const SORT_ORDERS = new Set(["asc", "desc"]);

const toPublicUrl = (p) => (p ? `/${String(p).replace(/\\/g, "/")}` : null);

async function nextCatalogueCode() {
  const last = await prisma.catalogue.findFirst({
    orderBy: { createdAt: "desc" },
    select: { code: true },
  });

  let newCode = "CT001";
  if (last?.code) {
    const n = parseInt(String(last.code).replace(/^CT/, ""), 10);
    const next = (isNaN(n) ? 0 : n) + 1;
    newCode = `CT${String(next).padStart(3, "0")}`;
  }
  return newCode;
}


// controllers/catalogue.controller.js
const pick = (req, field) => {
  if (Array.isArray(req.files)) return req.files.find(f => f.fieldname === field) || null;
  if (req.files?.[field]?.[0]) return req.files[field][0];
  if (req.file?.fieldname === field) return req.file;
  return null;
};


export const createCatalogue = async (req, res) => {
  try {
    const { type, name } = req.body || {};
    const validTypes = new Set(Object.values(CatalogueType || {}));
    if (!type || !validTypes.has(type)) return res.status(400).json({ message: "Invalid 'type'. Use CHAIR_CATALOGUE | UPHOLSTERY | BRAND_LOGO" });
    if (!name || !String(name).trim()) return res.status(400).json({ message: "name is required" });

    const image = pick(req, "image");
    const pdf = pick(req, "pdf");
    const brandLogo = pick(req, "brandLogo");

    if (!image) return res.status(400).json({ message: "image is required" });

    const imageUrl = await uploadImageToImgBB(image.path);
    const brandLogoUrl = brandLogo ? await uploadImageToImgBB(brandLogo.path) : null;
    const pdfUrl = pdf ? `/${String(pdf.path).replace(/\\/g, "/")}` : null;

    const code = await nextCatalogueCode();

    const created = await prisma.catalogue.create({
      data: { code, type, name: String(name).trim(), imageUrl, pdfUrl, brandLogoUrl },
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error("createCatalogue error:", err);
    return res.status(500).json({ message: "Failed to save catalogue" });
  }
};



export const listCatalogues = async (req, res) => {
  try {
    const {
      type,
      q,
      page = "1",
      pageSize = "20",
      sort = "createdAt",
      order = "desc",
    } = req.query || {};

    // validate type if provided
    if (type && !isValidType(type)) {
      return res.status(400).json({
        message:
          "Invalid 'type'. Use CHAIR_CATALOGUE | UPHOLSTERY | BRAND_LOGO",
      });
    }

    // build filters
    const where = {};
    if (type) where.type = type;
    if (q && String(q).trim()) {
      where.name = { contains: String(q).trim(), mode: "insensitive" };
    }

    // pagination
    const pageNum = toInt(page, 1);
    const take = toInt(pageSize, 20);
    const skip = (pageNum - 1) * take;

    // sorting
    const sortField = SORTABLE_FIELDS.has(String(sort)) ? String(sort) : "createdAt";
    const sortOrder = SORT_ORDERS.has(String(order)) ? String(order) : "desc";

    const [items, total] = await Promise.all([
      prisma.catalogue.findMany({
        where,
        orderBy: { [sortField]: sortOrder },
        skip,
        take,
        // select only fields you need (kept full here)
      }),
      prisma.catalogue.count({ where }),
    ]);

    return res.json({
      items,
      total,
      page: pageNum,
      pageSize: take,
      sort: sortField,
      order: sortOrder,
    });
  } catch (err) {
    console.error("listCatalogues error:", err);
    return res.status(500).json({ message: "Failed to list catalogues" });
  }
};

export const getAllCatalogues = async (req, res) => {
  try {
    // Optional query to sort, default newest first
    const { sort = "createdAt", order = "desc" } = req.query || {};
    const sortField = SORTABLE_FIELDS.has(String(sort)) ? String(sort) : "createdAt";
    const sortOrder = SORT_ORDERS.has(String(order)) ? String(order) : "desc";

    // Fetch all catalogues without filters or pagination
    const items = await prisma.catalogue.findMany({
      orderBy: { [sortField]: sortOrder },
    });

    return res.status(200).json({
      total: items.length,
      items,
      sort: sortField,
      order: sortOrder,
    });
  } catch (err) {
    console.error("getAllCatalogues error:", err);
    return res.status(500).json({ message: "Failed to get all catalogues" });
  }
};

export const getCatalogues = async (req, res) => {
  try {
    // Optional query to sort, default newest first
    const { sort = "createdAt", order = "desc" } = req.query || {};
    const sortField = SORTABLE_FIELDS.has(String(sort)) ? String(sort) : "createdAt";
    const sortOrder = SORT_ORDERS.has(String(order)) ? String(order) : "desc";

    // Fetch all catalogues without filters or pagination
    const items = await prisma.catalogue.findMany({
      orderBy: { [sortField]: sortOrder },
    });

    return res.status(200).json({
      total: items.length,
      items,
      sort: sortField,
      order: sortOrder,
    });
  } catch (err) {
    console.error("getAllCatalogues error:", err);
    return res.status(500).json({ message: "Failed to get all catalogues" });
  }
};

export const getCatalogueByCode = async (req, res) => {
  try {
    const { code } = req.params;
    if (!code) return res.status(400).json({ message: "code is required" });

    const item = await prisma.catalogue.findUnique({ where: { code } });
    if (!item) return res.status(404).json({ message: "Catalogue not found" });

    return res.status(200).json(item);
  } catch (err) {
    console.error("getCatalogueByCode error:", err);
    return res.status(500).json({ message: "Failed to get catalogue" });
  }
};


export const updateCatalogueByCode = async (req, res) => {
  try {
    const { code } = req.params;
    if (!code) return res.status(400).json({ message: "code is required" });

    const existing = await prisma.catalogue.findUnique({ where: { code } });
    if (!existing) return res.status(404).json({ message: "Catalogue not found" });

    const { type, name } = req.body || {};

    // Validate provided type (if present)
    if (typeof type !== "undefined" && !isValidType(type)) {
      return res.status(400).json({
        message: "Invalid 'type'. Use CHAIR_CATALOGUE | UPHOLSTERY | BRAND_LOGO",
      });
    }

    // Files (optional)
    const image = pick(req, "image");
    const brandLogo = pick(req, "brandLogo");
    const pdf = pick(req, "pdf");

    // Upload/derive new URLs if new files provided
    let imageUrl = existing.imageUrl;
    if (image) imageUrl = await uploadImageToImgBB(image.path);

    let brandLogoUrl = existing.brandLogoUrl;
    if (brandLogo) brandLogoUrl = await uploadImageToImgBB(brandLogo.path);

    let pdfUrl = existing.pdfUrl;
    if (pdf) pdfUrl = `/${String(pdf.path).replace(/\\/g, "/")}`;

    const data = {
      type: typeof type !== "undefined" ? type : existing.type,
      name: typeof name !== "undefined" ? String(name).trim() : existing.name,
      imageUrl,
      brandLogoUrl,
      pdfUrl,
      // code is immutable here
    };

    const updated = await prisma.catalogue.update({
      where: { code },
      data,
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.error("updateCatalogueByCode error:", err);
    return res.status(500).json({ message: "Failed to update catalogue" });
  }
};


// ────────────────────────────────────────────────────────────────
// Delete by CODE
// DELETE /api/catalogue/code/:code
// ────────────────────────────────────────────────────────────────
export const deleteCatalogueByCode = async (req, res) => {
  try {
    const { code } = req.params;
    if (!code) return res.status(400).json({ message: "code is required" });

    const existing = await prisma.catalogue.findUnique({ where: { code } });
    if (!existing) return res.status(404).json({ message: "Catalogue not found" });

    await prisma.catalogue.delete({ where: { code } });

    return res.status(200).json({ message: "Catalogue deleted" });
  } catch (err) {
    console.error("deleteCatalogueByCode error:", err);
    return res.status(500).json({ message: "Failed to delete catalogue" });
  }
};