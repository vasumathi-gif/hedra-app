import prisma from '../config/db.js';
import path from 'path';
import fs from 'fs';
import uploadImageToImgBB from '../services/uploadImageToImgBB.js';

// export const createProduct = async (req, res) => {
//   const { name, description, category, price, tags, specifications } = req.body;

//   // Get the last product's ID
//   const lastProduct = await prisma.product.findFirst({
//     orderBy: { createdAt: 'desc' },
//     select: { id: true },
//   });

//   let newId = 'PR001';
//   if (lastProduct) {
//     const lastIdNumber = parseInt(lastProduct.id.replace('PR', ''), 10);
//     const nextIdNumber = lastIdNumber + 1;
//     newId = `PR${String(nextIdNumber).padStart(3, '0')}`;
//   }

//   // Handle image upload (image is uploaded to ImgBB)
//   const imageUrl = req.file ? await uploadImageToImgBB(`uploads/${req.file.filename}`) : null;

//   const parsedTags = tags ? JSON.parse(tags) : [];
//   const parsedSpecifications = specifications ? JSON.parse(specifications) : [];

//   // Convert specifications object to string
//   const specificationsString = parsedSpecifications.length > 0 
//     ? JSON.stringify(parsedSpecifications) 
//     : null;

//   // Create the product
//   const product = await prisma.product.create({
//     data: {
//       id: newId,
//       name,
//       description,
//       category,
//       price: parseFloat(price),
//       tags: parsedTags,
//       imageUrl, // Save the ImgBB URL
//       specifications: specificationsString,
//     },
//   });

//   res.status(201).json(product);
// };

export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, tags, specifications } = req.body;

    // Get the last product's ID
    const lastProduct = await prisma.product.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    let newId = "PR001";
    if (lastProduct && lastProduct.id) {
      const lastIdNumber = parseInt(String(lastProduct.id).replace("PR", ""), 10);
      const nextIdNumber = (isNaN(lastIdNumber) ? 0 : lastIdNumber) + 1;
      newId = `PR${String(nextIdNumber).padStart(3, "0")}`;
    }

    // ------ IMAGES (multiple) ------
    // Works with upload.array('images') or legacy upload.single('image')
    const files = Array.isArray(req.files)
      ? req.files
      : (req.file ? [req.file] : []);

    let imageUrls = [];
    if (files.length > 0) {
      imageUrls = await Promise.all(
        files.map((f) => uploadImageToImgBB(`uploads/${f.filename}`))
      );
    }

    // Store as JSON string in existing string field (backward-compatible)
    const imageUrlField = imageUrls.length ? JSON.stringify(imageUrls) : null;

    // ------ SAFE PARSING ------
    let parsedTags = [];
    try {
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : (Array.isArray(tags) ? tags : []);
    } catch (_) { parsedTags = []; }

    let parsedSpecifications = [];
    try {
      parsedSpecifications = typeof specifications === "string"
        ? JSON.parse(specifications)
        : (Array.isArray(specifications) ? specifications : []);
    } catch (_) { parsedSpecifications = []; }

    const specificationsString =
      parsedSpecifications && parsedSpecifications.length
        ? JSON.stringify(parsedSpecifications)
        : null;

    // ------ CREATE ------
    const product = await prisma.product.create({
      data: {
        id: newId,
        name,
        description,
        category,
        price: parseFloat(price),
        tags: parsedTags,
        imageUrl: imageUrlField,
        specifications: specificationsString,
      },
    });

    return res.status(201).json(product);
  } catch (err) {
    console.error("createProduct error:", err);
    return res.status(500).json({ message: "Failed to create product" });
  }
};

export const getAllProducts = async (req, res) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(products);
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findFirst({ where: { id } });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description, category, price, tags, specifications, } = req.body;

//     const existingProduct = await prisma.product.findUnique({ where: { id } });
//     if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

//     let imageUrl = existingProduct.imageUrl;

