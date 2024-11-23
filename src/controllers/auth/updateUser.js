import { request, response } from "express";
import db from "../../connector";
import bcrypt from "bcryptjs";

const updateUser = async (req = request, res = response) => {
  const userId = req.userId;
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

  try {
    const { username, email, password, confirmPassword } = req.body;

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
        imageProfile: user.imageProfile,
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

export { updateUser };
