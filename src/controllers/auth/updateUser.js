import { request, response } from "express";
import db from "../../connector";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import multer from "multer";

// konfigurasi tempat penyimpanan gambar
const uploadDir = path.join(__dirname, "../../../public/imageProfile");

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

// konfigurasi multer untuk upload
const uploadUpdate = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const updateUser = async (req = request, res = response) => {
  try {
    const userId = req.userId;
    const { username, email, password, confirmPassword } = req.body;

    const user = await db.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User Not Found",
      });
    }

    let imageProfilePath = user.imageProfile;
    if (req.file) {
      // hapus foto lama
      const imagePath = path.resolve(
        __dirname,
        "../../../public/imageProfile",
        user.imageProfile
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      imageProfilePath = req.file.filename;
    }

    if (email === "" || email === null) {
      return res.status(400).json({ message: "Email cannot be empty" });
    }

    let passwordHash;
    if (password === "" || password === null) {
      passwordHash = user.password;
    } else {
      passwordHash = await bcrypt.hash(password, 10);
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password do not match" });
    }

    const response = await db.users.update({
      where: {
        id: req.userId,
      },
      data: {
        username,
        email,
        password: passwordHash,
        role: user.role,
        imageProfile: imageProfilePath,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Update User Successfully",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export { updateUser, uploadUpdate };
