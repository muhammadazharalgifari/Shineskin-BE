import { request, response } from "express";
import { zonedTimeToUtc } from "date-fns-tz";
import db from "../../connector";
import path from "path";
import fs from "fs";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const timeZone = "Asia/Jakarta";

// folder penyimpanan gambar produk
const uploadDir = path.join(__dirname, "../../../public/imageProducts");

// konfigurasi multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const newNameProduct = (req.body?.name || "product").toString();
    const cleanName = newNameProduct.replace(/[^\w\d]/g, "_");
    const uniqueSuffix = Date.now() + "_" + uuidv4();

    const finalName = `${cleanName}_${uniqueSuffix}${path.extname(
      file.originalname
    )}`;
    cb(null, finalName);
  },
});

// validasi tipe file gambar
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid image type"), false);
  }
};

// middleware multer untuk upload gambar produk
const uploadUpdate = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // max 5MB
  },
});

const updateProduct = async (req = request, res = response) => {
  try {
    const productId = parseInt(req.params.id);
    const userId = req.userId;

    const {
      name,
      description,
      price,
      stock,
      promoPrice,
      isPromo,
      promoStart,
      promoEnd,
    } = req.body;

    // Cari produk lama
    const product = await db.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    const isPromoBoolean =
      req.body && "isPromo" in req.body
        ? isPromo === "true" || isPromo === true
        : false;

    let promoStartUTC = null;
    let promoEndUTC = null;

    if (isPromoBoolean) {
      if (!promoStart || !promoEnd) {
        return res.status(400).json({
          status: "error",
          message:
            "Promo start and end date must be provided when promo is active.",
        });
      }

      promoStartUTC = zonedTimeToUtc(new Date(promoStart), timeZone);
      promoEndUTC = zonedTimeToUtc(new Date(promoEnd), timeZone);

      if (promoStartUTC > promoEndUTC) {
        return res.status(400).json({
          status: "error",
          message: "Promo start date must be before promo end date.",
        });
      }

      const finalPrice =
        price !== undefined && price !== "" ? Number(price) : product.price;

      if (
        promoPrice === undefined ||
        promoPrice === null ||
        Number(promoPrice) >= finalPrice
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "Promo price must be provided and less than the regular price.",
        });
      }
    }

    let updateImageProduct = product.imageProduct;

    if (req.file) {
      // Hapus gambar lama jika ada
      const imagePath = path.resolve(
        __dirname,
        "../../../public/imageProducts",
        product.imageProduct
      );

      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (unlinkError) {
        console.error("Gagal menghapus gambar lama:", unlinkError.message);
      }
      updateImageProduct = req.file.filename;
    }

    // Prepare data update
    const updateData = {
      name: name?.trim() ? name : product.name,
      description: description?.trim() ? description : product.description,
      price:
        price !== undefined && price !== "" ? parseInt(price) : product.price,
      stock:
        stock !== undefined && stock !== "" ? parseInt(stock) : product.stock,
      imageProduct: updateImageProduct,
      userId,
    };

    if ("isPromo" in req.body) {
      updateData.isPromo = isPromoBoolean;
      updateData.promoPrice = isPromoBoolean ? Number(promoPrice) : null;
      updateData.promoStart = isPromoBoolean ? promoStartUTC : null;
      updateData.promoEnd = isPromoBoolean ? promoEndUTC : null;
    }

    const updatedProduct = await db.products.update({
      where: { id: productId },
      data: updateData,
    });

    return res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      updateProduct: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
};

export { updateProduct, uploadUpdate };
