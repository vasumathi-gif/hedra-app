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

//   // Handle image upload
//   const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

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
//       imageUrl,
//       specifications: specificationsString, // <- string now
//     },
//   });

//   res.status(201).json(product);
// };

export const createProduct = async (req, res) => {
  const { name, description, category, price, tags, specifications } = req.body;

  // Get the last product's ID
  const lastProduct = await prisma.product.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });

  let newId = 'PR001';
  if (lastProduct) {
    const lastIdNumber = parseInt(lastProduct.id.replace('PR', ''), 10);
    const nextIdNumber = lastIdNumber + 1;
    newId = `PR${String(nextIdNumber).padStart(3, '0')}`;
  }

  // Handle image upload (image is uploaded to ImgBB)
  const imageUrl = req.file ? await uploadImageToImgBB(`uploads/${req.file.filename}`) : null;

  const parsedTags = tags ? JSON.parse(tags) : [];
  const parsedSpecifications = specifications ? JSON.parse(specifications) : [];

  // Convert specifications object to string
  const specificationsString = parsedSpecifications.length > 0 
    ? JSON.stringify(parsedSpecifications) 
    : null;

  // Create the product
  const product = await prisma.product.create({
    data: {
      id: newId,
      name,
      description,
      category,
      price: parseFloat(price),
      tags: parsedTags,
      imageUrl, // Save the ImgBB URL
      specifications: specificationsString,
    },
  });

  res.status(201).json(product);
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

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, tags, specifications } = req.body;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

    let imageUrl = existingProduct.imageUrl;

    if (req.file) {
      if (existingProduct.imageUrl && existingProduct.imageUrl !== '/uploads/default.png') {
        const oldPath = path.join(process.cwd(), 'public', existingProduct.imageUrl);
        fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    let parsedTags = [];
    let parsedSpecifications = {};
    try {
      parsedTags = tags ? JSON.parse(tags) : [];
    } catch (e) {
      console.warn("Failed to parse tags", tags);
    }
    try {
      parsedSpecifications = specifications ? JSON.parse(specifications) : {};
    } catch (e) {
      console.warn("Failed to parse specifications", specifications);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        category,
        price: parseFloat(price),
        tags: parsedTags,
        specifications: parsedSpecifications,
        imageUrl,
        // featured: req.body.featured === 'true',
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("❌ Update product error:", error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id } });
  res.json({ message: 'Product deleted' });
};