//     if (req.file) {
//       if (existingProduct.imageUrl && existingProduct.imageUrl !== '/uploads/default.png') {
//         const oldPath = path.join(process.cwd(), 'public', existingProduct.imageUrl);
//         fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
//       }
//        // Upload the new image to ImgBB and get the URL
//       try {
//         const uploadedImageUrl = await uploadImageToImgBB(req.file.path); // Assume req.file.path is the local path to the uploaded image
//         imageUrl = uploadedImageUrl; // Set the image URL from ImgBB
//       } catch (error) {
//         return res.status(500).json({ message: 'Failed to upload image to ImgBB', error: error.message });
//       }
//     }

//     let parsedTags = [];
//     let parsedSpecifications = {};
//     try {
//       parsedTags = tags ? JSON.parse(tags) : [];
//     } catch (e) {
//       console.warn("Failed to parse tags", tags);
//     }
//     try {
//       parsedSpecifications = specifications ? JSON.parse(specifications) : {};
//     } catch (e) {
//       console.warn("Failed to parse specifications", specifications);
//     }

//     const updatedProduct = await prisma.product.update({
//       where: { id },
//       data: {
//         name,
//         description,
//         category,
//         price: parseFloat(price),
//         tags: parsedTags,
//         specifications: parsedSpecifications,
//         imageUrl,
//         // featured: req.body.featured === 'true',
//       },
//     });

//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     console.error("❌ Update product error:", error);
//     res.status(500).json({ message: 'Failed to update product', error: error.message });
//   }
// };



// product.controller.js (pure JS)

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      price,
      tags,
      specifications,
      replaceImages,   // legacy support
      deleteImages,    // legacy support
      imagesToKeep,    // <- from FE
      bestSeller,
      featured,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return res.status(404).json({ message: "Product not found" });

    // Parse existing images from imageUrl (string or JSON-string array)
    let existingImages = [];
    if (typeof existingProduct.imageUrl === "string" && existingProduct.imageUrl.trim()) {
      const s = existingProduct.imageUrl.trim();
      if (s.startsWith("[")) {
        try {
          const arr = JSON.parse(s);
          if (Array.isArray(arr)) existingImages = arr.filter(Boolean);
        } catch (_) {}
      } else {
        existingImages = [s];
      }
    }

    // Gather uploaded files (prefer 'newImages')
    const uploadedFiles = [];
    if (req.files && req.files.newImages) uploadedFiles.push(...req.files.newImages);
    if (req.files && req.files.images)    uploadedFiles.push(...req.files.images); // legacy
    if (req.files && req.files.image)     uploadedFiles.push(...req.files.image);  // legacy
    if (!uploadedFiles.length && req.file) uploadedFiles.push(req.file);           // single

    // Upload new images
    let newImageUrls = [];
    if (uploadedFiles.length > 0) {
      newImageUrls = await Promise.all(
        uploadedFiles.map((f) => {
          const localPath = f.path || `uploads/${f.filename}`;
          return uploadImageToImgBB(localPath); // <- your existing uploader
        })
      );
    }

    // Build final images list
    let finalImages = [];
    if (typeof imagesToKeep === "string" && imagesToKeep.trim()) {
      // FE provides exactly which old URLs to keep
      let keepArr = [];
      try { keepArr = JSON.parse(imagesToKeep); } catch (_) { keepArr = []; }
      const existingSet = new Set(existingImages);
      const sanitizedKeep = keepArr.filter((u) => existingSet.has(u));
      finalImages = sanitizedKeep.concat(newImageUrls);
    } else {
      // legacy path using replaceImages / deleteImages
      let deleteSet = new Set();
      if (typeof deleteImages === "string" && deleteImages.trim()) {
        try {
          const arr = JSON.parse(deleteImages);
          if (Array.isArray(arr)) deleteSet = new Set(arr.filter(Boolean));
        } catch (_) {}
      }
      const shouldReplace = String(replaceImages || "false") === "true";
      finalImages = shouldReplace
        ? []
        : existingImages.filter((url) => !deleteSet.has(url));

      finalImages = finalImages.concat(newImageUrls);
    }

    const imageUrlField = finalImages.length ? JSON.stringify(finalImages) : null;

    // Parse tags
    let parsedTags = [];
    try {
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : (Array.isArray(tags) ? tags : []);
    } catch (_) { parsedTags = []; }

    // Parse specifications, store as string (your existing format)
    let parsedSpecifications = [];
    try {
      parsedSpecifications = typeof specifications === "string"
        ? JSON.parse(specifications)
        : (Array.isArray(specifications) ? specifications : []);
    } catch (_) { parsedSpecifications = []; }
    const specificationsString =
      parsedSpecifications && parsedSpecifications.length
        ? JSON.stringify(parsedSpecifications)
        : null;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        category,
        price: price != null ? parseFloat(price) : existingProduct.price,
        tags: parsedTags,
        specifications: specificationsString,
        imageUrl: imageUrlField,
        bestSeller: typeof req.body.bestSeller !== "undefined" ? String(req.body.bestSeller) === "true" : existingProduct.bestSeller,
        // ...(typeof featured !== "undefined" ? { featured: String(featured) === "true" } : {}),
      },
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("❌ Update product error:", error);
    return res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};



