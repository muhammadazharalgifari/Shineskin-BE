import { request, response } from "express";
import bcrypt from "bcryptjs";
import db from "../../connector";
import path from "path";
import multer from "multer";

// konfigurasi tempat penyimpanan gambar
const uploadDir = path.resolve(__dirname, "../../../public/imageProfile");

// konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const email = req.body.email || req.body.username;
    const randomDataProfile = email.replace(/[^a-zA-Z0-9]/g, "_");

    cb(null, randomDataProfile + path.extname(file.originalname));
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

// konfigurasi multer untuk upload image
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

async function createUser(req = request, res = response) {
  const { username, email, password, confirmPassword, role } = req.body;

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Password and confirm password do not match" });
  }
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const response = await db.users.create({
      data: {
        username,
        email,
        password: hashPassword,
        role,
        imageProfile: req.file.filename,
      },
    });
    res.status(201).json({
      status: "success",
      message: "Register successfully",
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

export { createUser, upload };
