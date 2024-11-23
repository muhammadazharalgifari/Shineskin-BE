import { request, response } from "express";
import bcrypt from "bcryptjs";
import db from "../../connector";
import path from "path";
import fs from "fs";

async function createUser(req = request, res = response) {
  const { username, email, password, confirmPassword, role, imageProfile } =
    req.body;
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Password and confirm password do not match" });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    // validasi type image dari image profile
    const mimeType = imageProfile.match(/data:(image\/\w+);base64,/);
    if (!mimeType) {
      return res.status(400).json({ message: "Invalid image type" });
    }

    // mengambil ekstensi
    const mime = mimeType[1]; //image/jpeg (or) image/png (or) image/jpg
    const extension = mime.split("/")[1]; //jpeg (or) png (or) jpg

    // menghapus prefix dari url sebelum mengkonversi base64 ke buffer
    const base64Image = imageProfile.replace(/^data:image\/\w+;base64,/, "");

    // nama image
    const fileName = `${username}-profile.${extension}`;

    // konversi base64 ke buffer
    const buffer = Buffer.from(base64Image, "base64");

    // menyimpan image ke folder
    const imagePath = path.join(
      __dirname,
      "../../../public/imageProfile",
      fileName
    );
    fs.writeFileSync(imagePath, buffer);

    const response = await db.users.create({
      data: {
        username,
        email,
        password: hashPassword,
        role,
        imageProfile: fileName,
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

export { createUser };
