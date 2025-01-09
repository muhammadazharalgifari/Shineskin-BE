import { request, response } from "express";
import multer from "multer";
import path from "path";
import db from "../../connector";


// konfigurasi tempat penyimpanan gambar
const uploadDir = path.resolve(__dirname, "../../../public/imageTransaction");

// konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const transactionId = req.params.id;
    if (!transactionId){
      cb(new Error("Transaction ID not found"), null);
      return;
    }
    const sanitizedName = transactionId.toString().replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, `transaction_${sanitizedName}${path.extname(file.originalname)}`);
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
const uploadUpdate = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});


const updateTransaction = async (req = request, res = response) => {
  try {
    const transactionId = parseInt(req.params.id);
    const userId = req.userId;

    const transaction = await db.transactions.findUnique({
      where: {
        id: transactionId,
      },
    });

    if (!transaction) {
      return res.status(404).json({
        status: "error",
        message: "Transaction not found",
      });
    }

    if (transaction.userId !== userId) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to update this transaction",
      });
    }

    const response = await db.transactions.update({
      where: {
        id: transactionId,
      },
      data: {
        imageTransaction: req.file.filename,
        userId,
      },
    });

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { updateTransaction, uploadUpdate };