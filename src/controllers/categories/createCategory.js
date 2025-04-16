import { request, response } from "express";
import db from "../../connector";
import multer from "multer";
import path from "path";

// konfigurasi tempat penyimpanan gambar
const uploadDir = path.resolve(__dirname, "../../../public/imageCategory");

// konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const nameProduct = req.body.name;
    const randomDataProduct = nameProduct.replace(/[^a-zA-Z0-9]/g, "_");

    cb(null, randomDataProduct + path.extname(file.originalname));
  },
});

// validasi type image
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid image type"), false);
  }
};

// konfigurasi multer untuk upload image product
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

async function createCategory(req = request, res = response) {
  const { name, description } = req.body;

  try {
    // Validasi input
    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Category name is required",
      });
    }

    // pengecekan nama kategori yg sudah ada
    const existingCategory = await db.categories.findFirst({
      where: {
        name: name,
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        status: "error",
        message: "Category with this name already exists",
      });
    }

    const response = await db.categories.create({
      data: {
        name,
        description,
        imageCategory: req.file.filename,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Category created successfully",
      category: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { createCategory, upload };