export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id } });
  res.json({ message: 'Product deleted' });
};

// export const getProductsByCategory = async (req, res) => {
//   try {
//     const { category } = req.params;

//     const products = await prisma.product.findMany({
//       where: { category },
//       orderBy: { createdAt: "desc" },
//     });

//     res.json(products);
//   } catch (err) {
//     console.error("Error fetching products by category:", err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    let products;

    // Check if it's a parent category that should include its subcategories
    const parentCategories = ["sofa", "center-tables", "bed", "dining-table", "office-tables"];

    if (parentCategories.includes(category)) {
      products = await prisma.product.findMany({
        where: {
          OR: [
            { category },
            { category: { startsWith: category + "-" } }
          ]
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Exact match for leaf categories
      products = await prisma.product.findMany({
        where: { category },
        orderBy: { createdAt: "desc" },
      });
    }

    res.json(products);
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};


// controllers/productController.js
export const getBestSellers = async (req, res) => {
  try {
    const bestSellers = await prisma.product.findMany({
      where: { bestSeller: true },
      orderBy: { createdAt: "desc" }, // optional: latest first
    });
    res.status(200).json(bestSellers);
  } catch (error) {
    console.error("❌ Fetch best sellers error:", error);
    res.status(500).json({ message: "Failed to fetch best sellers" });
  }
};




// No "as const" etc. Just plain JS.
const CHAIR_CATEGORIES = [
  "dining-chairs",
  "study-chairs",
  "boss-chairs",
  "high-back-mesh-chairs",
  "medium-back-workstation-chairs",
  "lounge-chairs",
  "meeting-room-chairs",
  "visitor-chairs",
  "training-chairs",
  "cafe-chairs",
  "bed-dressing-chairs",
];

// Optional: keep good IntelliSense using JSDoc (works in .js)
/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

/**
 * GET /api/products/chairs
 * Query params: q, featured (true|false), page, pageSize, orderBy, direction
 * @param {Request} req
 * @param {Response} res
 */
export const getChairProducts = async (req, res) => {
  try {
    const {
      q,
      featured,
      page = "1",
      pageSize = "20",
      orderBy = "createdAt",
      direction = "desc",
    } = req.query;

    const take = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (pageNum - 1) * take;

    const where = {
      category: { in: CHAIR_CATEGORIES }, // no type assertion needed
    };

    if (featured !== undefined) {
      where.featured = String(featured).toLowerCase() === "true";
    }
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const order =
      direction === "asc" ? { [orderBy]: "asc" } : { [orderBy]: "desc" };

    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({ where, orderBy: order, skip, take }),
      prisma.product.count({ where }),
    ]);

    res.json({ page: pageNum, pageSize: take, total, items });
  } catch (err) {
    console.error("getChairProducts error:", err);
    res.status(500).json({ error: "Failed to load chair products" });
  }
};
