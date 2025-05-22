import { request, response } from "express";
import { zonedTimeToUtc } from "date-fns-tz";
import multer from "multer";
import path from "path";
import db from "../../connector";

const timeZone = "Asia/Jakarta";

// konfigurasi tempat penyimpanan gambar
const uploadDir = path.resolve(__dirname, "../../../public/imageProducts");

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

async function addProduct(req = request, res = response) {
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
  // const { categoryId } = req.params;
  const categoryId = parseInt(req.body.categoryId, 10);

  const filename = req.file?.filename;

  if (!filename) {
    return res.status(400).json({
      status: "error",
      message: "Gambar produk wajib diunggah",
    });
  }
  // current user
  // const userId = req.userId;

  // jika promo aktif
  const isPromoBoolean = isPromo === "true" || isPromo === true;

  // Create a new product
  try {
    const category = await db.categories.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category does not exist",
      });
    }

    // validasi promo start dan end jika promo aktif
    let promoStartUTC = null;
    let promoEndUTC = null;

    if (isPromoBoolean) {
      if (!promoStart || !promoEnd) {
        return res.status(400).json({
          status: "error",
          message: "Promo start and end dates are required",
        });
      }

      promoStartUTC = zonedTimeToUtc(new Date(promoStart), timeZone);
      promoEndUTC = zonedTimeToUtc(new Date(promoEnd), timeZone);

      if (promoStartUTC > promoEndUTC) {
        return res.status(400).json({
          status: "error",
          message: "Promo start date must be before the end date",
        });
      }

      if (
        promoPrice === undefined ||
        promoPrice === null ||
        Number(promoPrice) >= Number(price)
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "Promo price must be provided and less than the regular price.",
        });
      }
    }

    const response = await db.products.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        imageProduct: filename,
        isPromo: isPromo === "true",
        promoPrice: promoPrice ? Number(promoPrice) : null,
        promoStart: promoStart ? new Date(promoStart) : null,
        promoEnd: promoEnd ? new Date(promoEnd) : null,
        user: {
          connect: { id: req.userId }, 
        },
        category: {
          connect: { id: categoryId }, 
        },
      },
    });

    res.status(201).json({
      status: "success",
      message: "Product added successfully",
      product: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { addProduct, upload };
