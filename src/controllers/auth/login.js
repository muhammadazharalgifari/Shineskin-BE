import { request, response } from "express";
import jwt from "jsonwebtoken";
import db from "../../connector";
import bcrypt from "bcryptjs";

async function login(req = request, res = response) {
  try {
    const { email, password } = req.body;
    const findUser = await db.users.findUnique({
      where: {
        email: email,
      },
    });
    // validasi email user apakah sesuai ketika register
    if (!findUser) {
      return res.status(400).json({
        status: "error",
        message: "Email not found",
      });
    }
    // validasi password user apakah sesuai ketika register
    const validPassword = await bcrypt.compare(password, findUser.password);
    if (!validPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password not match",
      });
    }

    // jwt
    const key = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ userId: findUser.id }, key, { expiresIn: "2h" });
    res.status(200).json({
      status: "success",
      message: "Login Successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { login };
